#!/usr/bin/env python3
"""Sync docs/_data/skills.yml and the skill counts from what's actually on disk.

The registry drives the "Agent Skill Available" download widget
(docs/_includes/doc-skill-download.html), which derives a skill slug as
"<domain>-<page.slug>" and only renders when that slug is listed here. Keeping
the list generated from disk means the widget can never point at a missing
SKILL.md.

A skill folder counts as complete only when it has BOTH SKILL.md and README.md
and the SKILL.md frontmatter parses with a `name` matching the folder.
"""

import os
import re
import sys

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKILLS_DIR = os.path.join(ROOT, "skills")
REGISTRY = os.path.join(ROOT, "docs", "_data", "skills.yml")

HEADER = """# Auto-maintained list of skill slugs that exist under /skills/.
# Used by _includes/doc-skill-download.html to only render the
# download widget on docs whose matching SKILL.md exists.
# Regenerate with: python3 scripts/sync-skills-registry.py
"""


def complete_skills():
    names, skipped = [], []
    for entry in sorted(os.listdir(SKILLS_DIR)):
        folder = os.path.join(SKILLS_DIR, entry)
        if not os.path.isdir(folder):
            continue
        skill, readme = (os.path.join(folder, f) for f in ("SKILL.md", "README.md"))
        if not (os.path.exists(skill) and os.path.exists(readme)):
            skipped.append((entry, "missing SKILL.md or README.md"))
            continue
        text = open(skill).read()
        match = re.match(r"^---\n(.*?)\n---", text, re.S)
        if not match:
            skipped.append((entry, "no YAML frontmatter"))
            continue
        front = yaml.safe_load(match.group(1)) or {}
        if front.get("name") != entry:
            skipped.append((entry, f"name '{front.get('name')}' != folder"))
            continue
        if text.count("```") % 2:
            skipped.append((entry, "unbalanced code fences"))
            continue
        names.append(entry)
    return names, skipped


def bump_count(path, pattern, count):
    text = open(path).read()
    new, n = re.subn(pattern, lambda m: m.group(0).replace(m.group(1), str(count)), text, count=1)
    if not n:
        sys.exit(f"count anchor not found in {path}")
    if new != text:
        open(path, "w").write(new)
        print(f"  count -> {count} in {os.path.relpath(path, ROOT)}")


def main():
    names, skipped = complete_skills()
    open(REGISTRY, "w").write(HEADER + "".join(f"- {n}\n" for n in names))
    print(f"registry: {len(names)} complete skills")
    for entry, why in skipped:
        print(f"  skipped {entry}: {why}")

    bump_count(os.path.join(ROOT, "skills", "README.md"), r"The (\d+) skills are grouped", len(names))
    bump_count(os.path.join(ROOT, "README.md"), r"This repo ships (\d+) \[Agent Skills\]", len(names))


if __name__ == "__main__":
    main()
