---
title: "Why an organism should not fetch its own data"
slug: why-organisms-should-not-fetch
layout: post
date: 2026-07-03
author: The Elegant team
category: architecture
tags: [ui, atomic-design, architecture, data]
description: 'The moment a reusable organism fetches its own data, it stops being reusable and becomes a feature bolted to one endpoint. Keeping the fetch above it, in a container, is what keeps the UI layer portable and testable.'
cover: /assets/img/atomic-design.png
reading_minutes: 4
related_practice: [atom-boundaries, presentational-vs-container, normalize-entities]
---

An organism — a product card, a comment thread, a header with navigation — is meant
to be a reusable section of UI. The single fastest way to destroy that reusability
is to let it fetch its own data. The moment `ProductGrid` calls `useProducts()`
inside itself, it stops being a grid you can drop anywhere and becomes a feature
welded to one endpoint, one data shape, and one loading strategy. Keeping the fetch
out is what keeps the organism reusable.

## Fetching couples the organism to one source

A `ProductGrid` that receives `products` as a prop can render products from
anywhere — a search result, a category page, a "related items" widget, a Storybook
fixture, a test. A `ProductGrid` that fetches `/api/products` inside itself can only
ever show *those* products, loaded *that* way. You have taken a reusable shape and
nailed it to one data source. The next screen that needs a grid of products but from
a different endpoint cannot reuse it, so someone copies it, and now you have two
grids to maintain that will drift apart.

## It also destroys testability

A presentational organism is tested by passing props and asserting output — no
network, no mocks, fast and deterministic. An organism that fetches can only be
tested by standing up a mock server or intercepting requests, which is slower,
flakier, and tests the fetch plumbing instead of the rendering you actually care
about. Every organism that fetches is a component you can no longer test simply, and
a Storybook story you can no longer write without faking a network. The fetch drags
the whole testing story down with it.

## Put the fetch in a container above it

The fix is the container line: a container component above the organism does the
fetching (or reads the store), then renders the organism with the data as props and
passes callbacks for its events. The organism stays pure — data in, events out — and
the container owns the coupling to the data source. Now the same organism serves
every screen, each with its own container supplying different data, and you test the
organism with props and the container's logic separately. One fetch site per screen,
not one per reusable component.

## The rule generalizes down the tree

This is not special to organisms — it is the general rule that *rendering* and
*fetching* are different responsibilities that belong in different components. Atoms
and molecules certainly do not fetch; organisms do not either; only containers (and
route-level components) reach out to data. When you feel the urge to fetch inside a
presentational component "just to make this screen work," that is the signal to
introduce a container instead. The atom-boundaries exercise drills where a component's
responsibility stops, and presentational-vs-container is the boundary this whole rule
rests on; normalize-entities is the kind of data a container should shape before
handing it down.
