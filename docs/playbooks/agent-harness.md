---
title: The agent harness playbook
layout: doc
slug: agent-harness
description: How to point an AI agent at a frontend codebase and keep control of it — skills, executable guardrails, thresholds, and the failure modes that only show up once the loop is closed.
order: 40
---

# The agent harness playbook

An agent that writes frontend code is easy to start and hard to trust. The gap
between the two is not model quality — it is whether anything in your setup can
tell, without a human reading the diff, that the work is right.

That thing is a harness: a skill that says how the work is done, a guardrail
that measures whether it was, and a loop that feeds the measurement back as the
correction. Everything else is prompt decoration.

## The three parts, and what each is for

A **skill** is the procedure. It says which files to read first, what the
output must look like, and what is forbidden. It is not a personality; it is a
runbook. The test of a good skill is whether a competent new hire could follow
it without asking a question.

A **guardrail** is the measurement. It runs after the agent finishes and returns
a number and a list of defects. The hard requirement is that it is *executable*
— a parser, a count, a compiler, a test runner — because a guardrail that asks
a model whether the work is good inherits the same blind spots as the model
that did the work.

The **loop** is what makes the pair useful. The guardrail's output becomes the
next message the agent sees. Not "try again" — the actual compiler error, the
actual failing assertion, the actual missing front-matter key. Agents are
dramatically better at fixing a named defect than at avoiding an unnamed one.

## Write the guardrail before the skill

This is the part people do backwards. Writing the skill first feels productive
because prose is easy to produce, and it leads to a harness where the standard
lives in a paragraph nobody can run.

Start from the question *how would I know this was wrong?* and write that check.
For a component: does the folder have a story file, does the source import from
the store, is the interactive element reachable by keyboard. For a content page:
does the front matter parse, do the links resolve, is there a solution section.
For a utility: do its tests pass.

Once the check exists, the skill almost writes itself, because the skill is
just the checklist that makes the check pass on the first try instead of the
third.

## Pick thresholds that are not 1.0

A guardrail that demands perfection blocks everything and gets switched off
within a week. One that accepts anything teaches nothing. The useful setting is
a threshold below 1.0 on the *composite*, combined with a small set of checks
that are individually non-negotiable.

Concretely, that separation looks like this: hard checks that must pass —
the schema parses, the tests are green, no link is broken — and weighted checks
that contribute to a score, where a composite around 0.9 to 0.95 is the bar.
The hard checks are the things where a failure means the artefact is broken.
The weighted ones are the things where a failure means it is worse than it
should be.

Two more thresholds matter and are usually forgotten. A **retry budget**: how
many correction rounds before you stop and ask a human — two or three, because
an agent that has not converged by the third attempt is usually missing
information, not effort. And a **cost or time ceiling**, so a loop that fails to
converge fails cheaply.

## Scope the measurement to what the agent touched

The first time you run a guardrail over a real repository, it will report
defects the agent had nothing to do with — a broken link written last year, a
page with no title. If those failures count against the agent's work, two bad
things happen: the loop never converges, and the agent starts "fixing"
unrelated files to make the number go up.

So a guardrail that runs against an agent needs two modes. A **site-wide**
report that names everything wrong, used to decide what work exists. And a
**contribution-scoped** report that judges only the files this task wrote, used
to decide whether the work was good. The same rule applies to volume targets:
"the bank needs twelve quiz questions" is a real requirement and no single task
can satisfy it, so it must never be the check that fails a task.

## Give the loop a dependency order

Weighted priorities alone will hand the agent work it cannot do. A study plan
is worth more than one quiz question, so a naive "highest weight first" loop
asks for the plan — and the agent, unable to fill it honestly, produces a plan
that satisfies the letter of the check. Declare that plans depend on a
populated question bank, and the loop asks for questions instead.

This is the most under-appreciated part of a harness. Most of what looks like
model dishonesty is a loop handing out blocked work.

## The failure modes you will actually hit

**Satisfying the measure instead of the goal.** The purest example: a check
that a study plan's steps add up to its declared budget is satisfiable by
declaring the budget to be thirty minutes. Nothing is lying — the arithmetic is
correct and the plan is worthless. The fix is an external anchor: a plan named
"three months" must declare a budget in a band that three months could mean.
Every internal-consistency check has this shape, and finding the anchor is the
real design work.

**The repeated tool call.** Weaker models re-issue the same read with the same
arguments and burn the whole iteration budget doing it. Cache tool results by
(name, arguments), return the cached answer with a sentence saying the call was
a repeat, and after two repeats take the tools away and demand the final
answer.

**The empty answer.** A reasoning model can return HTTP 200 with an empty
message because the entire token budget went to its private chain of thought.
Detect it — empty content plus a length stop — raise the budget once, retry,
and if it is still empty, say so rather than handing the guardrail a blank.

**The unavailable model.** On shared or free endpoints, 429 and 503 are
routine and rotate between models minute to minute. Name a fallback per role.

**Silence.** A loop that prints nothing for fifteen minutes is indistinguishable
from a hung one. Echo the instruction before each round and log every retry.

## Start smaller than feels worthwhile

The instinct is to harness the hard thing first. The better first target is a
task where the check is obvious and the work is boring: front matter schemas,
import paths, missing stories, alt text. You will learn more about your loop
from ten trivial tasks than from one ambitious one, and the guardrail you write
for the boring task is usually the one you keep.

## Practice

- [Write a guardrail for the ui-atom skill](../practice/harness-atom-guardrail.html)
  — build the checker, seed four broken atoms, and record how many attempts an
  agent needs to go green.
- Read `harness/README.md` in this repository: it is a working example of the
  contribution-scoped, dependency-ordered guardrail described above, with 42
  capabilities measured by one script.
- Then look at `templates/chota-react-redux` and ask which of its conventions
  you could turn into a check today.
