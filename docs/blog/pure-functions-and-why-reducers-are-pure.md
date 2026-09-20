---
title: "Pure functions, and why a reducer has to be one"
layout: post
slug: pure-functions-and-why-reducers-are-pure
date: 2026-09-04
author: The Elegant team
category: terminology
tags: [state, redux, reducers, functional]
description: A reducer that reads the clock, mutates its input, or fires a request is not a reducer — it is a bug. The purity rule is what makes state predictable, testable, and time-travellable.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [counter-reducer, combine-reducers, memoized-selector]
---

A pure function has two properties: given the same inputs it always returns the
same output, and it causes no side effects — it doesn't read the clock, generate
a random number, mutate its arguments, call an API, or log to a server. A reducer
is required to be pure, and this is not dogma. Every valuable thing Redux gives
you — predictable state, trivial tests, time-travel debugging, safe re-renders —
is a *consequence* of that one rule. Break purity and you don't just bend a
guideline; you turn off the features you adopted Redux for.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="pf-t pf-d" class="blog-figure__svg">
  <title id="pf-t">A pure reducer maps state and action to a new state with no outside reads or writes</title>
  <desc id="pf-d">State and action go into the reducer, a new state comes out. Side effects — clock, random, fetch, mutation — are shown crossed out because a pure reducer touches none of them.</desc>
  <rect x="30" y="70" width="90" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="75" y="92" text-anchor="middle" fill="#155799" font-size="11">state</text>
  <rect x="30" y="115" width="90" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="75" y="137" text-anchor="middle" fill="#155799" font-size="11">action</text>
  <path d="M120 87 L200 105" stroke="#819198" stroke-width="2" marker-end="url(#pf-a)"/><path d="M120 132 L200 112" stroke="#819198" stroke-width="2" marker-end="url(#pf-a)"/>
  <rect x="200" y="82" width="150" height="52" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="275" y="113" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">reducer (pure)</text>
  <path d="M350 108 L430 108" stroke="#819198" stroke-width="2" marker-end="url(#pf-a)"/>
  <rect x="430" y="82" width="130" height="52" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="495" y="113" text-anchor="middle" fill="#c2571a" font-size="11">new state</text>
  <g font-size="10" fill="#c2571a"><text x="275" y="165" text-anchor="middle">✗ clock  ✗ random  ✗ fetch  ✗ mutate input</text></g>
  <defs><marker id="pf-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>State + action in, new state out — and nothing else in or out. The crossed items are exactly what makes a reducer stop being a reducer.</figcaption>
</figure>

## The three ways reducers go impure

Almost every impure reducer commits one of three sins. It **reads a nondeterministic
source**, so the same action gives different results; it **mutates its input**,
so React's reference check can't see the change; or it **performs a side effect**,
so replaying actions fires it again. Here is all three, and the fix:

```js
// IMPURE — reads the clock, mutates state, and fires a request
function todos(state, action) {
  if (action.type === "ADD") {
    state.items.push({ text: action.text, at: Date.now() });  // mutate + clock
    fetch("/api/todos", { method: "POST" });                  // side effect
    return state;
  }
  return state;
}
```

```js
// PURE — deterministic inputs, a new array, no effects
function todos(state, action) {
  if (action.type === "ADD") {
    return { ...state, items: [...state.items, action.item] }; // caller made `item`
  }
  return state;
}
```

Notice the timestamp and the request didn't vanish — they *moved*. The `at` field
is computed in the action creator (where reading the clock is fine), and the
`fetch` moves to a thunk or saga. The reducer's only job is the transition. This
is the key mental shift: purity does not forbid side effects, it *relocates* them
to the edges — action creators, middleware, effects — and keeps the core state
logic a clean function you can reason about in isolation. When a reducer feels
like it "needs" to do something impure, that is the signal a step belongs one
layer out, not that the rule is inconvenient.

## Purity is what makes the tests trivial

Because a pure reducer is just input-to-output, a test needs no store, no mocks,
no framework — you call it and assert on the return value:

```js
const next = todos({ items: [] }, { type: "ADD", item: { text: "x" } });
expect(next.items).toEqual([{ text: "x" }]);   // no setup, no teardown, no clock
```

That same property is what lets Redux DevTools replay your action log and land on
exactly the state you had — time travel only works because re-running the reducers
is guaranteed to reproduce the same states. And immutability, the "return a new
object" half of purity, is what lets React and `reselect` detect a change with a
`===` reference check instead of a deep comparison. So the purity rule is load-
bearing: it is the single constraint that predictability, testability, and cheap
change-detection all rest on. The counter-reducer exercise is the cleanest place
to feel it — a reducer with nothing in it but a pure transition.
