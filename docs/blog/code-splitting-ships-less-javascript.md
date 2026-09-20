---
title: "Code splitting: ship the JavaScript this page needs, not all of it"
layout: post
slug: code-splitting-ships-less-javascript
date: 2026-08-11
author: The Elegant team
category: architecture
tags: [server, performance, bundling, web-vitals]
description: 'One big bundle makes the user download your entire app to see the login page. Code splitting breaks it into pieces loaded on demand, so the first screen ships only what it needs and the rest arrives when it is used.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [harness-bundle-budget, render-strategy-choice]
---

A single bundle has one fatal property: to see the login page, the user
downloads the admin dashboard, the charting library, the rich-text editor, and
every route they will never visit. The browser must parse and compile all of it
before the app is interactive, so the cost is not only bytes on the wire — it is
main-thread time. **Code splitting** breaks that one file into pieces the app
loads on demand: the first screen ships only its own code, and the rest arrives
when the user actually navigates to it.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="cs-t cs-d" class="blog-figure__svg">
  <title id="cs-t">One monolithic bundle versus a small entry chunk plus lazy chunks</title>
  <desc id="cs-d">On the left a single large bundle the browser must download before interactive. On the right a small entry chunk loads first, and route chunks for dashboard, editor and settings load on demand.</desc>
  <text x="150" y="30" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">one bundle</text>
  <rect x="70" y="45" width="160" height="130" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/>
  <text x="150" y="105" text-anchor="middle" fill="#c2571a" font-size="12">app.js</text>
  <text x="150" y="125" text-anchor="middle" fill="#819198" font-size="10">everything, up front</text>
  <line x1="320" y1="35" x2="320" y2="195" stroke="#dce6f0"/>
  <text x="480" y="30" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">split bundles</text>
  <rect x="380" y="45" width="90" height="44" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="425" y="72" text-anchor="middle" fill="#157878" font-size="11">entry</text>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2" font-size="10" text-anchor="middle">
    <rect x="380" y="105" width="80" height="34" rx="5"/><text x="420" y="126" fill="#155799">dashboard</text>
    <rect x="470" y="105" width="70" height="34" rx="5"/><text x="505" y="126" fill="#155799">editor</text>
    <rect x="425" y="150" width="80" height="34" rx="5"/><text x="465" y="171" fill="#155799">settings</text>
  </g>
  <g stroke="#819198" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#cs-a)">
    <path d="M425 89 L420 103"/><path d="M440 89 L505 103"/><path d="M440 89 L465 148"/>
  </g>
  <text x="465" y="205" text-anchor="middle" fill="#819198" font-size="10">route chunks load on demand</text>
  <defs><marker id="cs-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>The entry chunk boots the app; each route's code is a separate chunk fetched the moment it is needed, not before.</figcaption>
</figure>

## The dynamic import is the split point

Bundlers split at one syntactic marker: the dynamic `import()`. Where a static
`import` pulls code into the current chunk, `import()` returns a promise and tells
the bundler "put this in its own file and fetch it at runtime." In a framework
this is wrapped in a lazy-loading helper so a whole route becomes a chunk:

```jsx
import { lazy, Suspense } from "react";

// Dashboard and its deps become a SEPARATE chunk, fetched on first render
const Dashboard = lazy(() => import("./routes/Dashboard.jsx"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />           {/* the chunk downloads when this mounts */}
    </Suspense>
  );
}
```

The `Suspense` fallback is not optional polish — it is what the user sees during
the network round-trip for the chunk, so a lazy boundary without a good fallback
just trades a slow start for a blank flash.

## Prefetch so the split is invisible

Splitting adds a delay at the moment of navigation: the chunk has to arrive
before the route can render. You hide that delay by fetching the chunk *before*
the click, during idle time or on hover — the code is ready by the time the user
commits:

```js
// warm the dashboard chunk when the link is hovered, before the click
link.addEventListener("mouseenter", () => {
  import("./routes/Dashboard.jsx");   // browser caches it; navigation is instant
}, { once: true });
```

## Split by route first, then by weight

Not every `import()` earns its round-trip. The wins come from two places: split
by **route**, because a user on the login page genuinely does not need the
dashboard; and split out **heavy, rarely-used** dependencies — a charting library,
a markdown editor, a date picker — that would otherwise inflate the entry chunk
for everyone. Over-splitting has its own cost: dozens of tiny chunks mean dozens
of requests and worse compression, so there is a floor below which a chunk is not
worth its own file. The discipline is to set a bundle budget and let it fail the
build when the entry chunk crosses it, which is exactly what the bundle-budget
exercise makes you do — a number that turns "ship less JavaScript" from a wish
into a check.
