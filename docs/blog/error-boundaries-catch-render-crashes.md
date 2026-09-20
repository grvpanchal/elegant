---
title: "Error boundaries stop one broken component from blanking the page"
layout: post
slug: error-boundaries-catch-render-crashes
date: 2026-07-07
author: The Elegant team
category: terminology
tags: [ui, react, error-handling, resilience]
description: 'Without an error boundary, one component throwing during render takes the whole app down to a blank screen. A boundary catches the crash, shows a fallback for that subtree, and keeps the rest of the app alive.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [toast-notifications, retry-with-backoff]
---

By default, an uncaught error thrown while rendering a component does not just break
that component — it unmounts the entire application, leaving the user a blank white
screen. That is almost never what you want: a broken widget in the sidebar should
not take down the whole page. An error boundary is the mechanism that contains a
render-time crash to a subtree, shows a fallback there, and keeps the rest of the
app working.

## What a boundary catches, and what it doesn't

An error boundary catches errors thrown during rendering, in lifecycle methods, and
in the constructors of the tree *below* it — the render-phase crashes that would
otherwise blank the app. It deliberately does *not* catch errors in event handlers
(those are ordinary try/catch territory, because they do not happen during render),
in asynchronous code, or in the boundary itself. Knowing the boundary is a
*render-phase* safety net, not a universal catch-all, tells you where you still need
ordinary error handling: a click handler that calls an API needs its own try/catch,
because the boundary will never see that error.

## Place boundaries at meaningful seams

A boundary contains failure to the subtree it wraps, so *where* you place them is a
design decision about failure granularity. One boundary at the app root turns any
crash into a full-page fallback — better than a blank screen, but coarse. Boundaries
around independent sections — the sidebar, the main panel, each widget on a
dashboard — mean a crash in one shows a small "this section failed" fallback while
everything else keeps working. Match the boundaries to the units that can
meaningfully fail independently, so a failure degrades the page instead of
destroying it.

## The fallback is a UX decision

A boundary's fallback is what the user sees when that subtree crashed, and it
deserves thought rather than a bare "Something went wrong." Offer a way forward — a
retry button that re-mounts the subtree, a link elsewhere, a message that sets
expectations. For a widget, a small inline fallback keeps the page usable; for a
critical flow, a more prominent recovery path is warranted. The point is to turn a
crash into a recoverable moment, not a dead end, and to report it (see below) so you
learn it happened.

## Boundaries are also where you report crashes

The boundary is the natural place to log render crashes to your monitoring — it
receives the error and component stack, so it can report exactly what broke and
where before showing the fallback. This is how you find out a component is crashing
for a subset of users who would otherwise just see a fallback and leave. Pair the
boundary's user-facing fallback with a report to your error tracker, and a crash
becomes both survivable for the user and visible to you. The toast-notifications and
retry-with-backoff exercises pair naturally with boundaries — the toast surfaces a
recoverable error, and backoff is how a retry from a fallback should behave.
