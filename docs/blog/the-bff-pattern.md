---
title: "The backend-for-frontend: an API shaped for the screen, not the database"
layout: post
slug: the-bff-pattern
date: 2026-07-12
author: The Elegant team
category: architecture
tags: [server, bff, api, architecture]
description: 'A backend-for-frontend is a thin server layer that exists to serve one frontend — aggregating calls, reshaping data, and holding secrets — so the client gets exactly what the screen needs in one request.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [proxy-and-cors, session-and-tokens]
---

A backend-for-frontend (BFF) is a thin server layer that exists to serve **one**
frontend. Its job is not to be a general-purpose API — it is to give this specific
client exactly the shape it needs, in as few round-trips as possible. It aggregates
several downstream calls into one, reshapes data from database-shaped to
screen-shaped, and holds the secrets the browser must not. The problem it solves is
the mismatch between how backend services organise data (by domain, normalised, for
reuse) and how a screen needs it (denormalised, joined, for one view). Without a
BFF the client papers over that gap with a waterfall of calls and a pile of
reshaping code; with one, the server does it where it is cheap.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="bf-t bf-d" class="blog-figure__svg">
  <title id="bf-t">A BFF aggregates several services into one screen-shaped response</title>
  <desc id="bf-d">The client makes one request to the BFF, which fans out to user, orders and inventory services in parallel and returns a single combined, reshaped payload.</desc>
  <rect x="30" y="80" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="75" y="104" text-anchor="middle" fill="#155799" font-size="10">client</text>
  <path d="M120 100 L190 100" stroke="#819198" stroke-width="2" marker-end="url(#bf-a)"/><text x="155" y="92" fill="#819198" font-size="8">1 request</text>
  <rect x="190" y="78" width="110" height="44" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="245" y="104" text-anchor="middle" fill="#c2571a" font-size="10">BFF</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#bf-a)"><path d="M300 90 L400 55"/><path d="M300 100 L400 100"/><path d="M300 110 L400 145"/></g>
  <g fill="#e8f0f8" stroke="#157878" stroke-width="2" font-size="9" text-anchor="middle">
    <rect x="400" y="40" width="120" height="30" rx="5"/><text x="460" y="59" fill="#157878">user service</text>
    <rect x="400" y="85" width="120" height="30" rx="5"/><text x="460" y="104" fill="#157878">orders service</text>
    <rect x="400" y="130" width="120" height="30" rx="5"/><text x="460" y="149" fill="#157878">inventory service</text>
  </g>
  <text x="245" y="150" text-anchor="middle" fill="#819198" font-size="8">fan out in parallel, combine, reshape</text>
  <defs><marker id="bf-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>One client request; the BFF fans out to the services the screen needs, in parallel, and returns a single response already shaped for that screen.</figcaption>
</figure>

## Aggregate the waterfall into one call

The most visible win is collapsing a client-side request waterfall. A dashboard
that needs the user, their recent orders, and stock levels would otherwise make
three sequential round-trips from the browser (each often waiting on the last). The
BFF makes them in parallel, server-side, close to the services, and returns one
payload:

```js
// BFF endpoint: one client call fans out to three services in parallel
app.get("/api/dashboard", async (req, res) => {
  const [user, orders, stock] = await Promise.all([
    userService.get(req.userId),
    orderService.recent(req.userId),
    inventoryService.levels(),
  ]);
  res.json({ user, orders, stock });   // one response, already joined for the screen
});
```

The client makes one request over its slow last-mile connection instead of three,
and the fan-out happens on fast internal links.

## Reshape data for the view, and hold the secrets

The BFF also translates. Backend services return everything, normalised; the screen
wants a trimmed, joined, view-specific shape. Doing that in the BFF keeps the client
free of reshaping logic and keeps API keys off the browser:

```js
// reshape database-shaped data into screen-shaped data, using a server-only key
const raw = await payments.charges(userId, { key: process.env.STRIPE_KEY });  // secret stays here
res.json(raw.data.map((c) => ({ id: c.id, amount: c.amount / 100, when: c.created })));
```

The browser receives exactly the fields the component renders — no over-fetching,
no client-side money-math, no exposed credential.

## One BFF per frontend, and know when not to

The defining discipline is in the name: a BFF serves *one* frontend. The web app's
BFF and the mobile app's BFF are allowed to diverge, because their screens have
different needs — a shared "do everything" API drifts back into the generic
mismatch the BFF was meant to fix. The trade-off is a real extra service to build,
deploy, and operate, so a BFF earns its keep when you have multiple downstream
services to aggregate, secrets to keep off the client, or a genuine shape mismatch
— and is overkill for a single well-designed API that already returns
screen-friendly data. Where it fits, it moves the aggregation and reshaping to the
side of the network where they are cheap. The proxy-and-cors exercise is the
smallest version of this idea — a server layer that stands between your client and
an upstream — which is the seed a BFF grows from.
