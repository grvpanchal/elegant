---
title: "Thresholds, baselines and scope"
layout: lesson
course: agent-skills
slug: thresholds-and-budgets
term: ui/accessibility
skill: ui-accessibility
practice: harness-a11y-gate
description: "Set a bar a real codebase can pass: hard checks plus a weighted score, a retry budget, and a gate that judges only what the agent touched."
insight: "A guardrail that demands perfection gets switched off within a week; one that accepts anything teaches nothing. Make a few checks non-negotiable, score the rest against a composite below 1.0, and judge an agent only on the files it wrote."
---

## Two kinds of check, three numbers

The [agent harness playbook]({{ '/playbooks/agent-harness.html' | relative_url }})
separates checks by what a failure means:

- **Hard checks** must pass — the schema parses, the tests are green, no link is
  broken. A failure means the artefact is broken.
- **Weighted checks** feed a score, with a composite of about 0.9 to 0.95 as the
  bar. A failure means the work is worse than it should be.

Then two numbers people forget. A **retry budget** of two or three correction
rounds before a human looks, because an agent that has not converged by the
third attempt is usually missing information, not effort. And a **cost or time
ceiling**, so a loop that fails to converge fails cheaply. The bank's harness
questions use the same shape: the atom guardrail is scored at 0.75, the
accessibility gate at 0.8.

## Sort accessibility into those buckets

The [Accessibility]({{ '/ui/accessibility.html' | relative_url }}) doc traces most
bugs to three mistakes: non-semantic HTML (`<div>` instead of `<button>`),
missing ARIA labels, and forgetting keyboard users exist. The `ui-accessibility`
skill's quality gates include semantic HTML, alt text, keyboard navigation,
4.5:1 contrast for WCAG AA, visible focus, and "screen reader tested".

Those do not belong in one bucket. A `<div onClick>` or an unlabelled input is
broken for someone today — hard check. Contrast is machine-checkable but needs a
real browser, because jsdom computes neither layout nor colour. Reading order,
useful alt text and focus order that follows the layout are not automatable at
all; the gate question estimates that as roughly half of accessibility. So the
report must say that a green gate does not mean "this is accessible". Start by
gating on `axe-core`'s serious and critical findings only — gating on minor
buries the signal.

## The baseline is a scoping problem

Run that gate on a real codebase and it finds four hundred existing
violations. The gate is red forever, and within a week someone adds
`continue-on-error: true`. The playbook describes the same trap for any
guardrail: if old defects count against the agent, the loop never converges
and the agent starts "fixing" unrelated files to move the number.

The fix is two reports. A **site-wide** report names everything wrong and
decides what work exists. A **contribution-scoped** report judges only the files
this task wrote and decides whether the work was good. For accessibility, the
scoping device is a machine-generated baseline: the gate fails only on
violations that are not in it, and a rule is suppressed only with a written
reason beside the suppression.

## Brief the agent with all of it

```text
Run the a11y gate on the stories of the components you changed.
Fix every NEW serious or critical violation it reports.
Do not edit the baseline file or add a suppression without a reason.
If the gate is still red after 3 rounds, stop and show me the report.
```

Then introduce one violation yourself — a `<div onClick>`, a missing label —
and confirm the gate names exactly that component and rule.
