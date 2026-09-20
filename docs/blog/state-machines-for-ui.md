---
title: "State machines turn impossible UI states into unreachable ones"
slug: state-machines-for-ui
layout: post
date: 2026-06-22
author: The Elegant team
category: terminology
tags: [ui, state, patterns, reliability]
description: 'A pile of booleans can represent nonsense — loading and error true at once. A state machine names the legal states and the transitions between them, so the impossible combinations simply cannot occur.'
cover: /assets/img/state-system-diagram.png
reading_minutes: 4
related_practice: [tabs-molecule, toast-notifications, offline-first-list]
---

Model a component's status with independent booleans — `isLoading`, `isError`,
`isSuccess`, `isEmpty` — and you have quietly created a space of sixteen
combinations, most of which are nonsense. Loading *and* error at once? Success *and*
empty? The booleans let you represent states that should be impossible, and the bugs
are exactly those impossible states leaking onto the screen. A state machine fixes
this by naming the legal states and the transitions between them, so the nonsense
combinations cannot be constructed.

## Booleans multiply; states enumerate

Four booleans is 2⁴ = 16 combinations, and you meant for maybe four of them to be
valid. Every render has to defensively handle the invalid ones or risk showing a
spinner over an error, and every state update risks setting an incoherent
combination. A state machine replaces the booleans with a single `state` that is one
of a named set — `idle | loading | success | error` — so there *are* only four
states and the impossible ones are unrepresentable. You cannot be loading and errored
at once because `state` holds one value. The bug class disappears because the type
forbids it.

## Transitions are explicit and legal

The other half of a machine is the transitions: from `idle` you can go to `loading`;
from `loading` to `success` or `error`; from `error` back to `loading` (retry). You
name the events that cause each transition, and — crucially — transitions not in the
map simply do not happen. So a stray `SUCCESS` event while `idle` is ignored rather
than corrupting state, which kills a whole family of race-condition bugs (a late
response arriving after you moved on). The machine encodes not just the states but
the *rules for moving between them*, and illegal moves are no-ops by construction.

## Where machines earn their keep

Not every component needs a formal machine — a simple toggle is fine as a boolean.
Machines pay off where the state is genuinely multi-step and the illegal
combinations are real risks: async flows (the request lifecycle), multi-step forms
and wizards, media players, drag-and-drop, anything with modes. A tab set, a toast
that appears/dismisses/times-out, an offline sync that is idle/syncing/failed/queued
— these have real states and transitions, and modelling them as a machine makes the
behaviour legible and the edge cases handled by design rather than by scattered
guards.

## You do not need a library to start

The idea is more valuable than any tool. You can implement a small machine with a
reducer: a `state` field, an action per event, and a reducer that maps
(state, event) to the next state, ignoring illegal pairs. That alone gets you the
"impossible states are impossible" benefit. Dedicated state-machine libraries add
visualization, nested states, and guards for complex cases, but the entry cost is
just "model this as named states and explicit transitions instead of a bag of
booleans." The tabs and toast exercises both have real state worth modelling this
way, and the offline-first exercise has a sync lifecycle that is a textbook machine.
