#!/usr/bin/env python3
"""Frontend AI Harness — executable capability guardrail.

Measures the training site under ``docs/`` against ``harness/capabilities.yml``
and reports, per capability, what is missing. Nothing here is judged by an LLM:
every capability is a count, a schema, a resolved link or a Node process exit
code, so the same number comes out for a human and for an agent.

Usage
-----
    python3 harness/check_harness.py                 # full report, exit 1 on failure
    python3 harness/check_harness.py --json          # machine-readable
    python3 harness/check_harness.py --next          # the single highest-priority deficit
    python3 harness/check_harness.py --only bank.schema --only solutions.present
    python3 harness/check_harness.py --group workspace
    python3 harness/check_harness.py --build         # also run `jekyll build`

Exit codes: 0 every required capability passes and the composite clears
``pass_threshold``; 1 otherwise; 2 the guardrail itself could not run.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass, field
from fnmatch import fnmatch
from pathlib import Path
from typing import Any, Callable

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.stderr.write("harness: PyYAML is required (pip install pyyaml)\n")
    raise SystemExit(2)

HARNESS_DIR = Path(__file__).resolve().parent
ROOT = HARNESS_DIR.parent
SPEC_PATH = HARNESS_DIR / "capabilities.yml"

# Pages under docs/ that are scaffolding, drafts or vendored, not site content.
DOC_EXCLUDE = {"index-wip.md", "rough1.md", "README.md"}
FENCE_RE = re.compile(r"(^|\n)(```|~~~).*?\n\2[ \t]*(?=\n|$)", re.S)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
LIQUID_TAG_RE = re.compile(r"\{%.*?%\}", re.S)
# {% raw %} ... {% endraw %} is the only place Liquid leaves braces alone.
RAW_BLOCK_RE = re.compile(r"\{%-?\s*raw\s*-?%\}.*?\{%-?\s*endraw\s*-?%\}", re.S)
LIQUID_EXPR_RE = re.compile(r"\{\{.*?\}\}", re.S)


def prose(body: str) -> str:
    """The page with code samples and Liquid template syntax removed.

    Link, image and placeholder checks must read what a *reader* sees. A JSX
    `<img src={x} alt={y} />` inside a fence is an example, and a quiz option
    that discusses `<img srcset>` inside `{% include quiz.html %}` is a
    sentence about HTML — neither is an image on the page. Liquid expressions
    go too, so `src="{{ '/assets/x.png' | relative_url }}"` still reads as an
    `<img>` with no alt attribute, which is the real defect.
    """
    text = FENCE_RE.sub("\n", body)
    text = LIQUID_TAG_RE.sub(" ", text)
    text = LIQUID_EXPR_RE.sub("", text)
    return INLINE_CODE_RE.sub(" ", text)
MAX_DEFICITS = 12  # per check, so one report stays inside a small model's context


# --------------------------------------------------------------- data model
@dataclass
class Result:
    id: str
    group: str
    weight: float
    required: bool
    score: float
    why: str
    deficits: list[str] = field(default_factory=list)
    detail: str = ""
    skipped: bool = False

    @property
    def passed(self) -> bool:
        return self.skipped or self.score >= 1.0


@dataclass
class Page:
    path: Path
    meta: dict
    body: str

    @property
    def rel(self) -> str:
        return str(self.path.relative_to(ROOT))

    @property
    def slug(self) -> str:
        return str(self.meta.get("slug") or self.path.stem)

    @property
    def prose(self) -> str:
        return prose(self.body)


FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n?(.*)\Z", re.S)


def read_page(path: Path) -> Page:
    text = path.read_text(encoding="utf-8", errors="replace")
    m = FM_RE.match(text)
    if not m:
        return Page(path, {}, text)
    try:
        meta = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as exc:
        meta = {"__yaml_error__": str(exc)}
    if not isinstance(meta, dict):
        meta = {"__yaml_error__": "front matter is not a mapping"}
    return Page(path, meta, m.group(2))


def md_files(directory: Path) -> list[Path]:
    if not directory.is_dir():
        return []
    return sorted(p for p in directory.glob("*.md") if p.name not in DOC_EXCLUDE)


def word_count(body: str) -> int:
    stripped = re.sub(r"```.*?```", " ", body, flags=re.S)
    stripped = re.sub(r"<[^>]+>", " ", stripped)
    stripped = re.sub(r"\{%.*?%\}", " ", stripped, flags=re.S)
    return len(re.findall(r"[A-Za-z][A-Za-z'\-]+", stripped))


# ----------------------------------------------------------- built-site cache
_BUILD: dict[str, tuple[Optional[Path], str]] = {}
_BUILD_DIR: Optional[tempfile.TemporaryDirectory] = None


def build_site(docs: Path) -> tuple[Optional[Path], str]:
    """Build the site once per process; return (output dir, reason-if-not).

    Both `health.build` and every functional capability need a built site, and
    building it twice would double the slowest thing in the guardrail.
    """
    global _BUILD_DIR
    key = str(docs)
    if key in _BUILD:
        return _BUILD[key]
    probe = subprocess.run(["bundle", "exec", "jekyll", "-v"], cwd=str(docs),
                           capture_output=True, text=True)
    if probe.returncode != 0:
        _BUILD[key] = (None, "jekyll is not installed (`cd docs && bundle install`)")
        return _BUILD[key]
    _BUILD_DIR = tempfile.TemporaryDirectory(prefix="harness-site-")
    proc = subprocess.run(["bundle", "exec", "jekyll", "build", "-d", _BUILD_DIR.name, "-q"],
                          cwd=str(docs), capture_output=True, text=True, timeout=900)
    if proc.returncode != 0:
        out = (proc.stdout + "\n" + proc.stderr).strip()
        _BUILD[key] = (None, f"jekyll build failed:\n{out[:900]}")
    else:
        _BUILD[key] = (Path(_BUILD_DIR.name), "")
    return _BUILD[key]


# ------------------------------------------------------------------ context
class Site:
    """Everything the checks read, loaded once."""

    def __init__(self, spec: dict, changed: list[str] | None = None):
        self.spec = spec
        # When a contribution names the files it wrote, per-page checks judge
        # only those files. An agent is answerable for what it just changed,
        # not for debt it inherited — the unscoped run still reports everything.
        self.changed: set[Path] = set()
        for raw in changed or []:
            candidate = Path(raw)
            self.changed.add((candidate if candidate.is_absolute() else ROOT / candidate).resolve())
        self.docs = ROOT / spec.get("site_root", "docs")
        self.skills_root = ROOT / spec.get("skills_root", "skills")
        self.templates_root = ROOT / spec.get("templates_root", "templates")
        self.enums = spec.get("enums", {})
        self.qschema = spec.get("question_schema", {})

        self.layers = ["ui", "server", "state"]
        self.concept_docs: list[Page] = []
        for layer in self.layers:
            for p in md_files(self.docs / layer):
                if p.stem.startswith("index"):
                    continue
                self.concept_docs.append(read_page(p))

        self.questions: list[Page] = [
            read_page(p) for p in md_files(self.docs / "practice") if p.stem != "index"
        ]
        self.plan_pages: list[Page] = [
            read_page(p) for p in md_files(self.docs / "plans")
            if p.stem not in ("index", "certificate")
        ]
        self.playbooks: list[Page] = [
            read_page(p) for p in md_files(self.docs / "playbooks") if p.stem != "index"
        ]
        self.exclude_globs = list(spec.get("exclude_globs", []))
        self.all_pages: list[Page] = [
            read_page(p) for p in sorted(self.docs.rglob("*.md"))
            if "_site" not in p.parts and "demos" not in p.parts
            and "vendor" not in p.parts and p.name not in DOC_EXCLUDE
            and not self._excluded(p)
        ]

        self.skill_slugs = sorted(
            d.name for d in self.skills_root.glob("*") if (d / "SKILL.md").is_file()
        ) if self.skills_root.is_dir() else []
        self.template_dirs = sorted(
            d.name for d in self.templates_root.glob("chota-*") if d.is_dir()
        ) if self.templates_root.is_dir() else []

        self.workspace_root = self.docs / "practice" / "workspace"
        self.topics = self._load_topics()
        self.plans = self._load_yaml_data("plans.yml")
        self.registry = self._load_yaml_data("questions.yml")
        self.skills_yml = self._load_yaml_data("skills.yml")
        self._functional: Optional[tuple[Optional[dict], str]] = None

    def _excluded(self, path: Path) -> bool:
        # fnmatch, not PurePath.match: PurePath.match treats `**` as a single
        # path segment, so "docs/setup/**" would miss docs/setup/a/b.md.
        rel = path.relative_to(ROOT).as_posix()
        return any(fnmatch(rel, g) for g in self.exclude_globs)

    def _load_yaml_data(self, name: str):
        path = self.docs / "_data" / name
        if not path.is_file():
            return None
        try:
            return yaml.safe_load(path.read_text(encoding="utf-8"))
        except yaml.YAMLError as exc:
            return {"__yaml_error__": str(exc)}

    def _load_topics(self) -> dict[str, list[str]]:
        out: dict[str, list[str]] = {}
        tdir = self.docs / "_data" / "topics"
        if not tdir.is_dir():
            return out
        for csv_path in sorted(tdir.glob("*.csv")):
            slugs = []
            with csv_path.open(encoding="utf-8") as fh:
                for row in csv.DictReader(fh):
                    slug = (row.get("slug") or "").strip()
                    if slug:
                        slugs.append(slug)
            out[csv_path.stem] = slugs
        return out

    # -- helpers shared by several checks
    def functional(self) -> tuple[Optional[dict], str]:
        """Run the Playwright suite once and cache it; (scenarios, reason-if-not).

        This is the layer that removes the human from the loop. The static
        checks prove a page *has* a playground; only a browser proves the Run
        button executes the question's tests and that a passing run records
        progress. Nothing here asks anyone's opinion — every scenario is an
        assertion about observable behaviour.
        """
        if self._functional is not None:
            return self._functional
        runner = HARNESS_DIR / "functional" / "run.mjs"
        node = _which_node()
        if node is None:
            self._functional = (None, "skipped: node not found")
            return self._functional
        if not runner.is_file():
            self._functional = (None, f"skipped: {runner.relative_to(ROOT)} is missing")
            return self._functional
        built, why = build_site(self.docs)
        if built is None:
            self._functional = (None, f"skipped: no built site ({why.splitlines()[0] if why else 'unknown'})")
            return self._functional
        with tempfile.TemporaryDirectory(prefix="harness-fn-") as tmp:
            out = Path(tmp) / "results.json"
            proc = subprocess.run([node, str(runner), "--site", str(built), "--out", str(out)],
                                  cwd=str(ROOT), capture_output=True, text=True, timeout=900)
            if not out.is_file():
                detail = (proc.stdout + "\n" + proc.stderr).strip()[:400]
                self._functional = (None, f"skipped: the functional runner did not report ({detail})")
                return self._functional
            payload = json.loads(out.read_text(encoding="utf-8"))
        if not payload.get("available"):
            self._functional = (None, f"skipped: {payload.get('reason', 'playwright unavailable')}")
            return self._functional
        self._functional = (payload.get("scenarios") or {}, "")
        return self._functional

    def touches(self, globs: list[str]) -> bool:
        """Did this contribution change anything inside a capability's territory?"""
        rels = []
        for path in self.changed:
            try:
                rels.append(path.relative_to(ROOT).as_posix())
            except ValueError:
                rels.append(path.as_posix())
        return any(fnmatch(rel, g) or fnmatch(rel, g.rstrip("*") + "**")
                   for rel in rels for g in globs)

    def renders(self, page_path: Path, include_name: str) -> bool:
        """Does this page render `include_name`, directly or through its layout?

        A page that sets `layout: plan` inherits everything plan.html renders.
        Demanding the include appear in the page itself would be asking authors
        to duplicate their layout — and would fail a page that is correct.
        """
        try:
            text = page_path.read_text(encoding="utf-8")
        except OSError:
            return False
        needle = f"include {include_name}"
        if needle in text:
            return True
        page = read_page(page_path)
        layout = page.meta.get("layout")
        seen: set[str] = set()
        while layout and layout not in seen:
            seen.add(str(layout))
            layout_file = self.docs / "_layouts" / f"{layout}.html"
            if not layout_file.is_file():
                return False
            layout_text = layout_file.read_text(encoding="utf-8")
            if needle in layout_text:
                return True
            nested = read_page(layout_file)
            layout = nested.meta.get("layout")
        return False

    def sel(self, pages: list[Page]) -> list[Page]:
        """Narrow a page list to the contribution's own files, if it named any."""
        if not self.changed:
            return pages
        return [p for p in pages if p.path.resolve() in self.changed]

    def questions_by_format(self, *formats: str) -> list[Page]:
        return [q for q in self.questions if q.meta.get("format") in formats]

    def question_slugs(self) -> set[str]:
        return {q.slug for q in self.questions}

    def workspace_dir(self, slug: str) -> Path:
        return self.workspace_root / slug


