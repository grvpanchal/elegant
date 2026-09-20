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
reading_minutes: 5
related_practice: [apply-middleware, middleware-order]
---

Redux middleware has a reputation for being mysterious, mostly because of its
famous triple-arrow signature. But the idea is plain: middleware is an **ordered
pipeline** that every dispatched action flows through *before* it reaches the
reducer. Each stage in the pipeline gets to inspect the action, and can pass it
on, transform it, delay it, dispatch other actions, or swallow it entirely. Async
handling, logging, crash reporting, analytics — they are all just stages in this
one pipe. Once you see it as a pipeline with an order, the behaviour stops being
magic and becomes predictable.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="mw-t mw-d" class="blog-figure__svg">
  <title id="mw-t">An action flows through logger, then thunk, then reaches the reducer</title>
  <desc id="mw-d">dispatch sends an action into the middleware pipeline: logger, then thunk, then the reducer produces new state. A dot travels the pipeline left to right.</desc>
  <rect x="20" y="70" width="80" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="60" y="94" text-anchor="middle" fill="#155799" font-size="11">dispatch</text>
  <rect x="140" y="70" width="90" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="185" y="94" text-anchor="middle" fill="#157878" font-size="11">logger</text>
  <rect x="270" y="70" width="90" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="315" y="94" text-anchor="middle" fill="#157878" font-size="11">thunk</text>
  <rect x="400" y="70" width="100" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="450" y="94" text-anchor="middle" fill="#c2571a" font-size="11">reducer</text>
  <rect x="540" y="70" width="80" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="580" y="94" text-anchor="middle" fill="#155799" font-size="11">state</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#mw-a)"><path d="M100 90 L138 90"/><path d="M230 90 L268 90"/><path d="M360 90 L398 90"/><path d="M500 90 L538 90"/></g>
  <text x="320" y="45" text-anchor="middle" fill="#819198" font-size="11">order matters: each stage wraps the next</text>
  <defs><marker id="mw-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
  <circle r="6" fill="#fe854c"><animateMotion dur="3.5s" repeatCount="indefinite" path="M60 90 L185 90 L315 90 L450 90 L580 90"/></circle>
</svg>
<figcaption>Every action runs the pipeline in order before hitting the reducer; a stage can act, then call the next — or not.</figcaption>
</figure>

## The signature is a pipeline stage

The `store => next => action => {}` shape reads as three questions the pipeline
asks each stage: here is the store, here is the *next* stage to hand off to, and
here is the action. `next(action)` passes control down the pipe; whatever you do
before and after that call is your stage's behaviour. A logger is the clearest
example:

```js
const logger = (store) => (next) => (action) => {
  console.log("dispatching", action.type);
  const result = next(action);            // hand off to the next stage / reducer
  console.log("next state", store.getState());
  return result;
};
```

Before `next`, you see the action on the way in; after `next`, the reducer has
run and you can see the new state. Every middleware is a variation on where it
acts relative to that handoff.

## A stage can transform or swallow

Because a stage decides whether and how to call `next`, it can do more than
observe. The thunk middleware intercepts function actions and *runs* them instead
of forwarding them to the reducer — a plain object it just passes along:

```js
const thunk = (store) => (next) => (action) =>
  typeof action === "function"
    ? action(store.dispatch, store.getState)  // run it — never reaches the reducer
    : next(action);                            // ordinary action — pass down the pipe
```

That single conditional is the whole of "you can dispatch a function": the
middleware catches the function, so the reducer only ever sees plain actions.

## Order is a real decision

Because each stage wraps the next, the order you compose them in changes
behaviour. Put a logger *before* the thunk and you log the raw function action;
put it *after* and you log the plain actions the thunk dispatches — very different
logs. Put crash reporting last so it wraps everything, and analytics where it can
see the resolved actions. This is not incidental; `applyMiddleware(a, b, c)`
builds `a(b(c(reducer)))`, and reversing the arguments reverses who sees what
first. The apply-middleware and middleware-order exercises make you feel this
directly — the same three stages in a different order produce a different trace,
which is the fastest way to stop treating middleware as a grab bag and start
treating it as the ordered pipe it is.
