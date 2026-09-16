---
name: author-plan
description: Add a study plan to the Frontend AI Harness site — a registry entry whose steps resolve and whose minutes add up to the budget it advertises.
triggers: [plan, study plan, learning path, curriculum, schedule, plans.registry, plans.duration_fit, one week, one month, three months]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
guardrail:
  required_patterns: ["docs/_data/plans.yml", "Confidence:"]
  max_chars: 12000
  # Verifiers are inherited from the manifest on purpose. A skill that declares
  # its own `verifiers:` REPLACES the manifest's list (GuardrailSpec.merged uses
  # exclude_unset), which would drop the site-wide `verify:capabilities` and
  # leave bza with nothing to discover work from.
---
A study plan is an ordered list of questions and readings with a declared time
budget. The budget is measured: the guardrail adds up the `minutes` of every
step and fails the plan when the total drifts more than 25% from
`budget_minutes`. A plan that lies about its hours is worse than no plan.

## Procedure

1. `read_workspace_file docs/_data/questions.yml` — this is the only source of
   valid step references and their `minutes`. Never reference a slug that is
   not in it.
2. `read_workspace_file docs/_data/plans.yml` if it exists, so you extend the
   list rather than replacing it.
3. Choose the steps. Order matters: concepts before the questions that use
   them, easy before hard, and no two consecutive steps on the same topic.
4. Add up the `minutes` of every step you chose. Set `budget_minutes` to that
   sum, rounded to the nearest 15. Do the arithmetic explicitly in your answer
   so it can be checked.
5. Write `docs/_data/plans.yml` (the whole file, with your plan appended) and
   `docs/plans/<slug>.md`.

## The registry entry

```yaml
- slug: one-week
  title: One week
  summary: <one line: who it is for and what they will be able to do>
  budget_minutes: 420
  items:
    - ref: memoized-selector        # a question slug from questions.yml
      note: <optional, one line on why this step is here>
    - ref: ui/atom                  # or a concept doc, as <layer>/<page>
```

A `ref` resolves to either a question slug or a `<layer>/<page>` path where
`docs/<layer>/<page>.md` exists. A concept-doc step counts as 15 minutes.

## The plan page

```markdown
---
title: One week
layout: plan
slug: one-week
description: <one line for search results>
---

<two or three paragraphs: who this plan is for, what it assumes, and what
you should be able to do at the end. The step list itself is rendered from
the registry by the layout — do not repeat it here.>
```

`slug` in the page must equal `slug` in the registry and the filename.

## Rules

- Do not invent question slugs. If the bank is too small for the budget you
  want, say so in your answer and build a smaller plan.
- Do not delete or reorder other people's plans when you write the file.
- `layout: plan` exactly. `layout: doc` renders an empty page.

## Answer format, always

- `Wrote: docs/_data/plans.yml` and `Wrote: docs/plans/<slug>.md`
- The arithmetic: each step's minutes, the sum, and `budget_minutes`.
- `Confidence: <low|medium|high>` as the last line.
