---
title: "Largest Contentful Paint: make the biggest thing appear fast"
slug: optimize-the-largest-contentful-paint
layout: post
date: 2026-06-24
author: The Elegant team
category: architecture
tags: [ui, performance, web-vitals, images]
description: 'LCP measures when the largest visible element — usually a hero image or headline — finishes rendering. It is the Core Web Vital users feel most, and fixing it is mostly about the critical path and one image.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [responsive-image-set, render-strategy-choice]
---

Largest Contentful Paint measures one thing: how long until the **largest
visible element** in the viewport finishes rendering. Usually that is a hero
image or a headline, and it is the Core Web Vital users feel most viscerally —
it is the moment the page stops looking empty. Google flags an LCP over 2.5
seconds as poor. The good news is that fixing it is not a grab-bag of tricks; it
is almost always the same short story: find the LCP element, and remove
everything that delays *it* specifically.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="lcp-t lcp-d" class="blog-figure__svg">
  <title id="lcp-t">The four delays between navigation and the LCP element rendering</title>
  <desc id="lcp-d">A timeline from navigation to LCP broken into time to first byte, resource load delay, resource load time, and element render delay. The image load is the largest segment and the main target.</desc>
  <line x1="30" y1="150" x2="610" y2="150" stroke="#dce6f0" stroke-width="2"/>
  <g font-size="10" text-anchor="middle" fill="#606c71">
    <rect x="30" y="120" width="90" height="30" fill="#f3f6fa" stroke="#155799"/><text x="75" y="140" fill="#155799">TTFB</text>
    <rect x="120" y="120" width="70" height="30" fill="#f3f6fa" stroke="#819198"/><text x="155" y="140">load delay</text>
    <rect x="190" y="120" width="230" height="30" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="305" y="140" fill="#c2571a" font-weight="700">image download</text>
    <rect x="420" y="120" width="90" height="30" fill="#e8f0f8" stroke="#157878"/><text x="465" y="140" fill="#157878">render</text>
  </g>
  <text x="30" y="105" fill="#606c71" font-size="11">navigation</text>
  <text x="470" y="105" fill="#c2571a" font-size="11" font-weight="700">LCP</text>
  <circle cx="510" cy="150" r="7" fill="#fe854c"/>
  <text x="305" y="185" text-anchor="middle" fill="#819198" font-size="11">the widest bar is the biggest win: preload it, size it, and don't lazy-load it</text>
</svg>
<figcaption>LCP is the sum of four delays. The image download is usually the widest bar — so that is where the optimisation goes.</figcaption>
</figure>

## Step one: don't hide the LCP image from the preloader

The browser's preload scanner finds resources in the HTML early — but it cannot
find an image whose URL only exists in JavaScript or a CSS `background-image`.
So the single most common LCP bug is a hero that loads *late* because it was not
in the initial HTML. Put the LCP image in an `<img>` in the markup, tell the
browser it is high priority, and never mark it `loading="lazy"`:

```html
<!-- the LCP image: discoverable, high priority, eagerly loaded -->
<img src="/hero-800.jpg"
     fetchpriority="high"
     loading="eager"
     width="800" height="450"
     alt="...">
```

Note the explicit `width`/`height`: they reserve the box so the image does not
shift layout when it arrives — which also protects your Cumulative Layout Shift.

## Step two: preload it and serve the right size

If the image is important enough to be the LCP, tell the browser to fetch it
*before* it finishes parsing the CSS, with a `preload` hint in the head. And
serve a size that fits the slot rather than a 4000px original scaled down — the
bytes you don't send are the fastest bytes:

```html
<link rel="preload" as="image" href="/hero-800.jpg"
      imagesrcset="/hero-400.jpg 400w, /hero-800.jpg 800w"
      imagesizes="(max-width: 600px) 400px, 800px">
```

Pair that with a modern format (AVIF/WebP) and a `srcset` on the `<img>` itself,
and the download bar — the widest one in the diagram — shrinks the most.

## Step three: the render delay is the critical path again

Once the image lands fast, the remaining LCP time is *render delay*: the element
is downloaded but cannot paint yet because a stylesheet or a blocking script is
still holding up the first render. That is the critical rendering path from the
other posts — inline the critical CSS, defer non-essential scripts, subset the
web font so the headline is not waiting on it. The reason LCP is a satisfying
metric to optimise is that it forces you to reason about one concrete element
end to end: what is it, when is it discovered, how big is it, and what is it
waiting on to paint. The responsive-image exercise builds exactly the
`srcset`/`sizes` markup that shrinks the download bar, which is where most real
LCP wins actually come from.
