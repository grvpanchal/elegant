---
title: "Responsive images: describe the options, let the browser choose"
slug: responsive-images-let-the-browser-choose
layout: post
date: 2026-08-10
author: The Elegant team
category: terminology
tags: [ui, performance, images, web-vitals]
description: 'Shipping one large image to every device wastes data on phones and looks soft on retina screens. srcset and sizes let you describe the options and hand the choice to the browser, which knows the device better than you do.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 5
related_practice: [responsive-image-set, cache-headers-basics]
---

Ship one image to every device and you lose both ways: a phone on cellular
downloads a 2000px hero it will render at 375px (wasted data and a slow LCP), while
a retina laptop gets an image too small to look crisp. The fix is not to pick a
"medium" size that is wrong for everyone. It is to **describe the options** and let
the *browser* choose, because at request time the browser knows things you never
can at build time — the device pixel ratio, the viewport width, the current network
— and it picks the smallest file that will still look sharp. `srcset` and `sizes`
are how you hand it that choice.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="ri-t ri-d" class="blog-figure__svg">
  <title id="ri-t">The author lists image widths; the browser matches one to the device</title>
  <desc id="ri-d">A srcset lists 400w, 800w and 1600w options. Three devices — phone, laptop, retina — each receive the appropriately sized file chosen by the browser.</desc>
  <rect x="30" y="70" width="140" height="60" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="100" y="94" text-anchor="middle" fill="#157878" font-size="10">srcset</text><text x="100" y="112" text-anchor="middle" fill="#819198" font-size="9">400 · 800 · 1600w</text>
  <path d="M170 85 L250 55" stroke="#819198" stroke-width="2" marker-end="url(#ri-a)"/><path d="M170 100 L250 100" stroke="#819198" stroke-width="2" marker-end="url(#ri-a)"/><path d="M170 115 L250 145" stroke="#819198" stroke-width="2" marker-end="url(#ri-a)"/>
  <g font-size="9" text-anchor="middle">
    <rect x="250" y="40" width="150" height="30" rx="5" fill="#f3f6fa" stroke="#155799"/><text x="325" y="59" fill="#155799">phone → 400w</text>
    <rect x="250" y="85" width="150" height="30" rx="5" fill="#f3f6fa" stroke="#155799"/><text x="325" y="104" fill="#155799">laptop → 800w</text>
    <rect x="250" y="130" width="150" height="30" rx="5" fill="#fff4ec" stroke="#fe854c"/><text x="325" y="149" fill="#c2571a">retina → 1600w</text>
  </g>
  <text x="500" y="100" text-anchor="middle" fill="#819198" font-size="10">browser picks the</text><text x="500" y="116" text-anchor="middle" fill="#819198" font-size="10">smallest sharp file</text>
  <defs><marker id="ri-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>You publish several widths and describe the slot; the browser, knowing the device and viewport, downloads exactly one — the smallest that still looks crisp.</figcaption>
</figure>

## srcset lists the widths; sizes describes the slot

`srcset` gives the browser the candidate files and their intrinsic widths (the `w`
descriptor). `sizes` tells it how wide the image will *display* at various
breakpoints, so it can do the maths — display width × pixel ratio — and pick:

```html
<img
  src="/hero-800.jpg"                         <!-- fallback for old browsers -->
  srcset="/hero-400.jpg 400w,
          /hero-800.jpg 800w,
          /hero-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"      <!-- full width on phones, half on desktop -->
  width="800" height="450"                     <!-- reserve the box: no layout shift -->
  alt="A city skyline at dusk">
```

On a 375px phone the browser computes ~375 CSS px × 2 DPR ≈ 750px and grabs the
800w file; on a wide retina desktop it reaches for the 1600w. You wrote the options
once; the browser made the right call for each visitor.

## picture: when the image itself should change

`srcset` chooses between sizes of the *same* image. When you need to change the
image — a different crop on mobile (art direction), or a modern format with a
fallback — use `<picture>` with `<source>` elements, which let you swap by media
query or type:

```html
<picture>
  <source type="image/avif" srcset="/hero.avif">   <!-- modern format if supported -->
  <source media="(max-width: 600px)" srcset="/hero-square.jpg"> <!-- tighter crop on phones -->
  <img src="/hero.jpg" alt="A city skyline at dusk" width="800" height="450">
</picture>
```

The browser takes the first `<source>` it supports and matches, falling back to the
`<img>`.

## Always reserve the box, and lazy-load below the fold

Two habits make responsive images pay off without side effects. Always set `width`
and `height` (or an `aspect-ratio`) so the browser reserves the correct box before
the file arrives — otherwise the page reflows when it loads, hurting Cumulative
Layout Shift. And add `loading="lazy"` to images *below* the fold so they do not
compete for bandwidth with the first screen — but never to the LCP hero, which you
want eager and high priority. Describe the options, reserve the space, defer what
is offscreen, and the browser does the rest better than a fixed choice ever could.
The responsive-image-set exercise builds exactly this `srcset`/`sizes` markup, which
is where the "hand the choice to the browser" idea becomes muscle memory.
