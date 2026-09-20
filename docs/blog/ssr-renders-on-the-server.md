---
title: "Server-side rendering: HTML first, JavaScript second"
layout: post
slug: ssr-renders-on-the-server
date: 2026-08-21
author: The Elegant team
category: architecture
tags: [server, ssr, rendering, performance]
description: 'Server-side rendering sends real HTML on the first response instead of an empty div waiting for JavaScript. That changes what the user sees first, what a crawler indexes, and what your server has to do.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 6
related_practice: [render-strategy-choice, design-localized-app, cache-headers-basics]
---

Server-side rendering means the server runs your components and sends back real,
filled-in HTML on the first response — a page a browser can paint immediately and
a crawler can read — instead of an empty `<div id="root">` that only becomes a
page after a JavaScript bundle downloads and runs. That one change ripples
outward: it changes what the user sees at the first paint, what a search engine
indexes, and what work your server has to do on every request. SSR is not "better
than" client rendering; it moves the rendering cost from the user's device to
your server, and that trade is right for some pages and wrong for others.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="ssr-t ssr-d" class="blog-figure__svg">
  <title id="ssr-t">SSR sends filled HTML first, then hydrates; CSR sends an empty shell first</title>
  <desc id="ssr-d">Top: server renders components to HTML, browser paints content immediately, then JS hydrates. Bottom: server sends an empty div, browser waits for JS, then paints.</desc>
  <text x="30" y="42" fill="#157878" font-size="11" font-weight="700">SSR</text>
  <rect x="80" y="30" width="90" height="30" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="125" y="50" text-anchor="middle" fill="#157878" font-size="9">render HTML</text>
  <path d="M170 45 L215 45" stroke="#819198" stroke-width="2" marker-end="url(#ssr-a)"/>
  <rect x="215" y="30" width="110" height="30" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="270" y="50" text-anchor="middle" fill="#c2571a" font-size="9">paint content</text>
  <path d="M325 45 L370 45" stroke="#819198" stroke-width="2" marker-end="url(#ssr-a)"/>
  <rect x="370" y="30" width="90" height="30" rx="5" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="415" y="50" text-anchor="middle" fill="#155799" font-size="9">hydrate</text>
  <text x="480" y="49" fill="#819198" font-size="9">interactive last</text>
  <line x1="30" y1="90" x2="610" y2="90" stroke="#dce6f0"/>
  <text x="30" y="130" fill="#c2571a" font-size="11" font-weight="700">CSR</text>
  <rect x="80" y="118" width="90" height="30" rx="5" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="125" y="138" text-anchor="middle" fill="#155799" font-size="9">empty div</text>
  <path d="M170 133 L215 133" stroke="#819198" stroke-width="2" marker-end="url(#ssr-a)"/>
  <rect x="215" y="118" width="110" height="30" rx="5" fill="#f3f6fa" stroke="#819198" stroke-width="2"/><text x="270" y="138" text-anchor="middle" fill="#819198" font-size="9">download JS</text>
  <path d="M325 133 L370 133" stroke="#819198" stroke-width="2" marker-end="url(#ssr-a)"/>
  <rect x="370" y="118" width="110" height="30" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="425" y="138" text-anchor="middle" fill="#c2571a" font-size="9">paint content</text>
  <defs><marker id="ssr-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>SSR moves the first paint before the JavaScript; CSR makes the paint wait for the bundle. The interactivity gap is what hydration fills.</figcaption>
</figure>

## The server renders the tree to a string

The mechanism is a render-to-string call on the server: your component tree is
executed and serialised to HTML, sent as the response body, and the client
attaches to it later. In a React app the two ends look like this:

```jsx
// server: run the app and stream/serialise it into the HTML response
import { renderToString } from "react-dom/server";
app.get("*", (req, res) => {
  const html = renderToString(<App url={req.url} />);
  res.send(`<!doctype html><div id="root">${html}</div><script src="/client.js">`);
});
```

```jsx
// client: attach to the existing markup instead of creating it from scratch
import { hydrateRoot } from "react-dom/client";
hydrateRoot(document.getElementById("root"), <App url={location.pathname} />);
```

`hydrateRoot`, not `createRoot`: the DOM already exists, and the client's job is to
adopt it and wire up the event handlers.

## What you gain, and what it costs

The gains are real: a faster first *contentful* paint (there is content in the
first byte), correct SEO and social previews (crawlers see filled HTML without
running JS), and a usable page on slow devices sooner. The costs are equally real:
your server now does render work on every request (CPU and latency you must cache
around), your components must run in a Node environment where `window` does not
exist, and there is a window where the page *looks* ready but is not yet
interactive — the gap before hydration finishes.

```js
// SSR code runs where there is no DOM — guard browser-only access
const isBrowser = typeof window !== "undefined";
const width = isBrowser ? window.innerWidth : DEFAULT_WIDTH;  // no crash on the server
```

## Choose SSR where the first view matters to a stranger

The clean heuristic: SSR earns its cost on pages whose *first view matters to
someone who is not signed in* — marketing pages, articles, product listings,
anything a crawler or a first-time visitor lands on. It earns less on a deeply
interactive, authenticated app behind a login, where SEO is irrelevant and the
user will wait for the bundle once. Modern frameworks blur the line with
streaming SSR and partial hydration, but the underlying trade never changes: you
are choosing to spend server work to improve the first view. The
render-strategy-choice exercise makes you pick per page against real constraints,
which is the actual skill — not memorising that SSR exists, but knowing when its
cost buys you something.
