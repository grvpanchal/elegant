---
title: "Hydration is the handoff from server HTML to a live app"
layout: post
slug: hydration-is-the-handoff
date: 2026-08-18
author: The Elegant team
category: architecture
tags: [server, ssr, hydration, performance]
description: 'Hydration is the moment server-rendered HTML becomes interactive, when the client JavaScript attaches to the existing markup. It is also where a whole class of subtle SSR bugs and performance costs live.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [render-strategy-choice, counter-component]
---

Server-side rendering gives the user HTML immediately, but that HTML is inert —
buttons do not respond, state does not update — until the JavaScript loads and
takes over. That takeover is **hydration**: the client framework walks the
server-rendered DOM, reconciles it with the component tree, and attaches event
handlers so the static markup becomes a live application. Understanding
hydration explains both why SSR feels the way it does and why its trickiest bugs
happen.

## Attaching, not re-rendering

The key idea is that hydration reuses the existing DOM rather than throwing it
away and rebuilding. The server already produced the correct markup; the client's
job is to adopt it — match each element to the component that produced it and
wire up interactivity — not to render from scratch. That reuse is what makes SSR
worthwhile: if the client just rebuilt everything, the server HTML would flash and
be discarded. Done right, the user never sees the handoff; the page they were
already looking at simply becomes responsive.

## The mismatch bug

The reuse only works if the client's first render produces the *same* tree the
server did. When they disagree — a mismatch — the framework warns and may throw
away the server markup and re-render, costing you the SSR benefit and sometimes
flashing content. Mismatches come from rendering something that differs between
server and client: `Date.now()` or `Math.random()` at render time, reading
`window` or `localStorage` during the initial render, or locale/timezone
differences. The fix is to make the first client render deterministic and equal
to the server's, deferring anything browser-specific to an effect that runs after
hydration.

## The performance cost nobody mentions at first

Hydration is not free, and on large pages it can dominate. The browser has shown
the user content quickly (good), but the page is not actually usable until
hydration finishes attaching handlers — and hydration has to process the whole
tree, which on a heavy page can block the main thread and leave the user tapping
dead buttons on visible content. This is the "uncanny valley" of SSR: it *looks*
ready before it *is* ready. The gap between first paint and interactivity is a
real metric (it shows up as INP/TBT), and a big hydration cost widens it.

## How the ecosystem is shrinking it

Because hydration is the bottleneck, modern approaches attack it directly.
Partial or selective hydration hydrates only the interactive islands and leaves
static content as plain HTML forever. Progressive hydration prioritizes
in-viewport or interacted-with components first. Server components push the idea
further by never shipping some components' JavaScript at all. The through-line is
that the less you hydrate, the smaller the gap between visible and usable. When
you choose SSR in the render-strategy exercise, remember you are also choosing to
pay for hydration — and that keeping interactive surface small is how you keep
that bill down.
