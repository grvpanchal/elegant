#!/usr/bin/env python3
"""Sync docs/_data/questions.yml from the question pages on disk.

Every practice question is one markdown file under docs/practice/ whose front
matter carries the contract in harness/capabilities.yml (format, difficulty,
layer, topics, skill, minutes). This script flattens that front matter into a
registry the site reads at build time:

  * docs/practice/index.md renders the filterable bank from it
  * docs/assets/js/practice-index.js filters and searches it client-side
  * docs/_data/plans.yml items resolve against it
  * harness/check_harness.py fails when it drifts from disk

Generated, never hand-edited. Run after adding or editing a question:

    python3 scripts/sync-questions-registry.py
"""

import os
import re
import sys

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRACTICE_DIR = os.path.join(ROOT, "docs", "practice")
REGISTRY = os.path.join(ROOT, "docs", "_data", "questions.yml")

# Front-matter keys copied into the registry, in this order.
FIELDS = ("slug", "title", "format", "difficulty", "layer", "topics",
          "skill", "minutes", "frameworks", "summary")

HEADER = """# Auto-generated from the front matter of docs/practice/*.md.
# Regenerate with: python3 scripts/sync-questions-registry.py
# Do not hand-edit: harness/check_harness.py (bank.registry) fails on drift.
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
    if not os.path.isdir(PRACTICE_DIR):
        return entries, [("docs/practice", "directory does not exist")]
    for name in sorted(os.listdir(PRACTICE_DIR)):
        if not name.endswith(".md") or name == "index.md":
            continue
        path = os.path.join(PRACTICE_DIR, name)
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
    print(f"wrote {os.path.relpath(REGISTRY, ROOT)} with {len(entries)} question(s)")
    for name, why in skipped:
        print(f"  skipped {name}: {why}", file=sys.stderr)
    return 1 if skipped else 0


if __name__ == "__main__":
    sys.exit(main())
