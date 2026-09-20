---
title: "Prefetching hides latency by doing the work before it's asked for"
slug: prefetching-hides-latency
layout: post
date: 2026-07-11
author: The Elegant team
category: architecture
tags: [server, performance, prefetching, ux]
description: 'The fastest request is the one that already finished. Prefetching loads the code or data for what the user is likely to do next, during idle time, so the next click feels instant instead of waiting on the network.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [infinite-scroll-list, render-strategy-choice]
---

The fastest network request is the one that already finished before the user asked for
it. **Prefetching** is doing exactly that: predicting what the user is likely to do
next — the route they will click, the data the next screen needs — and loading it
during idle time, so when the click comes, the answer is already in cache and the
transition is instant. It does not make the network faster; it hides the latency by
*moving it earlier*, into a moment when the user is not waiting. Done well it is the
difference between an app that feels snappy and one that shows a spinner on every
navigation, even though the underlying requests are identical.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="pr-t pr-d" class="blog-figure__svg">
  <title id="pr-t">Prefetching moves the fetch into idle time so the click resolves instantly</title>
  <desc id="pr-d">Without prefetch: click then wait for the fetch. With prefetch: the fetch happens on hover/idle before the click, so the click is instant.</desc>
  <text x="30" y="40" fill="#c2571a" font-size="10" font-weight="700">no prefetch</text>
  <rect x="150" y="28" width="70" height="22" rx="4" fill="#f3f6fa" stroke="#155799"/><text x="185" y="44" text-anchor="middle" fill="#155799" font-size="8">click</text>
  <rect x="220" y="28" width="140" height="22" rx="4" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="290" y="44" text-anchor="middle" fill="#c2571a" font-size="8">wait for fetch (spinner)</text>
  <text x="30" y="110" fill="#157878" font-size="10" font-weight="700">prefetch</text>
  <rect x="80" y="98" width="140" height="22" rx="4" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="150" y="114" text-anchor="middle" fill="#157878" font-size="8">fetch on hover/idle</text>
  <rect x="230" y="98" width="70" height="22" rx="4" fill="#f3f6fa" stroke="#155799"/><text x="265" y="114" text-anchor="middle" fill="#155799" font-size="8">click</text>
  <rect x="300" y="98" width="90" height="22" rx="4" fill="#e8f0f8" stroke="#157878"/><text x="345" y="114" text-anchor="middle" fill="#157878" font-size="8">instant ✓</text>
  <text x="420" y="114" fill="#157878" font-size="9">latency hidden before the click</text>
</svg>
<figcaption>Prefetching relocates the fetch to idle time before the click. The work is the same; the user just never waits for it, because it finished earlier.</figcaption>
</figure>

## Prefetch on intent signals

The trick is predicting the next action from a cheap signal. **Hover** over a link is
a strong one — the user is deciding to click — and gives you a few hundred milliseconds
of head start. So warm the next route's code and data on hover:

```js
// hover is intent: warm the next route's chunk + data before the click lands
link.addEventListener("mouseenter", () => {
  import("./routes/Product.jsx");                 // code chunk
  queryClient.prefetchQuery(["product", id], () => fetchProduct(id));  // data
}, { once: true });
```

By the time the click fires, both the code and the data are cached, and the navigation
renders immediately.

## Use the browser's declarative hints

You do not always need JavaScript — the platform has declarative prefetch hints the
browser schedules intelligently during idle time. `<link rel="prefetch">` fetches a
resource for a likely *future* navigation at low priority; `preconnect` warms the
connection to an origin you will call:

```html
<!-- likely-next resources, fetched at idle/low priority by the browser -->
<link rel="prefetch" href="/product.js" as="script">
<link rel="preconnect" href="https://api.example.com">   <!-- warm the connection early -->
```

Many frameworks do route-level prefetch automatically — a `<Link>` in view or hovered
gets its chunk prefetched without you writing anything.

## Prefetch the likely, not everything

The discipline is that prefetching spends resources on a *guess*, so a bad guess is
waste — data the user never needed, bandwidth burned on a mobile plan, cache thrashed.
So prefetch what is **likely**, not everything: the hovered link, the next page of a
list the user is scrolling, the step-two data while they fill step one. Respect the
user's constraints — honour `navigator.connection.saveData` and back off on slow
connections — and prefer *idle* time (`requestIdleCallback`, low-priority hints) so
prefetching never competes with what the user is actively waiting on. Used with
judgement, it is one of the highest-impact perceived-speed tools available, because it
attacks latency where the user cannot feel the cost. The infinite-scroll-list exercise
is a natural home for it — prefetch the next page before the user reaches the bottom —
and render-strategy-choice is where prefetch fits into the larger loading plan.
