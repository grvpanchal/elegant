---
title: "Code splitting: ship the JavaScript this page needs, not all of it"
layout: post
slug: code-splitting-ships-less-javascript
date: 2026-08-11
author: The Elegant team
category: architecture
tags: [server, performance, bundling, web-vitals]
description: 'One big bundle makes the user download your entire app to see the login page. Code splitting breaks it into pieces loaded on demand, so the first screen ships only what it needs and the rest arrives when it is used.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [harness-bundle-budget, render-strategy-choice]
---

The default output of a bundler is one big JavaScript file, and the default
consequence is that a user visiting your login page downloads the code for your
entire app — the dashboard, the settings, the admin panel — before they can type
their password. Code splitting fixes that by breaking the bundle into pieces that
load on demand, so the first screen ships only the code it actually needs.

## Split by route first

The highest-value split is by route. The login page does not need the dashboard's
code, and the dashboard does not need the rarely-visited billing screen's. Lazy-
loading each route as a separate chunk means the initial download is just the
shell plus the first route, and each subsequent route's code arrives when the user
navigates to it. On a large app this can cut the initial bundle by an order of
magnitude, which shows up directly as faster time-to-interactive. Route-level
splitting is where you should start, because it maps cleanly to what a user is
likely to need next.

## Split heavy, rarely-used pieces too

Beyond routes, split anything large that most users do not immediately need: a
rich text editor, a charting library, a date-picker, a PDF viewer, a map. If a
feature pulls in a heavy dependency and only some users open it, load that
dependency when they do, not on first paint. A dynamic import inside the event
handler that opens the feature is enough — the chunk downloads the first time the
feature is used and is cached after. This keeps the "everyone pays" bundle small
and pushes the "only some people pay" code behind the interaction that needs it.

## The cost: waterfalls and spinners

Splitting is not free. Each split point is a network request that happens *when*
the code is needed, which can introduce a loading pause mid-interaction — click a
route, wait for its chunk. Over-split and you trade one big download for a
waterfall of small ones, each with latency. The mitigations are prefetching
(fetch the likely-next chunk during idle time, so it is ready before the click)
and sensible granularity (split at routes and heavy features, not at every
component). A loading state for the chunk keeps the pause from feeling broken.

## Keeping it honest with a budget

Code splitting is the technique; a bundle budget is what stops the initial chunk
from creeping back up as the app grows. Set a size ceiling for the entry bundle
and fail the build when a change blows past it — that turns "the bundle got huge
again" from a slow drift nobody noticed into a specific, blocking signal on the
pull request that caused it. The bundle-budget exercise is exactly that guardrail,
and the render-strategy exercise is where splitting interacts with how much
JavaScript you needed to ship in the first place.
