#!/usr/bin/env python3
"""Generate harness/README.md from harness/capabilities.yml.

The capability table is the spec, so writing it twice guarantees it drifts.
`harness.docs` fails when a check id is missing from the README, and this is
how you make it pass:

    python3 harness/gen_readme.py

Everything outside "## The capabilities" is prose kept in PROLOGUE/EPILOGUE
below — edit it here, not in the generated file.
"""

from __future__ import annotations

import pathlib

import yaml

HARNESS = pathlib.Path(__file__).resolve().parent
SPEC = HARNESS / "capabilities.yml"
OUT = HARNESS / "README.md"

GROUP_BLURB = {
    "content": "The reference layer under `docs/{ui,server,state}/`. Practice without a concept page to fall back on is a quiz, not training.",
    "question_bank": "The five practice formats and the registry that makes them findable. This is the GreatFrontend parity surface: quiz, coding, UI coding, system design — plus our fifth, `harness`.",
    "solutions": "A question without a worked solution is homework. Every solved format ships one, with more than one approach and an honest account of what each costs.",
    "workspace": "The in-browser workspace and the executable contract behind it. `tests.js` runs in the learner's browser and under Node in this checker, so \"solved\" means the same thing in both.",
    "frameworks": "The promise the six `chota-*` templates make: the same exercise in more than one framework.",
    "plans": "Study plans with declared time budgets, checked two ways — against the questions they contain, and against what their name claims.",
    "playbooks": "The long reads. Measured for depth so none of them decays into a stub.",
    "progress": "Per-learner progress in `localStorage`. No account, no backend, no telemetry — and a certificate when a plan is finished.",
    "discovery": "Filtering, search and navigation. A capability nobody can find does not exist.",
    "health": "Front matter, links, alt text, heading order and the Jekyll build. The floor everything else stands on.",
    "functional": "A real Chromium against the built site (`harness/functional/run.mjs`). Everything above proves the site is well *formed*; this group proves it *works* — the Run button executes the question's tests, the quiz grades, the filter filters, progress survives a reload. This is the group that removes the human from the healing loop, because a functional capability no longer needs anyone to click it.",
    "account": "Accounts on a site with no server. greatfrontend.com has real ones; this is static Jekyll on GitHub Pages, so an account here is a named profile on this device, with progress namespaced to it and a portable export \u2014 a smaller promise, kept exactly. It is not authentication, and the page says so. A real identity provider goes behind `registerProvider`, and `account.provider_seam` proves that abstraction actually works rather than merely existing.",
    "frontier": "Parity targets the site does not have yet. Declared and measured so the gap stays visible, `required: false` so they never block a contribution, and ordered after everything required so the cluster grows into them one at a time instead of all at once. A frontier check is a real measurement \u2014 when someone builds the feature it turns green without being rewritten.",
    "harness": "The axis GreatFrontend does not have: every unit of practice is also an Agent Skill, and every `harness` exercise ships its own eval with a numeric threshold.",
}

