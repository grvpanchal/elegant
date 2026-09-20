---
title: "AI-generated tests need a human oracle"
layout: post
slug: ai-generated-tests-need-a-human-oracle
date: 2026-07-30
author: The Elegant team
category: ai-and-frontend
tags: [ai, testing, quality, evals]
description: 'A model is great at writing test scaffolding and terrible at deciding what "correct" is. Ask it to test existing code and it will assert that the current behaviour — bugs and all — is right. The oracle has to be you.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-skill-eval, debounce-utility, deep-clone]
---

"Have the AI write the tests" sounds like a clean win, and it is half a win. A
model is genuinely good at the mechanical part of testing — the boilerplate, the
setup, the obvious cases, the arrange-act-assert structure. It is unreliable at the
part that actually matters: being the *oracle*, the thing that decides what the
correct answer is. Point it at existing code and it will confidently assert that
the code's current behaviour, bugs included, is correct.

## Tests encode a decision about correctness

Every assertion is a claim: "the right answer here is X." That claim has to come
from somewhere that knows what right *means* — a spec, a requirement, a human's
understanding of the domain. When a model writes tests by reading the
implementation, it derives the expected values *from the implementation*, so the
test says "the code does what the code does." That tautology passes forever and
catches nothing, including the bug that was already there when the test was
written. The test looks like coverage and is actually a snapshot of current
behaviour with no opinion about whether that behaviour is right.

## Where AI genuinely helps with tests

The productive division of labour: let the model generate the *structure* and the
*cases*, and you supply the *oracle*. It is good at enumerating cases you might
forget — empty input, boundary values, the cyclic object, the concurrent call —
which is real value, because thinking of cases is half of testing. Then you decide
what each case should return, based on the spec, not the code. For a debounce, the
model can propose "test the trailing call, test cancellation, test rapid
retriggers"; you decide that the trailing call must fire with the *last*
arguments, because that is the requirement, not because that is what the code
happened to do.

## Write the test before or against the intended behaviour

The reliable pattern is to make the oracle independent of the implementation.
Write (or have the model write) the test against the *specification* — ideally
before or alongside the code, so the expected values come from what it should do,
not what it does. When testing existing code, review every asserted value against
your understanding rather than accepting the model's derived expectations. A test
suite is only as trustworthy as the source of its expected answers, and if that
source is the code under test, the suite is decorative.

## This is why evals exist for judgement

The same principle scales up to non-boolean quality: when "correct" is a matter of
judgement rather than an equality, you need an eval with a rubric and cases whose
verdicts *you* set, not the model. A slop check written and judged entirely by a
model proves nothing; one with human-set positive and negative cases proves
discernment. Keep the oracle human — or at least human-validated — whether you are
writing unit tests or evals. The skill-eval exercise is exactly this discipline for
prose, and the debounce and deep-clone exercises are where AI-proposed cases with
human-set expectations catch the edges that matter.
