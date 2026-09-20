---
title: "Memoization is just caching with a key you have to get right"
slug: memoization-is-caching-with-a-key
layout: post
date: 2026-06-30
author: The Elegant team
category: terminology
tags: [ui, performance, memoization, react]
description: 'Memoization caches a result against its inputs and returns the cache when the inputs repeat. Simple — except the whole thing depends on comparing inputs correctly, which is where most memoization quietly does nothing.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [memoized-selector, selector-memoization, debounce-utility]
---

Memoization is caching wearing a fancier name: remember the result of a computation
against its inputs, and when the same inputs come again, return the remembered
result instead of recomputing. The idea is trivial. The reason memoization so often
does nothing — or worse, adds overhead while providing no benefit — is entirely in
the part everyone glosses over: how you decide whether the inputs are "the same."

## Cache keyed by inputs

A memoized function stores its last inputs and last output. On each call it compares
the new inputs to the stored ones; if they match, it returns the stored output; if
not, it recomputes and updates the store. So the whole mechanism rests on the
comparison. For a selector deriving a filtered list, memoization means "if the list
and the filter are unchanged, don't re-filter" — which is pure win *if* "unchanged"
is decided cheaply and correctly. The comparison is the entire ballgame.

## Reference equality and why it usually works

In practice the comparison is reference equality (`===`), because comparing deeply
would cost as much as recomputing. Reference equality is cheap and correct *when your
data is immutable*: an unchanged array is the same reference, a changed one is a new
reference, so `===` answers "changed?" perfectly. This is the deep connection between
immutability and memoization — the first makes the second cheap. It also means the
number-one memoization bug is passing a *new* object or array literal as an input
every time (`{}`, `[]`, an inline arrow function), because a fresh reference never
equals the last one, so the cache never hits and you recompute every call while
paying the comparison cost on top.

## The wins and the traps

Used right, memoization keeps derived data and expensive renders from recomputing
when nothing relevant changed — a memoized selector that only re-filters when the
data changes, a memoized component that only re-renders when its props change. Used
wrong, it is pure overhead: every `useMemo` and `memo` costs a comparison and some
memory, and if the inputs change every render (the new-reference trap) you pay that
cost for a cache that never hits. Memoizing everything by reflex is a real
anti-pattern — it adds cost without benefit and clutters the code.

## Memoize the expensive, stabilize the inputs

The discipline is twofold: memoize where the computation or the render is genuinely
expensive (not trivial ones, where the comparison costs more than the work), and make
sure the inputs are stable references so the cache actually hits — memoize the objects
and callbacks you pass in, or lift them out so they are not recreated each render. A
memoization that never hits and a computation that was never expensive are the two
ways this goes wrong. The memoized-selector exercise builds a correct one, and
selector-memoization drills the reference-stability trap that silently defeats it.
