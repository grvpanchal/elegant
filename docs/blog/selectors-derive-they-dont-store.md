---
title: "Selectors derive; they don't store"
layout: post
slug: selectors-derive-they-dont-store
date: 2026-08-31
author: The Elegant team
category: terminology
tags: [state, selectors, memoization, performance]
description: A selector is a function from state to a derived value. Used well, it is the seam that lets you reshape state without touching components — and memoized, it keeps derived data cheap.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [memoized-selector, selector-memoization, normalize-entities]
---

A selector is a small function that takes the store's state and returns some view
of it — the visible todos, the cart total, the current user's unread count.
Selectors sound trivial, and teams that skip them pay for it: components reach
directly into the state shape, so every shape change breaks every component that
reached in. A selector is the seam that stops that.

## The indirection that pays off

When a component reads `state.entities.users[state.session.currentId].name`, it
has hard-coded your entire state shape. Normalize the users differently next
month and that line, and dozens like it, break. Route the read through
`selectCurrentUserName(state)` and the shape lives in one function. Change the
shape, fix the selector, and every component keeps working untouched. This is the
same argument as any other abstraction boundary: put the thing that changes
behind a function so its blast radius is one file.

## Derive, never duplicate

Selectors are also how you honour "store the minimum, derive the rest." The
filtered list, the total, the grouped view, the sorted order — none of these
belong in the store, because storing them creates a sync obligation. They belong
in selectors, computed from the stored facts on read. A selector that composes
other selectors — `selectVisibleTodos` built on `selectAllTodos` and
`selectFilter` — keeps each piece small and lets you test the derivation in
isolation with plain inputs.

## Memoize the expensive ones

The obvious worry is cost: if `selectVisibleTodos` sorts and filters on every
render, does that not get slow? Yes, which is why non-trivial selectors are
memoized. A memoized selector caches its last inputs and output and recomputes
only when the inputs change by reference — the exact shortcut immutable state
enables. So a component re-rendering for an unrelated reason gets the cached
result instantly, and the sort runs only when the underlying data actually
changed. Get the input selectors right and memoization is nearly free; get them
wrong (returning a new object every call) and it never caches, which is the most
common selector bug.

The mental model: the store holds facts, selectors turn facts into the shapes
your UI needs, and memoization makes that turning cheap. Components should read
through selectors, not into state, so the shape stays private and changeable.
The memoized-selector exercise builds one that only recomputes when it must, and
selector-memoization drills the reference-equality trap that defeats caching. The rule that keeps a codebase
clean is short: components read through selectors, never into raw state, and any
selector that sorts, filters, groups, or maps gets a memoization wrapper so the
work runs only when its inputs genuinely change rather than on every render.
