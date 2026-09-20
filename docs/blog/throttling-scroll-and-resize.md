---
title: "Scroll and resize fire constantly — throttle them or pay for it"
slug: throttling-scroll-and-resize
layout: post
date: 2026-06-28
author: The Elegant team
category: terminology
tags: [ui, performance, events, throttle]
description: 'Scroll and resize can fire dozens of times a second, and doing real work in their handlers is a reliable way to jank the page. Throttle them, or move the work to the platform APIs built for exactly this.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [infinite-scroll-list, debounce-utility]
---

`scroll` and `resize` are firehose events — a single scroll gesture can fire the
handler dozens of times a second. If that handler does real work (measures layout,
updates state, triggers a render), you have signed up to do that work dozens of
times a second on the main thread, and the page janks. Taming these events is a
common, high-impact performance fix, and increasingly the best answer is to not
handle them at all.

## Throttle, don't debounce, for scroll

The instinct is to rate-limit, and the right tool is throttle, not debounce. Debounce
waits for the events to *stop* — so a debounced scroll handler does nothing until the
user stops scrolling, which is exactly wrong for anything that should update *during*
the scroll (a progress bar, a sticky header, lazy-loading). Throttle runs the handler
at a bounded rate *while* scrolling continues, so you get regular updates at, say,
every 100ms instead of every frame. Reserve debounce for the "act once it's over"
case (like saving scroll position after the user settles).

## Keep the handler cheap and batch DOM reads

Even throttled, a scroll handler must be cheap, because it runs during the most
performance-sensitive moment there is. The classic mistake is reading layout
(`offsetTop`, `getBoundingClientRect`) inside it, which forces synchronous reflow
every call — layout thrashing on the hot path. Read what you need once, cache it, and
recompute only on resize; inside the scroll handler, do math on cached numbers, not
fresh measurements. And wrap visual updates in `requestAnimationFrame` so they align
with the browser's paint rather than fighting it.

## Prefer the platform observers

The modern move is to delete most scroll handlers entirely. `IntersectionObserver`
tells you when an element enters or leaves the viewport — perfect for lazy-loading,
infinite scroll, and reveal-on-scroll — without any scroll handler, computed off the
main thread. `ResizeObserver` tells you when an element's size changes, replacing
resize-handler measurement. These APIs exist precisely because hand-written scroll
and resize handlers were such a reliable performance problem; they do the work the
browser is optimized for and hand you just the events you care about.

## Match the tool to the job

So the decision tree is: can a platform observer do this? Use it (infinite scroll,
lazy-load, size reactions almost always can). If you genuinely need a scroll handler,
throttle it, keep it cheap, cache measurements, and update in a rAF. And use debounce
only for the "after it stops" case. The infinite-scroll exercise is the canonical
place this comes up — and the clean solution is an `IntersectionObserver` sentinel,
not a throttled scroll handler, which is itself the lesson. The debounce exercise
covers the timer mechanics behind both throttle and debounce.
