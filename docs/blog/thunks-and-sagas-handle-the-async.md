---
title: "Thunks and sagas both handle async — they just disagree on how"
layout: post
slug: thunks-and-sagas-handle-the-async
date: 2026-08-29
author: The Elegant team
category: terminology
tags: [state, redux, async, sagas]
description: A thunk is a function you dispatch; a saga is a long-running process that watches for actions. Pick by how complex your async is — most apps need thunks, some genuinely need sagas.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [apply-middleware, retry-with-backoff, action-creators]
---

Reducers must be pure, so the `await` has to live somewhere else. In the Redux
world there are two established somewheres, and they represent genuinely
different philosophies. A **thunk** is a function you dispatch — it runs, does its
async work, and dispatches plain actions along the way. A **saga** is a
long-running process that sits to the side, *watches* the stream of dispatched
actions, and reacts. Thunks are imperative and local; sagas are declarative and
centralised. Neither is "better" — they fit different amounts of async
complexity, and picking by that is the whole decision.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="ts-t ts-d" class="blog-figure__svg">
  <title id="ts-t">A thunk runs inline on dispatch; a saga watches the action stream</title>
  <desc id="ts-d">On the left a dispatched thunk runs its async work and dispatches results. On the right actions flow past a saga that is always listening and reacts to the ones it watches for.</desc>
  <text x="150" y="28" text-anchor="middle" fill="#155799" font-size="12" font-weight="700">thunk</text>
  <rect x="60" y="45" width="80" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="100" y="67" text-anchor="middle" fill="#155799" font-size="10">dispatch</text>
  <path d="M140 62 L200 62" stroke="#819198" stroke-width="2" marker-end="url(#ts-a)"/>
  <rect x="200" y="45" width="90" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="245" y="67" text-anchor="middle" fill="#c2571a" font-size="10">fn runs await</text>
  <path d="M245 79 L245 120" stroke="#819198" stroke-width="2" marker-end="url(#ts-a)"/>
  <rect x="185" y="122" width="120" height="30" rx="5" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="245" y="142" text-anchor="middle" fill="#155799" font-size="10">SUCCESS/FAIL</text>
  <line x1="330" y1="30" x2="330" y2="200" stroke="#dce6f0"/>
  <text x="480" y="28" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">saga</text>
  <line x1="360" y1="70" x2="600" y2="70" stroke="#155799" stroke-width="2"/>
  <g fill="#155799"><circle cx="390" cy="70" r="5"/><circle cx="460" cy="70" r="5"/><circle cx="540" cy="70" r="5"/></g>
  <text x="360" y="58" fill="#819198" font-size="9">action stream</text>
  <rect x="420" y="120" width="120" height="40" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="480" y="145" text-anchor="middle" fill="#157878" font-size="11">saga watches</text>
  <path d="M460 75 L480 118" stroke="#157878" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#ts-a)"/>
  <defs><marker id="ts-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>A thunk is work triggered by a dispatch; a saga is a standing watcher that reacts to actions as they flow past.</figcaption>
</figure>

## A thunk is a function you dispatch

Thanks to the thunk middleware, `dispatch` accepts a function as well as an
object. That function receives `dispatch` and `getState`, so it can bracket an
async call with the request/success/fail triple:

```js
const loadUser = (id) => async (dispatch, getState) => {
  dispatch({ type: "USER_REQUEST" });
  try {
    const res = await fetch(`/api/users/${id}`);
    dispatch({ type: "USER_SUCCESS", data: await res.json() });
  } catch (err) {
    dispatch({ type: "USER_FAIL", error: err.message });
  }
};

dispatch(loadUser(42));   // the function runs, drives the async, dispatches results
```

The logic is right there, imperative and readable. For the vast majority of apps
— fetch on mount, submit a form, load more — this is all you ever need.

## A saga watches and reacts declaratively

Sagas invert the control flow. You write a generator that *listens* for an action
type and yields declarative effects (`call`, `put`, `takeLatest`) that the
middleware runs. The payoff is orchestration: cancellation, debouncing, racing,
and "wait for A then B" become first-class:

```js
import { call, put, takeLatest } from "redux-saga/effects";

function* loadUser(action) {
  yield put({ type: "USER_REQUEST" });
  try {
    const data = yield call(fetchUser, action.id);   // "call this", not "await this"
    yield put({ type: "USER_SUCCESS", data });
  } catch (err) {
    yield put({ type: "USER_FAIL", error: err.message });
  }
}

// takeLatest auto-cancels an in-flight load when a newer one starts
function* watch() { yield takeLatest("USER_LOAD", loadUser); }
```

`takeLatest` alone — cancel the previous request when a new one arrives — is
tedious to hand-roll in a thunk and one word in a saga. That is the kind of
problem sagas exist for.

## Pick by the shape of your async, not by fashion

The honest rule: reach for **thunks** by default. They are less code, less
concept, and cover fetch-and-store cleanly. Reach for **sagas** when your async
has genuine *process* — complex cancellation, cross-action coordination,
websocket streams, retry-with-backoff sequences, long workflows that span many
events. If you can describe your need as "when this happens, go do that," a thunk
is fine; if you need "watch for this, and while it runs, also do that, unless this
other thing happens first," that is a saga. Both are just middleware turning an
async story into plain actions the pure reducers can handle. The apply-middleware
exercise builds the seam both plug into, which is the best way to see they are two
answers to the same structural question.
