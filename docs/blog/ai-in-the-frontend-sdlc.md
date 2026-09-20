---
title: "Where AI actually fits in the frontend development lifecycle"
layout: post
slug: ai-in-the-frontend-sdlc
date: 2026-08-09
author: The Elegant team
category: ai-and-frontend
tags: [ai, workflow, guardrails, sdlc]
description: 'AI is not one thing you bolt onto the end of development. It shows up at every stage — scaffolding, implementing, reviewing, testing — and it is strong at some and dangerous at others. Knowing which is the whole skill.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-skill-eval, harness-atom-guardrail, harness-a11y-gate]
---

Teams talk about "using AI" as if it were a single decision, but a model touches
the frontend lifecycle at several distinct stages, and its usefulness varies
wildly between them. Mapping where it helps and where it hurts is more useful than
any blanket policy, because the answer is different at each stage.

## Scaffolding and implementation: strong

At the start of a well-scoped task, a model is genuinely fast and good. Give it a
clear boundary — "a debounce utility with a trailing call and cancellation," "a
loading button atom with these props and this accessible name" — and it produces
competent code quickly. This is the inside of a well-drawn box, and it is where
the leverage is real. The quality tracks the sharpness of the boundary: a precise
spec gets precise code; "add search" gets a component that fetches its own data
and reaches across every seam you were keeping separate.

## Review and verification: this is the human's job

The model is weak exactly where it matters most: judging whether a diff is right
in the ways tests do not cover. It has no stake in your architecture, so it will
happily produce working code that violates your design — a data fetch in an
organism, state colocated where it should be lifted, a missing accessible name.
And it cannot tell you what it got subtly wrong with calibrated confidence; a
fluent wrong answer looks identical to a fluent right one. So the review stage
does not get automated away by AI — it becomes *more* important, because there is
more code, produced faster, by something that does not care whether it fits.

## Testing: useful with a human oracle

AI is good at generating test *scaffolding* — the boilerplate, the obvious cases,
the arrange-act-assert structure. It is unreliable as the *oracle*, the thing that
decides what the correct answer is, because it will cheerfully assert that the
current (possibly buggy) behaviour is correct. Use it to write the cases; keep a
human deciding what "pass" means. A test suite an AI wrote and an AI judged proves
only that the code does what the code does.

## The stage that makes the rest safe

The move that turns AI from a liability into a multiplier is at the boundary
between implementation and merge: **executable guardrails**. Encode your
architectural rules as checks that run on every diff — no store imports in the UI
layer, every atom has an accessible name, the bundle stays under budget, links
resolve. Then the model can generate freely and a script, not a tired reviewer,
enforces the boundary. This is the whole thesis of this site: measure the work so
an agent can do it and a check decides if it is good enough. Get the guardrails
right and AI's speed stops being dangerous, because the boundary is a test rather
than a tradition. The harness exercises are where you build exactly those checks.
