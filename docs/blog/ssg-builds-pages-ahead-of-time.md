---
title: "Static site generation: render once, serve a million times"
layout: post
slug: ssg-builds-pages-ahead-of-time
date: 2026-08-20
author: The Elegant team
category: architecture
tags: [server, ssg, performance, caching]
description: 'Static generation renders your pages at build time, not per request, so the server just hands out files. It is the fastest and cheapest option for content that does not change per user — until the content changes often.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [render-strategy-choice, cache-headers-basics]
---

Server-side rendering runs your components on every request. Static site
generation runs them **once**, at build time, and writes the resulting HTML to
files. From then on the server does nothing but hand out those files — the same
work a plain file host or a CDN does best. For content that is the same for every
user, this is the fastest and cheapest rendering strategy there is.

## Build time instead of request time

With SSG, your build step walks every route, fetches its data, renders it to
HTML, and emits a file per page. Deploy those files to a CDN and a request is
answered from an edge cache in milliseconds, with no server executing anything.
There is no cold start, no per-request CPU, no render to wait on — the expensive
work already happened, once, before anyone visited. This is why documentation
sites, blogs, and marketing pages are almost always statically generated: the
content is identical for everyone, so rendering it per request is pure waste.

## The unbeatable performance and cost story

Because the output is static files, SSG gives you the best first-paint numbers
and the lowest hosting bill simultaneously. A CDN serves the HTML from a location
near the user, cached, with no origin round-trip in the common case. There is
nothing to scale under traffic spikes — a static file serves the same whether one
person or a million request it. Security surface shrinks too: there is no
per-request server code to exploit. For the right content, nothing else competes.

## The freshness problem

The catch is the whole model: pages are frozen at build time. If your data
changes after the build, the site is stale until you rebuild and redeploy. For a
blog that updates when you publish, that is fine — you rebuild on publish. For a
price that changes hourly or a feed that updates constantly, rebuilding the whole
site every time is absurd. This is the tension SSG lives with, and it is why
"just make it static" fails for dynamic content: you have traded per-request
freshness for per-request speed, and sometimes freshness is the requirement.

## Incremental and hybrid escapes

The frameworks answer the freshness problem with incremental regeneration:
statically generate pages, but let them be rebuilt in the background on a schedule
or on demand, so most requests hit a cached static page and stale ones refresh
without a full site build. That blends SSG's speed with a bounded staleness
window. The broader pattern is to mix strategies per route — static for the
marketing pages, incremental for the product catalog, server-rendered for the
per-user dashboard — rather than picking one for the whole app. The
render-strategy exercise makes you choose per page, and the caching exercise is
where SSG's CDN story connects to real cache headers.
