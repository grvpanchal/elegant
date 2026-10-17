#!/usr/bin/env python3
"""The terminology docs are complete and current: what the Docs Agent (a CTO sub-agent) keeps green.

    python3 .benzene/checks/docs.py [--changed FILE ...] [--max-age DAYS] [--limit N]

For every term in docs/_data/topics/{ui,server,state}.csv:
  - docs/<layer>/<slug>.md exists with front matter title, layout and slug, and a ``reviewed: YYYY-MM-DD`` no older
    than --max-age days (default 120): the doc was read against the latest practice, not just left alone
  - it carries the sections every term doc shares: Key Insight, Detailed Description, Code Examples, Common Mistakes,
    Quick Quiz, References
  - References lists at least two links, one of them dated 2025 or later (the doc cites current practice)
  - its Agent Skill exists: skills/<layer>-<slug>/SKILL.md
Prints ``FAIL docs [<rule>] <what>`` per finding (the first --limit, after a count per rule) and exits 1 when there is any.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import re
import sys
from pathlib import Path

ROOT = Path.cwd()
SECTIONS = ("## Key Insight", "## Detailed Description", "## Code Examples", "## Common Mistakes", "## Quick Quiz", "## References")
LAYERS = ("ui", "server", "state")


def front_matter(text: str) -> dict[str, str]:
    m = re.match(r"\A---\n(.*?)\n---\n", text, re.S)
    out = {}
    for line in (m.group(1).splitlines() if m else []):
        k, _, v = line.partition(":")
        if k.strip() and _:
            out[k.strip()] = v.strip().strip("'\"")
    return out


def section(text: str, heading: str) -> str:
    m = re.search(rf"(?ms)^{re.escape(heading)}\s*$(.*?)(?=^## |\Z)", text)
    return m.group(1) if m else ""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--changed", nargs="*", default=[])
    ap.add_argument("--max-age", type=int, default=120)
    ap.add_argument("--limit", type=int, default=12)
    args = ap.parse_args()
    only = {c for c in args.changed if c}
    today = dt.date.today()
    lines: list[str] = []
    terms = 0
    for layer in LAYERS:
        table = ROOT / "docs" / "_data" / "topics" / f"{layer}.csv"
        if not table.exists():
            lines.append(f"FAIL docs [registry] no {table.relative_to(ROOT)}")
            continue
        for row in csv.DictReader(table.open(encoding="utf-8")):
            slug = (row.get("slug") or "").strip()
            if not slug:
                continue
            rel = f"docs/{layer}/{slug}.md"
            if only and rel not in only:
                continue
            terms += 1
            doc = ROOT / rel
            if not doc.exists():
                lines.append(f"FAIL docs [missing] {rel}: the term {row.get('title', slug)!r} has no doc")
                continue
            text = doc.read_text(encoding="utf-8")
            fm = front_matter(text)
            for key in ("title", "layout", "slug"):
                if not fm.get(key):
                    lines.append(f"FAIL docs [front-matter] {rel}: no {key}")
            reviewed = fm.get("reviewed", "")
            try:
                age = (today - dt.date.fromisoformat(reviewed)).days
                if age > args.max_age:
                    lines.append(f"FAIL docs [stale] {rel}: reviewed {reviewed}, {age} days ago (> {args.max_age}): read it against "
                                 "current practice, update what changed, then set reviewed")
            except ValueError:
                lines.append(f"FAIL docs [stale] {rel}: no `reviewed: YYYY-MM-DD` in the front matter: review the doc against "
                             "current practice and record the date")
            for heading in SECTIONS:
                if not re.search(rf"(?m)^{re.escape(heading)}\s*$", text):
                    lines.append(f"FAIL docs [section] {rel}: no '{heading}'")
            refs = section(text, "## References")
            links = re.findall(r"https?://\S+", refs)
            if len(links) < 2:
                lines.append(f"FAIL docs [references] {rel}: {len(links)} reference links, at least 2")
            elif not re.search(r"\b20(2[5-9]|[3-9]\d)\b", refs):
                lines.append(f"FAIL docs [references] {rel}: no reference dated 2025 or later: cite current practice")
            skill = ROOT / "skills" / f"{layer}-{slug}" / "SKILL.md"
            if not skill.exists():
                lines.append(f"FAIL docs [skill] {rel}: no skills/{layer}-{slug}/SKILL.md")
    if not lines:
        print(f"ok docs: {terms} terms complete, current and backed by a skill")
        return 0
    rules: dict[str, int] = {}
    for line in lines:
        rule = line.split("[", 1)[1].split("]", 1)[0]
        rules[rule] = rules.get(rule, 0) + 1
    print("docs: " + ", ".join(f"{n} {r}" for r, n in sorted(rules.items(), key=lambda kv: -kv[1])) + f" across {terms} terms")
    for line in lines[: args.limit]:
        print(line)
    if len(lines) > args.limit:
        print(f"... {len(lines) - args.limit} more: the next run lists the rest")
    return 1


if __name__ == "__main__":
    sys.exit(main())
