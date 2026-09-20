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
reading_minutes: 4
related_practice: [cache-headers-basics, proxy-and-cors]
---

Every response your server sends carries instructions about how long it may be
reused, and browsers and CDNs obey them. Those instructions are the caching
headers — `Cache-Control`, `ETag`, `Last-Modified` — and most performance
problems on static assets come down to getting them wrong: either caching things
that change (users see stale files) or failing to cache things that don't
(throwing away free speed on every visit).

## Cache-Control is the main dial

`Cache-Control` sets the policy. `max-age=31536000` says "reuse this for a year
without asking." `no-cache` says "you may store it, but revalidate with me before
using it." `no-store` says "do not keep this at all." `public` allows shared
caches (CDNs) to store it; `private` restricts it to the user's browser. The
combination you pick per resource is the contract: a hashed JavaScript bundle can
be cached for a year because its name changes when its content does, while an
HTML document that must reflect fresh content wants `no-cache` so the browser
always checks.

## The immutable-asset pattern

The single most valuable pattern is content-hashed filenames plus a long
`max-age`. Name your assets `app.9f3c2a.js`, where the hash is derived from the
content, and serve them with `Cache-Control: max-age=31536000, immutable`. Now the
browser caches them effectively forever and never even revalidates — and when you
deploy a change, the hash changes, the filename changes, and it is a *new* URL the
browser has never seen, so it fetches the new one. You get permanent caching and
instant cache-busting at once, with no manual purging. This is why build tools
hash filenames by default.

## Revalidation with ETag

For resources you cannot fingerprint — an HTML page, an API response — you still
want to avoid re-downloading unchanged bytes. That is what `ETag` and
`Last-Modified` do: the server sends a validator, the browser sends it back next
time with `If-None-Match`, and if nothing changed the server replies `304 Not
Modified` with an empty body. The user's browser reuses its cached copy, and you
paid only for a tiny round-trip instead of the full payload. It is the middle
ground between "cache forever" and "fetch every time."

## The mistakes that bite

Two errors recur. Caching HTML with a long `max-age` freezes users on an old
version of the app until their cache expires — always keep the HTML entry point
short-lived or `no-cache`. And forgetting to cache genuinely static assets means
every visit re-downloads your fonts, images, and bundles, wasting the user's data
and your bandwidth. The discipline is to classify each response — is it
fingerprinted and immutable, is it revalidatable, or must it never be stored — and
set headers to match. The caching exercise walks through exactly that
classification for a real static app, and the proxy-and-CORS exercise is where
these headers meet the network boundary.