# ------------------------------------------------------------------- checks
CHECKS: dict[str, Callable[[Site, Any], tuple[float, list[str], str]]] = {}


def check(check_id: str):
    def deco(fn):
        CHECKS[check_id] = fn
        return fn
    return deco


def ratio(ok: int, total: int) -> float:
    return 1.0 if total == 0 else ok / total


# ---- content
@check("content.concept_docs")
def _content_concept_docs(site: Site, threshold):
    n = len(site.concept_docs)
    if n >= threshold:
        return 1.0, [], f"{n} concept docs"
    return n / threshold, [f"only {n} concept docs, need {threshold}"], f"{n}/{threshold}"


@check("content.concept_quiz")
def _content_concept_quiz(site: Site, threshold):
    missing = [d.rel for d in site.concept_docs if "include quiz.html" not in d.body]
    have = len(site.concept_docs) - len(missing)
    got = ratio(have, len(site.concept_docs))
    score = 1.0 if got >= threshold else got / threshold
    deficits = [f"{rel}: no MCQ — add a {{% include quiz.html %}}" for rel in missing]
    return score, deficits, f"{have}/{len(site.concept_docs)} docs carry a quiz ({got:.0%}, need {threshold:.0%})"


@check("content.skill_registry_sync")
def _content_skill_sync(site: Site, threshold):
    listed = set(site.skills_yml or [])
    actual = set(site.skill_slugs)
    deficits = []
    for slug in sorted(actual - listed):
        deficits.append(f"docs/_data/skills.yml: missing '{slug}'")
    for slug in sorted(listed - actual):
        deficits.append(f"docs/_data/skills.yml: lists '{slug}' but skills/{slug}/SKILL.md does not exist")
    if deficits:
        deficits.append("run: python3 scripts/sync-skills-registry.py")
    return (1.0 if not deficits else 0.0), deficits[:MAX_DEFICITS], f"{len(listed)} listed / {len(actual)} on disk"


# ---- question bank
@check("bank.registry")
def _bank_registry(site: Site, threshold):
    if site.registry is None:
        return 0.0, ["docs/_data/questions.yml does not exist — generate it with scripts/sync-questions-registry.py"], "missing"
    if not isinstance(site.registry, list):
        return 0.0, ["docs/_data/questions.yml must be a YAML list of question entries"], "bad shape"
    listed = {e.get("slug") for e in site.registry if isinstance(e, dict)}
    actual = site.question_slugs()
    deficits = [f"questions.yml: missing '{s}'" for s in sorted(actual - listed)]
    deficits += [f"questions.yml: stale entry '{s}' (no docs/practice/{s}.md)" for s in sorted(listed - actual)]
    if deficits:
        deficits.append("run: python3 scripts/sync-questions-registry.py")
    return (1.0 if not deficits else 0.0), deficits[:MAX_DEFICITS], f"{len(listed)} listed / {len(actual)} on disk"


