---
title: "Prefetching hides latency by doing the work before it's asked for"
layout: post
slug: prefetching-hides-latency
date: 2026-07-11
author: The Elegant team
category: architecture
tags: [server, performance, prefetching, ux]
description: 'The fastest request is the one that already finished. Prefetching loads the code or data for what the user is likely to do next, during idle time, so the next click feels instant instead of waiting on the network.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [infinite-scroll-list, render-strategy-choice]
---

The fastest network request is the one that already finished before the user asked
for it. Prefetching is the practice of doing likely-next work during idle time — 
loading the next route's code, the next page's data, the image just below the fold
— so that when the user acts, the result is already in hand and the interaction
feels instant. Used well it hides latency; used carelessly it wastes the user's data
and bandwidth on things they never needed.

## Predict the next action and prepare for it

Prefetching works because user behaviour is predictable at the margin. A user on a
product list will probably click a product; a user hovering a nav link will probably
follow it; a user near the bottom of a feed will probably scroll further. Each is a
cue to start fetching the likely-next thing now, during a moment when the network
and CPU are idle anyway. When the click comes, the code and data are cached, and the
navigation is instant instead of a spinner. The art is picking predictions
confident enough to be worth the cost.

## The mechanisms, from cheap to eager

There is a ladder of techniques. `<link rel="prefetch">` and `rel="preload"` tell
the browser to fetch a resource at low or high priority. Route-based frameworks
prefetch a route's code when its link enters the viewport or on hover, so the chunk
is ready before the click. Data can be prefetched the same way — start the query on
hover or when the triggering element is near. Infinite scroll prefetches the next
page before the user reaches the end, so content is already there as they arrive.
Each trades a bit of speculative work for a faster interaction.

## The cost: you can prefetch the wrong thing

Prefetching is speculative, so some of it is wasted — you fetch a route the user
never visits, an image they never scroll to, a page they never open. On a fast
connection that waste is cheap; on a metered mobile plan it is the user's money, and
prefetching aggressively is rude. The discipline is to prefetch only high-confidence
next actions, respect the user's data-saver preference (the `Save-Data` hint and the
connection API), and prefer idle-time, low-priority fetches that yield to real
requests. Prefetch everything and you have just made the initial load heavy again in
a different way.

## Balance eagerness against the initial load

The deeper tension is that prefetching and a lean initial load pull in opposite
directions — every speculative fetch competes for bandwidth with what the user
needs right now. So prefetch *after* the current page is interactive, at low
priority, for the most likely next step only. Done with that restraint, prefetching
is close to free perceived speed; done greedily, it is a regression wearing an
optimization's clothes. The infinite-scroll exercise is prefetching in its most
natural form — load the next page before the user hits the bottom — and the
render-strategy exercise is where prefetching interacts with how much you shipped up
front.
