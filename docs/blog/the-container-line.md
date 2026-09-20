---
title: "The container line: draw it, and defend it with a check"
layout: post
slug: the-container-line
date: 2026-07-26
author: The Elegant team
category: architecture
tags: [architecture, state, ui, guardrails]
description: 'Somewhere in your tree is a line above which components may touch the store and below which they may not. Naming that line — and enforcing it with a check — is what keeps your UI layer portable and testable.'
cover: /assets/img/ui-server-state.png
reading_minutes: 4
related_practice: [presentational-vs-container, harness-state-shape]
---

Every well-structured frontend has an invisible horizontal line running through
its component tree. Above it, components are allowed to touch the store — read
state, dispatch actions, fetch data. Below it, they are not: they receive data as
props and emit events, and that is all. That line is the container line, and
whether your UI layer stays portable and testable comes down to whether you draw
it and hold it.

## What the line separates

Above the line are containers and the route-level components that wire data into
the page. Below it are the presentational atoms, molecules, and organisms that
render. The rule is simple and strict: nothing below the line imports the store,
calls `useSelector`/`useDispatch`, or fetches. A below-the-line component that
needs data gets it from a prop passed by something above the line. This keeps the
entire lower half of your tree free of coupling to how state is managed, which is
exactly what makes it reusable across screens and testable with plain props.

## Why the line has to be strict

A soft line is no line. The moment "just this one organism" reads the store
directly, the next one does too, and within a quarter your presentational layer is
riddled with store dependencies and none of it is reusable or testable in
isolation anymore. The value of the line is entirely in its being absolute —
components below it are *guaranteed* store-free, so you can trust that guarantee
when you reuse or test them. A line honored most of the time provides none of that
guarantee, because you now have to check each component to know.

## Enforce it with a check, not a code review

Strictness that depends on reviewer attention decays, especially with AI
generating components that reach for the store because that is the shortest path.
So the line belongs in a guardrail: a check that scans your UI directory for
imports of the store, `useSelector`, `useDispatch`, or your fetch client, and fails
the build with the offending file. Now the line enforces itself on every diff, and
"below the line is store-free" stops being a hope and becomes a fact the build
verifies. This is a small script with a large payoff — one of the highest-leverage
guardrails a codebase can have.

## The line moves data through props and events

With the line held, data flows down through props and intentions flow up through
events — the unidirectional flow the whole architecture is built on. A container
above the line fetches, renders a presentational tree below it, and passes
callbacks that dispatch; the presentational tree renders and calls back, never
reaching sideways or up into the store. That discipline is what lets you swap the
data layer without touching the UI, and swap the UI without touching the data
layer. The presentational-vs-container exercise is where you first draw the line,
and the state-shape exercise is the kind of guardrail that keeps what is above it
honest too.
