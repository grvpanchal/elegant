---
title: "The request/success/fail triple is the shape of every fetch"
layout: post
slug: the-request-success-fail-triple
date: 2026-08-28
author: The Elegant team
category: terminology
tags: [state, async, patterns, redux]
description: Every asynchronous call has three outcomes worth modelling — it started, it worked, it failed — and a single boolean isLoading cannot represent them. The triple is why your spinners and errors behave.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [action-creators, retry-with-backoff, normalize-entities]
---

The most reliable pattern in async state management is also the most boring: for
every request, dispatch three actions — `REQUEST`, `SUCCESS`, and `FAIL`. Teams
that skip it and reach for a lone `isLoading` boolean end up with spinners that
never stop, errors that never clear, and race conditions they cannot explain. The
triple is not ceremony; it is the minimum needed to represent what actually
happens.

## Three outcomes, not two

A fetch has more than two states. Before it starts you are idle. When it starts
you are loading. Then you are either successful (with data) or failed (with an
error). A single `isLoading` flag collapses that into two and loses information:
it cannot distinguish "haven't asked yet" from "asked and got nothing," and it
has nowhere to put the error. Modelling the triple explicitly — a `status` field
of `idle | loading | success | error`, plus `data` and `error` — makes every
screen state representable and every transition a real action the reducer
handles.

## Why three actions, not one

You could set all this from one place, but three actions keep the logic in the
store where it belongs. `REQUEST` sets status to loading and clears the previous
error. `SUCCESS` stores the data, sets status to success, clears the error.
`FAIL` stores the error and sets status to error. Each is a pure transition, and
the reducer owns the rules — for instance, that a new `REQUEST` clears the old
error so a stale message does not linger under a fresh spinner. Components just
read `status` and render the matching state; they do not orchestrate flags.

## Races and the stale response

The triple also gives you a place to handle the classic async race: the user
searches "cat," then "cats," and the "cat" response arrives last and overwrites
the newer results. Because each request is modelled, you can tag responses with
the query (or a request id) and have `SUCCESS` ignore a result that does not match
the latest `REQUEST`. A lone boolean has no way to express "this response is
stale"; the triple does, because the request was a first-class thing.

Every data-fetching library you might adopt — the ones that own server state for
you — implements exactly this triple under the hood, exposing `isLoading`,
`data`, and `error` because those are the three outcomes that matter. Whether you
hand-roll it or adopt a library, model the request as three outcomes, not one
flag. The action-creators exercise builds the triple's actions, and
retry-with-backoff layers a real failure policy on top. Once the request is
modelled as three outcomes, features like retry, cancellation, and a stale-
response guard each get an obvious home, because every one of them is simply
another transition on a state you already represent explicitly.
