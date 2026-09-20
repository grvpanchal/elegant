---
title: "HTTP cache headers are a contract you are signing with every browser"
layout: post
slug: http-cache-headers-are-a-contract
date: 2026-08-16
author: The Elegant team
category: architecture
tags: [server, caching, performance, http]
description: 'Cache-Control, ETag and the rest are not obscure server trivia — they are how you tell every browser and CDN how long to trust a response. Get them wrong and you either serve stale files or throw away free speed.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [cache-headers-basics, proxy-and-cors]
---

Every response you send carries an implicit answer to "how long may this be
reused?" — and if you do not set the caching headers deliberately, the browser and
any CDN in between guess, usually badly. `Cache-Control`, `ETag`, and friends are
not obscure server trivia; they are a **contract** you sign with every client about
how long to trust a response and how to check whether it is still good. Get the
contract wrong in one direction and users see stale files after a deploy; get it
wrong in the other and you throw away free speed by re-downloading things that never
changed. Getting it right is one of the cheapest performance wins available.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="hc-t hc-d" class="blog-figure__svg">
  <title id="hc-t">Fresh responses serve from cache; stale ones revalidate with an ETag</title>
  <desc id="hc-d">A response with max-age is served from cache until it expires. After that the browser sends its ETag; the server answers 304 Not Modified if unchanged, or 200 with new content if changed.</desc>
  <rect x="30" y="40" width="120" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="90" y="62" text-anchor="middle" fill="#157878" font-size="9">within max-age</text>
  <path d="M150 57 L250 57" stroke="#157878" stroke-width="2" marker-end="url(#hc-a)"/>
  <rect x="250" y="40" width="150" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="325" y="62" text-anchor="middle" fill="#157878" font-size="9">served from cache (fast)</text>
  <rect x="30" y="110" width="120" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="90" y="132" text-anchor="middle" fill="#c2571a" font-size="9">stale → revalidate</text>
  <path d="M150 127 L250 127" stroke="#819198" stroke-width="2" marker-end="url(#hc-a)"/><text x="200" y="119" text-anchor="middle" fill="#819198" font-size="8">If-None-Match: etag</text>
  <rect x="250" y="95" width="150" height="30" rx="6" fill="#f3f6fa" stroke="#155799"/><text x="325" y="114" text-anchor="middle" fill="#155799" font-size="9">304 → reuse (no body)</text>
  <rect x="250" y="130" width="150" height="30" rx="6" fill="#f3f6fa" stroke="#155799"/><text x="325" y="149" text-anchor="middle" fill="#155799" font-size="9">200 → new content</text>
  <path d="M400 110 L440 110" stroke="#157878" stroke-width="1.5" marker-end="url(#hc-a)"/><path d="M400 145 L440 145" stroke="#c2571a" stroke-width="1.5" marker-end="url(#hc-a)"/>
  <defs><marker id="hc-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Inside max-age the file is reused with no request at all; once stale, a conditional request lets the server say "still good" (304) cheaply, or send fresh content.</figcaption>
</figure>

## Cache-Control sets the freshness lifetime

`Cache-Control` is the main clause of the contract. `max-age` says how many seconds
the response may be reused without asking; `no-cache` means "you may store it, but
revalidate before every use"; `no-store` means "never keep it." The trick is that
different resources want different terms:

```http
# a hashed, immutable asset: cache hard, forever — the filename changes when it does
Cache-Control: public, max-age=31536000, immutable

# an HTML page that must reflect the latest deploy: store, but check every time
Cache-Control: no-cache
```

`immutable` on a content-hashed file (`app.9f3c1.js`) is the single biggest win:
the browser reuses it with *no request at all* until the hash — and thus the URL —
changes.

## ETag makes revalidation nearly free

When a response is stale (or `no-cache`), the browser does not blindly re-download.
It sends the `ETag` it stored via `If-None-Match`, and the server compares: if
unchanged, it replies `304 Not Modified` with **no body**, so the browser reuses
its copy for the cost of a tiny round-trip:

```http
# first response
HTTP/1.1 200 OK
ETag: "abc123"

# later, browser revalidates
GET /data  If-None-Match: "abc123"
HTTP/1.1 304 Not Modified          ← no body sent; browser reuses its cached copy
```

You pay for headers, not for the payload — which for a large unchanged file is
almost all the savings of a full cache hit.

## The two failure modes, and the pattern that avoids both

Bad caching fails in two directions. Cache HTML too long and users run an old app
after you deploy (the "hard refresh fixes it" bug). Cache assets too little and you
re-download megabytes that never changed. The standard pattern resolves both:
**content-hash your static assets and cache them `immutable` forever**, while
serving **HTML with `no-cache`** so it always revalidates. A deploy changes the
asset filenames, the fresh HTML references the new names, and users get the update
instantly *and* keep every unchanged asset from cache. The contract is only
dangerous when you sign it by accident; sign it deliberately — long for hashed
assets, revalidate for HTML, `no-store` for anything private — and caching becomes
pure upside. The cache-headers-basics exercise walks through choosing the right
clause per resource type, which is where this stops being header trivia and becomes
a deploy strategy.
