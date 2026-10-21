#!/usr/bin/env python3
"""The offices' bars on their material (under .benzene/material) and on the files they close for the product.

    python3 .benzene/checks/material.py <bar> [--limit N]

One subcommand per bar of benzene-standards.yaml; each prints ``FAIL material.<bar> [<rule>] <what>`` per finding (the
first --limit after a count) and exits 1 when there is any. Stdlib + PyYAML; run from the repository root.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

import yaml

ROOT = Path.cwd()
M = ROOT / ".benzene" / "material"
MK, EXP, FIN, INV = M / "marketing", M / "experience", M / "finance", M / "investors"
SITE = "elegantfrontend.training"
TODAY = dt.date.today()
OUT: list[str] = []
NAME = ""


def fail(rule: str, what: str) -> None:
    OUT.append(f"FAIL material.{NAME} [{rule}] {what}")


def rel(p: Path) -> str:
    return p.relative_to(ROOT).as_posix()


def fm(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8", errors="replace")
    m = re.match(r"\A---\n(.*?)\n---\n?(.*)\Z", text, re.S)
    if not m:
        return {}, text
    try:
        meta = yaml.safe_load(m.group(1)) or {}
    except yaml.YAMLError as exc:
        fail("front-matter", f"{rel(path)}: front matter is not YAML ({str(exc)[:80]})")
        meta = {}
    return (meta if isinstance(meta, dict) else {}), m.group(2)


def files(folder: Path, pattern: str = "*.md") -> list[Path]:
    return sorted(p for p in folder.glob(pattern) if p.is_file() and p.name.lower() != "readme.md") if folder.is_dir() else []


def date_of(meta: dict) -> dt.date | None:
    v = meta.get("date")
    if isinstance(v, dt.datetime):
        return v.date()
    if isinstance(v, dt.date):
        return v
    try:
        return dt.date.fromisoformat(str(v)[:10])
    except ValueError:
        return None


def week(d: dt.date) -> str:
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def sections(text: str) -> dict[str, str]:
    out, cur = {}, None
    for line in text.splitlines():
        m = re.match(r"^##\s+(.*?)\s*$", line)
        if m:
            cur = m.group(1).strip().lower()
            out[cur] = ""
        elif cur is not None:
            out[cur] += line + "\n"
    return out


def words(text: str) -> int:
    return len(re.findall(r"[A-Za-z0-9][\w'-]*", text))


def need_file(path: Path, what: str) -> bool:
    if not path.exists():
        fail("missing", f"no {rel(path)}: {what}")
        return False
    return True


def channel_posts(channel: str) -> list[tuple[Path, dict, str]]:
    out = []
    for p in files(MK / "posts"):
        meta, body = fm(p)
        if str(meta.get("channel", "")).lower() in (channel, "twitter" if channel == "x" else channel):
            out.append((p, meta, body.strip()))
    return out


def deck(meta: dict) -> list[str] | None:
    path = str(meta.get("slides") or "")
    if not path:
        return None
    p = ROOT / path
    if not p.exists():
        return []
    _, body = fm(p)
    return [s for s in re.split(r"(?m)^---\s*$", body) if s.strip()]


_BOX = str.maketrans({c: " " for c in "│├└─┬┼|`"})


def diagram_problems(rel_path: str) -> list[str]:
    """A folder diagram (benzene/diagrams.py draws it): its tree, every node under its root, every callout on a node, the
    sizes a feed shows. The same rules the room flags, in stdlib, so the bar and the room agree."""
    p = ROOT / rel_path
    if not p.is_file():
        return [f"{rel_path} does not exist"]
    meta, body = fm(p)
    m = re.search(r"```tree\s*\n(.*?)```", body, re.S)
    if not m:
        return [f"{rel_path}: no ```tree block"]
    nodes, stack = [], []
    for raw in m.group(1).splitlines():
        flat = raw.rstrip().translate(_BOX)
        name = flat.strip()
        if not name or name.startswith("#") or name in (".", "./"):
            continue
        indent = len(flat) - len(flat.lstrip())
        while stack and indent <= stack[-1][0]:
            stack.pop()
        path = "/".join([n.rstrip("/") for _, n in stack] + [name.rstrip("/")])
        nodes.append({"name": name, "path": path, "depth": len(stack), "dir": name.endswith("/")})
        stack.append((indent, name))
    for i, n in enumerate(nodes):
        if i + 1 < len(nodes) and nodes[i + 1]["depth"] > n["depth"]:
            n["dir"] = True
    out = []
    for k in ("title", "subtitle"):
        if len(str(meta.get(k) or "")) > 28:
            out.append(f"{rel_path}: the {k} is over 28 characters")
    if not meta.get("title"):
        out.append(f"{rel_path}: no title")
    if len(nodes) > 24:
        out.append(f"{rel_path}: {len(nodes)} nodes; at most 24")
    root = ROOT / str(meta.get("root") or "").strip().rstrip("/")
    if not meta.get("root") or not root.is_dir():
        out.append(f"{rel_path}: root {meta.get('root')!r} is not a folder of the repository")
    else:
        for n in nodes:
            q = root / n["path"]
            if (n["dir"] and not q.is_dir()) or (not n["dir"] and not q.is_file()):
                out.append(f"{rel_path}: {meta['root']}/{n['path']} is not in the repository")
    names = {n["name"].rstrip("/") for n in nodes} | {n["path"] for n in nodes}
    callouts = re.split(r"(?m)^##\s+", body[m.end():])[1:]
    if not callouts:
        out.append(f"{rel_path}: no ## callout")
    if len(callouts) > 8:
        out.append(f"{rel_path}: {len(callouts)} callouts; at most 8")
    for chunk in callouts:
        head, _, rest = chunk.partition("\n")
        head = re.sub(r"\s*\{\w+\}\s*$", "", head).strip()
        am = re.match(r"(.*?)\s*(?:→|->)\s*(.*)$", head)
        refs = [r for r in re.split(r"[,\s]+", am.group(2)) if r] if am else [head]
        for ref in refs:
            if ref.strip().rstrip("/") not in names:
                out.append(f"{rel_path}: the callout {head!r} names {ref!r}, which is no node of the tree")
        bullets = [l for l in rest.splitlines() if re.match(r"^\s*[-*•]\s+\S", l)]
        if not 1 <= len(bullets) <= 4:
            out.append(f"{rel_path}: the callout {head!r} has {len(bullets)} bullets; 1 to 4")
        for b in bullets:
            if len(re.sub(r"^\s*[-*•]\s+", "", b).strip()) > 64:
                out.append(f"{rel_path}: a bullet of {head!r} is over 64 characters")
    return out


def x_length(text: str) -> int:
    text = re.sub(r"https?://\S+", "x" * 23, text)
    return sum(2 if ord(ch) > 0xFFFF else 1 for ch in text)


# ------------------------------------------------------------------ COO
def b_roadmap() -> None:
    p = ROOT / "ROADMAP.md"
    if not need_file(p, "the public roadmap (item | status | owner | target)"):
        return
    rows = [r for r in p.read_text(encoding="utf-8").splitlines() if r.startswith("|") and not re.match(r"\|\s*-", r)]
    body = [[c.strip() for c in r.strip("|").split("|")] for r in rows[1:]]
    unshipped = [r for r in body if len(r) >= 4 and r[1].lower() in ("planned", "in-progress")]
    targets = []
    for r in body:
        m = re.search(r"(\d{4})-(\d{2})", r[3] if len(r) >= 4 else "")
        if m:
            targets.append(dt.date(int(m.group(1)), int(m.group(2)), 1))
    if len(unshipped) < 6:
        fail("items", f"ROADMAP.md has {len(unshipped)} planned or in-progress items; at least 6")
    if not targets or max(targets) < TODAY + dt.timedelta(days=60):
        fail("horizon", "ROADMAP.md's furthest target (YYYY-MM) must be at least 90 days out")
    if not all(len(r) >= 4 and r[2].lower() in ("cto", "coo", "cmo", "cxo", "cfo", "cio") for r in body):
        fail("owner", "every roadmap row names one owner office (cto, coo, cmo, cxo, cfo, cio)")


def b_changelog() -> None:
    p = ROOT / "CHANGELOG.md"
    if not need_file(p, "the dated, learner-facing changelog"):
        return
    text = p.read_text(encoding="utf-8")
    dates = sorted(dt.date.fromisoformat(d) for d in re.findall(r"(?m)^## (\d{4}-\d{2}-\d{2})", text))
    if not dates:
        fail("dated", "CHANGELOG.md has no `## YYYY-MM-DD` entry")
        return
    if (TODAY - dates[-1]).days > 31:
        fail("fresh", f"the newest changelog entry is {dates[-1]}, {(TODAY - dates[-1]).days} days old (at most 31)")
    if re.search(r"\b[0-9a-f]{12,40}\b", text):
        fail("curated", "CHANGELOG.md lists raw commit hashes: write what learners got, not the commits")
    if not re.search(r"\]\(/(ui|server|state|practice|courses|blog|skills|dashboard|plans)/", text):
        fail("links", "no changelog entry links a shipped page (/practice/..., /courses/..., /skills/...)")


def b_sprint() -> None:
    p = ROOT / ".benzene" / "board" / "sprint.json"
    if not need_file(p, "the sprint ledger the board keeps (written when the COO plans in sprints)"):
        return
    data = json.loads(p.read_text(encoding="utf-8"))
    cur = (data.get("current") or {}).get("key", "")
    rows = data.get("sprints", {}).get(cur, {})
    if not cur:
        fail("sprint", "no current sprint on the board")
    for office, r in rows.items():
        if r.get("capacity") is not None and r.get("steps", 0) > r["capacity"]:
            fail("capacity", f"{office} has {r['steps']} steps planned in {cur} against a capacity of {r['capacity']}")


def b_contributing() -> None:
    p = ROOT / "CONTRIBUTING.md"
    if not need_file(p, "how people contribute content and code"):
        return
    secs = sections(p.read_text(encoding="utf-8"))
    for want in ("content", "code", "not accepted"):
        if not any(want in s for s in secs):
            fail("section", f"CONTRIBUTING.md has no section about {want} changes")
    if not re.search(r"(?i)(check|ask|open an issue)[^.]{0,60}(before|first)", p.read_text(encoding="utf-8")):
        fail("check-first", "CONTRIBUTING.md does not ask contributors to check with the owner before large work")


def b_issue_forms() -> None:
    d = ROOT / ".github" / "ISSUE_TEMPLATE"
    forms = sorted(d.glob("*.yml")) if d.is_dir() else []
    forms = [f for f in forms if f.name != "config.yml"]
    labelled = [f for f in forms if (yaml.safe_load(f.read_text(encoding="utf-8")) or {}).get("labels")]
    if len(labelled) < 3:
        fail("forms", f"{len(labelled)} labelled issue forms under .github/ISSUE_TEMPLATE; at least 3 (bug, content-correction, skill-or-question-request)")
    cfg = d / "config.yml"
    if not cfg.exists() or (yaml.safe_load(cfg.read_text(encoding="utf-8")) or {}).get("blank_issues_enabled") is not False:
        fail("blank", ".github/ISSUE_TEMPLATE/config.yml must set blank_issues_enabled: false")


# ------------------------------------------------------------------ CMO
def b_profile() -> None:
    p = MK / "profile.md"
    if not need_file(p, "the identity every channel replica is drawn from"):
        return
    meta, _ = fm(p)
    for k in ("name", "handle", "bio", "link", "avatar", "header", "about", "theme"):
        if not meta.get(k):
            fail("field", f"{rel(p)}: no {k}")
    if meta.get("avatar") and not (ROOT / str(meta["avatar"])).exists():
        fail("avatar", f"{rel(p)}: avatar {meta['avatar']} is not a file in the workspace")
    if len(str(meta.get("bio", ""))) > 160:
        fail("bio", f"{rel(p)}: the bio is {len(str(meta['bio']))} characters (at most 160)")


def b_posts() -> None:
    posts = files(MK / "posts")
    if not posts:
        fail("missing", "no post under .benzene/material/marketing/posts/")
    for p in posts:
        meta, body = fm(p)
        for k in ("channel", "date", "claim", "source", "campaign", "showcase_url"):
            if not meta.get(k):
                fail("front-matter", f"{rel(p)}: no {k}")
        url = str(meta.get("showcase_url", ""))
        ch = str(meta.get("channel", "")).lower()
        if url and not (SITE in url and f"utm_source={ch}" in url and "utm_medium=social" in url and "utm_campaign=" in url):
            fail("utm", f"{rel(p)}: showcase_url must be on {SITE} with utm_source={ch}&utm_medium=social&utm_campaign=<campaign>")
        if url and url not in body and url not in str(meta.get("first_comment", "")):
            fail("link", f"{rel(p)}: the showcase_url is neither in the post nor in first_comment")


def b_articles() -> None:
    arts = files(MK / "articles")
    if not arts:
        fail("missing", "no article under .benzene/material/marketing/articles/")
    for p in arts:
        meta, body = fm(p)
        slug = p.stem
        for k in ("title", "date", "tags", "canonical_url", "ai_assistance", "related_practice", "description"):
            if meta.get(k) in (None, "", []):
                fail("front-matter", f"{rel(p)}: no {k}")
        tags = meta.get("tags") or []
        if not 1 <= len(tags) <= 4:
            fail("tags", f"{rel(p)}: {len(tags)} tags; 1 to 4 (dev.to allows 4)")
        if meta.get("canonical_url") and meta["canonical_url"] != f"https://{SITE}/blog/{slug}.html":
            fail("canonical", f"{rel(p)}: canonical_url must be https://{SITE}/blog/{slug}.html")
        if str(meta.get("ai_assistance", "")) not in ("none", "assisted"):
            fail("disclosure", f"{rel(p)}: ai_assistance is none or assisted")
        if str(meta.get("ai_assistance")) == "assisted" and not re.search(r"(?i)\b(AI|model|assistant)\b", " ".join(body.split("\n\n")[:2])):
            fail("disclosure", f"{rel(p)}: assisted, but the first two paragraphs do not say so")
        if "```" not in body:
            fail("code", f"{rel(p)}: no code example")
        if not re.search(r"<svg|<figure|!\[", body):
            fail("figure", f"{rel(p)}: no original figure (an inline <svg>, a <figure> or an image)")
        if words(body) < 700:
            fail("depth", f"{rel(p)}: {words(body)} words; at least 700")


def b_blog_cadence() -> None:
    dates = [d for d in (date_of(fm(p)[0]) for p in files(MK / "articles")) if d]
    this = week(TODAY)
    n = sum(1 for d in dates if week(d) == this)
    if n < 3:
        fail("cadence", f"{n} article(s) dated in {this}; at least 3 a week")


def b_syndication() -> None:
    for p in files(MK / "articles"):
        meta, _ = fm(p)
        synd = meta.get("syndication") or []
        chans = {str(s.get("channel")) for s in synd if isinstance(s, dict)}
        for want in ("devto", "hashnode", "medium"):
            if want not in chans:
                fail("channel", f"{rel(p)}: no {want} copy under syndication")
        for s in synd:
            if isinstance(s, dict) and s.get("canonical_url") != meta.get("canonical_url"):
                fail("canonical", f"{rel(p)}: the {s.get('channel')} copy does not carry the article's canonical_url")


def b_linkedin() -> None:
    posts = channel_posts("linkedin")
    if not posts:
        fail("missing", "no LinkedIn post (channel: linkedin)")
    for p, meta, body in posts:
        if len(body) > 3000:
            fail("length", f"{rel(p)}: {len(body)} characters (LinkedIn allows 3000)")
        tags = re.findall(r"(?<!\w)#\w+", body)
        if not 3 <= len(tags) <= 5:
            fail("hashtags", f"{rel(p)}: {len(tags)} hashtags; 3 to 5")
        slides = deck(meta)
        if slides is None and not meta.get("media") and not meta.get("diagram"):
            fail("media", f"{rel(p)}: no slides deck, diagram or media (every LinkedIn post carries a document, image or video)")
        for problem in diagram_problems(str(meta["diagram"])) if meta.get("diagram") else []:
            fail("diagram", f"{rel(p)}: {problem}")
        if slides is not None:
            if not 5 <= len(slides) <= 9:
                fail("deck", f"{rel(p)}: the deck {meta['slides']} has {len(slides)} slides; 5 to 9")
            if slides and SITE not in slides[-1]:
                fail("cta", f"{rel(p)}: the deck's last slide is not the call to action on {SITE}")
            if not meta.get("document_title"):
                fail("deck", f"{rel(p)}: a document post needs document_title")
    this = week(TODAY)
    weekly = [m for _, m, _ in posts if date_of(m) and week(date_of(m)) == this]
    if len(weekly) < 5 or sum(1 for m in weekly if m.get("slides")) < 2:
        fail("cadence", f"{len(weekly)} LinkedIn posts dated in {this} ({sum(1 for m in weekly if m.get('slides'))} decks); at least 5, 2 of them decks")


def b_diagrams() -> None:
    """Every folder diagram is true to the repository, and at least one LinkedIn post a week is one."""
    for p in files(MK / "diagrams"):
        for problem in diagram_problems(rel(p)):
            fail("diagram", problem)
    posts = [(p, m) for ch in ("linkedin", "instagram", "facebook", "x") for p, m, _ in channel_posts(ch) if m.get("diagram")]
    for p, m in posts:
        if not (ROOT / str(m["diagram"])).is_file():
            fail("missing", f"{rel(p)}: diagram {m['diagram']} does not exist")
    this = week(TODAY)
    weekly = [p for p, m, _ in channel_posts("linkedin") if m.get("diagram") and date_of(m) and week(date_of(m)) == this]
    if not weekly:
        fail("cadence", f"no LinkedIn post dated in {this} is a folder diagram (diagram: .benzene/material/marketing/diagrams/<name>.md)")


def b_x() -> None:
    posts = channel_posts("x")
    if not posts:
        fail("missing", "no X post (channel: x)")
    for p, meta, body in posts:
        parts = [s.strip() for s in re.split(r"(?m)^---\s*$", body) if s.strip()] or [body]
        for i, part in enumerate(parts, 1):
            if x_length(part) > 280:
                fail("length", f"{rel(p)}: part {i} is {x_length(part)} weighted characters (X allows 280)")
        if len(re.findall(r"https?://", body)) > 1:
            fail("links", f"{rel(p)}: more than one URL in the thread (a link post costs more on the X API)")


def b_instagram() -> None:
    posts = channel_posts("instagram")
    if not posts:
        fail("missing", "no Instagram post (channel: instagram)")
    for p, meta, body in posts:
        if len(body) > 2200:
            fail("caption", f"{rel(p)}: the caption is {len(body)} characters (2200)")
        if len(re.findall(r"(?<!\w)#\w+", body)) > 5:
            fail("hashtags", f"{rel(p)}: more than 5 hashtags")
        slides = deck(meta)
        if slides is None and not meta.get("media") and not meta.get("diagram"):
            fail("media", f"{rel(p)}: an Instagram post needs a carousel deck (slides:), a diagram or media")
        for problem in diagram_problems(str(meta["diagram"])) if meta.get("diagram") else []:
            fail("diagram", f"{rel(p)}: {problem}")
        if slides is not None and not 2 <= len(slides) <= 10:
            fail("carousel", f"{rel(p)}: {len(slides)} slides; Instagram carousels take 2 to 10")


def b_facebook() -> None:
    ig = {str(m.get("campaign")) for _, m, _ in channel_posts("instagram")}
    fb = {str(m.get("campaign")) for _, m, _ in channel_posts("facebook")}
    if not fb:
        fail("missing", "no Facebook post (channel: facebook)")
    for c in sorted(ig - fb):
        fail("twin", f"the Instagram campaign {c!r} has no Facebook twin")


SHOT = re.compile(r"^\s*\|\s*(\d+(?:\.\d+)?)\s*(?:–|—|-|to)\s*(\d+(?:\.\d+)?)\s*s\s*\|(.*)$")   # the replica's shot row


def b_youtube() -> None:
    shorts = []
    for p in files(MK / "video"):
        meta, body = fm(p)
        if str(meta.get("channel", "")).lower() == "youtube":
            shorts.append((p, meta, body))
    if not shorts:
        fail("missing", "no YouTube storyboard (channel: youtube) under .benzene/material/marketing/video/")
    linkedin = {str(m.get("campaign")) for _, m, _ in channel_posts("linkedin")}
    for p, meta, body in shorts:
        for k in ("date", "format", "aspect", "duration_s", "title", "tags", "claim", "source", "campaign", "showcase_url"):
            if meta.get(k) in (None, "", []):
                fail("front-matter", f"{rel(p)}: no {k}")
        if meta.get("format") and str(meta["format"]) != "short":
            fail("format", f"{rel(p)}: format is {meta['format']!r}; this bar holds Shorts (format: short)")
        if meta.get("aspect") and str(meta["aspect"]) not in ("9:16", "1:1"):
            fail("aspect", f"{rel(p)}: aspect {meta['aspect']!r}; a Short is vertical (9:16) or square (1:1)")
        try:
            duration = float(meta.get("duration_s") or 0)
        except (TypeError, ValueError):
            duration = 0.0
        if not 0 < duration <= 180:
            fail("duration", f"{rel(p)}: duration_s {meta.get('duration_s')!r}; a Short runs up to 180 s")
        title = str(meta.get("title") or "")
        if len(title) > 100 or re.search(r"[<>]", title):
            fail("title", f"{rel(p)}: the title is {len(title)} characters (100) or carries < or >")
        tags = meta.get("tags") or []
        if not isinstance(tags, list) or len(",".join(str(t) for t in tags)) > 500:
            fail("tags", f"{rel(p)}: tags must be a list of at most 500 characters in all")
        desc = re.split(r"(?m)^##\s", re.sub(r"(?m)\A\s*#\s+.*\n", "", body, count=1), maxsplit=1)[0].strip()
        if not desc:
            fail("description", f"{rel(p)}: no description between the title and the first ## section")
        if len(desc.encode("utf-8")) > 5000 or re.search(r"[<>]", desc):
            fail("description", f"{rel(p)}: the description is {len(desc.encode('utf-8'))} bytes (5000) or carries < or >")
        if len(re.findall(r"(?<!\w)#\w+", desc)) > 3:
            fail("hashtags", f"{rel(p)}: more than 3 hashtags in the description")
        url, campaign = str(meta.get("showcase_url", "")), str(meta.get("campaign", ""))
        if url and not (SITE in url and "utm_source=youtube" in url and "utm_medium=video" in url and f"utm_campaign={campaign}" in url):
            fail("utm", f"{rel(p)}: showcase_url must be on {SITE} with utm_source=youtube&utm_medium=video&utm_campaign={campaign}")
        if url and url not in "\n".join(desc.splitlines()[:2]):
            fail("link", f"{rel(p)}: the showcase_url is not in the first two lines of the description")
        if campaign and campaign not in linkedin:
            fail("twin", f"{rel(p)}: no LinkedIn post carries the campaign {campaign!r}")
        shots = []
        for line in body.splitlines():
            m = SHOT.match(line)
            if m:
                cells = [c.strip() for c in m.group(3).strip().strip("|").split("|")]
                shots.append((float(m.group(1)), float(m.group(2)), cells[1] if len(cells) > 1 else ""))
        if len(shots) < 4:
            fail("shots", f"{rel(p)}: {len(shots)} timed shots; at least 4")
        at = 0.0
        for start, end, caption in shots:
            if abs(start - at) > 1e-6 or end <= start:
                fail("shots", f"{rel(p)}: the shot {start:g}–{end:g} s does not follow on from {at:g} s")
            if not caption or len(caption) > 60:
                fail("caption", f"{rel(p)}: the shot at {start:g} s has {'no caption' if not caption else f'a {len(caption)}-character caption (60)'}")
            at = end
        if shots and duration and abs(at - duration) > 1e-6:
            fail("shots", f"{rel(p)}: the shots end at {at:g} s, duration_s is {duration:g}")
        if meta.get("thumbnail"):
            thumb = ROOT / str(meta["thumbnail"])
            if not thumb.is_file() or thumb.suffix.lower() not in (".png", ".jpg", ".jpeg"):
                fail("thumbnail", f"{rel(p)}: thumbnail {meta['thumbnail']} is not a PNG or JPG in the workspace")
            else:
                from PIL import Image

                with Image.open(thumb) as im:
                    w, h = im.size
                if w < 640 or not any(abs(w / h - r) < 0.01 for r in (9 / 16, 1.0)):
                    fail("thumbnail", f"{rel(p)}: thumbnail is {w}×{h}; at least 640 px wide, 9:16 or 1:1")
    this, ahead = week(TODAY), week(TODAY + dt.timedelta(days=7))
    if shorts and not any(date_of(m) and week(date_of(m)) in (this, ahead) for _, m, _ in shorts):
        fail("cadence", f"no Short dated in {this} or {ahead}; at least one a week")


def b_newsletter() -> None:
    issues = files(MK / "newsletter")
    if not issues:
        fail("missing", "no newsletter issue under .benzene/material/marketing/newsletter/")
    weeks = {}
    for p in issues:
        meta, body = fm(p)
        for k in ("subject", "preheader", "to", "date", "claim", "source"):
            if not meta.get(k):
                fail("front-matter", f"{rel(p)}: no {k}")
        if re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", str(meta.get("to", "")) + body):
            fail("privacy", f"{rel(p)}: an email address in the issue: the audience is a count, never a list of people")
        secs = sections(body)
        for want in ("lead", "bottom line", "links", "practice question"):
            if not any(want in s for s in secs):
                fail("section", f"{rel(p)}: no '## {want.title()}' section")
        links = re.findall(r"https?://\S+", secs.get("links", ""))
        if not 3 <= len(links) <= 5:
            fail("links", f"{rel(p)}: {len(links)} links in Links; 3 to 5")
        d = date_of(meta)
        if d:
            weeks.setdefault(week(d), []).append(p.name)
    if week(TODAY) not in weeks:
        fail("weekly", f"no newsletter issue dated in {week(TODAY)}: one every week")
    for w, names in weeks.items():
        if len(names) > 1:
            fail("weekly", f"{len(names)} issues in {w}; exactly one")


def b_boosts() -> None:
    total = 0.0
    for p in files(MK / "ads"):
        meta, _ = fm(p)
        for k in ("platform", "boost", "engagement_72h", "median_engagement_30d", "daily_budget_usd", "days", "objective", "kpi", "evidence"):
            if meta.get(k) in (None, ""):
                fail("front-matter", f"{rel(p)}: no {k}")
        try:
            eng, med = float(meta.get("engagement_72h", 0)), float(meta.get("median_engagement_30d", 0))
            daily, days = float(meta.get("daily_budget_usd", 0)), float(meta.get("days", 0))
        except (TypeError, ValueError):
            fail("numbers", f"{rel(p)}: engagement, budget and days are numbers")
            continue
        if med and eng < 2 * med:
            fail("rule", f"{rel(p)}: engagement {eng:g} is under twice the 30-day median {med:g}: only an outperforming post is boosted")
        if str(meta.get("platform")).lower() == "linkedin" and (daily < 25 or daily * days < 100):
            fail("linkedin", f"{rel(p)}: LinkedIn boosts need at least $25 a day and $100 a campaign")
        if not (ROOT / str(meta.get("boost", ""))).exists():
            fail("post", f"{rel(p)}: boost names no post file in the workspace")
        total += daily * days
    if total > 500:
        fail("ceiling", f"the proposed boosts total ${total:.0f}; at most $500 over the first twelve weeks")


# ------------------------------------------------------------------ CXO
def b_analytics() -> None:
    folder = EXP / "analytics"
    snaps = sorted(folder.glob("*.json")) if folder.is_dir() else []
    fresh = snaps and (TODAY - dt.date.fromtimestamp(snaps[-1].stat().st_mtime)).days <= 7
    if not fresh and os.environ.get("UPLOAD_POST_API_KEY"):   # the instrument: the weekly snapshot is taken when it is due
        subprocess.run([sys.executable, str(ROOT / ".benzene" / "scripts" / "analytics.py")], cwd=ROOT, capture_output=True, timeout=300)
        snaps = sorted(folder.glob("*.json")) if folder.is_dir() else []
    if not snaps:
        fail("snapshot", "no analytics snapshot under .benzene/material/experience/analytics/ (python3 .benzene/scripts/analytics.py)")
        return
    data = json.loads(snaps[-1].read_text(encoding="utf-8"))
    if (TODAY - dt.date.fromtimestamp(snaps[-1].stat().st_mtime)).days > 8:
        fail("fresh", f"the newest snapshot {snaps[-1].name} is older than 8 days")
    for k in ("upload_post", "connectsafely", "combined_audience"):
        if k not in data:
            fail("shape", f"{snaps[-1].name} has no {k}")


def b_analytics_report() -> None:
    p = EXP / "analytics-report.md"
    if not need_file(p, "the CXO's weekly reading of the analytics snapshot"):
        return
    meta, body = fm(p)
    snaps = sorted((EXP / "analytics").glob("*.json")) if (EXP / "analytics").is_dir() else []
    if snaps and str(meta.get("week")) != snaps[-1].stem:
        fail("week", f"{rel(p)} reads week {meta.get('week')}, the newest snapshot is {snaps[-1].stem}")
    secs = sections(body)
    for want in ("audience", "channels", "what changed", "suggestion"):
        if not any(want in s for s in secs):
            fail("section", f"{rel(p)}: no '## {want.title()}' section")


def b_feedback_log() -> None:
    p = EXP / "feedback-log.md"
    if not need_file(p, "every piece of feedback, its source and its response"):
        return
    secs = sections(fm(p)[1])
    for want in ("sources", "responses"):
        if want not in secs:
            fail("section", f"{rel(p)}: no '## {want.title()}'")
    rows = [r for r in secs.get("responses", "").splitlines() if r.startswith("|") and not re.match(r"\|\s*-", r)][1:]
    for r in rows:
        cells = [c.strip() for c in r.strip("|").split("|")]
        if len(cells) < 4 or not all(cells[:4]):
            fail("entry", f"{rel(p)}: a response row lacks date, source, feedback or response: {r[:80]}")


def b_beta() -> None:
    changes = ROOT / ".benzene" / "changes.json"
    if not changes.exists():
        return
    for c in json.loads(changes.read_text(encoding="utf-8")).get("changes", []):
        if c.get("stage") not in ("beta", "review"):
            continue
        p = EXP / "beta" / f"{c['id']}.md"
        if not p.exists():
            fail("report", f"the CTO change {c['id']} ({c.get('title', '')[:60]}) is in {c['stage']} with no beta report {rel(p)}")
            continue
        meta, _ = fm(p)
        for k in ("persona", "tasks", "passed", "failed", "severity"):
            if meta.get(k) in (None, ""):
                fail("field", f"{rel(p)}: no {k}")


# ------------------------------------------------------------------ CFO
def pricing_meta() -> dict:
    p = FIN / "pricing.md"
    if not need_file(p, "the pricing the site renders (tiers, discounts, refund)"):
        return {}
    return fm(p)[0]


def b_pricing() -> None:
    meta = pricing_meta()
    if not meta:
        return
    tiers = {str(t.get("id")): t for t in meta.get("tiers", []) if isinstance(t, dict)}
    if {k for k in tiers if k != "team"} != {"free", "monthly", "annual", "lifetime"}:
        fail("tiers", f"tiers are {sorted(tiers)}; exactly free, monthly, annual, lifetime (team optional)")
        return
    for k, t in tiers.items():
        for f in ("price_usd", "billing", "licence"):
            if t.get(f) in (None, ""):
                fail("tier", f"tier {k}: no {f}")
    price = {k: float(t.get("price_usd") or 0) for k, t in tiers.items()}
    if price["free"] != 0:
        fail("band", "the free tier costs 0")
    if price["monthly"] > 15 or price["annual"] > 120 or price["lifetime"] > 1.5 * price["annual"] or price["annual"] > 10 * price["monthly"]:
        fail("band", f"prices {price}: monthly <= 15, annual <= 120 and <= 10 x monthly, lifetime <= 1.5 x annual")
    disc = meta.get("discounts", {}) or {}
    bj = disc.get("between_jobs", {}) or {}
    if float(bj.get("percent", 0)) < 40 or "annual" not in (bj.get("applies_to") or []):
        fail("between-jobs", "discounts.between_jobs: at least 40 percent, applying to annual")
    if int(meta.get("refund_days", 0)) < 30:
        fail("refund", "refund_days: 30 on the first purchase")
    worst = 1 - float(bj.get("percent", 0)) / 100
    for k in ("monthly", "annual", "lifetime"):
        p_ = price[k] * (worst if k in (bj.get("applies_to") or []) else 1)
        if 0 < p_ and (p_ < 10 or (0.0499 * p_ + 0.49) / p_ > 0.10):
            fail("fee-floor", f"{k} at ${p_:.2f} after the between-jobs discount is under the $10 fee floor")
    for k, t in tiers.items():
        if k != "free" and len(t.get("gates") or []) < 3:
            fail("gates", f"tier {k}: list at least 3 gates (what the price unlocks)")
    if len((tiers.get("free") or {}).get("includes") or []) < 3:
        fail("free", "the free tier lists at least 3 includes")


def b_pricing_sync() -> None:
    meta = pricing_meta()
    site = ROOT / "docs" / "_data" / "pricing.yml"
    if not meta or not need_file(site, "the site's pricing data, rendered from the CFO's pricing"):
        return
    data = yaml.safe_load(site.read_text(encoding="utf-8")) or {}
    rows = data.get("tiers", data) if isinstance(data, dict) else data
    site_prices = {str(t.get("id")): float(t.get("price_usd") or 0) for t in (rows or []) if isinstance(t, dict)}
    for t in meta.get("tiers", []):
        tid = str(t.get("id"))
        if tid not in site_prices:
            fail("tier", f"docs/_data/pricing.yml has no tier {tid}")
        elif abs(site_prices[tid] - float(t.get("price_usd") or 0)) > 0.001:
            fail("price", f"docs/_data/pricing.yml shows {tid} at {site_prices[tid]}, the CFO's pricing says {t.get('price_usd')}")


def b_checkout() -> None:
    cfg = yaml.safe_load((ROOT / "docs" / "_config.yml").read_text(encoding="utf-8")) or {}
    pp = cfg.get("paypal") or {}
    if pp.get("env") != "sandbox" or not pp.get("client_id"):
        fail("config", "docs/_config.yml: paypal.env sandbox and paypal.client_id")
    pages = list((ROOT / "docs").glob("pricing/*")) + list((ROOT / "docs").glob("checkout/*")) + list((ROOT / "docs" / "assets" / "js").glob("*pricing*"))
    text = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in pages if p.is_file())
    if "paypal.com/sdk/js" not in text and "sandbox.paypal.com/web-sdk" not in text:
        fail("sdk", "the pricing or checkout page does not load the PayPal SDK")
    if list((ROOT / "docs").rglob("*paypal*sdk*.js")):
        fail("vendored", "the PayPal SDK is vendored under docs/: load it from PayPal")
    if re.search(r"api-m\.paypal\.com|www\.paypal\.com/web-sdk", text) and not (FIN / "go-live.md").exists():
        fail("live", "a live PayPal host is referenced before finance/go-live.md records the sandbox evidence")


def b_finance_docs() -> None:
    need = {"business-model.md": ("who pays", "for what", "billing unit", "costs"),
            "projection.md": ("assumptions", "twelve months", "break-even")}
    for name, secs_ in need.items():
        p = FIN / name
        if not need_file(p, "the CFO's model"):
            continue
        meta, body = fm(p)
        secs = sections(body)
        for s in secs_:
            if not any(s in k for k in secs):
                fail("section", f"{rel(p)}: no '## {s.title()}'")
        for line in body.splitlines():
            if re.search(r"\$\s?\d", line) and not re.search(r"(?i)simulated|target|assumption|source|http", line):
                fail("label", f"{rel(p)}: a money figure without SIMULATED, target or a source: {line.strip()[:80]}")
                break


# ------------------------------------------------------------------ CIO
PITCH = ("problem", "for whom", "why now", "traction", "ask", "use of funds", "risks", "competition")


def pitch() -> tuple[dict, dict[str, str]]:
    p = INV / "pitch.md"
    if not need_file(p, "the pitch"):
        return {}, {}
    meta, body = fm(p)
    return meta, sections(body)


def b_pitch() -> None:
    meta, secs = pitch()
    if not secs:
        return
    for s in PITCH:
        if s not in secs:
            fail("section", f"investors/pitch.md: no '## {s.title()}'")
        elif s != "competition" and words(secs[s]) < 40:
            fail("depth", f"investors/pitch.md '## {s.title()}': {words(secs[s])} words; at least 40")
    first = re.split(r"(?<=[.!?])\s", secs.get("problem", "").strip(), maxsplit=1)[0]
    if first and words(first) > 25:
        fail("problem", f"the first sentence of Problem is {words(first)} words; at most 25")
    if not re.search(r"(?i)front-?end", secs.get("for whom", "")):
        fail("audience", "For whom names the frontend developer it is for")
    urls = [l for l in secs.get("why now", "").splitlines() if re.search(r"https?://", l) and re.search(r"20(2[5-9])", l)]
    if len(urls) < 3:
        fail("why-now", f"{len(urls)} dated (2025+) outside signals with URLs in Why now; at least 3")
    rows = [l for l in secs.get("competition", "").splitlines() if l.startswith("|") and "$" in l and re.search(r"https?://", l)]
    if len(rows) < 6:
        fail("competition", f"{len(rows)} competitor rows with a price and a URL; at least 6")


def b_traction() -> None:
    _, secs = pitch()
    for line in secs.get("traction", "").splitlines():
        if re.search(r"\d", line) and not (re.search(r"https?://|\.benzene/|\./", line) and re.search(r"\d{4}-\d{2}-\d{2}", line)):
            fail("cited", f"a traction number without a record (URL or path) and a date: {line.strip()[:90]}")
    p = INV / "traction.json"
    if not need_file(p, "traction as {value, source, date} per metric"):
        return
    data = json.loads(p.read_text(encoding="utf-8"))
    for k in ("github_stars", "npm_downloads_last_month", "newsletter_subscribers"):
        if not isinstance(data.get(k), dict) or not {"value", "source", "date"} <= set(data[k]):
            fail("shape", f"traction.json: {k} as {{value, source, date}}")
    live = {}
    try:
        with urllib.request.urlopen("https://api.github.com/repos/grvpanchal/elegant", timeout=20) as r:  # noqa: S310
            live["github_stars"] = json.loads(r.read())["stargazers_count"]
        with urllib.request.urlopen("https://api.npmjs.org/downloads/point/last-month/elegant", timeout=20) as r:  # noqa: S310
            live["npm_downloads_last_month"] = json.loads(r.read())["downloads"]
    except Exception:  # noqa: BLE001 - offline: the shape is still checked
        live = {}
    for k, v in live.items():
        got = (data.get(k) or {}).get("value")
        if isinstance(got, (int, float)) and v and abs(got - v) > max(2, 0.05 * v):
            fail("live", f"traction.json {k} = {got}, the live API says {v}")


def b_courses() -> None:
    p = ROOT / "docs" / "_data" / "courses.yml"
    if not need_file(p, "the free courses"):
        return
    data = yaml.safe_load(p.read_text(encoding="utf-8")) or {}
    courses = data.get("courses", data) if isinstance(data, dict) else data
    lessons = 0
    for c in courses or []:
        ls = [l for m in (c.get("modules") or []) for l in (m.get("lessons") or [])] or (c.get("lessons") or [])
        lessons += len(ls)
        if len(ls) < 5:
            fail("lessons", f"course {c.get('slug') or c.get('title')}: {len(ls)} lessons; at least 5")
    if len(courses or []) < 4:
        fail("courses", f"{len(courses or [])} courses; at least 4 (UI, State, Server, Agent Skills)")
    if lessons < 20:
        fail("free", f"{lessons} free lessons; at least 20")


def b_seo() -> None:
    from html.parser import HTMLParser

    out = Path(os.environ.get("SITE_OUT", "")) if os.environ.get("SITE_OUT") else None
    if out is None:
        import hashlib, tempfile
        out = Path(tempfile.gettempdir()) / f"elegant-site-{hashlib.sha1(str(ROOT.resolve()).encode()).hexdigest()[:10]}"
    if not (out / "index.html").exists():
        subprocess.run([sys.executable, str(ROOT / ".benzene" / "checks" / "site.py"), "build"], cwd=ROOT, capture_output=True, timeout=600)

    class Meta(HTMLParser):
        def __init__(self):
            super().__init__()
            self.m = {}

        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            if tag == "meta":
                key = a.get("name") or a.get("property")
                if key:
                    self.m[key] = a.get("content") or ""
            if tag == "link" and a.get("rel") == "canonical":
                self.m["canonical"] = a.get("href") or ""

    for page in sorted(out.rglob("*.html")):
        r = page.relative_to(out).as_posix()
        if r.startswith(("demos/", "skills/", "blog/drafts/", "assets/")):
            continue
        p = Meta()
        p.feed(page.read_text(encoding="utf-8", errors="replace"))
        if "http-equiv" in page.read_text(encoding="utf-8", errors="replace")[:2000].lower():
            continue
        for k in ("description", "og:image", "twitter:card", "canonical"):
            if not p.m.get(k):
                fail(k.replace(":", "-"), f"{r}: no {k}")
        if p.m.get("og:image") and not p.m["og:image"].startswith("https://"):
            fail("og-image", f"{r}: og:image must be an absolute https URL")


BARS = {name[2:].replace("_", "-"): fn for name, fn in globals().items() if name.startswith("b_") and callable(fn)}


def main() -> int:
    global NAME
    ap = argparse.ArgumentParser()
    ap.add_argument("bar", choices=sorted(BARS))
    ap.add_argument("--limit", type=int, default=12)
    args = ap.parse_args()
    NAME = args.bar
    BARS[args.bar]()
    if not OUT:
        print(f"ok material.{args.bar}")
        return 0
    rules: dict[str, int] = {}
    for line in OUT:
        rule = line.split("[", 1)[1].split("]", 1)[0]
        rules[rule] = rules.get(rule, 0) + 1
    print(f"material.{args.bar}: " + ", ".join(f"{n} {r}" for r, n in sorted(rules.items(), key=lambda kv: -kv[1])))
    for line in OUT[: args.limit]:
        print(line)
    if len(OUT) > args.limit:
        print(f"... {len(OUT) - args.limit} more: the next run lists the rest")
    return 1


if __name__ == "__main__":
    sys.exit(main())