@check("bank.schema")
def _bank_schema(site: Site, threshold):
    required = site.qschema.get("required", [])
    minutes = site.qschema.get("minutes", {})
    enums = site.enums
    deficits, ok = [], 0
    for q in site.sel(site.questions):
        problems = []
        if "__yaml_error__" in q.meta:
            problems.append(f"front matter does not parse: {q.meta['__yaml_error__']}")
        for key in required:
            if q.meta.get(key) in (None, "", []):
                problems.append(f"missing `{key}`")
        if q.meta.get("layout") not in (None, site.qschema.get("layout", "question")):
            problems.append(f"layout must be `{site.qschema.get('layout')}`, got `{q.meta.get('layout')}`")
        for key in ("format", "difficulty", "layer"):
            val = q.meta.get(key)
            allowed = enums.get(key, [])
            if val is not None and allowed and val not in allowed:
                problems.append(f"`{key}: {val}` not one of {allowed}")
        mins = q.meta.get("minutes")
        if isinstance(mins, int) and minutes:
            if not (minutes.get("min", 0) <= mins <= minutes.get("max", 10 ** 6)):
                problems.append(f"`minutes: {mins}` outside {minutes.get('min')}..{minutes.get('max')}")
        elif mins is not None and not isinstance(mins, int):
            problems.append("`minutes` must be an integer")
        topics = q.meta.get("topics")
        if topics is not None and (not isinstance(topics, list) or len(topics) < site.qschema.get("topics", {}).get("min_items", 1)):
            problems.append("`topics` must be a list with at least one entry")
        if problems:
            deficits.append(f"{q.rel}: " + "; ".join(problems))
        else:
            ok += 1
    subjects = site.sel(site.questions)
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} valid"


@check("bank.formats")
def _bank_formats(site: Site, threshold):
    counts = {fmt: 0 for fmt in site.enums.get("format", [])}
    for q in site.questions:
        if q.meta.get("format") in counts:
            counts[q.meta["format"]] += 1
    scores, deficits = [], []
    for fmt, need in (threshold or {}).items():
        have = counts.get(fmt, 0)
        scores.append(min(1.0, have / need) if need else 1.0)
        if have < need:
            deficits.append(f"format `{fmt}`: {have}/{need} questions — write {need - have} more")
    detail = ", ".join(f"{k}={v}" for k, v in sorted(counts.items()))
    return (sum(scores) / len(scores) if scores else 1.0), deficits, detail


@check("bank.difficulty_mix")
def _bank_difficulty(site: Site, threshold):
    formats = site.enums.get("format", [])
    diffs = site.enums.get("difficulty", [])
    pairs_ok, pairs_total, deficits = 0, 0, []
    for fmt in formats:
        in_fmt = [q for q in site.questions if q.meta.get("format") == fmt]
        if not in_fmt:
            continue  # bank.formats already reports the empty format
        for d in diffs:
            pairs_total += 1
            have = sum(1 for q in in_fmt if q.meta.get("difficulty") == d)
            if have >= threshold:
                pairs_ok += 1
            else:
                deficits.append(f"format `{fmt}` has {have} `{d}` question(s), need {threshold}")
    return ratio(pairs_ok, pairs_total), deficits[:MAX_DEFICITS], f"{pairs_ok}/{pairs_total} format x difficulty cells filled"


@check("bank.layer_coverage")
def _bank_layers(site: Site, threshold):
    scores, deficits, detail = [], [], []
    for layer in site.layers:
        have = sum(1 for q in site.questions if q.meta.get("layer") == layer)
        detail.append(f"{layer}={have}")
        scores.append(min(1.0, have / threshold))
        if have < threshold:
            deficits.append(f"layer `{layer}`: {have}/{threshold} questions")
    return sum(scores) / len(scores), deficits, ", ".join(detail)


@check("bank.topic_coverage")
def _bank_topics(site: Site, threshold):
    all_topics = {t for slugs in site.topics.values() for t in slugs}
    if not all_topics:
        return 1.0, [], "no topic registry"
    used = set()
    for q in site.questions:
        for t in q.meta.get("topics") or []:
            used.add(str(t))
    covered = all_topics & used
    got = ratio(len(covered), len(all_topics))
    score = 1.0 if got >= threshold else got / threshold
    missing = sorted(all_topics - used)
    deficits = [f"no question practises topic `{t}`" for t in missing[:MAX_DEFICITS]]
    return score, deficits, f"{len(covered)}/{len(all_topics)} topics practised ({got:.0%}, need {threshold:.0%})"


@check("bank.unique_slugs")
def _bank_unique(site: Site, threshold):
    seen, deficits = {}, []
    for q in site.questions:
        declared = q.meta.get("slug")
        if declared and declared != q.path.stem:
            deficits.append(f"{q.rel}: `slug: {declared}` does not match the filename")
        key = q.slug
        if key in seen:
            deficits.append(f"{q.rel}: duplicate slug `{key}` (also {seen[key]})")
        seen[key] = q.rel
    return (1.0 if not deficits else 0.0), deficits[:MAX_DEFICITS], f"{len(seen)} unique slugs"


GENERIC_SLUG = re.compile(
    r"^(sample|test|example|untitled|new|draft|question|quiz|coding|placeholder)[-_]?\d*$"
    r"|[-_](sample|test|example|untitled|draft)[-_]?\d*$"
    r"|^\w+[-_](sample|test|example)[-_]?\d*$", re.I)


@check("bank.slug_quality")
def _bank_slug_quality(site: Site, threshold):
    """A slug is a permanent URL and the only handle a plan has on a question.

    An agent asked for "one more quiz question" will happily call it
    `quiz-sample-1`, which passes every other check, ships as a public URL and
    tells nobody what it contains. Name it for its subject or do not ship it.
    """
    subjects = site.sel(site.questions)
    ok, deficits = 0, []
    for q in subjects:
        slug = q.slug
        if GENERIC_SLUG.search(slug):
            deficits.append(f"{q.rel}: slug `{slug}` is a placeholder name — "
                            "rename it for the subject, e.g. `presentational-vs-container`")
        elif len(slug) < 6 or "-" not in slug:
            deficits.append(f"{q.rel}: slug `{slug}` is too terse to be a URL — "
                            "use at least two hyphenated words")
        else:
            ok += 1
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} slugs are descriptive"


@check("content.house_rules")
def _content_house_rules(site: Site, threshold):
    """Repo-specific claims that are simply out of date.

    An executable guardrail measures form, not truth, and a well-formed wrong
    answer passes everything. This is the narrow part of truth that CAN be
    mechanised: a table of claims this codebase already knows are false. Each
    entry came from a real error found in review, which is the only way this
    list should ever grow.
    """
    rules = site.spec.get("house_rules") or []
    if not rules:
        return 1.0, [], "no house rules declared"
    pages = site.sel(site.questions + site.playbooks)
    deficits = []
    for page in pages:
        text = page.prose + "\n" + page.body
        for rule in rules:
            pattern = rule.get("forbidden")
            if not pattern:
                continue
            m = re.search(pattern, text, re.I)
            if m and not re.search(rule.get("unless", r"(?!x)x"), text, re.I):
                line = text[:m.start()].count("\n") + 1
                deficits.append(f"{page.rel}:{line}: `{m.group(0)}` — {rule.get('why', 'violates a house rule')}")
    return (1.0 if not deficits else ratio(len(pages) - len(deficits), len(pages))), \
        deficits[:MAX_DEFICITS], f"{len(deficits)} stale claim(s) across {len(pages)} page(s)"


