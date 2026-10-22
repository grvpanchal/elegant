#!/usr/bin/env python3
"""The training site's own checks, run by the CTO's cells and by the standard's bars (stdlib only).

    python3 .benzene/checks/site.py build [--out DIR]     # the Jekyll build must succeed
    python3 .benzene/checks/site.py health [--changed F]  # links resolve, images have alt, one h1 per page
    python3 .benzene/checks/site.py secrets               # no secret from the daemon's environment in any tracked file

Each prints one line per finding (``FAIL <check> [<rule>] <what>``) and exits 1 when there is any, so the cell that
wrote the change reads exactly what to fix. Run from the repository root (a worktree's root works the same).
"""

from __future__ import annotations

import argparse
import hashlib
import os
import re
import shutil
import subprocess
import sys
import tempfile
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path.cwd()
DOCS = ROOT / "docs"


def default_out() -> Path:
    tag = hashlib.sha1(str(ROOT.resolve()).encode()).hexdigest()[:10]
    return Path(tempfile.gettempdir()) / f"elegant-site-{tag}"


def jekyll() -> list[str]:
    if os.environ.get("JEKYLL_CMD"):
        return os.environ["JEKYLL_CMD"].split()
    wrapper = Path.home() / ".local" / "bin" / "jekyll-env"
    return ([str(wrapper)] if wrapper.exists() else []) + ["bundle", "exec", "jekyll"]


def build(out: Path, baseurl: str = "") -> int:
    if out.exists():
        shutil.rmtree(out, ignore_errors=True)
    extra = ["-b", baseurl] if baseurl else []   # a beta preview is served under /beta/<change>/
    proc = subprocess.run([*jekyll(), "build", "-q", "-d", str(out), *extra], cwd=DOCS, capture_output=True, text=True, timeout=600)
    errors = [l for l in (proc.stdout + proc.stderr).splitlines() if re.search(r"(?i)error|liquid exception|exception", l)
              and "deprecat" not in l.lower()]
    if proc.returncode != 0 or not (out / "index.html").exists():
        for line in (errors or (proc.stdout + proc.stderr).strip().splitlines()[-15:]):
            print(f"FAIL site.build [jekyll] {line.strip()[:300]}")
        return 1
    for line in errors:
        print(f"FAIL site.build [liquid] {line.strip()[:300]}")
    if errors:
        return 1
    if (ROOT / "skills").is_dir():   # as the deploy does (demos.sh): the Agent Skills are served beside the pages
        shutil.copytree(ROOT / "skills", out / "skills", dirs_exist_ok=True)
    print(f"ok site.build: {sum(1 for _ in out.rglob('*.html'))} pages in {out}")
    return 0


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.images: list[tuple[str, str | None, str | None]] = []
        self.h1 = 0
        self.redirect = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = dict(attrs)
        if tag == "a" and a.get("href"):
            self.links.append(a["href"] or "")
        elif tag == "img":
            self.images.append((a.get("src") or "", a.get("alt"), a.get("role")))
        elif tag == "h1":
            self.h1 += 1
        elif tag == "meta" and (a.get("http-equiv") or "").lower() == "refresh":
            self.redirect = True


def resolve(site: Path, page: Path, href: str) -> bool:
    href = href.split("#", 1)[0].split("?", 1)[0]
    if not href:
        return True
    target = (site / href.lstrip("/")) if href.startswith("/") else (page.parent / href)
    target = Path(os.path.normpath(target))
    candidates = [target, target / "index.html", target.with_suffix(".html") if not target.suffix else target]
    return any(c.is_file() for c in candidates) or (target.is_dir() and (target / "index.html").is_file())


