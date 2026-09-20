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
reading_minutes: 4
related_practice: [render-strategy-choice, design-localized-app, cache-headers-basics]
---

Open a client-rendered app with a slow connection and you watch a blank page,
then a spinner, then finally content — because the first response was an empty
`<div id="root">` and the browser had to download, parse, and run JavaScript
before anything appeared. Server-side rendering flips that: the server runs your
components, produces real HTML, and sends it in the first response. The user sees
content immediately, and the JavaScript catches up afterward.

## What the server actually does

With SSR, a request comes in and the server executes your component tree for that
URL — fetching whatever data the page needs, rendering to an HTML string, and
returning a fully-formed document. The browser paints that HTML right away, so
the first contentful paint does not wait on your bundle. Then the same JavaScript
that would have rendered on the client loads and *hydrates* the markup, attaching
event handlers so the page becomes interactive. Two phases: see it (server HTML),
then use it (client hydration).

## Why teams reach for it

Two reasons dominate. The first is perceived performance on real networks: HTML
in the first response means the user is looking at content while the bundle
downloads, which matters enormously on mobile. The second is SEO and link
previews: crawlers and social scrapers that do not run JavaScript well see a
populated page instead of an empty shell. For content that must be indexed —
marketing pages, articles, product listings — that alone can decide the choice.
Localization benefits too: the server can render in the right language and
currency from the request, rather than shipping a flash of the wrong locale.

## The costs you are signing up for

SSR is not free. Your server now runs your rendering code on every request, which
costs CPU and adds a server you must scale and keep warm — a static file host
cannot do this. Your components must run in both environments, so browser-only
assumptions (`window`, `document`, `localStorage` at module load) break the
server render and have to be guarded. Data fetching moves earlier and has to be
ready at render time. And you inherit the hydration mismatch class of bug, where
the server HTML and the first client render disagree and the framework warns or
re-renders.

## When it is worth it

Choose SSR when first-paint on slow networks matters, when SEO is a real
requirement, or when per-request personalization (locale, auth-gated content)
needs to be in the initial HTML. Lean away from it for an internal dashboard
behind a login, where SEO is irrelevant and users are on fast networks — there a
client-rendered app is simpler and a static host is cheaper. Many apps land in
between with a hybrid: static-render what can be, server-render what must be
per-request, and client-render the interactive islands. The render-strategy
exercise is exactly this decision made concrete, and the localized-app design
question is where SSR's per-request rendering earns its keep.
