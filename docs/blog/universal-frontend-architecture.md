---
title: "The Universal Frontend Architecture: UI, Server, and State as three seams"
layout: post
slug: universal-frontend-architecture
date: 2026-09-19
author: The Elegant team
category: architecture
tags: [architecture, ssr, state, ui, separation-of-concerns]
description: One architecture that survives a framework swap because it separates the three concerns every frontend has — rendering the UI, talking to the server, and holding state — instead of tangling them.
cover: /assets/img/fe-segregation-all.png
reading_minutes: 5
related_practice: [presentational-vs-container, render-strategy-choice, design-micro-frontends]
---

Frameworks come and go, but the concerns a frontend has to handle do not. Every
app renders a UI, talks to a server, and holds state between the two. The
Universal Frontend Architecture is the claim that if you keep those three as
distinct seams, the same design survives a move from React to Vue to a web
component — because the framework only ever occupies one of the three seams.

## The three seams

### UI

The UI seam is the atomic-design tree: atoms, molecules, organisms, templates.
Its only job is to turn props into pixels and user actions into events. It does
not know where data comes from or where it goes. This is the seam frameworks
compete over, and it is deliberately the *thinnest* place your business logic
touches — a component that only renders can be ported by rewriting its template,
nothing more.

### Server

The server seam is everything about talking to the outside: route providers,
auth providers, the SSR and SSG renderers, API services, session management, the
proxy config. It is easy to forget this is part of *frontend* architecture, but
the choices here — render on the server or the client, where the session lives,
how requests are proxied — shape the whole app's performance and security. A
container sits at this boundary: it fetches, then hands plain data and callbacks
down into the UI seam.

### State

The state seam is the store and the machinery around it: selectors read, actions
describe intent, reducers apply changes, the store is the single source of truth.
Whether you spell that Redux, NgRx, or Pinia, the shape is the same — a
unidirectional flow where the UI dispatches an intent and re-renders from the
new state. Keeping this separate from the UI is what lets you test business logic
without rendering anything.

## Why separation is the actual feature

The payoff is that each seam can change without dragging the others. Swap the
rendering strategy from client-side to SSR and the state seam does not notice.
Move from Redux to Pinia and the UI components keep taking the same props. Split
the app into micro-frontends and the seams give you the natural fault lines to
split along.

The opposite — a component that fetches its own data, holds its own state, and
renders it — feels fast to write and is expensive forever. It cannot be tested
without a network, cannot be reused on another screen, and cannot be ported
without untangling all three concerns at once. The architecture's whole job is to
stop that fusion from happening by default.

## Reading the diagram

The segregation diagram above is not decoration; it is the contract. Data flows
in from the server seam, through a container, into the UI as props. User actions
flow back out as events, into the state seam as dispatched actions, and the new
state flows back into the UI. Nothing in the UI reaches sideways into the server,
and nothing in the server reaches into a component's internals. Every arrow
crosses a seam exactly once.

## Applying it without dogma

You do not need every box on day one. A small app might collapse the server seam
into a couple of fetch calls and skip a formal store. The architecture is a
target to grow toward, not a checklist to satisfy up front. What matters is that
when the app grows, the seams are where you add — you are never forced to
re-thread a concern that was tangled in from the start. That is the difference
between an architecture that ages well and one that calcifies.