def health(out: Path, changed: list[str], limit: int = 12) -> int:
    """Every finding counted per rule, the first ``limit`` printed: one task closes a handful, not two hundred."""
    if (changed or not (out / "index.html").exists()) and build(out):   # a scoped check judges the session's edits: build them first
        return 1
    # --changed scopes the check to the session's own work: the pages whose source it wrote, and, for a shared file
    # (an include, a layout, data, styles, assets), every page, counting only what that file produces (its src or href)
    shared_dirs = ("docs/_includes/", "docs/_layouts/", "docs/_data/", "docs/_sass/", "docs/_plugins/", "docs/assets/")
    shared = [c for c in changed if c.startswith(shared_dirs)]
    only = {Path(c).stem for c in changed if c.startswith("docs/") and not c.startswith(shared_dirs)} if changed else None
    shared_text = "\n".join((ROOT / c).read_text(encoding="utf-8", errors="replace") for c in shared if (ROOT / c).is_file())
    lines: list[str] = []
    for page in sorted(out.rglob("*.html")):
        rel = page.relative_to(out).as_posix()
        if rel.startswith(("demos/", "assets/", "storybooks/", "blog/drafts/", "skills/")) or "/storybook" in rel:
            continue
        in_scope = only is None or page.stem in only or page.parent.name in only
        if not in_scope and not shared:
            continue
        p = Page()
        try:
            p.feed(page.read_text(encoding="utf-8", errors="replace"))
        except Exception as exc:  # noqa: BLE001 - a page that does not parse is a finding
            lines.append(f"FAIL site.health [parse] {rel}: {exc}")
            continue
        if p.redirect:
            continue
        found: list[tuple[str, str]] = []   # (finding, the src or href it is about; empty for one-h1)
        for href in p.links:
            if re.match(r"(?i)^(https?:|mailto:|tel:|javascript:|data:|#|//)", href) or "{{" in href or href.startswith("/demos/"):
                continue
            if not resolve(out, page, href):
                found.append((f"FAIL site.health [broken-link] {rel} -> {href}", href))
        for src, alt, role in p.images:
            if alt is None and role != "presentation":
                found.append((f"FAIL site.health [img-alt] {rel}: <img src=\"{src[:80]}\"> has no alt", src))
        if p.h1 != 1 and not rel.endswith("404.html"):
            found.append((f"FAIL site.health [one-h1] {rel}: {p.h1} <h1> elements, expected 1", ""))
        if not in_scope:   # a shared file changed: this page counts for what that file produces
            found = [(line, key) for line, key in found if key and (key in shared_text or key.lstrip("/") in shared_text)]
        lines += [line for line, _ in found]
    if not lines:
        print("ok site.health: links resolve, images carry alt, every page has one h1")
        return 0
    rules: dict[str, int] = {}
    for line in lines:
        rule = line.split("[", 1)[1].split("]", 1)[0]
        rules[rule] = rules.get(rule, 0) + 1
    print("site.health: " + ", ".join(f"{n} {r}" for r, n in sorted(rules.items(), key=lambda kv: -kv[1])) + f" ({len(lines)} findings)")
    for line in lines[:limit]:
        print(line)
    if len(lines) > limit:
        print(f"... {len(lines) - limit} more: fix these first, the next run lists the rest")
    return 1


SECRET_ENVS = ("PAYPAL_SECRET", "SUPABASE_SECRET", "OPENROUTER_API_KEY", "LINEAR_API_KEY", "UPLOAD_POST_API_KEY",
               "CONNECTSAFELY_API_KEY", "BENZENE_RELAY_SECRET", "BENZENE_RELAY_OWNER", "BENZENE_RELAY_VIEW")
SECRET_PATTERNS = (r"sb_secret_[A-Za-z0-9_-]{8,}", r"service_role", r"sk-or-v1-[0-9a-f]{20,}", r"lin_api_[A-Za-z0-9]{20,}")


def secrets() -> int:
    files = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=ROOT, capture_output=True, text=True).stdout.splitlines()
    values = [(name, os.environ[name]) for name in SECRET_ENVS if len(os.environ.get(name, "")) >= 12]
    findings = 0
    for rel in files:
        path = ROOT / rel
        if not path.is_file() or path.stat().st_size > 2_000_000 or rel == ".env" or rel.startswith(".env"):
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for name, value in values:
            if value in text:
                print(f"FAIL site.secrets [{name}] {rel} contains the value of {name}: move it to .env")
                findings += 1
        if rel.startswith(("docs/", "templates/")):
            for pattern in SECRET_PATTERNS:
                if re.search(pattern, text):
                    print(f"FAIL site.secrets [pattern] {rel} matches {pattern}: a secret never ships in client code")
                    findings += 1
    if not findings:
        print(f"ok site.secrets: {len(files)} files, {len(values)} secret values checked")
    return 1 if findings else 0


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("check", choices=["build", "health", "secrets"])
    ap.add_argument("--out", default="")
    ap.add_argument("--changed", nargs="*", default=[])
    ap.add_argument("--limit", type=int, default=12)
    ap.add_argument("--baseurl", default="")
    args = ap.parse_args()
    out = Path(args.out).resolve() if args.out else default_out()
    if args.check == "build":
        return build(out, args.baseurl)
    if args.check == "health":
        return health(out, [c for c in args.changed if c], args.limit)
    return secrets()


if __name__ == "__main__":
    sys.exit(main())
