---
title: "combineReducers splits the store without splitting the truth"
layout: post
slug: combine-reducers-splits-the-store
date: 2026-08-23
author: The Elegant team
category: terminology
tags: [state, redux, reducers, architecture]
description: One state tree can still have many owners. combineReducers gives each slice its own reducer while keeping a single store — the trick is that each reducer sees only its slice, and that constraint is a feature.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [combine-reducers, normalize-entities, counter-reducer]
---

A single store does not mean a single giant reducer. As an app grows, one
`switch` statement handling every action for every slice of state becomes
unreadable. `combineReducers` is the answer: it lets each slice of the state tree
have its **own** reducer, while the store stays single. The subtle, important
detail is the constraint it imposes — each slice reducer sees *only its own
slice* of state, never the whole tree. That looks like a limitation and is
actually the feature: it makes every reducer independently understandable and
testable.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="cr-t cr-d" class="blog-figure__svg">
  <title id="cr-t">combineReducers routes each slice of state to its own reducer</title>
  <desc id="cr-d">One action fans out to user, cart and ui reducers; each receives only its own slice of state and returns its own new slice, which combine into one new state tree.</desc>
  <rect x="30" y="85" width="80" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="70" y="109" text-anchor="middle" fill="#157878" font-size="10">action</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#cr-a)"><path d="M110 100 L200 55"/><path d="M110 105 L200 105"/><path d="M110 110 L200 155"/></g>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2" font-size="10" text-anchor="middle">
    <rect x="200" y="38" width="140" height="34" rx="5"/><text x="270" y="59" fill="#155799">user(state.user)</text>
    <rect x="200" y="88" width="140" height="34" rx="5"/><text x="270" y="109" fill="#155799">cart(state.cart)</text>
    <rect x="200" y="138" width="140" height="34" rx="5"/><text x="270" y="159" fill="#155799">ui(state.ui)</text>
  </g>
  <g stroke="#819198" stroke-width="2" marker-end="url(#cr-a)"><path d="M340 55 L440 95"/><path d="M340 105 L440 105"/><path d="M340 155 L440 115"/></g>
  <rect x="440" y="80" width="160" height="50" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="520" y="103" text-anchor="middle" fill="#c2571a" font-size="11">{ user, cart, ui }</text><text x="520" y="120" text-anchor="middle" fill="#819198" font-size="9">one new state tree</text>
  <defs><marker id="cr-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Each reducer owns one key of the tree and is handed only that key's value; combineReducers reassembles their outputs into the single new state.</figcaption>
</figure>

## Each reducer owns one key and sees only its value

`combineReducers` takes a map from state key to reducer. When an action is
dispatched, it calls each reducer with *that key's slice*, and assembles the
returns into the new tree:

```js
import { combineReducers } from "redux";

const rootReducer = combineReducers({ user, cart, ui });
// on dispatch, internally:
//   { user: user(state.user, action),
//     cart: cart(state.cart, action),
//     ui:   ui(state.ui, action) }
```

The `cart` reducer receives `state.cart`, not `state`. It cannot read the user
slice even if it wanted to — which is exactly why it stays simple and why you can
test it with nothing but a cart-shaped object.

## The default case is load-bearing

Because *every* reducer sees *every* action, each slice reducer must return its
own state unchanged for actions it does not recognise. That is what the
`default: return state` line is for — omit it and the slice becomes `undefined` on
any unrelated action, wiping itself out:

```js
function cart(state = { items: [] }, action) {
  switch (action.type) {
    case "ITEM_ADDED": return { ...state, items: [...state.items, action.item] };
    default:           return state;   // MUST return the slice untouched
  }
}
```

This is also how one action updates several slices at once: dispatch
`USER_LOGGED_IN` and the `user`, `cart`, and `ui` reducers each independently
decide their response — no coordination, because each only touches its own key.

## When one slice needs another slice's data

The constraint bites in one place: a reducer that genuinely needs a value from
another slice. The wrong fix is to abandon `combineReducers` and hand everything
the whole tree. The right fix is usually to **derive** the cross-slice value with
a selector at read time (selectors *can* see the whole state), or, for the rare
true case, to pass the needed value *in the action* so the slice stays ignorant of
its neighbours. Keeping each reducer local is what lets a large store stay a
collection of small, independently-verifiable functions rather than one tangled
switch. The combine-reducers exercise builds exactly this split and the
default-case discipline that keeps it honest.
