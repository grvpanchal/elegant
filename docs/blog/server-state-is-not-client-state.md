---
title: "Server state is not client state, and treating them the same hurts"
layout: post
slug: server-state-is-not-client-state
date: 2026-08-27
author: The Elegant team
category: terminology
tags: [state, architecture, caching, async]
description: The data you fetch from a server and the state your UI owns are different animals with different rules. Cramming server data into your Redux store as if you owned it is the source of most stale-data bugs.
cover: /assets/img/state-system-diagram.png
reading_minutes: 3
related_practice: [offline-first-list, normalize-entities, retry-with-backoff]
---

There are two kinds of state in a frontend, and conflating them causes a
surprising share of bugs. **Client state** is state your app owns — the open tab,
the form draft, the theme, whether a menu is expanded. **Server state** is data
that lives on a server and you are merely borrowing a copy of — the user's
orders, a product list, a profile. They look alike in your store, but they obey
different rules, and treating server data as if you owned it is why it goes
stale.

## Ownership is the difference

Client state has one owner: your app. Nobody else can change it, so it is never
stale — it is always exactly what you set. Server state has another owner: the
server, and other users, and other tabs. Your copy can be out of date the instant
you fetch it, because someone else can change the source. That single fact means
server state needs things client state never does: a notion of freshness,
background refetching, cache invalidation, and a plan for when your copy and the
server's disagree. A boolean toggle needs none of that.

## Why the naive store approach rots

The common pattern — fetch data, dump it in Redux, read it forever — treats
borrowed data as owned data. It works until the data changes on the server and
your copy doesn't, and now you are hand-writing invalidation: "after this
mutation, refetch these three things." That logic sprawls, gets forgotten, and
produces the "why am I seeing the old value" bugs. You have rebuilt a cache,
badly, without admitting it is a cache.

## Give server state a caching layer

The modern answer is to stop pretending. Server state belongs in a caching layer
that knows it is a cache — keyed by query, with staleness, background refresh,
deduplication, and invalidation as first-class features. Dedicated data-fetching
libraries do exactly this, and they exist precisely because "put it in Redux" was
the wrong shape. Your Redux store then shrinks to what it is actually good at:
client state you own. When you do keep server data in the store (offline-first
apps, for instance), normalize it and treat writes as cache updates, not source-
of-truth edits.

The distinction to carry: if your app is the only thing that can change a value,
it is client state and lives in your store simply. If a server owns it and you
hold a copy, it is server state and needs a cache's discipline — freshness,
invalidation, refetch — whether you adopt a library or build that discipline
yourself. Most "state management is hard" complaints are really "we managed
server state as if it were client state." The offline-first-list exercise forces
the distinction, because there the cache *is* the point.