@check("bank.distinct")
def _bank_distinct(site: Site, threshold):
    """A volume target with no distinctness check rewards padding.

    The loop keeps asking for "more questions in format X" until the count is
    met, and the cheapest way to meet a count is to rewrite a question you have
    already written. This compares titles and summaries within a format and
    flags pairs that overlap too much to be teaching different things.
    """
    def tokens(q: Page) -> set[str]:
        text = f"{q.meta.get('title', '')} {q.meta.get('summary', '')}".lower()
        return {w for w in re.findall(r"[a-z][a-z0-9-]{2,}", text) if w not in _STOPWORDS}

    by_format: dict[str, list[Page]] = {}
    for q in site.questions:
        by_format.setdefault(str(q.meta.get("format")), []).append(q)

    pairs, deficits = 0, []
    for fmt, group in by_format.items():
        for i, a in enumerate(group):
            ta = tokens(a)
            for b in group[i + 1:]:
                tb = tokens(b)
                union = ta | tb
                if not union:
                    continue
                pairs += 1
                overlap = len(ta & tb) / len(union)
                if overlap >= threshold:
                    deficits.append(
                        f"`{a.slug}` and `{b.slug}` ({fmt}) overlap {overlap:.0%} on title+summary — "
                        "one of them is padding; make them teach different things or merge them")
    return (ratio(pairs - len(deficits), pairs) if pairs else 1.0), deficits[:MAX_DEFICITS], \
        f"{len(deficits)} near-duplicate pair(s) across {pairs} comparisons"


_STOPWORDS = {"the", "and", "for", "with", "into", "from", "that", "this", "your", "you",
              "one", "own", "its", "when", "why", "how", "what", "are", "not", "use",
              "using", "build", "write", "basics", "quick", "checks", "question", "questions"}


# ---- solutions
SOLVED_FORMATS = ("coding", "ui-coding", "system-design")


@check("solutions.present")
def _sol_present(site: Site, threshold):
    subjects = site.sel(site.questions_by_format(*SOLVED_FORMATS))
    missing = [q.rel for q in subjects if not re.search(r"^##\s+Solution\b", q.body, re.M)]
    return (ratio(len(subjects) - len(missing), len(subjects)),
            [f"{rel}: no `## Solution` section" for rel in missing[:MAX_DEFICITS]],
            f"{len(subjects) - len(missing)}/{len(subjects)} solved")


@check("solutions.approaches")
def _sol_approaches(site: Site, threshold):
    subjects = site.sel(site.questions_by_format("coding", "ui-coding"))
    ok, deficits = 0, []
    for q in subjects:
        n = len(re.findall(r"^###\s+Approach\b", q.body, re.M))
        if n >= threshold:
            ok += 1
        else:
            deficits.append(f"{q.rel}: {n} `### Approach` section(s), need {threshold}")
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} with >= {threshold} approaches"


@check("solutions.tradeoffs")
def _sol_tradeoffs(site: Site, threshold):
    subjects = site.sel(site.questions_by_format(*SOLVED_FORMATS))
    pat = re.compile(r"^##\s+(Trade-offs|Tradeoffs|Complexity)\b", re.M | re.I)
    missing = [q.rel for q in subjects if not pat.search(q.body)]
    return (ratio(len(subjects) - len(missing), len(subjects)),
            [f"{rel}: no `## Trade-offs` or `## Complexity` section" for rel in missing[:MAX_DEFICITS]],
            f"{len(subjects) - len(missing)}/{len(subjects)}")


# Authoring placeholders only. "placeholder" is a legitimate word on a page about
# layout stability, so match the markers writers actually leave behind.
PLACEHOLDER = re.compile(
    r"\b(TODO|TBD|FIXME|WIP|lorem ipsum|coming soon|to be written|fill (?:this )?in later)\b", re.I)


@check("solutions.no_placeholders")
def _sol_placeholders(site: Site, threshold):
    subjects = site.sel(site.questions)
    deficits = []
    for q in subjects:
        for m in PLACEHOLDER.finditer(q.prose):
            line = q.prose[:m.start()].count("\n") + 1
            deficits.append(f"{q.rel}:{line}: placeholder text `{m.group(0)}`")
            break
    return (1.0 if not deficits else ratio(len(subjects) - len(deficits), len(subjects))), \
        deficits[:MAX_DEFICITS], f"{len(deficits)} page(s) with placeholders"


# ---- workspace
@check("workspace.runner")
def _ws_runner(site: Site, threshold):
    path = site.docs / "assets" / "js" / "playground.js"
    if not path.is_file():
        return 0.0, ["docs/assets/js/playground.js is missing"], "missing"
    src = path.read_text(encoding="utf-8")
    deficits = []
    for token in ("runTests", "starter.js", "tests.js"):
        if token not in src:
            deficits.append(f"playground.js: no reference to `{token}` — the runner must load a question workspace and run its tests")
    return (1.0 if not deficits else 0.0), deficits, f"{len(src)} bytes"


@check("workspace.include")
def _ws_include(site: Site, threshold):
    path = site.docs / "_includes" / "code-playground.html"
    if not path.is_file():
        return 0.0, ["docs/_includes/code-playground.html is missing"], "missing"
    return 1.0, [], "present"


@check("workspace.wired")
def _ws_wired(site: Site, threshold):
    subjects = site.sel(site.questions_by_format("coding"))
    ok, deficits = 0, []
    for q in subjects:
        wdir = site.workspace_dir(q.slug)
        problems = []
        if "include code-playground.html" not in q.body:
            problems.append("page does not embed {% include code-playground.html %}")
        for fname in ("starter.js", "solution.js", "tests.js"):
            if not (wdir / fname).is_file():
                problems.append(f"missing docs/practice/workspace/{q.slug}/{fname}")
        if problems:
            deficits.append(f"{q.rel}: " + "; ".join(problems))
        else:
            ok += 1
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} wired"


@check("workspace.tests_pass")
def _ws_tests(site: Site, threshold):
    subjects = site.sel(site.questions_by_format("coding"))
    runnable = [q for q in subjects
                if (site.workspace_dir(q.slug) / "solution.js").is_file()
                and (site.workspace_dir(q.slug) / "tests.js").is_file()]
    if not runnable:
        return (1.0 if not subjects else 0.0), \
            (["no coding question has a runnable workspace/<slug>/{solution,tests}.js pair"] if subjects else []), \
            "nothing runnable"
    node = _which_node()
    if node is None:
        return 1.0, [], "skipped: node not found"
    ok, deficits = 0, []
    for q in runnable:
        passed, detail = _run_question_tests(node, site.workspace_dir(q.slug))
        if passed:
            ok += 1
        else:
            deficits.append(f"{q.slug}: {detail}")
    return ratio(ok, len(runnable)), deficits[:MAX_DEFICITS], f"{ok}/{len(runnable)} solutions pass their own tests"


def _which_node() -> str | None:
    from shutil import which
    return which("node")


RUNNER_JS = """
import * as subject from './solution.js';
import tests from './tests.js';
const results = await tests(subject.default ?? subject);
const failed = (results || []).filter(r => !r.pass);
if (!Array.isArray(results) || results.length === 0) {
  console.error('tests.js returned no results; it must return [{name, pass, message?}, ...]');
  process.exit(3);
}
if (failed.length) {
  console.error(failed.map(r => `  x ${r.name}${r.message ? ': ' + r.message : ''}`).join('\\n'));
  process.exit(1);
}
console.log(`${results.length} passed`);
"""


