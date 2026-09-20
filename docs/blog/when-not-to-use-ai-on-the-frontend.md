---
title: "When not to use AI on the frontend"
layout: post
slug: when-not-to-use-ai-on-the-frontend
date: 2026-08-02
author: The Elegant team
category: ai-and-frontend
tags: [ai, judgement, architecture, workflow]
description: 'Using AI well includes knowing when not to. There are tasks where a model is slower, riskier, or actively misleading, and reaching for it there is not sophistication — it is a mistake that costs you more than typing would have.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-state-shape, presentational-vs-container]
---

Enthusiasm for AI has an under-discussed failure mode: using it for tasks where it
is the wrong tool. Knowing when *not* to reach for the model is as much a skill as
prompting it well, and the cases where it hurts are fairly predictable once you
name them.

## The one-line change you understand completely

If you know exactly what to type and it is a few lines, type it. Prompting the
model, waiting, reading its output, and verifying it is slower than just making the
change — and it introduces a review step for something you would have gotten right
directly. AI earns its keep on tasks with enough surface that generation beats
typing; on a rename, a conditional, a small fix you can see in your head, it is
pure overhead. The tell is when you spend longer describing the change than the
change would have taken.

## Anything where a confident wrong answer is expensive

The model produces fluent output whether it is right or wrong, so it is dangerous
precisely where being subtly wrong is costly and hard to catch. Security-sensitive
code — auth flows, token handling, input sanitization, permission checks — is the
clearest case: a plausible-looking auth check that is subtly broken is worse than
no check, and the model has no way to signal its uncertainty. Here the risk is not
that it fails obviously; it is that it fails convincingly. Write these yourself,
or treat any AI draft as untrusted until you have verified it line by line against
the actual threat.

## Decisions that require holding your whole system

Architecture is the model's structural blind spot because it has no stake in and
no memory of your system's shape. "Where should this state live," "should this be
a new service or a slice of the existing one," "does this belong in the design
system" — these require holding the whole system in mind and caring about its
evolution, and the model does neither. It will give you a plausible answer that
optimizes the local task and quietly degrades the global structure. Make the
architectural calls yourself; use the model to implement them once made.

## When you cannot verify the output

The deepest rule: do not use AI for something you cannot check. If you lack the
knowledge to tell whether the output is correct, the model has not helped you — it
has given you something you must now trust blindly, which is worse than not having
it, because it *looks* authoritative. AI amplifies a verifier; it does not replace
one. Where you can verify (you know the domain, or you have a guardrail that
checks), generate freely. Where you cannot, either build the ability to verify
first or do it yourself. The state-shape exercise is the kind of thing you should
be able to check by hand before you trust a model to touch it, and
presentational-vs-container is exactly the architectural call the model should not
be making for you.
