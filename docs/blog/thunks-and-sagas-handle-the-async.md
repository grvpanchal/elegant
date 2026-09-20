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
reading_minutes: 3
related_practice: [apply-middleware, retry-with-backoff, action-creators]
---

Reducers are pure, so asynchronous work — fetching, retrying, debouncing,
cancelling — has to live in middleware. The two dominant answers are thunks and
sagas, and teams argue about them as if it were a religious question. It is not.
They sit at different points on a complexity curve, and most apps are well
served by the simpler one.

## Thunks: a function you dispatch

A thunk is just a function that middleware lets you dispatch instead of a plain
action. Inside it you have `dispatch` and `getState`, so you fire the
`REQUEST` action, `await` the call, then dispatch `SUCCESS` or `FAIL`. That is
the whole model. It is imperative, reads top to bottom, and needs no new
concepts — if you can write an async function, you can write a thunk. For the
overwhelmingly common case (fetch some data, dispatch the result), thunks are the
right tool, and reaching for anything heavier is over-engineering.

## Sagas: a process that watches

A saga is a long-running generator that *watches* for actions and reacts —
`takeLatest('SEARCH', handleSearch)` runs `handleSearch` every time a `SEARCH`
action passes, cancelling the previous run. Sagas express things thunks struggle
with: cancellation (`takeLatest` drops the stale request automatically), complex
orchestration (wait for three actions, then do a fourth), debouncing and
throttling at the action level, and retry-with-backoff as a readable loop. The
cost is a new mental model — generators, effects like `call` and `put`, a
declarative style that is powerful but takes learning.

## Choosing without dogma

Pick by the shape of your async. If your effects are mostly "fire a request,
store the result," thunks keep the code obvious and the bundle small. If you have
genuine orchestration — search-as-you-type that must cancel in-flight requests,
websockets that dispatch a stream of actions, multi-step flows with cancellation
— sagas earn their complexity. The mistake in both directions is real: sagas for
a CRUD app add ceremony nobody needs; thunks for a heavily concurrent app turn
into a tangle of manual cancellation flags. There is also a third option many
teams now take — a data-fetching library that owns server state entirely — which
removes most of this question for the common case.

The honest default is thunks, upgraded to sagas only when cancellation and
orchestration stop being edge cases and become the point. The apply-middleware
exercise shows where both plug in, and retry-with-backoff is the kind of async
policy that reads cleanly as a saga and awkwardly as a thunk. Start with thunks,
keep them until you actually hit cancellation or multi-step orchestration, and
treat the jump to sagas as a deliberate response to that complexity rather than a
default you reach for on day one — the wrong choice either way is a real cost.
