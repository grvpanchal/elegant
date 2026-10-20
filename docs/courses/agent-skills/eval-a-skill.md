---
title: "Score a skill with an eval set"
layout: lesson
course: agent-skills
slug: eval-a-skill
term: state/operations
skill: state-operations
practice: harness-skill-eval
description: "Build cases a script can grade, include the adversarial ones, measure the variance, and change one sentence of a SKILL.md at a time."
insight: "A SKILL.md is a set of instructions you believe will make a model behave; an eval set is the experiment that says whether it does, and which sentence carries the weight. Grade with a script, never with a model's opinion."
---

## A case is something a script can check

The eval question defines a case as an `{ input, expected }` pair where
`expected` is machine-checkable: a file that must compile, a function that must
pass given tests, output matching a schema, a required string present and a
forbidden one absent. Six cases is the deliberate minimum — a small set you run
on every skill change beats a large one you run once. Write the grader before
the cases: cases invented first turn into wishes like "the answer should be
idiomatic", which is not a case.

The grader is deterministic: temperature 0, a fixed case order, a score of
`passed / total`. No case is graded by asking a model whether the answer was
good, because that grader shares the blind spots of what it grades.

## Why operations make a good first subject

The [Operations]({{ '/state/operations.html' | relative_url }}) doc puts it in one
line: reducers are the *what*, operations are the *how*. Every `await` and
`try/catch` moves into operations, so reducers stay pure. The `state-operations`
skill adds explicit loading, success and error tracking, optimistic updates with
rollback, debouncing, and cancellation — and its quality gates include "race
conditions handled" and "request cancellation on unmount".

The doc's common mistakes are ready-made cases: API calls inside reducers, not
cancelling when the component unmounts, and catching errors but never
dispatching the FAIL action. Each one is checkable by running the agent's output
against tests, as the bank's coding questions do. One possible case shape:

```json
{"id": "fail-dispatched",
 "input": "Write fetchTodos so a rejected request ends the loading state",
 "expected": {"tests": "fetch-todos.tests.js", "mustNotContain": {"todos.reducer.js": ["fetch("]}}}
```

Then write at least two **adversarial** cases, where the skill's instruction is
ambiguous or the obvious reading is wrong — the question's example is an
instruction to "prefer a selector" where the right answer is a plain property
access. The easy cases only tell you the skill is not broken; the adversarial
ones are where it improves.

## Variance before improvement

Score the skill as it stands three times. The same model at temperature 0
still varies, because providers batch and route differently. If the runs score
0.83, 0.92 and 0.75, a change that moves the mean to 0.87 has told you nothing.
Report the spread, or do not report the number.

## Close the loop into the instructions

Change exactly one instruction in the `SKILL.md`, re-run three times, and keep
the change only if it did not regress. The rubric's last item is the point: name
the sentence you changed and show the before and after scores. Expect, sometimes,
to learn that no wording helps and the fix is a tool or a verifier — that is a
finding, not a failure.

```bash
for run in 1 2 3; do node grade.mjs evals/state-operations.jsonl > runs/before-$run.txt; done
# edit ONE instruction in skills/state-operations/SKILL.md
for run in 1 2 3; do node grade.mjs evals/state-operations.jsonl > runs/after-$run.txt; done
```

Add a case whenever a real failure gets past the set; one you have not added to
in a month is stale.
