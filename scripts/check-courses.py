#!/usr/bin/env python3
"""Check the free courses against their contract.

docs/_data/courses.yml owns the order (course -> modules -> lesson slugs); each
lesson's own front matter (docs/courses/<course>/<slug>.md, `layout: lesson`)
owns what it teaches. The layouts render whatever they are given, so a typo
ships as a lesson with no term card or a dead practice link. This catches it:

  * every listed lesson has a page whose `course` and `slug` match, and every
    lesson page is listed exactly once
  * `term` is <layer>/<slug> in docs/_data/topics/<layer>.csv with a doc page,
    `skill` is in docs/_data/skills.yml with a skills/<name>/SKILL.md, and
    `practice` is a slug in docs/_data/questions.yml
  * `description` (<= 160 chars) and `insight` are present
  * the body is 300-600 words, and a course has at least 5 lessons
  * each course has docs/courses/<course>/index.md with `layout: course`

Run from anywhere:  python3 scripts/check-courses.py   (exit 1 on any problem)
"""

import csv
import os
import re
import sys

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, "docs")
FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n?(.*)\Z", re.S)
MIN_WORDS, MAX_WORDS, MIN_LESSONS = 300, 600, 5


def load_yaml(*parts):
    with open(os.path.join(DOCS, *parts), encoding="utf-8") as fh:
        return yaml.safe_load(fh) or []


def page(path):
    with open(path, encoding="utf-8") as fh:
        m = FM_RE.match(fh.read())
    if not m:
        return None, ""
    return yaml.safe_load(m.group(1)) or {}, m.group(2)


def main():
    problems = []
    courses = load_yaml("_data", "courses.yml")
    questions = {q["slug"] for q in load_yaml("_data", "questions.yml")}
    skills = set(load_yaml("_data", "skills.yml"))
    topics = {}
    for layer in ("ui", "server", "state"):
        with open(os.path.join(DOCS, "_data", "topics", layer + ".csv"), encoding="utf-8") as fh:
            topics[layer] = {row["slug"].strip() for row in csv.DictReader(fh)}

    for course in courses:
        cslug = course.get("slug")
        cdir = os.path.join(DOCS, "courses", cslug)
        where = "courses.yml:" + cslug
        index = os.path.join(cdir, "index.md")
        if not os.path.isfile(index):
            problems.append(f"{where}: no docs/courses/{cslug}/index.md")
        else:
            meta, _ = page(index)
            if not meta or meta.get("layout") != "course" or meta.get("course") != cslug:
                problems.append(f"{where}: index.md needs layout: course and course: {cslug}")

        listed = [s for m in course.get("modules") or [] for s in (m.get("lessons") or [])]
        if len(listed) < MIN_LESSONS:
            problems.append(f"{where}: {len(listed)} lessons, needs at least {MIN_LESSONS}")
        for dup in sorted({s for s in listed if listed.count(s) > 1}):
            problems.append(f"{where}: lesson '{dup}' listed more than once")

        on_disk = set()
        if os.path.isdir(cdir):
            on_disk = {f[:-3] for f in os.listdir(cdir) if f.endswith(".md") and f != "index.md"}
        for orphan in sorted(on_disk - set(listed)):
            problems.append(f"docs/courses/{cslug}/{orphan}.md: not listed in any module of courses.yml")

        for slug in listed:
            rel = f"docs/courses/{cslug}/{slug}.md"
            path = os.path.join(ROOT, rel)
            if not os.path.isfile(path):
                problems.append(f"{where}: lists '{slug}' but {rel} does not exist")
                continue
            meta, body = page(path)
            if meta is None:
                problems.append(f"{rel}: no front matter")
                continue
            if meta.get("layout") != "lesson":
                problems.append(f"{rel}: layout must be 'lesson'")
            if meta.get("course") != cslug or meta.get("slug") != slug:
                problems.append(f"{rel}: course/slug must be {cslug}/{slug}")
            term = str(meta.get("term") or "")
            layer, _, tslug = term.partition("/")
            if tslug not in topics.get(layer, set()):
                problems.append(f"{rel}: term '{term}' is not in docs/_data/topics/{layer or '?'}.csv")
            elif not os.path.isfile(os.path.join(DOCS, layer, tslug + ".md")):
                problems.append(f"{rel}: term doc docs/{term}.md does not exist")
            skill = meta.get("skill")
            if skill not in skills or not os.path.isfile(os.path.join(ROOT, "skills", str(skill), "SKILL.md")):
                problems.append(f"{rel}: skill '{skill}' is not a published skill")
            if meta.get("practice") not in questions:
                problems.append(f"{rel}: practice '{meta.get('practice')}' is not a question in the bank")
            desc = str(meta.get("description") or "")
            if not desc or len(desc) > 160:
                problems.append(f"{rel}: description must be 1-160 characters (is {len(desc)})")
            if not str(meta.get("insight") or "").strip():
                problems.append(f"{rel}: insight is missing")
            words = len(body.split())
            if not MIN_WORDS <= words <= MAX_WORDS:
                problems.append(f"{rel}: body is {words} words, needs {MIN_WORDS}-{MAX_WORDS}")

    for p in problems:
        print(p, file=sys.stderr)
    total = sum(len([s for m in c.get("modules") or [] for s in (m.get("lessons") or [])]) for c in courses)
    print(f"checked {len(courses)} course(s), {total} lesson(s): {len(problems)} problem(s)")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
