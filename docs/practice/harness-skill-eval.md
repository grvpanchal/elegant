---
title: Write an eval set for an Agent Skill
layout: question
slug: harness-skill-eval
format: harness
difficulty: hard
layer: state
topics: [state, store, reducer, operations]
skill: state-operations
minutes: 55
summary: Score a skill instead of arguing about it — build the cases, the grader and the threshold, then use the results to change the skill.
eval:
  rubric:
    - "At least six cases, each with an input and a machine-checkable expected outcome."
    - "At least two cases are adversarial: plausible inputs where the skill's instructions are ambiguous or wrong."
    - "The grader is deterministic — no case is scored by an LLM's opinion."
    - "Running the set twice on the same model produces the same score."
    - "The write-up names one instruction in the SKILL.md that the results changed, and shows the before and after scores."
  threshold: 0.8
---

A `SKILL.md` is a set of instructions you believe will make a model behave. An
eval set is the experiment that tells you whether it does — and, more usefully,
*which sentence* is carrying the weight.

Take `skills/state-operations/SKILL.md` from this repository (or any skill you
have written) and build an eval set for it.

**What to build**

1. **Cases.** At least six, each a `{ input, expected }` pair where `expected`
   is checkable by a script: a file that must compile, a function that must pass
   given tests, an output matching a schema, a required string present and a
   forbidden one absent.
2. **Adversarial cases.** At least two where the skill's instructions are
   genuinely ambiguous, or where the obvious reading produces the wrong answer.
   These are the cases that teach you something; the six easy ones only tell you
   the skill is not broken.
3. **A deterministic grader.** Temperature 0, a fixed case order, a score that
   is `passed / total`. No case may be graded by asking a model whether the
   answer was good — that grader has the same blind spots as the thing it is
   grading.
4. **A baseline run.** Score the skill as it stands, three times, and report the
   variance as well as the mean. A one-run improvement inside the variance is
   not an improvement.
5. **One change, measured.** Change exactly one instruction in the SKILL.md.
   Re-run. Report the before and after with the same three-run treatment. Keep
   the change only if it did not regress.

## Deliverables

- `evals/<skill>.jsonl` and the grader.
- Baseline and post-change scores, three runs each.
- A paragraph naming the instruction you changed and what the numbers said.

## Eval

Scored by the rubric above at a threshold of **0.8**. The last rubric item is
the one that matters: an eval set nobody acted on is a report, and this exercise
is about closing the loop from measurement back into the instructions.

## How to think about it

**Write the grader first, then the cases.** Cases invented before a grader tend
to be things you can describe rather than things you can check, and you will
find yourself writing "the answer should be idiomatic" — which is not a case,
it is a wish.

**Six cases is a low bar and it is deliberate.** A small set you actually run on
every change beats a large one you run once. Add cases when a real failure gets
past the set, which is the only evidence that tells you what is missing.

**Variance is the result people skip.** The same model on the same prompt at
temperature 0 still varies across runs, because providers batch and route
differently. If your set scores 0.83, 0.92 and 0.75, then a change that moves
the mean to 0.87 has told you nothing. Report the spread or do not report the
number.

**The adversarial cases are where the skill actually improves.** A skill that
scores 6/6 on cases you wrote from its own instructions has measured your
reading comprehension. Write the case where the instruction says "prefer a
selector" and the right answer is a plain property access; see what the model
does; then fix the sentence.

**Expect to learn that the wording was not the problem.** Often the result is
that no phrasing helps, and the fix is a tool the skill can call or a verifier
that catches the mistake after the fact. That is a finding, not a failure —
knowing a model cannot be prompted into reliability at a task is worth more than
another rewrite.

## Trade-offs

**Deterministic graders vs coverage.** Everything checkable by a script is
narrower than everything you care about. You will leave out "is this
well-explained". Leave it out anyway: a narrow honest number beats a broad
dishonest one, and the things you left out are what human review is still for.

**Eval-driven skill development has the same failure as test-driven anything.**
You will start writing instructions that satisfy your cases. Rotate in new cases
from real failures, and treat a set you have not added to in a month as stale.

**Cost.** Six cases times three runs times every candidate change is real money
on a paid model and real time on a free one. That is the argument for keeping
the set small and the grader fast, and for running the full set on a change to
the skill rather than on every commit.

## Related

- Reading: [Operations](../state/operations.html) · [Store](../state/store.html) · [Reducer](../state/reducer.html)
- Playbook: [The agent harness](../playbooks/agent-harness.html)
- Practice: [Write a guardrail for the ui-atom skill](../practice/harness-atom-guardrail.html)
- Agent Skill: `state-operations`
