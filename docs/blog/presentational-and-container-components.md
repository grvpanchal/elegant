---
title: "Presentational and container components: the split that keeps testing sane"
layout: post
slug: presentational-and-container-components
date: 2026-07-28
author: The Elegant team
category: architecture
tags: [ui, architecture, components, testing]
description: 'Split components by whether they render or whether they fetch and decide. The presentational half takes props and stays dumb; the container half talks to the outside. That one boundary is what makes both halves testable and reusable.'
cover: /assets/img/ui-server-state.png
reading_minutes: 4
related_practice: [presentational-vs-container, loading-button-atom, form-field-molecule]
---

The single most useful boundary in a component tree is the one between components
that **render** and components that **decide**. A presentational component takes
props and emits events and knows nothing about where data comes from. A container
component fetches, reads the store, and hands data down. Keeping the two separate
is what lets you test the rendering without a network and the logic without a DOM.

## Presentational: dumb on purpose

A presentational component is deliberately ignorant. Give it `products` and an
`onSelect` callback and it renders the list and calls back when clicked — it does
not know if `products` came from an API, a store, or a test fixture, and it does
not care. That ignorance is the feature: the component works identically
everywhere, so you can reuse it across screens, render it in Storybook with fake
data, and test it by passing props and asserting output. No mocks, no store, no
network. A component that only turns props into pixels is the easiest thing in a
frontend to trust.

## Container: where the outside world connects

The container is where the messy connections live: the fetch, the `useSelector`,
the `dispatch`, the subscription. It fetches or reads, then renders a
presentational component with the results and passes callbacks that dispatch. It
usually has little or no markup of its own — its job is wiring, not layout. Because
all the coupling to the outside is concentrated here, there is one obvious place to
look when data flow breaks, and the presentational components below it stay
portable.

## Why the split pays off under change

The boundary earns its keep when things change. Swap the data source — REST to
GraphQL, store to a data-fetching library — and only containers change; every
presentational component keeps its prop contract and does not notice. Redesign the
UI and only presentational components change; the containers keep wiring. Test
coverage splits cleanly too: fast, mock-free tests for presentational components,
and focused tests for container logic. The alternative — components that both fetch
and render — cannot be tested without standing up the whole world and cannot be
reused because they drag their data source with them.

## The line is a judgement, not a law

Modern hooks blur the strict version of this pattern — a custom hook can
encapsulate the "container" concerns without a wrapper component — and that is
fine. The durable idea is not the literal two-file split; it is that *fetching and
deciding should be separable from rendering*, however you express it. When a
component is hard to test or reuse, the usual cause is that the two got fused, and
pulling the data-and-decisions out (into a container, a hook, or a parent) fixes
it. The presentational-vs-container exercise makes you draw exactly this line, and
the loading-button and form-field exercises are presentational components clean
enough to reuse anywhere.
