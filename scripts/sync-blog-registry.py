#!/usr/bin/env python3
"""Sync docs/_data/blog.yml from the blog post pages on disk.

The blog index (docs/blog/index.md) and the per-post "keep reading" / practice
CTA includes read docs/_data/blog.yml, not the pages directly, so filtering and
cross-linking are instant and cannot drift from a renamed post. This script is
the single writer of that file; harness/check_harness.py (blog.registry) fails
if the file and the pages disagree, so never hand-edit it.

Drafts under docs/blog/drafts/ are deliberately not published and not listed —
only top-level docs/blog/*.md posts count.

Regenerate with: python3 scripts/sync-blog-registry.py
"""

import os
import re
import sys

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "docs", "blog")
REGISTRY = os.path.join(ROOT, "docs", "_data", "blog.yml")

# Front-matter keys copied into the registry, in this order.
FIELDS = ("slug", "title", "date", "author", "category", "tags",
          "description", "cover", "reading_minutes", "related_practice")

HEADER = """# Auto-generated from the front matter of docs/blog/*.md.
# Regenerate with: python3 scripts/sync-blog-registry.py
# Do not hand-edit: harness/check_harness.py (blog.registry) fails on drift.
"""

FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---", re.S)


def front_matter(path):
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    m = FM_RE.match(text)
    if not m:
        return None, "no YAML front matter"
    try:
        meta = yaml.safe_load(m.group(1))
    except yaml.YAMLError as exc:
        return None, f"front matter does not parse: {exc}"
    if not isinstance(meta, dict):
        return None, "front matter is not a mapping"
    return meta, None


def collect():
    entries, skipped = [], []
    if not os.path.isdir(BLOG_DIR):
        return entries, [("docs/blog", "directory does not exist")]
    for name in sorted(os.listdir(BLOG_DIR)):
        if not name.endswith(".md") or name == "index.md":
            continue
        path = os.path.join(BLOG_DIR, name)
        if not os.path.isfile(path):  # skip the drafts/ subdirectory
            continue
        meta, err = front_matter(path)
        if err:
            skipped.append((name, err))
            continue
        stem = name[:-3]
        if meta.get("slug") and meta["slug"] != stem:
            skipped.append((name, f"slug '{meta['slug']}' does not match the filename"))
            continue
        entry = {"slug": stem}
        for field in FIELDS:
            if field == "slug":
                continue
            if meta.get(field) not in (None, "", []):
                entry[field] = meta[field]
        entries.append(entry)
    return entries, skipped


def main():
    entries, skipped = collect()
    os.makedirs(os.path.dirname(REGISTRY), exist_ok=True)
    body = yaml.safe_dump(entries, sort_keys=False, allow_unicode=True, default_flow_style=False)
    with open(REGISTRY, "w", encoding="utf-8") as fh:
        fh.write(HEADER + (body if entries else "[]\n"))
    print(f"wrote {os.path.relpath(REGISTRY, ROOT)} with {len(entries)} post(s)")
    for name, why in skipped:
        print(f"  skipped {name}: {why}", file=sys.stderr)
    return 1 if skipped else 0


if __name__ == "__main__":
    sys.exit(main())
