---
title: "Reflow and repaint are not the same, and the difference is your frame budget"
layout: post
slug: reflow-and-repaint-are-not-the-same
date: 2026-09-10
author: The Elegant team
category: terminology
tags: [ui, performance, rendering, layout]
description: Changing a color repaints. Changing a size reflows. Reflow is the expensive one, and doing it inside a loop is how a smooth list turns into a janky one.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [infinite-scroll-list, skeleton-list]
---

Not all style changes cost the same. Change an element's `color` and the browser
only has to **repaint** — re-fill the pixels, cheap. Change its `width`, and the
browser has to **reflow** — recompute the geometry of that element and, often,
everything after it in the document, *then* repaint. Reflow is the expensive one,
and the classic performance bug is triggering it over and over inside a loop.
With a 60fps target you have about 16 milliseconds per frame; a reflow storm
blows that budget and the page visibly stutters.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="rr-t rr-d" class="blog-figure__svg">
  <title id="rr-t">Repaint redraws pixels; reflow recomputes geometry then repaints</title>
  <desc id="rr-d">A colour change goes straight to paint. A size change goes through layout first, which recomputes geometry, then paint. The layout step is highlighted as the expensive one.</desc>
  <text x="130" y="34" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">repaint (cheap)</text>
  <rect x="40" y="50" width="120" height="38" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="100" y="74" text-anchor="middle" fill="#155799" font-size="11">color change</text>
  <path d="M160 69 L250 69" stroke="#819198" stroke-width="2" marker-end="url(#rr-a)"/>
  <rect x="250" y="50" width="90" height="38" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="295" y="74" text-anchor="middle" fill="#157878" font-size="11">paint</text>
  <text x="130" y="128" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">reflow (expensive)</text>
  <rect x="40" y="144" width="120" height="38" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="100" y="168" text-anchor="middle" fill="#155799" font-size="11">size change</text>
  <path d="M160 163 L250 163" stroke="#819198" stroke-width="2" marker-end="url(#rr-a)"/>
  <rect x="250" y="144" width="120" height="38" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="310" y="168" text-anchor="middle" fill="#c2571a" font-size="11">layout (geometry)</text>
  <path d="M370 163 L450 163" stroke="#819198" stroke-width="2" marker-end="url(#rr-a)"/>
  <rect x="450" y="144" width="90" height="38" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="495" y="168" text-anchor="middle" fill="#157878" font-size="11">paint</text>
  <defs><marker id="rr-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>A repaint skips layout. A reflow pays for layout first — and layout can cascade to every element after the one you changed.</figcaption>
</figure>

## Layout thrashing: the read-write-read trap

The worst case is not one reflow — it is forcing many by interleaving *reads* and
*writes*. When you write a style the browser can batch it and reflow once, later.
But if you then *read* a geometry property like `offsetHeight`, the browser must
flush the pending changes and reflow *now* to give you an accurate answer. Do
that in a loop and you force a synchronous reflow on every iteration:

```js
// BAD — reads offsetWidth after each write, forcing a reflow per item
for (const el of items) {
  el.style.width = el.offsetWidth + 10 + "px";  // read forces reflow, write dirties it
}
```

## Batch the reads, then batch the writes

The fix is to separate the phases: read every value first (one reflush at most),
then apply every write (batched into one reflow). The measurements are all taken
against the same clean layout, and the mutations settle together:

```js
// GOOD — one read phase, then one write phase
const widths = items.map((el) => el.offsetWidth);   // all reads
items.forEach((el, i) => {
  el.style.width = widths[i] + 10 + "px";           // all writes, batched
});
```

For animation, go one step further and stay on properties that skip layout
entirely. `transform` and `opacity` can be handled by the compositor on their own
layer — they neither reflow nor repaint the main content, which is why a
`transform: translateX()` animation is smooth where animating `left` janks:

```css
/* compositor-friendly: no reflow, no repaint of siblings */
.card { transition: transform 200ms; }
.card:hover { transform: translateY(-4px); }
```

The rule of thumb is a hierarchy of cost: compositing (transform/opacity) is
cheapest, repaint is next, reflow is dearest, and forced synchronous reflow in a
loop is the thing that actually drops frames. When a list scrolls smoothly until
it doesn't, this is almost always why — you are reading geometry mid-mutation.
A useful habit is to reach for the browser's own tools before guessing: the
Performance panel marks forced reflows in purple and names the line that
triggered each one, so "why is this janky" becomes a specific stack trace rather
than a hunch. And for measurements you genuinely need during a frame, batch them
behind `requestAnimationFrame`, which runs your callback just before layout so a
single read reflects every pending write at once.
The infinite-scroll exercise is where that lesson bites hardest, because a scroll
handler that thrashes layout turns a long list into a slideshow.