def _run_question_tests(node: str, wdir: Path) -> tuple[bool, str]:
    runner = wdir / ".__harness_runner.mjs"
    try:
        runner.write_text(RUNNER_JS, encoding="utf-8")
        proc = subprocess.run([node, str(runner)], capture_output=True, text=True, timeout=30, cwd=str(wdir))
    except subprocess.TimeoutExpired:
        return False, "tests timed out after 30s (infinite loop?)"
    except OSError as exc:
        return False, f"could not run node: {exc}"
    finally:
        runner.unlink(missing_ok=True)
    if proc.returncode == 0:
        return True, proc.stdout.strip()
    out = (proc.stdout + "\n" + proc.stderr).strip()
    return False, out[:600] if out else f"node exited {proc.returncode}"


# ---- frameworks
@check("frameworks.multi")
def _fw_multi(site: Site, threshold):
    subjects = site.sel(site.questions_by_format("ui-coding"))
    ok, deficits = 0, []
    for q in subjects:
        declared = [str(f) for f in (q.meta.get("frameworks") or [])]
        wdir = site.workspace_dir(q.slug)
        present = [f for f in declared if any(wdir.glob(f"{f}/starter.*"))]
        if len(present) >= threshold:
            ok += 1
        else:
            deficits.append(
                f"{q.rel}: starter code for {len(present)}/{threshold} frameworks "
                f"(declared {declared or 'none'}; need docs/practice/workspace/{q.slug}/<framework>/starter.*)")
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} multi-framework"


@check("frameworks.known")
def _fw_known(site: Site, threshold):
    allowed = set(site.enums.get("framework", []))
    deficits = []
    for q in site.sel(site.questions):
        for f in q.meta.get("frameworks") or []:
            if str(f) not in allowed:
                deficits.append(f"{q.rel}: unknown framework `{f}` (allowed: {sorted(allowed)})")
    unmapped = [f for f in allowed if not any(f in t for t in site.template_dirs)]
    for f in unmapped:
        deficits.append(f"enums.framework lists `{f}` but no templates/chota-*{f}* project exists")
    return (1.0 if not deficits else 0.0), deficits[:MAX_DEFICITS], f"{len(allowed)} frameworks"


# ---- plans
def _plan_entries(site: Site) -> list[dict]:
    plans = site.plans
    if isinstance(plans, list):
        return [p for p in plans if isinstance(p, dict)]
    return []


@check("plans.registry")
def _plans_registry(site: Site, threshold):
    if site.plans is None:
        return 0.0, ["docs/_data/plans.yml does not exist"], "missing"
    entries = _plan_entries(site)
    deficits = []
    for p in entries:
        for key in ("slug", "title", "budget_minutes", "items"):
            if p.get(key) in (None, "", []):
                deficits.append(f"plans.yml `{p.get('slug', '?')}`: missing `{key}`")
    if len(entries) < threshold:
        deficits.append(f"plans.yml has {len(entries)} plans, need {threshold} (e.g. 1-week, 1-month, 3-months, a curated shortlist)")
    score = min(1.0, len(entries) / threshold) if threshold else 1.0
    if any("missing" in d for d in deficits):
        score = min(score, 0.5)
    return score, deficits[:MAX_DEFICITS], f"{len(entries)} plans"


@check("plans.items_resolve")
def _plans_items(site: Site, threshold):
    entries = _plan_entries(site)
    qslugs = site.question_slugs()
    doc_paths = {f"{d.path.parent.name}/{d.path.stem}" for d in site.concept_docs}
    total, ok, deficits = 0, 0, []
    for p in entries:
        for item in p.get("items") or []:
            total += 1
            ref = item.get("ref") if isinstance(item, dict) else str(item)
            if ref in qslugs or ref in doc_paths:
                ok += 1
            else:
                deficits.append(f"plan `{p.get('slug')}`: item `{ref}` is neither a question slug nor a <layer>/<doc> path")
    return ratio(ok, total), deficits[:MAX_DEFICITS], f"{ok}/{total} plan items resolve"


@check("plans.duration_fit")
def _plans_duration(site: Site, threshold):
    entries = _plan_entries(site)
    minutes_by_slug = {q.slug: (q.meta.get("minutes") or 0) for q in site.questions}
    ok, deficits = 0, []
    for p in entries:
        budget = p.get("budget_minutes") or 0
        if not budget:
            deficits.append(f"plan `{p.get('slug')}`: no `budget_minutes`")
            continue
        total = 0
        for item in p.get("items") or []:
            ref = item.get("ref") if isinstance(item, dict) else str(item)
            total += minutes_by_slug.get(ref, item.get("minutes", 15) if isinstance(item, dict) else 15)
        drift = abs(total - budget) / budget
        if drift <= threshold:
            ok += 1
        else:
            deficits.append(
                f"plan `{p.get('slug')}`: items sum to {total} min against a {budget} min budget "
                f"({drift:.0%} off, tolerance {threshold:.0%})")
    return (ratio(ok, len(entries)) if entries else 1.0), deficits[:MAX_DEFICITS], \
        f"{ok}/{len(entries)} plans fit their budget"


@check("plans.horizon_fit")
def _plans_horizon(site: Site, threshold):
    """`plans.duration_fit` only checks a plan against its own promise.

    A model that cannot fill a 3-month plan can satisfy that check perfectly by
    declaring the budget to be 60 minutes — the arithmetic is consistent and the
    plan is a lie. This check anchors the named horizons to real time, so
    shrinking the promise stops being an escape route.
    """
    bands = site.spec.get("plan_horizons") or {}
    entries = _plan_entries(site)
    subjects = [p for p in entries if p.get("slug") in bands]
    if not subjects:
        return 1.0, [], "no named-horizon plans"
    ok, deficits = 0, []
    for p in subjects:
        band = bands[p["slug"]]
        budget = p.get("budget_minutes") or 0
        lo, hi = band.get("min", 0), band.get("max", 10 ** 9)
        if lo <= budget <= hi:
            ok += 1
        else:
            deficits.append(
                f"plan `{p['slug']}`: {budget} min is outside the {lo}-{hi} min a plan with that "
                f"name has to mean. Add steps until it fits, or rename the plan to what it is.")
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} horizons honest"


@check("plans.pages")
def _plans_pages(site: Site, threshold):
    entries = _plan_entries(site)
    have = {p.slug: p for p in site.plan_pages}
    ok, deficits = 0, []
    for p in entries:
        slug = p.get("slug")
        page = have.get(slug)
        if page is None:
            deficits.append(f"plan `{slug}`: no docs/plans/{slug}.md")
        elif page.meta.get("layout") != "plan":
            deficits.append(f"docs/plans/{slug}.md: `layout` must be `plan`")
        else:
            ok += 1
    return (ratio(ok, len(entries)) if entries else 1.0), deficits[:MAX_DEFICITS], \
        f"{ok}/{len(entries)} plan pages"


# ---- playbooks
@check("playbooks.count")
def _pb_count(site: Site, threshold):
    n = len(site.playbooks)
    deficits = [] if n >= threshold else [f"docs/playbooks/ has {n} guides, need {threshold}"]
    return min(1.0, n / threshold), deficits, f"{n} playbooks"


@check("playbooks.depth")
def _pb_depth(site: Site, threshold):
    ok, deficits = 0, []
    subjects = site.sel(site.playbooks)
    for p in subjects:
        wc = word_count(p.body)
        if wc >= threshold:
            ok += 1
        else:
            deficits.append(f"{p.rel}: {wc} words, need {threshold}")
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} deep enough"


# ---- progress
@check("progress.tracker")
def _prog_tracker(site: Site, threshold):
    path = site.docs / "assets" / "js" / "progress.js"
    if not path.is_file():
        return 0.0, ["docs/assets/js/progress.js is missing"], "missing"
    src = path.read_text(encoding="utf-8")
    deficits = [f"progress.js: no `{t}` — progress must persist client-side" for t in ("localStorage",) if t not in src]
    return (1.0 if not deficits else 0.0), deficits, "present"


