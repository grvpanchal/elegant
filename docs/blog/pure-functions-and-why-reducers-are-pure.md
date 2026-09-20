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
reading_minutes: 3
related_practice: [counter-reducer, combine-reducers, memoized-selector]
---

A pure function has two properties: given the same inputs it always returns the
same output, and it causes no side effects — no mutation of its arguments, no
network calls, no reading of the clock or random numbers. Reducers are required
to be pure, and that requirement is not academic dogma. It is what makes the
whole state model work.

## What purity buys the store

Because a reducer is `(state, action) => newState` with no side effects, the
store can call it whenever it likes and trust the result. You can replay a list
of actions and get the same state every time — that is what time-travel debugging
and hydration from a log depend on. You can test a reducer with plain inputs and
assert on the output, no mocks, no setup, no network. And because it returns a
*new* state instead of mutating the old one, the store can compare references to
know cheaply whether anything changed.

## The three ways reducers go impure

The violations are always the same three. **Mutation**: `state.items.push(x)` and
returning `state` — now the old and new state are the same object, change
detection fails, and components do not re-render. Return a new array instead.
**Side effects**: firing an API call or dispatching from inside the reducer —
that belongs in middleware (a thunk or saga), never in the reducer. **Nondeterminism**:
`createdAt: Date.now()` or `id: Math.random()` inside the reducer makes replay
impossible; compute those in the action creator and pass them in.

## Purity is what makes the ecosystem work

The payoff extends past your own tests. Because reducers are pure, dev tools can
record every action and let you scrub backward and forward through state — time
travel is only possible when replaying the same actions yields the same states.
Server-side rendering can run the reducers on the server, serialize the resulting
state, and hydrate it on the client, trusting that the same actions would rebuild
it. Undo/redo becomes a matter of keeping a stack of states, not writing bespoke
reversal logic. Optimistic updates can be applied and cleanly rolled back.
None of these features were written for your app specifically; they all fall out
of the single constraint that the reducer is a pure function of state and action.
Break purity — read the clock, mutate the input, fire a request — and you do not
just fail a test, you quietly opt out of the entire tooling ecosystem built on
that guarantee.

## Keeping it honest

The discipline is to treat the incoming state as read-only and build the next
state from it. Spread operators, `map`, `filter`, and `concat` return new
structures; `push`, `splice`, and direct assignment mutate. Toolkits that wrap an
immutable-update library let you *write* mutating-looking code that produces a new
state under the hood — convenient, but the mental model is still "return a new
state, never change the old one."

If a reducer is hard to test, it is usually because it stopped being pure —
something crept in that reads the world or changes its input. Move that
something out, and the reducer becomes a plain function you can reason about. The
counter-reducer exercise enforces immutability directly, and combine-reducers
shows how pure slices compose.
