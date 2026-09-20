---
title: "SEO for single-page apps: help the crawler see what the user sees"
slug: seo-for-single-page-apps
date: 2026-07-15
layout: post
author: The Elegant team
category: architecture
tags: [server, seo, rendering, ssr]
description: 'A client-rendered app ships an empty div and fills it with JavaScript. Some crawlers run that JavaScript, many do not or do it late. If organic traffic matters, you have to get real content into the HTML the crawler first sees.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [render-strategy-choice, cache-headers-basics]
---

A client-rendered single-page app ships an almost-empty `<div>` and fills it with
JavaScript after the bundle loads. A human browser runs that JavaScript and sees a full
page; a crawler may not. Google's crawler *can* execute JavaScript, but it does so on a
delay and a budget, and many other crawlers (social preview bots, smaller search
engines, some AI indexers) do not run it at all — they read the raw HTML and move on.
So the SEO problem for an SPA is a gap: the content the *user* sees and the content the
*crawler* first sees are different. If organic traffic or link previews matter, closing
that gap — getting real content into the initial HTML — is the whole job.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="se-t se-d" class="blog-figure__svg">
  <title id="se-t">A crawler reads the initial HTML; a CSR app's initial HTML is empty</title>
  <desc id="se-d">Left: CSR ships an empty div, so a non-JS crawler sees nothing. Right: SSR/prerender ships real content in the HTML, so the crawler indexes what the user sees.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">CSR: empty HTML</text>
  <rect x="60" y="42" width="180" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="150" y="66" text-anchor="middle" fill="#c2571a" font-size="9">&lt;div id="root"&gt;&lt;/div&gt;</text>
  <path d="M150 82 L150 108" stroke="#c2571a" stroke-width="2" marker-end="url(#se-a)"/>
  <rect x="80" y="110" width="140" height="26" rx="5" fill="#f3f6fa" stroke="#819198"/><text x="150" y="127" text-anchor="middle" fill="#819198" font-size="8">non-JS crawler sees nothing</text>
  <line x1="330" y1="18" x2="330" y2="160" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">SSR/prerender</text>
  <rect x="390" y="42" width="180" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="480" y="60" text-anchor="middle" fill="#157878" font-size="8">&lt;h1&gt;Real title&lt;/h1&gt;</text><text x="480" y="74" text-anchor="middle" fill="#157878" font-size="8">real content + meta</text>
  <path d="M480 82 L480 108" stroke="#157878" stroke-width="2" marker-end="url(#se-a)"/>
  <rect x="410" y="110" width="140" height="26" rx="5" fill="#e8f0f8" stroke="#157878"/><text x="480" y="127" text-anchor="middle" fill="#157878" font-size="8">crawler indexes it</text>
  <defs><marker id="se-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>The crawler's first read is the raw HTML. CSR hands it an empty div; SSR or prerendering hands it the real content and meta, so what gets indexed matches what users see.</figcaption>
</figure>

## Get real content into the initial HTML

The core fix is to render content on the server (SSR) or at build time (SSG/prerender)
for the pages that need to rank, so the HTML that arrives already contains the title,
the body text, and the metadata — no JavaScript required to see it:

```html
<!-- what the crawler should receive for an indexable page: real content, server-rendered -->
<head>
  <title>Blue Running Shoes — Acme</title>
  <meta name="description" content="Lightweight blue running shoes, from $89.">
  <link rel="canonical" href="https://acme.com/shoes/blue-runner">
</head>
<body><main><h1>Blue Running Shoes</h1><p>Lightweight, breathable…</p></main></body>
```

A common pragmatic split is SSR/prerender the *public, indexable* pages (marketing,
product, articles) and leave the *authenticated app* client-rendered, since SEO does
not apply behind a login.

## Metadata is per-route, not global

An SPA's biggest SEO footgun is a single, static `<title>` and `<meta>` in `index.html`
for every route — so every page looks identical to a crawler and to a social preview.
Each route needs its *own* title, description, canonical URL, and Open Graph tags,
rendered into that route's HTML:

```jsx
// per-route metadata, rendered on the server for each page
<Head>
  <title>{product.name} — Acme</title>
  <meta property="og:title" content={product.name} />
  <meta property="og:image" content={product.image} />   {/* the link preview image */}
  <link rel="canonical" href={`https://acme.com/p/${product.slug}`} />
</Head>
```

Without this, sharing any page shows the same generic preview, and search engines
cannot tell your pages apart.

## Help the crawler, and verify what it sees

Round it out with the mechanical helpers crawlers expect: a `sitemap.xml` listing your
URLs, a sensible `robots.txt`, real `<a href>` links (not click handlers that a crawler
cannot follow), and structured data (JSON-LD) for rich results. Then *verify* rather
than assume — fetch your page with JavaScript disabled, or use a crawler-simulation
tool, and confirm the content and meta are actually there. The failure mode is silent:
the site looks perfect to you (you run JS) and is invisible to the crawler (it may not).
The one-sentence rule is "make the crawler's first read match the user's final view,"
and getting there is a rendering-strategy decision more than a keywords one. The
render-strategy-choice exercise is exactly that decision — which pages to render where —
and it is the real lever behind SPA SEO.
