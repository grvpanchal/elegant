---
title: Guardrail a performance budget
layout: question
slug: harness-bundle-budget
format: harness
difficulty: medium
layer: server
topics: [protocol, app-shell, images]
skill: server-app-shell
minutes: 35
summary: A size budget that fails a change, attributes the growth to a dependency, and survives the week someone genuinely needs to exceed it.
eval:
  rubric:
    - "The check fails when the critical-path bundle grows beyond the declared budget."
    - "The report attributes the growth to specific modules or dependencies, not just a total."
    - "A budget increase requires editing a declared budget file, so it appears in the diff and in review."
    - "The check is deterministic: two runs on the same commit produce the same numbers."
  threshold: 0.75
---

Bundles do not get big in one commit. They grow by fifteen kilobytes at a time,
each increase individually defensible, until the app is slow and nobody can say
which change did it.

Build the check that makes each of those fifteen kilobytes a decision.

**What to build**

1. A budget file — `performance-budget.json` — declaring a gzipped ceiling per
   entry point, and a smaller ceiling for the critical path (the shell plus the
   first route).
2. A check that builds the app, measures the real gzipped transfer size of each
   entry, and fails when one exceeds its budget.
3. **Attribution.** When it fails, the report must name what grew. A total with
   no cause gets answered by raising the budget; a report saying
   `+38kb: moment@2.30 (locales)` gets answered by fixing the import.
4. A per-PR delta against the base branch, printed whether or not the check
   fails, so a 9kb growth inside budget is still visible.
5. Determinism: same commit, same numbers. A check whose output wobbles gets
   ignored.

**Then run it.** Add a heavyweight dependency in the laziest way (`import
moment from "moment"`), watch the check fail and name it, then fix it with a
lighter alternative or a dynamic import, and watch it pass.

## Deliverables

- The budget file and the check.
- A run showing a failure with attribution, and the passing run after the fix.
- One paragraph on where you set the critical-path budget and why.

## Eval

Scored by the rubric above at a threshold of **0.75**. Attribution is the item
worth most of your attention: it is what separates a check that changes
behaviour from one that produces an argument about the number.

## How to think about it

**Measure what the user downloads.** Gzipped (or Brotli) transfer size over the
network — not the raw file on disk, and not the parsed size. Every bundler emits
a stats file; that plus `zlib.gzipSync` on the emitted asset is the whole
measurement.

**The critical path is not "all the JavaScript".** A 900kb app where 80kb loads
before first paint is fine. A 200kb app that loads all of it up front is not.
Budget the entry chunk and the first route separately from the total, or the
number you gate on will not be the number the user feels.

**Attribution is a graph problem you do not have to solve.** Bundler stats files
already contain module sizes and the reasons each module was included. Sorting
modules by `size` delta against the base build gets you a useful report in about
thirty lines — you do not need to build a treemap.

**Setting the first budget.** Take today's number, add a small margin, and
commit that. A budget derived from a Lighthouse recommendation is aspirational
and will be red on day one, which is the same failure mode as the accessibility
gate: a check that is red on arrival gets bypassed rather than satisfied. Ratchet
it down as you improve.

## Trade-offs

**Hard fail vs warn.** A warning is a number nobody reads. A hard fail on a
budget that is genuinely too small blocks a legitimate feature at 5pm on a
Friday — which is exactly why the escape hatch is *editing the budget file in
the same PR*. The increase then goes through review with the feature that needed
it, which is the conversation you wanted.

**Synthetic size vs field performance.** Bundle size is a proxy. It is cheap,
deterministic and gateable; real-user metrics are the truth and are far too
noisy to gate a single PR on. Gate on the proxy, alert on the truth, and when
they disagree, believe the field data and fix your proxy.

**Per-route budgets** are more accurate and more work to maintain, and they rot
when routes are added without one. A default budget applied to any route without
an explicit entry keeps that from silently failing open.

## Related

- Reading: [App shell](../server/app-shell.html) · [Protocol](../server/protocol.html) · [Images](../server/images.html)
- Playbook: [The agent harness](../playbooks/agent-harness.html)
- Agent Skill: `server-app-shell`
