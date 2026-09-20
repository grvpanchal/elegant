---
title: "Progressive web apps: the service worker is the whole trick"
layout: post
slug: progressive-web-apps-and-service-workers
date: 2026-07-16
author: The Elegant team
category: architecture
tags: [server, pwa, offline, caching]
description: 'A PWA is a website that behaves like an installed app — offline, installable, fast on repeat visits. Almost all of that comes from one piece: a service worker sitting between your page and the network.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [offline-first-list, cache-headers-basics]
---

A progressive web app is a website that behaves like an installed app: it launches
from the home screen, works offline, and loads instantly on repeat visits. Strip
away the marketing and almost all of that capability comes from a single piece of
technology — the service worker, a script that sits between your page and the
network and gets to decide how requests are answered.

## The service worker is a programmable proxy

A service worker is a background script the browser runs separately from your page,
and its superpower is intercepting network requests. When your page asks for a file
or an API response, the service worker can answer from a cache, go to the network,
or do both — you write the strategy. This is what makes offline possible: on the
first visit the worker caches the app shell and key assets, and on later visits it
serves them from that cache with no network at all. The page does not know or care
whether the response came from the network or the cache; the worker decides.

## Caching strategies are policy decisions

The worker lets you pick a caching strategy per kind of request, and each is a real
trade-off. *Cache-first* (serve from cache, fall back to network) is fast and works
offline but can serve stale content — right for your app shell and versioned
assets. *Network-first* (try network, fall back to cache) is fresh but slower and
needs the cache as a fallback — right for data that changes. *Stale-while-
revalidate* serves the cache immediately and updates it in the background — a good
default for content that can be a little stale. Choosing per request is the design
work; there is no single right strategy for everything.

## Installability and the app-like shell

The other half of a PWA is the manifest — a small JSON file declaring the app's
name, icons, and display mode — which, combined with a service worker, lets the
browser offer "install" and launch the app in its own window without browser
chrome. Paired with an app shell cached by the worker, the launched app paints its
frame instantly, exactly like a native app, because it never touches the network to
draw itself. This is where the app shell pattern and the service worker meet: the
shell is what the worker caches to make the launch feel native.

## The gotchas that bite

Service workers are powerful enough to be dangerous. They have a lifecycle (install,
activate, fetch) that trips people up — a new worker does not take control until
the old one's pages close, so users can be stuck on a stale version. Cache
invalidation is genuinely hard: cache too aggressively and users never get updates;
too little and you lose the offline benefit. And a buggy worker can make your site
un-updatable until you ship a fix that unregisters it. Treat the worker's caching as
carefully as you treat HTTP cache headers, because it is the same problem moved into
your own code. The offline-first exercise is a PWA's caching problem in miniature.
