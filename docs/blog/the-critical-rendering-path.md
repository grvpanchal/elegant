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
reading_minutes: 5
related_practice: [render-strategy-choice, responsive-image-set]
---

Between the moment the HTML arrives and the moment the first pixel appears, the
browser runs a fixed sequence of steps: parse the HTML into a DOM, parse the CSS
into a CSSOM, combine them into a render tree, lay it out, and paint. That
sequence is the **critical rendering path**, and the reason it is worth knowing
is that two things you control — CSS and synchronous JavaScript — can *stall* it.
A page paints sooner not by doing the steps faster but by removing what blocks
them, and to remove a blocker you have to know where it sits on the path.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="crp-t crp-d" class="blog-figure__svg">
  <title id="crp-t">The critical rendering path from HTML to first paint</title>
  <desc id="crp-d">HTML becomes the DOM and CSS becomes the CSSOM; they combine into the render tree, which is laid out and painted. CSS blocks render and a synchronous script blocks parsing. A dot travels the path to the paint.</desc>
  <g font-size="11" text-anchor="middle">
    <rect x="20" y="40" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="65" y="64" fill="#155799">DOM</text>
    <rect x="20" y="110" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="65" y="134" fill="#155799">CSSOM</text>
    <rect x="200" y="75" width="110" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="255" y="99" fill="#157878">render tree</text>
    <rect x="380" y="75" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="425" y="99" fill="#155799">layout</text>
    <rect x="530" y="75" width="90" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="575" y="99" fill="#c2571a" font-weight="700">paint</text>
  </g>
  <g stroke="#819198" stroke-width="2" fill="none" marker-end="url(#crp-a)">
    <path d="M110 60 L195 82"/><path d="M110 130 L195 108"/><path d="M310 95 L375 95"/><path d="M470 95 L525 95"/>
  </g>
  <text x="65" y="180" text-anchor="middle" fill="#c2571a" font-size="11">CSS blocks render</text>
  <text x="255" y="150" text-anchor="middle" fill="#819198" font-size="10">a sync &lt;script&gt; blocks DOM parsing</text>
  <defs><marker id="crp-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
  <circle r="6" fill="#fe854c"><animateMotion dur="3.5s" repeatCount="indefinite" path="M65 60 L255 95 L425 95 L575 95"/></circle>
</svg>
<figcaption>The render tree needs both the DOM and the CSSOM, so CSS blocks the first paint; a synchronous script blocks the DOM it might rewrite.</figcaption>
</figure>

## CSS is render-blocking by design

The render tree needs the CSSOM, and the CSSOM is not ready until the browser
has downloaded and parsed **every** stylesheet it has seen. So a single large
`<link>` in the `<head>` holds the first paint hostage — the browser will not
show a half-styled page. The fix is to ship the styles the first screen needs
inline and defer the rest, or to mark a non-critical stylesheet as not blocking:

```html
<!-- critical styles inline: no round-trip before first paint -->
<style>/* just what the above-the-fold layout needs */</style>

<!-- the rest loads without blocking render, then applies -->
<link rel="stylesheet" href="/full.css" media="print" onload="this.media='all'">
```

## A synchronous script blocks parsing

When the parser hits a plain `<script src>`, it *stops* — it must fetch and run
that script before continuing, because the script might call
`document.write` and change the DOM it is building. Put that script in the
`<head>` and you have paused DOM construction before the body even exists. The
two attributes that fix this tell the browser the script does not need to block:

```html
<!-- defer: fetch in parallel, run in order AFTER the DOM is parsed -->
<script src="/app.js" defer></script>

<!-- async: fetch in parallel, run as soon as it lands (order not guaranteed) -->
<script src="/analytics.js" async></script>
```

Use `defer` for your application code (it needs the DOM and it needs to run in
order); use `async` for independent scripts like analytics that touch nothing
else. The one thing you almost never want is a bare, synchronous script in the
`<head>`.

## The path is the mental model for every "why is it slow?"

Most first-paint problems reduce to one of these two blockers plus a third: a
render-tree element that has to *wait* for a resource, like a web font or the LCP
image. Once you see the page as this pipeline, the tactics fall out — inline
critical CSS, defer scripts, preload the hero image, subset the font — because
each one removes a specific stall from a specific step. The render-strategy
exercise makes you choose where a page should render given its path, which is the
same reasoning applied one level up. Optimising a first paint is not folklore; it
is reading this diagram and asking, at each arrow, "what is the browser waiting
for here, and can I stop making it wait?"
