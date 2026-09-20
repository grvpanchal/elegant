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
reading_minutes: 5
related_practice: [memoized-selector, selector-memoization, normalize-entities]
---

A selector is a function that takes the store's state and returns a value derived
from it: `selectCartTotal(state)`, `selectVisibleTodos(state)`. The discipline it
enforces is simple and easy to violate — **derive, don't store**. Anything you can
compute from existing state should be computed by a selector on read, not saved
as another field you have to keep in sync on write. The cart total is not a fact
to store; it is `items.reduce(...)`. Store it and you have created a second source
of truth that will drift the first time someone updates an item without
recomputing the total.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="sel-t sel-d" class="blog-figure__svg">
  <title id="sel-t">Selectors sit between raw state and components, deriving views on read</title>
  <desc id="sel-d">Raw normalised state on the left. Selectors in the middle derive total, visible list and count. Components on the right read only the derived values, never the raw shape.</desc>
  <rect x="30" y="70" width="110" height="70" rx="8" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="85" y="100" text-anchor="middle" fill="#155799" font-size="11">raw state</text><text x="85" y="118" text-anchor="middle" fill="#819198" font-size="10">normalised</text>
  <g fill="#e8f0f8" stroke="#157878" stroke-width="2" font-size="10" text-anchor="middle">
    <rect x="250" y="45" width="130" height="30" rx="5"/><text x="315" y="65" fill="#157878">selectTotal</text>
    <rect x="250" y="90" width="130" height="30" rx="5"/><text x="315" y="110" fill="#157878">selectVisible</text>
    <rect x="250" y="135" width="130" height="30" rx="5"/><text x="315" y="155" fill="#157878">selectCount</text>
  </g>
  <g stroke="#819198" stroke-width="2" marker-end="url(#sel-a)"><path d="M140 95 L245 60"/><path d="M140 105 L245 105"/><path d="M140 115 L245 150"/></g>
  <g stroke="#819198" stroke-width="2" marker-end="url(#sel-a)"><path d="M380 60 L490 90"/><path d="M380 105 L490 105"/><path d="M380 150 L490 120"/></g>
  <rect x="490" y="80" width="120" height="50" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="550" y="110" text-anchor="middle" fill="#c2571a" font-size="11">components</text>
  <defs><marker id="sel-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>State stays minimal and normalised; selectors are the seam that shapes it into what each component needs, on read.</figcaption>
</figure>

## The seam that decouples shape from components

The second reason selectors matter is refactoring. If a component reaches into
`state.cart.items` directly, then changing how the cart is stored — say,
normalising items into a `byId` map — means editing every component. Route every
read through a selector and the store's shape is hidden behind a function you can
change in one place:

```js
// the ONLY code that knows the raw shape lives here
export const selectItems = (state) => Object.values(state.cart.byId);
export const selectCartTotal = (state) =>
  selectItems(state).reduce((sum, i) => sum + i.price * i.qty, 0);

// the component knows only the selector's name and its return value
const total = useSelector(selectCartTotal);
```

Reshape the store, fix the selectors, and every component keeps working.

## Memoize the derivation so it isn't recomputed

Deriving on every read is fine until the derivation is expensive or the component
re-renders often. That is what memoized selectors (`reselect`) are for: compose an
output selector from input selectors, and the result is recomputed *only* when an
input's reference changes:

```js
import { createSelector } from "reselect";

export const selectVisibleTodos = createSelector(
  [selectItems, (state) => state.filter],     // inputs
  (items, filter) => items.filter((t) => t.status === filter)  // recomputed only on change
);
```

If `items` and `filter` are unchanged references, `selectVisibleTodos` returns the
*same array reference* it returned last time — which means the component that
depends on it does not re-render. That reference stability is the performance
payoff, and it only works because reducers keep state immutable.

## Keep state minimal, push logic into selectors

The healthiest stores are small: the irreducible facts, normalised, and nothing
that can be computed. Everything else — totals, filtered lists, counts, joins
across slices — lives in selectors. This keeps the write path simple (fewer fields
to update, fewer chances to desync) and puts the read-shaping where it belongs, in
composable functions you can test in isolation. The memoized-selector exercise
builds the `createSelector` chain above and is the fastest way to internalise why
a selector returning a fresh array every call quietly defeats the whole point.
