---
title: "Actions are messages, not setters"
layout: post
slug: actions-are-messages-not-setters
date: 2026-09-02
author: The Elegant team
category: terminology
tags: [state, redux, actions, architecture]
description: The most common Redux mistake is treating actions like setters — SET_USER, SET_LOADING, SET_ERROR. An action should describe something that happened, not command the store how to change.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [action-creators, counter-reducer, combine-reducers]
---

The most common way to misuse Redux is to treat actions as **setters**:
`SET_USER`, `SET_LOADING`, `SET_ERROR`, `SET_ITEMS`. It feels natural — you have
a piece of state, so you write an action that sets it — but it quietly throws
away the entire point of the pattern. An action is supposed to be a **message
about something that happened in the world**, not a command telling the store
which field to overwrite. `USER_LOGGED_IN` is a message; `SET_USER` is a setter
wearing an action's clothes. The difference decides whether your reducers stay
readable and whether one event can update several slices at once.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="am-t am-d" class="blog-figure__svg">
  <title id="am-t">One event as a setter reaches one field; as a message it reaches many reducers</title>
  <desc id="am-d">On the left SET_USER writes one field. On the right USER_LOGGED_IN is received by the user, cart and analytics reducers, each deciding its own change.</desc>
  <text x="140" y="28" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">setter</text>
  <rect x="60" y="45" width="150" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="135" y="67" text-anchor="middle" fill="#c2571a" font-size="11">SET_USER</text>
  <path d="M135 79 L135 120" stroke="#819198" stroke-width="2" marker-end="url(#am-a)"/>
  <rect x="80" y="122" width="110" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="135" y="144" text-anchor="middle" fill="#155799" font-size="11">user field</text>
  <line x1="320" y1="30" x2="320" y2="200" stroke="#dce6f0"/>
  <text x="470" y="28" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">message</text>
  <rect x="390" y="45" width="160" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="470" y="67" text-anchor="middle" fill="#157878" font-size="11">USER_LOGGED_IN</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#am-a)"><path d="M420 79 L390 120"/><path d="M470 79 L470 120"/><path d="M520 79 L550 120"/></g>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2" font-size="10" text-anchor="middle">
    <rect x="345" y="122" width="80" height="34" rx="5"/><text x="385" y="143" fill="#155799">user</text>
    <rect x="432" y="122" width="70" height="34" rx="5"/><text x="467" y="143" fill="#155799">cart</text>
    <rect x="510" y="122" width="90" height="34" rx="5"/><text x="555" y="143" fill="#155799">analytics</text>
  </g>
  <defs><marker id="am-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>A setter can only address one field. A message names an event, and every reducer that cares gets to respond in its own way.</figcaption>
</figure>

## A setter couples the caller to the shape

When you dispatch `SET_LOADING`, the component has to *know* there is a
`loading` field and that it should be `true` right now. The knowledge of how state
changes has leaked out of the reducer and into the caller. Compare a setter-style
action with a message-style one:

```js
// setter: the component decides the new state shape
dispatch({ type: "SET_LOADING", value: true });
dispatch({ type: "SET_ERROR", value: null });

// message: the component reports what happened; reducers decide the shape
dispatch({ type: "SEARCH_REQUESTED", query });
```

The message carries *why*, not *what to write*. That lets the reducer own the
transition — clear the error, set loading, stash the query — in one place, and it
lets a second reducer (say, analytics) react to the very same event without the
caller knowing it exists.

## One event, many reducers

Because every reducer sees every action, a single well-named message can fan out.
`USER_LOGGED_IN` can populate the user slice, hydrate a saved cart, and reset a
guest flag — three reducers, one dispatch, no coordination in the component:

```js
// user.js
case "USER_LOGGED_IN": return { ...state, profile: action.user };
// cart.js
case "USER_LOGGED_IN": return { ...state, items: action.savedCart ?? state.items };
// ui.js
case "USER_LOGGED_IN": return { ...state, isGuest: false };
```

Try that with setters and you are dispatching three actions in the component and
hoping nobody forgets one.

## Name actions after events, in the past tense

The practical rule is to name actions the way you would narrate the app's history:
`ITEM_ADDED_TO_CART`, `PAYMENT_FAILED`, `FILTER_CLEARED` — past-tense facts, not
imperative commands. When you find yourself writing `SET_`, stop and ask what
actually *happened* that made you want to set that field, and name the action
that. Your reducers become a log you can read, your components stop knowing the
store's shape, and the `redux-devtools` timeline turns into a story instead of a
list of assignments. The action-creators exercise is where you practise phrasing
these as events, which is most of what separates a maintainable store from a pile
of setters.
