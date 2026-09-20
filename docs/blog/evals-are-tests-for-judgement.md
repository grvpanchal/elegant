---
title: "Evals are tests for the things unit tests can't check"
layout: post
slug: evals-are-tests-for-judgement
date: 2026-08-04
author: The Elegant team
category: ai-and-frontend
tags: [ai, evals, quality, testing]
description: 'A unit test checks that a function returns the right value. An eval checks that a piece of prose, a design, or an AI output meets a standard you can describe but not compute. As AI writes more, evals become as important as tests.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-skill-eval, harness-atom-guardrail]
---

A unit test answers a computable question: given this input, does the function
return this output? Plenty of things you care about are not computable that way —
is this explanation clear, is this component the right abstraction, is this AI
output actually good or just fluent? An **eval** is a test for those: a set of
cases plus a way to judge each one against a standard you can describe even when
you cannot express it as an equality assertion. In an age where AI produces prose,
designs, and code, evals matter as much as tests.

## When a boolean assertion isn't enough

"Is this blog post generic AI slop or genuinely specific?" has no `expect(x).toBe`
form. Neither does "does this solution explain its trade-offs" or "is this
component accessible in practice." These are real quality bars, and pretending
they do not exist because they are not a unit test is how slop and subtle wrongness
ship. An eval makes the bar explicit: a rubric, a set of example cases with known
verdicts, and a judge — human, or a model constrained to a rubric, or a
deterministic scorer — that grades against it. The point is to make a fuzzy
standard measurable and repeatable, not to pretend it is boolean.

## The cases are the specification

The most valuable part of an eval is the case set, because it pins down what you
actually mean by "good." A good eval includes positive cases (this should pass),
negative cases (this should fail), and edge cases that probe the boundary. Writing
those cases forces you to say precisely what the standard is — which is exactly
the work people skip when they wave at "quality." A slop-detection eval needs
genuine posts *and* plausible slop, so it proves it can tell them apart rather than
just rejecting everything. "Refuses everything" is not discernment, and only a
negative-and-positive case set catches that.

## Judges, and their limits

The judge can be a human (accurate, slow, inconsistent across time), a rubric-
constrained model (fast, cheap, must be validated against human judgement), or a
deterministic scorer (repeatable, only works for the mechanizable parts). Each has
a place, and the honest caveat is that a model judge's calibration is not
correctness — a confident verdict can still be wrong, so a model-judged eval is
one signal, never the only one. The discipline is to know which kind of judge your
standard needs and to validate it, rather than trusting a number because it came
out of a model.

## Evals turn "quality" into a metric you can track

The payoff is that a fuzzy goal becomes a number you can watch over time. You can
see the eval score move when you change a prompt, catch a regression when a
refactor makes outputs worse, and hold a floor the way a test suite holds
behaviour. That is what lets an AI-heavy workflow stay honest: the code has unit
tests, and the judgement-shaped outputs have evals, and both run in the loop. The
skill-eval exercise has you write an eval set with a threshold — the exact
artifact this describes — and the atom-guardrail exercise is its computable cousin
for the parts that *are* boolean.