@check("progress.wired")
def _prog_wired(site: Site, threshold):
    include = site.docs / "_includes" / "progress-tracker.html"
    targets = [site.docs / "practice" / "index.md"] + [p.path for p in site.plan_pages]
    deficits = []
    if not include.is_file():
        deficits.append("docs/_includes/progress-tracker.html is missing")
    ok = 0
    for t in targets:
        if not t.is_file():
            deficits.append(f"{t.relative_to(ROOT)} is missing")
            continue
        if site.renders(t, "progress-tracker.html"):
            ok += 1
        else:
            deficits.append(f"{t.relative_to(ROOT)}: neither the page nor its layout renders "
                            "{% include progress-tracker.html %}")
    score = ratio(ok, len(targets)) if targets else 0.0
    if not include.is_file():
        score = 0.0
    return score, deficits[:MAX_DEFICITS], f"{ok}/{len(targets)} surfaces wired"


@check("progress.certificate")
def _prog_cert(site: Site, threshold):
    path = site.docs / "plans" / "certificate.md"
    return (1.0, [], "present") if path.is_file() else (0.0, ["docs/plans/certificate.md is missing"], "missing")


# ---- discovery
@check("discovery.index")
def _disc_index(site: Site, threshold):
    path = site.docs / "practice" / "index.md"
    if not path.is_file():
        return 0.0, ["docs/practice/index.md is missing"], "missing"
    src = path.read_text(encoding="utf-8")
    deficits = [f"practice/index.md: no filter control for `{f}` (expected data-filter=\"{f}\")"
                for f in ("format", "difficulty", "layer", "topic") if f'data-filter="{f}"' not in src]
    return ratio(4 - len(deficits), 4), deficits, f"{4 - len(deficits)}/4 filters"


@check("discovery.nav")
def _disc_nav(site: Site, threshold):
    nav = site.docs / "_includes" / "site-nav.html"
    if not nav.is_file():
        return 0.0, ["docs/_includes/site-nav.html is missing"], "missing"
    src = nav.read_text(encoding="utf-8")
    wanted = {"practice": "/practice", "plans": "/plans", "playbooks": "/playbooks"}
    deficits = [f"site-nav.html: no link to {href}" for name, href in wanted.items() if href not in src]
    return ratio(len(wanted) - len(deficits), len(wanted)), deficits, f"{len(wanted) - len(deficits)}/{len(wanted)} nav links"


@check("discovery.search")
def _disc_search(site: Site, threshold):
    path = site.docs / "assets" / "js" / "practice-index.js"
    if not path.is_file():
        return 0.0, ["docs/assets/js/practice-index.js is missing"], "missing"
    src = path.read_text(encoding="utf-8")
    deficits = [f"practice-index.js: no `{t}` handling" for t in ("data-filter", "search") if t not in src]
    return (1.0 if not deficits else 0.0), deficits, "present"


# ---- site health
@check("health.front_matter")
def _health_fm(site: Site, threshold):
    pages = site.sel(site.all_pages)
    ok, deficits = 0, []
    for p in pages:
        problems = []
        if "__yaml_error__" in p.meta:
            problems.append(f"front matter does not parse: {p.meta['__yaml_error__']}")
        else:
            if not p.meta.get("title"):
                problems.append("missing `title`")
            if not p.meta.get("layout"):
                problems.append("missing `layout`")
        if problems:
            deficits.append(f"{p.rel}: " + "; ".join(problems))
        else:
            ok += 1
    return ratio(ok, len(pages)), deficits[:MAX_DEFICITS], f"{ok}/{len(pages)} pages"


LINK_RE = re.compile(r"(?<!\!)\[[^\]]*\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")


@check("health.internal_links")
def _health_links(site: Site, threshold):
    ok, total, deficits = 0, 0, []
    for p in site.sel(site.all_pages):
        for target in LINK_RE.findall(p.prose):
            if re.match(r"^(https?:|mailto:|tel:|#|\{\{|\{%|data:)", target):
                continue
            total += 1
            if _resolves(site, p, target.split("#")[0]):
                ok += 1
            else:
                deficits.append(f"{p.rel}: broken link -> `{target}`")
    return ratio(ok, total), deficits[:MAX_DEFICITS], f"{ok}/{total} internal links resolve"


def _resolves(site: Site, page: Page, target: str) -> bool:
    if not target:
        return True
    base = site.docs if target.startswith("/") else page.path.parent
    rel = target.lstrip("/")
    candidate = (base / rel)
    stem = candidate.with_suffix("")
    for probe in (candidate, stem.with_suffix(".md"), stem.with_suffix(".html"),
                  candidate / "index.md", candidate / "index.html"):
        try:
            if probe.exists():
                return True
        except OSError:
            return False
    return False


IMG_MD = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)")
IMG_HTML = re.compile(r"<img\b([^>]*)>", re.I)


@check("health.alt_text")
def _health_alt(site: Site, threshold):
    ok, total, deficits = 0, 0, []
    for p in site.sel(site.all_pages):
        for alt, src in IMG_MD.findall(p.prose):
            total += 1
            if alt.strip():
                ok += 1
            else:
                deficits.append(f"{p.rel}: image `{src}` has empty alt text")
        for attrs in IMG_HTML.findall(p.prose):
            total += 1
            m = re.search(r'alt\s*=\s*"([^"]*)"', attrs, re.I)
            if m and m.group(1).strip():
                ok += 1
            else:
                deficits.append(f"{p.rel}: <img{attrs[:60]}...> has no alt attribute")
    return ratio(ok, total), deficits[:MAX_DEFICITS], f"{ok}/{total} images have alt text"


HEADING_RE = re.compile(r"^(#{1,6})\s+\S", re.M)


@check("health.heading_order")
def _health_headings(site: Site, threshold):
    pages = site.sel(site.all_pages)
    ok, deficits = 0, []
    for p in pages:
        body = p.prose
        levels = [len(m.group(1)) for m in HEADING_RE.finditer(body)]
        bad = None
        prev = 0
        for lv in levels:
            if prev and lv > prev + 1:
                bad = (prev, lv)
                break
            prev = lv
        if bad:
            deficits.append(f"{p.rel}: heading level jumps h{bad[0]} -> h{bad[1]}")
        else:
            ok += 1
    return ratio(ok, len(pages)), deficits[:MAX_DEFICITS], f"{ok}/{len(pages)} pages"


def _liquid_problem(text: str, start: int, label: str, opener: str, closer: str) -> str:
    line = text[:start].count("\n") + 1
    snippet = text[start:start + 60].replace("\n", " ")
    return (f"line {line}: Liquid {label} `{opener}` is not terminated by `{closer}` "
            f"— `{snippet}...`. If this is code rather than a template, wrap the block "
            "in {% raw %} ... {% endraw %}")


