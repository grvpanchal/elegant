---
title: Gate a pull request on accessibility
layout: question
slug: harness-a11y-gate
format: harness
difficulty: hard
layer: ui
topics: [accessibility, story, component]
skill: ui-accessibility
minutes: 50
summary: Turn an accessibility audit into a check that runs on every change — and confront the baseline problem that makes most of them useless.
eval:
  rubric:
    - "The gate fails a pull request that introduces a new serious or critical violation."
    - "The gate does NOT fail a pull request that merely touches a file with a pre-existing violation."
    - "The baseline file is machine-generated and its diff is readable in review."
    - "Each violation is reported with the component, the rule id and the offending selector."
    - "A rule can be suppressed only with a written reason recorded next to the suppression."
  threshold: 0.8
---

Every team that adds an accessibility audit to CI hits the same wall on day one:
the existing codebase has four hundred violations, the gate is red forever, and
within a week someone adds `continue-on-error: true`. The audit is now
decoration.

Build the gate that survives that week.

**What to build**

1. An audit that renders each component from its `*.stories.*` file and runs
   `axe-core` against the result. The story files already exist in every
   `chota-*` template; that is the point of having them.
2. A **baseline**: a generated file recording the violations that exist today,
   keyed stably enough to survive reformatting.
3. A gate that fails only on violations **not** in the baseline. New code is
   held to the standard; old code is a debt you can pay down deliberately.
4. A way to remove entries from the baseline as they are fixed, and a check that
   the baseline never grows without a reason recorded in the file.
5. Suppression with a reason. `// a11y-disable-next-line color-contrast — brand
   colour, waiver #412` is auditable; a bare disable is not.

**Then run it.** Introduce one new violation — a `<div onClick>`, a missing
form label, a 3:1 contrast pair — and check that the gate catches exactly it
and says which component.

## Deliverables

- The audit runner and the gate.
- A generated baseline for one template.
- A log showing a PR that fails and a PR that touches a baselined file and
  passes.

## Eval

Scored by the rubric above at a threshold of **0.8**. Two of those five rubric
items are the whole exercise — failing on new violations and *not* failing on
old ones — and a gate that only does the first is the one that gets disabled.

## How to think about it

**The key stability problem is the real work.** A violation keyed by line number
moves when someone adds an import. Keyed by DOM selector, it moves when someone
wraps a div. Keyed by (component, rule id, count) it survives both and cannot
distinguish two instances of the same rule. There is no perfect key; pick one,
write down why, and watch which false churn it produces in review.

**Serious and critical only, at first.** `axe-core` reports four severities, and
gating on `minor` will bury the signal. Start with `serious` and `critical`,
which are close to "unusable for someone", and tighten later once the number is
near zero.

**The audit needs a real DOM.** Stories render components; `jsdom` is close
enough for structure and label association, and it does not compute layout or
colour — so contrast rules need a real browser. Knowing which of your rules are
lying in jsdom is part of the exercise, and the honest answer is to run the
contrast rules separately in Playwright.

**What this cannot catch.** Roughly half of accessibility is not automatable: a
sensible reading order, an alt text that says something useful, a focus order
that follows the visual layout. `axe-core` finds the half a machine can find,
which is the half that regresses silently. Do not let a green gate be read as
"this is accessible" — say so in the report the gate prints.

## Trade-offs

**Baseline vs bulk fix.** Fixing four hundred violations before turning the gate
on is the honest option and it never happens, because it is a quarter of work
with no feature attached. The baseline is the pragmatic option and it
institutionalises the debt, which is why the baseline file needs to shrink over
time and someone needs to own that number.

**Story-based vs page-based auditing.** Stories are fast, isolated and miss
everything about composition — a heading level that is fine in isolation and
skips a level on the real page. Page-based auditing catches composition and is
slower, flakier, and harder to attribute to a component. Run stories on every
PR and pages nightly.

**Gate vs report.** A gate changes behaviour and generates pressure to bypass
it. A report changes nothing and nobody reads it. The gate is right — provided
the suppression path is easy, visible, and leaves a written reason, because an
escape hatch people can use openly is what stops them disabling the whole check.

## Related

- Reading: [Accessibility](../ui/accessibility.html) · [Story](../ui/story.html) · [Component](../ui/component.html)
- Playbook: [The agent harness](../playbooks/agent-harness.html)
- Practice: [Build an accessible combobox](../practice/accessible-combobox.html)
- Agent Skill: `ui-accessibility`
