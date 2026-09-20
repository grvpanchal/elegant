---
title: "Client-side rendering is not the villain, it is a trade-off"
layout: post
slug: csr-and-its-tradeoffs
date: 2026-08-19
author: The Elegant team
category: architecture
tags: [server, csr, rendering, spa]
description: 'The single-page app that renders everything in the browser gets blamed for slow first paints and bad SEO. Both are real, both are fixable, and for the right app CSR is simpler and cheaper than the alternatives.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 6
related_practice: [render-strategy-choice, infinite-scroll-list]
---

Client-side rendering — the single-page app that ships a mostly-empty HTML shell
and builds the whole UI in the browser — has become the thing everyone apologises
for. It gets blamed for slow first paints and bad SEO, and both criticisms are
fair. But they are *fixable* trade-offs, not a verdict, and for a large class of
apps CSR is genuinely the simplest and cheapest choice. Understanding CSR well
means being honest about both halves: what it costs on the first load, and what it
buys you afterwards.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="csr-t csr-d" class="blog-figure__svg">
  <title id="csr-t">CSR pays a slow first load then serves fast in-app navigations</title>
  <desc id="csr-d">A timeline: the first load is a long bar (download bundle, then render). Subsequent navigations are short bars because no full page reload happens.</desc>
  <text x="30" y="40" fill="#c2571a" font-size="11" font-weight="700">first load</text>
  <rect x="140" y="28" width="130" height="24" rx="4" fill="#f3f6fa" stroke="#819198"/><text x="205" y="45" text-anchor="middle" fill="#819198" font-size="9">download bundle</text>
  <rect x="270" y="28" width="90" height="24" rx="4" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="315" y="45" text-anchor="middle" fill="#c2571a" font-size="9">render</text>
  <text x="30" y="100" fill="#157878" font-size="11" font-weight="700">nav 1</text>
  <rect x="140" y="88" width="55" height="24" rx="4" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="167" y="105" text-anchor="middle" fill="#157878" font-size="9">render</text>
  <text x="30" y="150" fill="#157878" font-size="11" font-weight="700">nav 2</text>
  <rect x="140" y="138" width="55" height="24" rx="4" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="167" y="155" text-anchor="middle" fill="#157878" font-size="9">render</text>
  <text x="240" y="105" fill="#819198" font-size="9">no reload — data fetch only</text>
  <text x="240" y="155" fill="#819198" font-size="9">instant client-side transition</text>
</svg>
<figcaption>CSR front-loads the cost: one slow start to download and boot the app, then fast in-app navigations with no full reloads.</figcaption>
</figure>

## The shell is empty on purpose

A CSR app's initial HTML is deliberately minimal — a root node and a script tag.
Everything the user sees is created by JavaScript after the bundle loads and boots:

```html
<!doctype html>
<div id="root"></div>            <!-- nothing here yet -->
<script src="/app.js"></script>  <!-- this builds the entire UI in the browser -->
```

That is the source of the two complaints: before `app.js` downloads and runs,
there is nothing to paint (slow first contentful paint) and nothing for a crawler
that does not execute JavaScript to read (SEO gap). Both are consequences of the
same design choice — rendering in the client.

## After boot, navigation is the payoff

Once the app is running, CSR shines. Navigating between routes does not reload the
page or re-download HTML; the router swaps components and fetches only the data the
new view needs, so transitions feel instant:

```jsx
// no full page reload — the router renders the next view in place
<Link to="/dashboard">Dashboard</Link>;   // swaps components, fetches just the data

function Dashboard() {
  const { data } = useQuery(["stats"], fetchStats);  // only the new data crosses the wire
  return <Stats data={data} />;
}
```

For an app where the user logs in once and then works for twenty minutes — a
dashboard, an editor, an internal tool — that snappy in-app feel is the whole
experience, and the one-time slow boot barely registers.

## Fix the trade-offs, or choose another strategy

The two costs have known mitigations. The slow first paint shrinks with code
splitting (ship only the first screen's JS), a meaningful loading skeleton (so the
shell is not blank), and prefetching the next route. The SEO gap closes with
prerendering for crawlers or moving the public, indexable pages to SSR/SSG while
the authenticated app stays CSR. The honest decision rule: choose CSR when the app
is **behind a login, highly interactive, and SEO-irrelevant**, and reach for SSR
or SSG when the **first view matters to a stranger or a crawler**. CSR is not the
villain — it is the right tool when the first paint is not the thing you are
optimising for. The render-strategy-choice exercise makes you weigh exactly these
factors per page, and the infinite-scroll exercise is a taste of where CSR's
in-app responsiveness genuinely wins.