@check("health.liquid_syntax")
def _health_liquid(site: Site, threshold):
    """An unterminated Liquid tag breaks the build of the WHOLE site.

    Found the hard way: a generated question closed `{% include quiz.html ... }`
    with a bare `}`. Every text check passed and `jekyll build` died, taking
    every other page with it. The full build is the real authority, but it is
    too slow to run on every heal attempt — this is the same defect class in
    milliseconds, so it can sit in an agent's per-task verifier.
    """
    pages = site.sel(site.all_pages)
    ok, deficits = 0, []
    for page in pages:
        # NOT `prose`: Liquid runs before Markdown, so it parses INSIDE code
        # fences too. A JSX `style={{ aspectRatio }}` in an example block is a
        # real build failure unless the block is wrapped in {% raw %}.
        text = RAW_BLOCK_RE.sub("\n", page.body)
        problems = []

        # Tags: Liquid needs `%}` before the next `{%`.
        pos = 0
        while True:
            start = text.find("{%", pos)
            if start == -1:
                break
            end = text.find("%}", start + 2)
            nxt = text.find("{%", start + 2)
            if end == -1 or (nxt != -1 and nxt < end):
                problems.append(_liquid_problem(text, start, "tag", "{%", "%}"))
                break
            pos = end + 2

        # Expressions: Liquid's tokenizer is LAZY and accepts a single closing
        # brace, so the FIRST `}` after `{{` must itself be followed by `}`.
        # That is why JSX like `style={{ aspectRatio: `${w}/${h}` }}` fails —
        # the `}` of `${w}` ends the token and Liquid then rejects it.
        pos = 0
        while True:
            start = text.find("{{", pos)
            if start == -1:
                break
            close = text.find("}", start + 2)
            if close == -1 or text[close:close + 2] != "}}":
                problems.append(_liquid_problem(text, start, "expression", "{{", "}}"))
                break
            pos = close + 2

        if problems:
            deficits.append(f"{page.rel}: " + "; ".join(problems))
        else:
            ok += 1
    return ratio(ok, len(pages)), deficits[:MAX_DEFICITS], f"{ok}/{len(pages)} pages parse"


@check("health.build")
def _health_build(site: Site, threshold):
    if os.environ.get("HARNESS_SKIP_BUILD") == "1":
        return 1.0, [], "skipped: HARNESS_SKIP_BUILD=1"
    built, why = build_site(site.docs)
    if built is not None:
        return 1.0, [], "jekyll build ok"
    if why.startswith("jekyll is not installed"):
        return 1.0, [], f"skipped: {why}"
    return 0.0, [why], "build failed"


# ---- functional capabilities: a browser, not a parser
def _functional(scenario: str):
    """Register a capability backed by one Playwright scenario."""
    def run(site: Site, threshold):
        scenarios, why = site.functional()
        if scenarios is None:
            return 1.0, [], why
        result = scenarios.get(scenario)
        if result is None:
            return 0.0, [f"the functional suite did not run scenario `{scenario}`"], "not reported"
        if result.get("pass"):
            return 1.0, [], f"{result.get('detail', 'ok')} ({result.get('ms', 0)}ms)"
        return 0.0, [f"{scenario}: {result.get('detail', 'failed')}"], "failed in the browser"
    return run


for _scenario in ("playground", "quiz", "filters", "progress", "plans", "console_clean", "keyboard"):
    CHECKS[f"functional.{_scenario}"] = _functional(_scenario)


# ---- the AI-harness axis
@check("harness.skill_map")
def _h_skill_map(site: Site, threshold):
    known = set(site.skill_slugs)
    subjects = site.sel(site.questions)
    ok, deficits = 0, []
    for q in subjects:
        skill = q.meta.get("skill")
        if skill and str(skill) in known:
            ok += 1
        else:
            deficits.append(f"{q.rel}: `skill: {skill}` has no skills/{skill}/SKILL.md")
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} questions map to a skill"


@check("harness.eval_spec")
def _h_eval(site: Site, threshold):
    subjects = site.sel(site.questions_by_format("harness"))
    ok, deficits = 0, []
    for q in subjects:
        ev = q.meta.get("eval")
        problems = []
        if not isinstance(ev, dict):
            problems.append("missing `eval:` block (needs `rubric:` and `threshold:`)")
        else:
            rubric = ev.get("rubric")
            if not isinstance(rubric, list) or len(rubric) < 2:
                problems.append("`eval.rubric` must be a list of at least 2 measurable items")
            th = ev.get("threshold")
            if not isinstance(th, (int, float)) or not 0 < float(th) <= 1:
                problems.append("`eval.threshold` must be a number in (0, 1]")
        if problems:
            deficits.append(f"{q.rel}: " + "; ".join(problems))
        else:
            ok += 1
    return ratio(ok, len(subjects)), deficits[:MAX_DEFICITS], f"{ok}/{len(subjects)} harness questions carry an eval"


@check("harness.skill_coverage")
def _h_skill_cov(site: Site, threshold):
    known = set(site.skill_slugs)
    if not known:
        return 0.0, ["no skills/<slug>/SKILL.md found"], "no skills"
    used = {str(q.meta.get("skill")) for q in site.questions if q.meta.get("skill")}
    covered = known & used
    got = ratio(len(covered), len(known))
    score = 1.0 if got >= threshold else got / threshold
    missing = sorted(known - used)
    return score, [f"skill `{s}` has no question" for s in missing[:MAX_DEFICITS]], \
        f"{len(covered)}/{len(known)} skills exercised ({got:.0%}, need {threshold:.0%})"


@check("harness.docs")
def _h_docs(site: Site, threshold):
    path = HARNESS_DIR / "README.md"
    if not path.is_file():
        return 0.0, ["harness/README.md is missing"], "missing"
    src = path.read_text(encoding="utf-8")
    missing = [c["id"] for c in site.spec["checks"] if c["id"] not in src]
    if missing:
        return ratio(len(site.spec["checks"]) - len(missing), len(site.spec["checks"])), \
            [f"harness/README.md does not document check `{cid}`" for cid in missing[:MAX_DEFICITS]], \
            f"{len(missing)} undocumented checks"
    return 1.0, [], "documented"


# ------------------------------------------------------------------- runner
def fmt_why(why: str, threshold) -> str:
    try:
        return why.format(threshold=threshold)
    except (KeyError, IndexError, ValueError, TypeError):
        return why


def sync_generated(site_root: Path) -> list[str]:
    """Regenerate the files that are generated, not authored.

    An agent writes question pages; docs/_data/questions.yml is derived from
    them. Running the generator before the checks keeps `bank.registry` a real
    guard against hand-edits without making every author responsible for a
    build artefact.
    """
    notes = []
    for script in ("scripts/sync-questions-registry.py", "scripts/sync-skills-registry.py"):
        path = ROOT / script
        if not path.is_file():
            continue
        proc = subprocess.run([sys.executable, str(path)], cwd=str(ROOT),
                              capture_output=True, text=True, timeout=120)
        if proc.returncode != 0:
            notes.append(f"{script}: {(proc.stdout + proc.stderr).strip()[:300]}")
    return notes


# A capability named in the instruction the agent is answering. `owns` may not
# skip it and `scope` may not drop it: it is the whole point of the task.
TARGET_RE = re.compile(r"Capability `([a-z_]+\.[a-z_]+)`", re.I)


def dispatched_targets(explicit: list[str] | None) -> set[str]:
    """Capabilities this run must judge no matter what the contribution touched.

    `--changed` and `owns` exist so an author is not blamed for inherited debt.
    Left alone they also let a repair task pass by writing a file outside the
    broken capability's territory — the contribution is scoped out of the very
    check it was sent to satisfy. Benzene exports the instruction as
    BENZENE_INSTRUCTION, so the checker can read which capability was handed
    over and refuse to skip it.
    """
    targets = set(explicit or [])
    targets.update(TARGET_RE.findall(os.environ.get("BENZENE_INSTRUCTION", "")))
    return targets


