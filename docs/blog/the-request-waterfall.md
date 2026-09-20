---
title: "The request waterfall: when your fetches wait in line for no reason"
slug: the-request-waterfall
layout: post
date: 2026-06-23
author: The Elegant team
category: architecture
tags: [server, performance, async, data]
description: 'A waterfall is a chain of requests that each wait for the previous one when they did not have to. It is the quiet cause of slow pages — data that could have loaded in parallel loading in sequence instead.'
cover: /assets/img/ui-server-state.png
reading_minutes: 4
related_practice: [retry-with-backoff, normalize-entities]
---

Open the network panel on a slow page and you often see the real problem: a staircase
of requests, each starting only after the previous one finished, when many of them
had no reason to wait. That staircase is a request waterfall, and it is one of the
most common and most fixable causes of a slow-feeling app — latency multiplied by
serialization, paid on every load.

## Sequential when it could be parallel

The classic waterfall comes from awaiting requests one at a time that do not depend on
each other: fetch the user, then (after it returns) fetch their settings, then fetch
their notifications. If none of those needs the previous one's result, you have turned
three round-trips that could have happened at once into three that happen in sequence —
tripling the latency for no reason. The fix is to fire the independent requests
together (`Promise.all`) and wait for all of them, collapsing three sequential
round-trips into one parallel wait. The tell is `await` immediately followed by another
independent `await`.

## The component-tree waterfall

A subtler waterfall hides in the component tree: a parent fetches and renders, then a
child mounts and fetches, then a grandchild mounts and fetches — each level's request
cannot start until the level above rendered, so the data loads in a cascade matching
the tree depth. This is why "each component fetches its own data" feels slow even when
each fetch is fast: they are serialized by the render order. Hoisting the fetches up
(a container that fetches everything the subtree needs, or a route-level loader that
fetches in parallel before rendering) breaks the cascade. It is another reason the
container line matters — concentrated fetching can be parallelized; scattered
fetching waterfalls.

## Genuine dependencies still have to wait

Some sequences are real: you need the user's id before you can fetch their orders, so
that request genuinely depends on the first. Those cannot be parallelized away — but
you can often still shorten them by fetching the dependent data on the server (where
the round-trips are between machines in a datacenter, not over mobile), or by
restructuring the API so one request returns what the screen needs (a BFF endpoint
that aggregates). The goal is not "never sequence" but "never sequence what did not
have to be sequential."

## Prefetch to hide the waterfalls you cannot remove

For the waterfalls that remain, prefetching hides them: start the likely-next
request during idle time so its latency overlaps with something else. And on the
data-shape side, normalizing responses so related entities are fetched together and
cached avoids re-fetching in a second wave. The through-line: look at your network
panel as a staircase, and for every step ask "did this have to wait?" — the answer is
often no. The retry-with-backoff exercise is about handling requests that fail, and
normalize-entities is about shaping the data so you fetch it once and in the right
groupings rather than in a cascade.