PROLOGUE = """# The capability guardrail

`harness/` is the executable definition of what the Frontend AI Harness
training site must be able to do. It exists so that "is the site finished?" is
a number, not an opinion — and so an agent working on the site is corrected by
the same measurement a reviewer would use.

Feature parity is benchmarked against [GreatFrontend](https://www.greatfrontend.com/):
question formats, an in-browser workspace with tests, worked solutions with
multiple approaches, study plans, playbooks and progress tracking. The
*content* is ours — the Universal Frontend Architecture split into UI, Server
and State — and so is one capability GreatFrontend has no equivalent for: every
unit of practice is also an Agent Skill, and `harness`-format exercises ship
their own eval.

## Run it

```bash
python3 harness/check_harness.py                 # full report, exit 1 on failure
python3 harness/check_harness.py --json          # machine-readable
python3 harness/check_harness.py --next          # the single highest-priority deficit
python3 harness/check_harness.py --group workspace
python3 harness/check_harness.py --only bank.schema
python3 harness/check_harness.py --scope incremental --changed docs/practice/x.md
python3 harness/check_harness.py --sync          # regenerate docs/_data/*.yml first
python3 harness/check_harness.py --build         # also run `jekyll build` (slow)
```

Only PyYAML is required. `node` runs the executable workspace check and the
Playwright functional suite; `bundle exec jekyll` builds the site those browser
scenarios run against (built once per process and shared). Each is skipped with
an explicit "skipped" line when it is not installed, never silently passed over.

```bash
node harness/functional/run.mjs --site <built-dir>   # the browser suite on its own
```

`--next` is what an agent loop consumes: one failing capability, why it exists,
the current measurement, and the specific files to fix.

## Scope: one contribution, or the whole site

Two axes narrow a run, and both exist because an author must not be judged by
work that is not theirs:

* `--scope incremental` drops the **cumulative** capabilities — the volume
  targets like "twelve quiz questions" that no single contribution can close.
  `--scope cumulative` keeps only those.
* `--changed <paths>` restricts every per-page capability to the files named.
  Registry, plan and volume checks stay site-wide, because those are properties
  of the site, not of a page.

An agent's per-task verifier is therefore
`--sync --scope incremental --changed {touched}`, while the site-wide target it
works toward is the unscoped `--next`.

## How a capability is scored

Each check returns a score in `[0, 1]` — usually a ratio such as "6 of 8
questions have a solution". The report is:

```
score      = weighted mean of every check
passing    = every `required: true` check is at 1.0  AND  score >= {pass_threshold}
```

A check marked `required: false` (shown with a `~` in the report) drags the
composite down but never blocks on its own — those are the capabilities that
should improve over time rather than gate a change.

## Editing the spec

`harness/capabilities.yml` holds the thresholds; `harness/check_harness.py`
holds one function per check id, registered with `@check("<id>")`. Adding a
capability means adding both — the spec entry so the intent is reviewable, and
the function so the intent is measurable. A spec entry with no implementation
fails loudly rather than passing by default. Then run
`python3 harness/gen_readme.py` to refresh the table below.

## The contract a question must satisfy

One markdown file per question under `docs/practice/`, front matter:

```yaml
---
title: Memoize a derived selector
layout: question
slug: memoized-selector     # must equal the filename
format: coding              # quiz | coding | ui-coding | system-design | harness
difficulty: medium          # easy | medium | hard
layer: state                # ui | server | state
topics: [selectors, state]  # at least one, from docs/_data/topics/*.csv
skill: state-selectors      # must exist as skills/<slug>/SKILL.md
minutes: 25                 # 5..120
frameworks: [react, vue]    # ui-coding only, at least 2
summary: One line for the bank listing.
---
```

`format: coding` additionally needs `docs/practice/workspace/<slug>/`:

| File | Role |
|---|---|
| `starter.js` | what the learner sees in the editor |
| `solution.js` | the reference implementation, run under Node by `workspace.tests_pass` |
| `tests.js` | `export default async (subject) => [{name, pass, message?}, ...]` |

`format: harness` additionally needs an `eval:` block with a `rubric:` list of
at least two measurable items and a `threshold:` in `(0, 1]`.

After adding or editing a question:

```bash
python3 scripts/sync-questions-registry.py    # regenerates docs/_data/questions.yml
```

## The capabilities
"""

EPILOGUE = """## Using it as an agent verifier

The checker is designed to be the executable half of an agent's guardrail. In a
Benzene manifest it is two lines — one that finds the work, one that judges it:

```yaml
guardrail:
  verifiers:
    - type: command
      name: verify:capabilities          # the site-wide target: discovers the next deficit
      command: [python3, harness/check_harness.py, --sync, --next]
      required: false                    # no single contribution can close a volume target
      cwd: "."
    - type: command
      name: verify:contribution          # what this task actually wrote
      command: [python3, harness/check_harness.py, --sync, --scope, incremental, --changed, "{touched}"]
      cwd: "."
```

The agent's loop is then: `--next` produces the instruction, the agent writes
files, the checker runs again, and its output becomes the correction message on
failure. Nothing in that loop needs a human, and nothing in it needs the model
to be right about whether it was right.

`manifests/frontend-harness-openrouter.yaml` in the
[benzene-agent](https://github.com/grvpanchal/benezene-agent) repository is the
genome that does this, running entirely on free models.
"""


def fmt_threshold(t) -> str:
    if isinstance(t, dict):
        return ", ".join(f"`{k}` >= {v}" for k, v in t.items())
    if isinstance(t, float) and 0 < t <= 1:
        return "all" if t == 1.0 else f"{t:.0%}"
    return f"`{t}`"


def main() -> int:
    spec = yaml.safe_load(SPEC.read_text(encoding="utf-8"))
    # Fixtures are scaffolding for other checks, not capabilities of the site.
    # `harness.docs` counts them out of every "N capabilities" claim, so the
    # generated README has to leave them out too or the two disagree.
    real = [c for c in spec["checks"] if not c.get("fixture")]
    groups: dict[str, list[dict]] = {}
    for c in real:
        groups.setdefault(c["group"], []).append(c)

    out = [PROLOGUE.replace("{pass_threshold}", str(spec["pass_threshold"]))]
    for group, checks in groups.items():
        out.append(f"### {group}\n")
        out.append(GROUP_BLURB.get(group, "") + "\n")
        out.append("| check | weight | required | scope | threshold | fails when |")
        out.append("|---|---|---|---|---|---|")
        for c in checks:
            t = c["threshold"]
            why = c["why"]
            shown = fmt_threshold(t) if not isinstance(t, dict) else "the per-format minimum"
            why = why.replace("{threshold:.0%}", shown).replace("{threshold}", shown).replace("|", "\\|")
            out.append(
                f"| `{c['id']}` | {c['weight']} | {'yes' if c.get('required', True) else 'no'} "
                f"| {c.get('scope', 'incremental')} | {fmt_threshold(t)} | {why} |")
        out.append("")
    out.append(EPILOGUE)

    OUT.write_text("\n".join(out), encoding="utf-8")
    print(f"wrote {OUT.relative_to(HARNESS.parent)} ({len(real)} capabilities)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