def run(spec: dict, only: set[str], groups: set[str], want_build: bool,
        scope: str = "all", changed: list[str] | None = None,
        must: list[str] | None = None) -> list[Result]:
    site = Site(spec, changed=changed)
    targets = dispatched_targets(must)
    results: list[Result] = []
    for c in spec["checks"]:
        cid = c["id"]
        if only and cid not in only:
            continue
        if groups and c.get("group") not in groups:
            continue
        if scope != "all" and c.get("scope", "incremental") != scope and cid not in targets:
            continue
        if site.changed and c.get("owns") and cid not in targets and not site.touches(c["owns"]):
            results.append(Result(cid, c["group"], c.get("weight", 1), c.get("required", True),
                                  1.0, fmt_why(c["why"], c.get("threshold")),
                                  detail="skipped: this contribution did not touch " + ", ".join(c["owns"]),
                                  skipped=True))
            continue
        if cid == "health.build" and not want_build:
            results.append(Result(cid, c["group"], c.get("weight", 1), c.get("required", True),
                                  1.0, fmt_why(c["why"], c.get("threshold")),
                                  detail="skipped: pass --build to run it", skipped=True))
            continue
        fn = CHECKS.get(cid)
        if fn is None:
            results.append(Result(cid, c["group"], c.get("weight", 1), c.get("required", True),
                                  0.0, fmt_why(c["why"], c.get("threshold")),
                                  deficits=[f"no implementation for check `{cid}`"]))
            continue
        try:
            score, deficits, detail = fn(site, c.get("threshold"))
        except Exception as exc:  # a broken check must not hide the rest
            score, deficits, detail = 0.0, [f"check raised {type(exc).__name__}: {exc}"], "error"
        results.append(Result(cid, c["group"], c.get("weight", 1), c.get("required", True),
                              max(0.0, min(1.0, float(score))), fmt_why(c["why"], c.get("threshold")),
                              deficits=deficits, detail=detail))
    return results


def composite(results: list[Result]) -> float:
    total = sum(r.weight for r in results)
    return 1.0 if not total else sum(r.weight * r.score for r in results) / total


def report_text(results: list[Result], spec: dict, verbose: bool, failures_only: bool = False) -> str:
    lines: list[str] = []
    group = None
    shown = [r for r in results if not r.passed] if failures_only else results
    if failures_only and not shown:
        return "\nevery capability in scope passes."
    for r in shown:
        if r.group != group:
            group = r.group
            lines.append(f"\n[{group}]")
        mark = "skip" if r.skipped else ("pass" if r.passed else "FAIL")
        req = " " if r.required else "~"
        lines.append(f"  {mark:4} {req}{r.id:28} {r.score:5.2f}  {r.detail}")
        if not r.passed or verbose:
            if not r.passed:
                lines.append(f"       why: {r.why}")
            for d in r.deficits:
                lines.append(f"       - {d}")
    comp = composite(results)
    failed_required = [r for r in results if r.required and not r.passed]
    lines.append("")
    lines.append(f"composite {comp:.3f} (pass_threshold {spec['pass_threshold']})")
    lines.append(f"required failing: {len(failed_required)}"
                 + (": " + ", ".join(r.id for r in failed_required) if failed_required else ""))
    return "\n".join(lines)


def next_deficit(results: list[Result], spec: dict) -> str:
    """The single highest-priority piece of work that is not blocked.

    Weight alone picks the wrong job. A study plan outweighs a quiz question,
    but a plan cannot be built before there is a bank to build it from, so
    handing an agent `plans.*` first only teaches it to fake the plan. A check
    whose `requires` are still failing waits its turn.
    """
    candidates = [r for r in results if not r.passed]
    if not candidates:
        return ""
    by_id = {r.id: r for r in results}
    requires = {c["id"]: list(c.get("requires") or []) for c in spec["checks"]}

    def blocked(r: Result) -> bool:
        return any(dep in by_id and not by_id[dep].passed for dep in requires.get(r.id, []))

    reachable = [r for r in candidates if not blocked(r)]
    pool = reachable or candidates  # a dependency cycle must not stall the loop

    # Repair before growth. `scope` already says which is which: a cumulative
    # capability failing means "not enough yet", an incremental one means "what
    # is there is wrong". Sorting by weight alone put a filter that stopped
    # filtering behind six questions that were never written — you do not add a
    # room to a house that is on fire.
    scope_of = {c["id"]: c.get("scope", "incremental") for c in spec["checks"]}
    pool.sort(key=lambda r: (scope_of.get(r.id) == "cumulative", not r.required, -r.weight, r.score))
    r = pool[0]
    out = [f"Capability `{r.id}` fails ({r.score:.2f}). {r.why}", f"Current state: {r.detail}", "Fix these:"]
    out += [f"  - {d}" for d in r.deficits[:MAX_DEFICITS]]
    out.append("")
    # A volume target names more work than one contribution should attempt.
    # Saying so is the difference between an agent writing one good file and an
    # agent trying to write twelve and finishing none.
    kind = "a regression: something that exists is wrong" if r.id in {c["id"] for c in spec["checks"] if c.get("scope") != "cumulative"} else "growth: something is missing"
    out.insert(1, f"This is {kind}.")
    out.append("Do the smallest useful piece of this now — normally ONE file. "
               "Whatever is left stays reported here until it is done, so there is "
               "nothing to gain by attempting all of it in one go.")
    out.append(f"Re-check with: python3 harness/check_harness.py --only {r.id}")
    return "\n".join(out)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="Frontend AI Harness capability guardrail")
    ap.add_argument("--json", action="store_true", help="machine-readable report")
    ap.add_argument("--next", action="store_true", dest="next_", help="print only the highest-priority deficit")
    ap.add_argument("--only", action="append", default=[], help="run a single check id (repeatable)")
    ap.add_argument("--group", action="append", default=[], help="run one group (repeatable)")
    ap.add_argument("--build", action="store_true", help="also run `jekyll build` (slow)")
    ap.add_argument("--scope", choices=["all", "incremental", "cumulative"], default="all",
                    help="incremental: only what one contribution is responsible for; "
                         "cumulative: only the whole-site volume targets")
    ap.add_argument("--must", action="append", default=[], metavar="CHECK",
                    help="always judge this capability, even when --changed / owns would skip it. "
                         "Also read from `Capability \u0060<id>\u0060` in $BENZENE_INSTRUCTION, so a "
                         "repair task cannot pass by editing a file outside the broken capability.")
    ap.add_argument("--changed", nargs="*", default=None, metavar="PATH",
                    help="judge per-page capabilities only for these files — what one "
                         "contribution is answerable for. Registry, plan and volume "
                         "checks stay site-wide.")
    ap.add_argument("--sync", action="store_true",
                    help="regenerate docs/_data/*.yml from disk before checking")
    ap.add_argument("--verbose", action="store_true", help="show deficits for passing checks too")
    ap.add_argument("--failures-only", action="store_true", dest="failures_only",
                    help="print only failing capabilities. Use this when the output is a "
                         "correction message: an agent acts on the first thing it reads, and "
                         "two defects under forty 'pass' lines get skipped.")
    ap.add_argument("--spec", default=str(SPEC_PATH))
    args = ap.parse_args(argv)

    spec_path = Path(args.spec)
    if not spec_path.is_file():
        sys.stderr.write(f"harness: spec not found: {spec_path}\n")
        return 2
    spec = yaml.safe_load(spec_path.read_text(encoding="utf-8"))

    if args.sync:
        for note in sync_generated(ROOT):
            sys.stderr.write(f"harness: {note}\n")

    results = run(spec, set(args.only), set(args.group), args.build, args.scope, args.changed, args.must)
    comp = composite(results)
    failed_required = [r for r in results if r.required and not r.passed]
    passing = not failed_required and comp >= spec["pass_threshold"]

    if args.json:
        print(json.dumps({
            "version": spec.get("version"),
            "composite": round(comp, 4),
            "pass_threshold": spec["pass_threshold"],
            "passed": passing,
            "checks": [{"id": r.id, "group": r.group, "score": round(r.score, 4),
                        "passed": r.passed, "required": r.required, "skipped": r.skipped,
                        "weight": r.weight, "detail": r.detail, "why": r.why,
                        "deficits": r.deficits} for r in results],
        }, indent=2))
    elif args.next_:
        text = next_deficit(results, spec)
        print(text or f"All capabilities pass (composite {comp:.3f}).")
    else:
        print(f"Frontend AI Harness — capability guardrail (scope: {args.scope})")
        print(report_text(results, spec, args.verbose, args.failures_only))

    return 0 if passing else 1


if __name__ == "__main__":
    raise SystemExit(main())
