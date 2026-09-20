---
title: "Proxy it or fix CORS? Two answers to the same cross-origin wall"
layout: post
slug: proxy-or-fix-cors
date: 2026-08-15
author: The Elegant team
category: architecture
tags: [server, cors, proxy, http]
description: 'When your frontend cannot call an API because of a cross-origin error, you have two real fixes — proxy the request through your own origin, or set CORS headers on the API. Which one is right depends on who owns the API.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [proxy-and-cors, session-and-tokens]
---

You hit the cross-origin wall: your frontend on one origin cannot read a response
from an API on another, because the API does not permit your origin. There are
exactly two real fixes, and picking between them comes down to a single question —
**do you control the API server?** If you do, add the CORS headers. If you do not,
proxy the request through your own origin so, as far as the browser is concerned,
there is no cross-origin request at all. Everything else ("disable CORS in the
browser," "add a header in my fetch") is either a local hack or impossible, because
CORS is granted by the API's response, not by the client.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="pf-t2 pf-d2" class="blog-figure__svg">
  <title id="pf-t2">Fix CORS on an API you own; proxy through your origin for one you don't</title>
  <desc id="pf-d2">Left: you own the API, so add Access-Control-Allow-Origin. Right: you don't, so the browser calls your own server which relays to the third-party API, making it same-origin.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">you own the API</text>
  <rect x="40" y="45" width="90" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="85" y="67" text-anchor="middle" fill="#155799" font-size="9">browser</text>
  <path d="M130 62 L200 62" stroke="#157878" stroke-width="2" marker-end="url(#pf-a2)"/>
  <rect x="200" y="45" width="90" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="245" y="67" text-anchor="middle" fill="#157878" font-size="9">your API</text>
  <text x="165" y="105" text-anchor="middle" fill="#157878" font-size="9">add Allow-Origin header</text>
  <line x1="330" y1="18" x2="330" y2="185" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">you don't</text>
  <rect x="370" y="45" width="80" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="410" y="67" text-anchor="middle" fill="#155799" font-size="9">browser</text>
  <path d="M450 62 L500 62" stroke="#819198" stroke-width="2" marker-end="url(#pf-a2)"/><text x="475" y="54" fill="#819198" font-size="8">same-origin</text>
  <rect x="500" y="45" width="80" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="540" y="67" text-anchor="middle" fill="#c2571a" font-size="9">your proxy</text>
  <path d="M540 79 L540 120" stroke="#819198" stroke-width="2" marker-end="url(#pf-a2)"/><text x="580" y="102" fill="#819198" font-size="8">server-to-server</text>
  <rect x="490" y="122" width="100" height="30" rx="6" fill="#f3f6fa" stroke="#155799"/><text x="540" y="141" text-anchor="middle" fill="#155799" font-size="9">3rd-party API</text>
  <defs><marker id="pf-a2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Own the API: send the permission header. Don't own it: route through your own server, so the browser only ever talks same-origin and CORS never applies.</figcaption>
</figure>

## Fix CORS when you own the API

If the API is yours, the correct fix is to send the permission headers for the
origins you trust. Echo the specific origin (do not reflexively use `*`, which also
disables credentialed requests), and answer the preflight:

```js
// express: allow your app's origin to read responses, and handle preflight
app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "https://app.example.com");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.set("Access-Control-Allow-Headers", "content-type, authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);   // preflight
  next();
});
```

This is the clean fix because it addresses the actual thing — the API declaring who
may read it.

## Proxy when you don't

If the API belongs to someone else, you cannot make it send headers. So you remove
the cross-origin-ness instead: the browser calls *your* server (same origin, no
CORS), and your server calls the third-party API server-to-server, where CORS does
not exist:

```js
// your own origin: the browser sees a same-origin call; you relay it server-side
app.get("/api/weather", async (req, res) => {
  const upstream = await fetch("https://third-party.com/v1/weather?city=" + req.query.city, {
    headers: { Authorization: `Bearer ${process.env.WEATHER_KEY}` },  // secret stays server-side
  });
  res.json(await upstream.json());
});
```

In dev, the framework's dev server usually does this for you with a proxy config,
which is why a call works locally and then breaks in production — the dev proxy was
quietly making it same-origin.

## The proxy has a bonus: secrets stay server-side

There is a reason to prefer the proxy even for some APIs you *could* CORS-enable: it
keeps credentials off the client. A third-party API key shipped to the browser is
public; relayed through your proxy, it lives in a server env var and never reaches
the user. That makes the proxy the right answer whenever a secret is involved,
cross-origin or not. So the decision tree is: own the API and no secret → send CORS
headers; don't own it, or a secret is involved → proxy. What you never do is
disable browser security or pretend the client can grant itself permission — CORS is
the server's to give, and the proxy is how you route around a server that won't.
The proxy-and-cors exercise builds both fixes so the choice becomes reflexive.
