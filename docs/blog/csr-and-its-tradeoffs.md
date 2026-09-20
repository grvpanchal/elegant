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
reading_minutes: 4
related_practice: [render-strategy-choice, infinite-scroll-list]
---

Client-side rendering is the model people learned first and now apologize for: the
server sends a near-empty HTML shell and a JavaScript bundle, and the browser
builds the entire UI. It has real downsides that SSR and SSG were invented to
fix. But it also has real advantages, and treating it as always-wrong leads teams
to add server-rendering complexity they did not need.

## How it works and what it costs on first load

A CSR app's first response is an empty `<div id="root">` plus script tags. The
browser must download the bundle, parse and execute it, fetch the page's data,
and only then render — so the user stares at a blank page or spinner during that
sequence. On a slow phone with a big bundle, that first-paint delay is the whole
complaint. It also means a crawler that does not execute JavaScript sees an empty
page, which is the SEO problem. Neither of these is imaginary; they are the cost
of doing all the work in the browser.

## What it buys in return

After that first load, a CSR app is fast and simple in ways the alternatives are
not. Navigation between routes is instant — no server round-trip for HTML, just a
data fetch and a re-render. The hosting is trivial: static files on a CDN, no
server executing render code, no scaling story, no server-only code paths to
guard. The mental model is simpler too — your code runs in one environment, the
browser, so there is no "does this run on the server?" question and no hydration
mismatch class of bug. For an app you enter once and use for a long session, that
simplicity is worth a lot.

## Where CSR is the right call

The clearest case is an app behind a login where SEO is irrelevant and the first
paint is a one-time cost the user pays once per session: an internal dashboard, an
admin tool, a design editor, a webmail client. Nobody is crawling it, users are
often on decent connections, and they stay for a long time, so the initial load
amortizes to nothing. Adding SSR there buys you a faster first paint you do not
need in exchange for a server you now have to run — a bad trade.

## Fixing the downsides without abandoning it

You do not have to jump to SSR to soften CSR's costs. Code-splitting shrinks the
first bundle so the initial parse is smaller. A meaningful loading skeleton makes
the wait feel shorter and reserves layout. Prefetching the data for likely-next
routes hides navigation latency. And for the SEO case specifically, pre-rendering
just the public, crawlable pages while keeping the app CSR covers the requirement
without server-rendering the whole thing. The render-strategy exercise weighs
exactly these trade-offs; treat CSR as one honest option on that spectrum, not a
mistake to migrate away from by default.
