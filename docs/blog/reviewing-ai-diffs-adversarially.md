---
title: "Review an AI diff adversarially: assume it works and looks for the catch"
layout: post
slug: reviewing-ai-diffs-adversarially
date: 2026-08-07
author: The Elegant team
category: ai-and-frontend
tags: [ai, review, quality, architecture]
description: 'The question for an AI diff is never "does it run" — it usually does. It is "what would make this wrong that the tests do not cover?" Reviewing AI code well means reading it looking for the plausible-but-broken.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-a11y-gate, harness-state-shape, presentational-vs-container]
---

Reviewing human code, you assume good intent and look for mistakes. Reviewing AI
code, you should assume it *works on the happy path* — it usually does — and hunt
for the plausible-but-wrong: the missing edge case, the leaked concern, the subtle
violation the tests do not cover. The model optimizes for producing working code,
not correct code, and the gap between those two is exactly what your review has to
find.

## "Does it run" is the wrong question

AI is very good at producing code that runs and passes the obvious tests. So
"does it run" tells you almost nothing — of course it runs. The useful question is
adversarial: what input, what state, what interaction would make this wrong? A
debounce that ignores the trailing call runs fine until you need the last value. A
deep clone that chokes on a cycle runs fine until the data has one. A component
that works with a mouse runs fine until someone uses a keyboard. The model will
not surface these; you have to go looking, precisely because the code *looks*
finished.

## Watch for leaked concerns

The most common architectural violation in AI diffs is a concern in the wrong
place. A presentational component that quietly fetches. A store read inside a
component that should have received a prop. Business logic in a reducer's
neighbour that should have been in the reducer. These do not fail tests — the code
works — so they slip through unless you are specifically checking the *shape* of
the change against your architecture. Read the diff asking "is each thing in the
layer it belongs to?" not just "does each thing do what it says?"

## Distrust confident-looking correctness

A human who is unsure hedges, adds a comment, leaves a TODO. A model is fluent
whether it is right or wrong, so its confidence carries no signal. The comment
that says "handles all edge cases" is not evidence it handles all edge cases; the
variable named `sanitizedInput` is not evidence the input was sanitized. Verify
the claims the code makes about itself rather than trusting the tone. This is the
single hardest habit to build, because fluent wrong code is genuinely convincing —
which is why you offload the verifiable parts to checks instead of eyeballs.

## Offload what a machine can check

You cannot hold every rule in your head across a flood of AI diffs, and you
should not try. The parts that are mechanical — accessibility attributes, store
imports in the UI layer, store shape, bundle size, link resolution — belong in
guardrails that run on every diff and never get tired at 5pm. That frees your
adversarial reading for the parts a machine cannot judge: is this the right
abstraction, does this edge case matter, is this the design we want. The a11y-gate
and state-shape exercises build exactly the mechanical checks, so your review can
spend itself where human judgement is actually required.
