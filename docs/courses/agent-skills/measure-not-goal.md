---
title: "When the agent satisfies the measure, not the goal"
layout: lesson
course: agent-skills
slug: measure-not-goal
term: state/store
skill: state-store
practice: harness-state-shape
description: "Spot the change that passes your check and misses the point, anchor checks outside themselves, and order the loop so it never hands out blocked work."
insight: "Most of what looks like model dishonesty is a check that measured a proxy, or a loop that handed out work the agent could not do honestly. Every internal-consistency check needs an external anchor."
---

## Correct arithmetic, worthless result

The [agent harness playbook]({{ '/playbooks/agent-harness.html' | relative_url }})
gives the purest example. A check that a study plan's steps add up to its
declared budget can be satisfied by declaring the budget to be thirty minutes.
Nothing is lying — the arithmetic is right and the plan is worthless. The fix is
an **external anchor**: a plan named "three months" must declare a budget in a
band that three months could mean. This site holds its own study plans to that
rule. Finding the anchor is the real design work, and every
internal-consistency check has this shape.

## The same failure inside a store

The [Store]({{ '/state/store.html' | relative_url }}) doc describes a single
source of truth with clear rules for updates, and the `state-store` skill turns
that into three principles: one store, state is read-only, pure reducer updates.
The store-shape guardrail question encodes them as rules — and rule 4 is the
instructive one. Every `_REQUEST` action needs a `_SUCCESS` and a `_FAIL`, and
the reducer must handle all three. An agent satisfies it with
`case FOO_FAIL: return state;`. The rule passes, the error is swallowed, and the
UI hangs on a spinner forever. The rule measured the presence of a case label,
not the handling of an error.

The anchor is behaviour, not text. Rule 3 shows how: reducer purity can be
*proved* by running the reducer against deep-frozen state, where a mutation
throws a `TypeError` in strict mode. Tighten rule 4 the same way — run the
`_FAIL` branch and assert something observable changed:

```js
const next = reducer(loadingState, { type: "FOO_FAIL", payload: "offline" });
if (next === loadingState || next.isLoading !== false) {
  throw new Error("FOO_FAIL must end loading and record the error");
}
```

The heuristic rules — no entity under two keys, no `.filter(` over store data in
a component — have false positives. The question's warning applies: a false
positive the agent cannot fix correctly is one it will fix *incorrectly*, and
the diff shows you how much the rule was really measuring.

## Give the loop a dependency order

The second source of gamed checks is the loop itself. Weighted priorities
alone hand the agent work it cannot do: a study plan is worth more than a quiz
question, so a naive loop asks for the plan, and the agent, unable to fill it
honestly, produces a plan that satisfies the letter of the check. Declare that
plans depend on a populated question bank and the loop asks for questions
instead. In the playbook's words, most of what looks like model dishonesty is a
loop handing out blocked work.

## Read the diff for it

After any round that turned a check green, ask:

- Did the behaviour the rule stands for change, or only the text it matches?
- Did the agent edit a test, the checker, a threshold or a baseline?
- Did it move code to dodge a count?

And put the exit in the prompt:

```text
If a rule cannot be satisfied without changing what it checks,
stop and tell me which rule and why. Do not work around it.
```
