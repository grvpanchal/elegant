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
reading_minutes: 5
related_practice: [retry-with-backoff, normalize-entities]
---

A request waterfall is a chain of network calls where each one waits for the previous
to finish — even though it did not have to. It is one of the quietest causes of a slow
page, because each request looks reasonable on its own; the cost is in the *sequence*.
Three 200ms requests that genuinely depend on each other take 600ms and that is
unavoidable. Three that *don't* depend on each other but were written to await one
another also take 600ms — and that is pure waste, because they could have taken 200ms
in parallel. Spotting which of your sequences are real dependencies and which are
accidental is where a lot of page-speed lives.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="rw-t rw-d" class="blog-figure__svg">
  <title id="rw-t">Sequential requests stack their durations; parallel requests overlap</title>
  <desc id="rw-d">Top: three requests one after another, total time is the sum. Bottom: the same three fired in parallel, total time is the longest single one.</desc>
  <text x="30" y="40" fill="#c2571a" font-size="10" font-weight="700">waterfall</text>
  <rect x="120" y="28" width="120" height="22" rx="4" fill="#fff4ec" stroke="#fe854c"/><text x="180" y="44" text-anchor="middle" fill="#c2571a" font-size="8">user 200ms</text>
  <rect x="240" y="28" width="120" height="22" rx="4" fill="#fff4ec" stroke="#fe854c"/><text x="300" y="44" text-anchor="middle" fill="#c2571a" font-size="8">orders 200ms</text>
  <rect x="360" y="28" width="120" height="22" rx="4" fill="#fff4ec" stroke="#fe854c"/><text x="420" y="44" text-anchor="middle" fill="#c2571a" font-size="8">stock 200ms</text>
  <text x="500" y="44" fill="#c2571a" font-size="9">= 600ms</text>
  <text x="30" y="100" fill="#157878" font-size="10" font-weight="700">parallel</text>
  <rect x="120" y="88" width="120" height="22" rx="4" fill="#e8f0f8" stroke="#157878"/><text x="180" y="104" text-anchor="middle" fill="#157878" font-size="8">user 200ms</text>
  <rect x="120" y="114" width="120" height="22" rx="4" fill="#e8f0f8" stroke="#157878"/><text x="180" y="130" text-anchor="middle" fill="#157878" font-size="8">orders 200ms</text>
  <rect x="120" y="140" width="120" height="22" rx="4" fill="#e8f0f8" stroke="#157878"/><text x="180" y="156" text-anchor="middle" fill="#157878" font-size="8">stock 200ms</text>
  <text x="260" y="130" fill="#157878" font-size="9">= 200ms</text>
</svg>
<figcaption>Independent requests in sequence sum their times; the same requests in parallel take only as long as the slowest. The waterfall is the wasted difference.</figcaption>
</figure>

## The accidental waterfall

The classic version comes from `await`-ing in a row out of habit. These three fetches
have no dependency on each other, yet each waits for the last — turning 200ms of work
into 600ms:

```js
// ACCIDENTAL WATERFALL — independent data, loaded in sequence for no reason
const user = await fetchUser(id);        // 200ms
const orders = await fetchOrders(id);    // waits, then 200ms
const stock = await fetchStock();        // waits, then 200ms  → 600ms total
```

Nothing about `orders` or `stock` needs `user`, so making them wait is pure latency
you gave away.

## Fire the independent ones together

When requests do not depend on each other, start them all and await the group with
`Promise.all`. Now they overlap, and the total is the *slowest* one, not the sum:

```js
// PARALLEL — fire all three at once, wait for the group → ~200ms total
const [user, orders, stock] = await Promise.all([
  fetchUser(id),
  fetchOrders(id),
  fetchStock(),
]);
```

Same data, a third of the time. The only change was recognising there was no real
dependency.

## Tell real dependencies from accidental ones

Some waterfalls are genuine and cannot be flattened: if request B needs an id from
request A's response, B must wait. The skill is distinguishing those from the
accidental kind — and even genuine chains can often be shortened. If the client keeps
discovering "oh, now I need *this* too," each round-trip is a waterfall step; a
**backend-for-frontend** can collapse the whole chain into one call that fans out
server-side. Component-level waterfalls hide here too: a parent fetches, renders a
child, and only *then* does the child fetch — so lift the child's fetch up to start it
in parallel with the parent's. The habit is to look at your network panel and ask, at
each request, "did this truly need to wait for the one before it?" Every "no" is
latency you can delete with `Promise.all` or a reshaped endpoint. The retry-with-backoff
and normalize-entities exercises live in this data-fetching layer, where flattening
waterfalls is often the biggest single speed win a page has left.
