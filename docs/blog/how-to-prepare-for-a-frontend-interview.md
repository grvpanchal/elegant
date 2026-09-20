---
title: "How to prepare for a frontend interview without boiling the ocean"
layout: post
slug: how-to-prepare-for-a-frontend-interview
date: 2026-07-22
author: The Elegant team
category: career
tags: [interview, career, preparation, practice]
description: 'Most candidates prepare by grinding random problems and hoping. The loop is legible: prepare per round — utilities, UI components, system design, behavioural — and drill the specific muscle each one tests.'
cover: /assets/img/ui-server-state.png
reading_minutes: 4
related_practice: [accessible-combobox, debounce-utility, design-search-experience]
---

The wrong way to prepare for a frontend interview is to grind a random pile of
problems and hope the overlap is enough. The loop is more legible than that: it is
a small number of distinct rounds, each testing a specific muscle, and you prepare
far more efficiently by training per round than by grinding indiscriminately.

## Map the rounds first

Before practicing anything, find out the actual loop for the companies you are
targeting — most publish or reliably leak it. A typical frontend loop has a
JavaScript/utility coding round, a UI component-building round, a system design
round, and a behavioural round; some add a DSA round or a take-home. Each tests
something different, so "practice for the interview" is really four different
preparations. Knowing the shape stops you from over-indexing on algorithms for a
loop that mostly builds UI, which is the most common misallocation.

## Drill utilities until narration is automatic

For the coding round, build a stock of the classic utilities from scratch — a
debounce, a throttle, an event emitter, a deep clone, a promise pool, a simple
store. The goal is not memorization; it is that the edge cases become automatic.
When you can write a debounce and, without thinking, say "I'll handle the trailing
call and add cancellation," you have the round's real signal — because the
interviewer is scoring whether you *see* the edges, not whether the happy path
compiles. Practice saying the edges out loud as you code; that narration is most of
the score.

## Build a few components end to end

For the UI round, build two or three components fully accessible and stateful — a
combobox, a set of tabs, a sortable table, a modal. Fully means keyboard-operable,
correct roles and names, managed focus — not just visually done. This is where most
candidates are weakest, because tutorials stop at "it looks right," and it is where
you can most differentiate by getting the invisible parts (the accessibility tree,
the focus management) correct. Build them until the accessibility is muscle memory,
not an afterthought you bolt on when reminded.

## Rehearse design and behaviour out loud

The system design and behavioural rounds are not coding, so practicing them by
writing code is a mistake — you practice them by *talking*. For design, take a
prompt (a search-as-you-type, a localized app, a set of micro-frontends), and
narrate a solution that names the trade-offs and commits to a side, out loud,
timed. For behavioural, write down two or three concrete stories — a conflict, a
failure, a hard decision — with specifics, and rehearse telling them. Both rounds
reward fluency you can only build by speaking, not by reading. Space this practice
over weeks, drill the rounds you are weakest at, and the interview stops being a
lottery and becomes a set of solvable problems. The combobox, debounce, and
search-experience exercises are exactly the per-round practice this describes.
