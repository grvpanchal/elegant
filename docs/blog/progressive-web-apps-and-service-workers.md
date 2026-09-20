---
title: "Progressive web apps: the service worker is the whole trick"
slug: progressive-web-apps-and-service-workers
date: 2026-07-16
layout: post
author: The Elegant team
category: architecture
tags: [server, pwa, offline, caching]
description: 'A PWA is a website that behaves like an installed app — offline, installable, fast on repeat visits. Almost all of that comes from one piece: a service worker sitting between your page and the network.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [offline-first-list, cache-headers-basics]
---

A progressive web app is a website that behaves like an installed app — it works
offline, it can be added to the home screen, and it loads instantly on repeat visits.
That sounds like a big pile of technology, and almost all of it comes from **one**
piece: a **service worker**, a script the browser runs in the background, sitting
between your page and the network. It can intercept every request your app makes and
decide whether to answer from a cache, from the network, or from a mix — which is what
makes offline and instant loads possible. Understand the service worker and you
understand what a PWA actually is; the manifest and the install prompt are trimmings on
top.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="pw-t pw-d" class="blog-figure__svg">
  <title id="pw-t">A service worker intercepts requests and answers from cache or network</title>
  <desc id="pw-d">The page makes a request; the service worker intercepts it and either serves a cached response instantly or falls through to the network, updating the cache.</desc>
  <rect x="30" y="75" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="75" y="99" text-anchor="middle" fill="#155799" font-size="10">page</text>
  <path d="M120 95 L180 95" stroke="#819198" stroke-width="2" marker-end="url(#pw-a)"/><text x="150" y="87" text-anchor="middle" fill="#819198" font-size="8">fetch</text>
  <rect x="180" y="72" width="130" height="46" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="245" y="92" text-anchor="middle" fill="#c2571a" font-size="10" font-weight="700">service worker</text><text x="245" y="108" text-anchor="middle" fill="#819198" font-size="8">intercepts every request</text>
  <path d="M310 82 L400 55" stroke="#157878" stroke-width="2" marker-end="url(#pw-a)"/><text x="355" y="55" fill="#157878" font-size="8">cache hit → instant</text>
  <path d="M310 108 L400 135" stroke="#819198" stroke-width="2" marker-end="url(#pw-a)"/><text x="360" y="140" fill="#819198" font-size="8">miss → network</text>
  <rect x="400" y="40" width="100" height="30" rx="5" fill="#e8f0f8" stroke="#157878"/><text x="450" y="59" text-anchor="middle" fill="#157878" font-size="9">cache</text>
  <rect x="400" y="120" width="100" height="30" rx="5" fill="#f3f6fa" stroke="#155799"/><text x="450" y="139" text-anchor="middle" fill="#155799" font-size="9">network</text>
  <defs><marker id="pw-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Every request passes through the service worker, which can answer from cache (instant, offline-capable) or fall through to the network — the interception is the whole mechanism.</figcaption>
</figure>

## Register it, then intercept fetches

A service worker is registered once, installs, and from then on the browser routes the
page's requests through its `fetch` handler. That handler is where offline and speed
come from — you decide what each request returns:

```js
// page: register the worker once
navigator.serviceWorker.register("/sw.js");

// sw.js: intercept requests — serve cache first, fall back to network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))  // cache, else network
  );
});
```

That single handler is what makes the app load with no network — if the response is
cached, the request never touches the wire.

## Strategy per request type

"Cache first" is not right for everything, and the power of the service worker is
choosing a strategy *per resource*. The app shell (rarely changes) is cache-first;
API data (must be fresh) is network-first with a cache fallback for offline; images are
cache-first with a size cap:

```js
// pick a strategy by request type — not one policy for everything
if (isShell(e.request))   e.respondWith(caches.match(e.request));                  // cache-first
else if (isApi(e.request)) e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); // network-first, offline fallback
```

This per-type control is exactly what a plain HTTP cache cannot give you, and it is why
the service worker, not the manifest, is the heart of a PWA.

## The manifest and the honest caveats

The other PWA pieces are lightweight by comparison. A **web app manifest** (a JSON file
with the app's name, icons, and theme) is what enables "add to home screen" and a
standalone, app-like window — real, but small next to the service worker. And two
caveats keep you honest: a service worker requires HTTPS (it can rewrite responses, so
the browser demands a secure origin), and cache versioning is a real hazard — because
the worker caches aggressively, a deploy can be masked by a stale cache unless you
version the cache name and clean up old ones on activation. Get the service worker's
interception and per-type strategies right, add a manifest, mind the cache versioning,
and an ordinary website becomes installable, offline-capable, and instant on return —
all from that one script in the middle. The offline-first-list and cache-headers
exercises build the caching decisions the service worker depends on.
