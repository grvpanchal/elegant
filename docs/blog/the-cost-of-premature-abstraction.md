---
title: "The cost of premature abstraction: wrong is more expensive than repeated"
slug: the-cost-of-premature-abstraction
layout: post
date: 2026-06-16
author: The Elegant team
category: architecture
tags: [architecture, abstraction, maintainability, craft]
description: 'Pulling two similar bits of code into a shared abstraction feels responsible. Do it too early, before you know how they will actually diverge, and you build the wrong abstraction — which costs more than the duplication ever would.'
cover: /assets/img/atomic-design.png
reading_minutes: 4
related_practice: [presentational-vs-container, combine-reducers]
---

You write a component, then a second one that looks similar, and the instinct kicks
in: extract the shared part into a reusable abstraction. Often that is right. Done
too early — before you actually understand how the two cases will diverge — it is a
classic and expensive mistake, because the wrong abstraction is harder to live with
than the duplication it replaced. "A little duplication is cheaper than the wrong
abstraction" is one of the more valuable things experience teaches.

## Two similar things are not necessarily one thing

Two pieces of code that look alike today may be alike by coincidence, not by nature —
they might evolve in completely different directions once real requirements arrive.
Abstract them together prematurely and you have coupled two things that wanted to be
separate, so the next requirement for one forces awkward changes on the other. You
end up with an abstraction bristling with flags and special cases (`if (variantA)…`)
as each caller's divergence gets bolted on — which is the wrong abstraction wearing
the costume of reuse. The duplication you feared would have let each evolve freely.

## The wrong abstraction is stickier than duplication

Duplication is easy to fix: when two copies genuinely need to converge, you can merge
them once you understand how. The wrong abstraction is much harder to undo, because
callers now depend on it, its flags encode assumptions, and unwinding it means
untangling everyone who uses it. So the asymmetry is: premature abstraction risks a
costly, sticky mistake to avoid a cheap, easily-fixed one. When in doubt, duplicate
and wait — the duplication is a reversible bet, the abstraction is not.

## Wait for the third case

A useful rule of thumb is the "rule of three": do not abstract on the second
occurrence, wait for the third. Two data points cannot tell you the shape of the
variation; three start to reveal what actually stays the same and what differs, so
the abstraction you build is informed by real divergence rather than guessed. By the
third use you can see the true seam — the part that is genuinely common versus the
part each caller customizes — and the abstraction fits instead of fighting. Extracting
on the second use is guessing the seam; extracting on the third is observing it.

## Some abstractions are worth building up front

This is not license to never abstract or to copy-paste forever — that has its own
compounding cost, especially with AI generating near-duplicates fast. The judgement is
about *confidence*: architectural boundaries you understand well (the container line,
the store, a design-system primitive) are worth establishing early because you know
their shape. Incidental similarity between two feature components is worth leaving
duplicated until the pattern proves itself. The skill is telling a known, load-bearing
abstraction from a speculative one — and defaulting to "duplicate and wait" when you
are not sure. The presentational-vs-container split is a known-good abstraction worth
early; combine-reducers shows composition that is safe because the boundary (one slice
per reducer) is well understood.
