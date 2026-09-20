---
title: "The critical rendering path is the story of your first paint"
layout: post
slug: the-critical-rendering-path
date: 2026-08-12
author: The Elegant team
category: architecture
tags: [server, performance, rendering, web-vitals]
description: 'Between the HTML arriving and the first pixel painting, the browser runs a fixed sequence — and CSS and synchronous JavaScript can block it. Knowing the path is how you make a page paint sooner.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [render-strategy-choice, responsive-image-set]
---

There is a fixed sequence between "the HTML arrived" and "the user sees
something," and everything you can do to make a page feel fast is really about
shortening or unblocking that sequence. It is called the critical rendering path,
and the two things that most often block it — CSS and synchronous JavaScript — are
under your control.

## The sequence

The browser parses HTML into the DOM. In parallel it parses CSS into the CSSOM.
It combines them into the render tree (only visible nodes), computes layout
(geometry), and finally paints. The first paint cannot happen until the render
tree exists, and the render tree needs both the DOM and the CSSOM. So anything
that delays the DOM or the CSSOM delays the first pixel — which is why *where* you
put your CSS and scripts changes how fast the page appears, independent of how
fast your server is.

## CSS is render-blocking by default

The browser will not paint until it has the CSS, because painting with incomplete
styles would flash unstyled content. So a big stylesheet, or one loaded late,
holds up the first paint for the whole page. The fix is to get the *critical* CSS
— the styles needed for above-the-fold content — to the browser as early and as
small as possible, inlining it in the document head when you can, and loading the
rest asynchronously. A megabyte of CSS in one blocking file is a first-paint
tax you pay on every visit.

## JavaScript can block the parser

A plain `<script>` tag blocks HTML parsing while it downloads and executes,
because the script might modify the DOM as the parser is building it. Put a
blocking script in the head and you have stalled the DOM, and therefore the render
tree, and therefore the paint. The fix is `defer` (download in parallel, run
after the DOM is ready, in order) or `async` (download in parallel, run whenever
it arrives) for scripts that do not need to run mid-parse. Modern module scripts
defer by default. The rule: no synchronous script should sit between the user and
the first paint unless it genuinely must.

## Making it paint sooner

The playbook falls out of the path: inline critical CSS and defer the rest; add
`defer`/`async` to scripts so they stop blocking the parser; preload the fonts and
hero image the first screen needs so they are not discovered late; and keep the
above-the-fold content light. Each of these removes something from the blocking
sequence, and the payoff shows up directly in Largest Contentful Paint. The
render-strategy exercise decides how the HTML gets built in the first place, and
the responsive-image exercise handles the single asset that most often dominates
LCP — the hero image.
