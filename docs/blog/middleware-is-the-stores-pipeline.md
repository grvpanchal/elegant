---
title: "Middleware is the store's pipeline, not a grab bag"
layout: post
slug: middleware-is-the-stores-pipeline
date: 2026-08-30
author: The Elegant team
category: terminology
tags: [state, redux, middleware, async]
description: Middleware sits between dispatch and the reducer, and each one can inspect, delay, transform, or swallow an action. Understanding it as an ordered pipeline is what makes async and logging predictable.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [apply-middleware, middleware-order]
---

Every action you dispatch does not go straight to the reducer. It travels through
a pipeline of middleware first, and each one gets to see the action and decide
what to do with it: log it, delay it, transform it, dispatch other actions, or
stop it entirely. Understanding middleware as an ordered pipeline — not a bag of
plugins — is what makes async flows, logging, and error handling behave.

## The signature that composes

A middleware has a deliberately curried shape: `store => next => action => …`.
It receives the store (so it can `getState` and `dispatch`), then `next` (the
next middleware in the chain, or the reducer if it is last), then the action. It
does its work and usually calls `next(action)` to pass control along. That
`next` is the whole design: each middleware wraps the one after it, so calling
`next` is "hand this down the pipeline," and *not* calling it is "swallow this
action here." A logger calls `next` and also logs; a thunk middleware intercepts
function-actions and never passes them down.

## Order is behaviour

Because it is a pipeline, order matters, and getting it wrong produces subtle
bugs. A logger placed before an async middleware logs the raw thunk (a function)
instead of the real actions it eventually dispatches; placed after, it logs the
real actions. A crash-reporter that should see the final action must sit at the
end. This is why `applyMiddleware(thunk, logger)` and `applyMiddleware(logger,
thunk)` behave differently — the pipeline runs left to right on the way in.
Deciding order is a real design act, not an afterthought.

## What belongs here versus in a reducer

Middleware is where side effects live, precisely because reducers must be pure.
Firing an API request, reading `localStorage`, scheduling a timer, dispatching a
follow-up action — all of that goes in middleware (a thunk, a saga, a custom
one), never in a reducer. The clean division: reducers compute the next state
from an action; middleware decides which actions get dispatched and when,
including the async ones. Keep that line and your reducers stay testable and your
effects stay in one identifiable layer.

Think of dispatch as dropping an action at the top of a pipe. Each middleware is
a segment that can read, rewrite, delay, or cap the pipe, and `next` is the flow
to the next segment. Design the order deliberately, keep effects here and purity
below, and the store's behaviour stays legible. The apply-middleware exercise has
you build the pipeline itself, and middleware-order drills why the sequence
changes the outcome. Read a pipeline top to bottom as "who sees this action, in
what order, and who is allowed to stop it" — when a logged action looks wrong or
an effect fires at the wrong time, that ordering is almost always the first place
to look, and it tells you exactly which segment to suspect.
