---
title: "Immutability is how you detect change cheaply"
layout: post
slug: immutability-is-how-you-detect-change-cheaply
date: 2026-09-03
author: The Elegant team
category: terminology
tags: [state, immutability, performance, react]
description: Immutable updates are not about purity for its own sake. They let the framework decide 'did this change?' with a reference check instead of a deep scan — which is what keeps re-renders bounded.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [counter-reducer, memoized-selector, normalize-entities]
---

Beginners hear "always return new state, never mutate" as a ritual. It is
actually a performance contract. When state is immutable, "did this change?"
becomes `oldRef !== newRef` — a single reference comparison. When state is
mutated in place, the reference is the same even though the contents changed, so
the only honest way to detect a change is to walk the whole structure. Immutable
updates trade a little allocation for very cheap change detection, and modern UI
frameworks are built on that trade.

## The reference-equality shortcut

React's `memo`, `useMemo`, `useCallback`, and a store's `connect`/`useSelector`
all decide whether to re-render or recompute by comparing references. If you
mutate an array and return the same reference, they conclude "nothing changed"
and skip the update — the classic "my state changed but the UI didn't" bug.
Return a new array and the reference differs, so they update. The whole
optimization layer depends on you never mutating.

## Structural sharing keeps it cheap

The worry is "won't copying everything be slow?" No — because you only copy the
path that changed. Updating one item in a list means a new array and a new object
for that item; every other item keeps its old reference. This is *structural
sharing*: the new state shares most of its structure with the old one, so a deep
tree costs a shallow copy. That is also why selectors can memoize effectively —
the branches that did not change compare equal, so derived values are not
recomputed.

## The selector connection

Immutability and memoized selectors are two halves of the same performance story.
A memoized selector caches its computed result and only recomputes when its
inputs change — and it decides "changed" by reference equality, the exact
shortcut immutability enables. So a selector that derives a sorted, filtered list
recomputes only when the underlying slice gets a new reference, which happens
only when that slice actually changed, because you updated it immutably. Mutate
the slice in place and the selector sees the same reference, skips the recompute,
and serves a stale result — the same class of bug as a skipped re-render, one
layer down. This is why the two techniques are always taught together: immutable
updates make change detectable by reference, and selectors cash in that
detectability to avoid recomputing derived data. Neither works without the other
holding up its end.

## Writing it without footguns

Spread to copy, then change the copy: `{ ...state, count: state.count + 1 }`,
`[...list, item]`, `list.map(x => x.id === id ? { ...x, done: true } : x)`. Avoid
`push`, `splice`, `sort` (which mutates!), and direct property assignment on
state. For deeply nested state, the spread ceremony gets ugly — which is a signal
to either normalize the shape flatter or use an immutable-update helper that lets
you write mutating-looking code that produces new references underneath.

The rule to internalize: a new reference means "changed," a same reference means
"identical," and the framework believes you. Break the rule and you either lose
updates or lose the performance the whole model was designed to give you. The
memoized-selector and normalize-entities exercises are where this pays off.
