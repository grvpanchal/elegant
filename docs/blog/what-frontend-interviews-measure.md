---
title: "What frontend interviews actually measure"
layout: post
slug: what-frontend-interviews-measure
date: 2026-09-15
author: The Elegant team
category: interview
tags: [interview, career, ui, state, system-design]
description: Frontend interviews are not quizzing you on trivia. Each round probes a specific axis — API recall, UI construction, state modelling, and trade-off reasoning — and knowing which is which is half the preparation.
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [accessible-combobox, debounce-utility, design-search-experience, normalize-entities]
---

Candidates who struggle with frontend interviews often prepare for the wrong
thing — grinding algorithm puzzles for a loop that never asks one, or memorising
API surface for a round that cares about structure. The loop is legible once you
see that each round measures a distinct axis. Prepare per axis and the whole
thing stops feeling like a lottery.

## The coding round: can you build correct behaviour from scratch?

This is the utility round — a debounce, an event emitter, a deep clone, a
reducer. It looks like trivia, but the interviewer is watching for something
specific: do you handle the edge that the naive version misses? A debounce that
ignores the trailing call, an emitter that leaks listeners, a clone that chokes
on cycles. The signal is not "did it work on the happy path" but "did you see the
case that breaks it." Say the edge cases out loud before you code; that narration
is most of the score.

## The UI coding round: can you build an accessible, stateful component?

Here you build something real in the browser — a combobox, a sortable table, an
infinite list. Two things separate a pass from a fail. First, **accessibility as
you go**, not bolted on: the right roles, keyboard operation, focus management. A
combobox you can only drive with a mouse is not finished. Second, **state kept
where it belongs** — local UI state in the component, shared state lifted, no
tangle. Interviewers notice when a component's state model is coherent because
they have seen so many that are not.

## The system design round: can you reason about trade-offs?

No code here — the round is about judgement. Design a search-as-you-type, a
localized app, a set of micro-frontends. There is no single right answer, and
saying "it depends" is fine *only* if you then say what it depends on. Name the
axis — latency versus freshness, bundle size versus flexibility, server render
versus client — pick a side, and justify it. The failure mode is listing options
without ever committing; the pass is a defended decision.

### A note on data shape

System design rounds frequently hinge on how you model data. Normalising a nested
API response so the UI can index entities by id, rather than walking a tree on
every render, is the kind of move that signals you have built something real. It
comes up disguised as a dozen different prompts.

## The behavioural round: can you work with people?

Underrated by engineers, weighted heavily by companies. This round asks whether
you can describe a real conflict, a real failure, and what you did about it,
without either blaming everyone or taking blame for physics. Prepare two or three
concrete stories with specifics — a number, a decision, an outcome — because the
vague version reads as invented.

## How to prepare, per axis

Map your practice to the axes rather than to a pile of random questions. Drill a
few utilities until edge-case narration is automatic. Build two or three
accessible components end to end, keyboard included. Talk through a couple of
system designs out loud, forcing yourself to commit to a side each time. Write
your behavioural stories down.

The interviewers are not trying to trick you. Each round is a different question
about whether you can do the job. Answer the question the round is actually
asking, and the loop becomes a set of solvable problems instead of an ordeal.
