---
title: "Responsive images: describe the options, let the browser choose"
layout: post
slug: responsive-images-let-the-browser-choose
date: 2026-08-10
author: The Elegant team
category: terminology
tags: [ui, performance, images, web-vitals]
description: 'Shipping one large image to every device wastes data on phones and looks soft on retina screens. srcset and sizes let you describe the options and hand the choice to the browser, which knows the device better than you do.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [responsive-image-set, cache-headers-basics]
---

Images are usually the heaviest thing on a page, so getting them right is the
highest-leverage performance work you can do. The mistake is shipping one image
size to everyone: a 2000px hero wastes megabytes on a phone that will display it
at 375px, and a 375px image looks blurry on a high-density laptop screen. The fix
is not to guess the device — it is to describe your options and let the browser,
which knows the viewport and pixel density, pick.

## srcset offers resolutions

The `srcset` attribute lists the same image at several widths, and `sizes` tells
the browser how wide the image will actually render at different breakpoints.
Given both, the browser does the math — viewport, layout width, device pixel
ratio — and downloads the single best file, no JavaScript involved. A phone grabs
the small one and saves data; a retina laptop grabs the large one and stays sharp.
You are not detecting the device; you are handing the browser the information it
needs to choose, which it does better and more cheaply than any script could.

## picture handles art direction and formats

When you need more than a resolution swap — a different *crop* on mobile, or a
modern format with a fallback — `<picture>` with `<source>` elements is the tool.
Use it to serve a tightly-cropped image on narrow screens and a wide one on
desktop (art direction), or to offer AVIF and WebP with a JPEG fallback so
capable browsers get the smaller modern format and older ones still work. The
browser picks the first `<source>` it supports, so you get progressive
enhancement for free.

## Reserve the space to avoid layout shift

A fast image that arrives late still hurts if it shoves the page around when it
lands — that is Cumulative Layout Shift, and it is jarring and bad for your Core
Web Vitals. Always give images explicit `width` and `height` attributes (or a CSS
`aspect-ratio`), so the browser reserves the correct box before the image loads
and nothing jumps when it arrives. This one attribute pair fixes a large share of
real-world layout-shift complaints.

## Lazy-load below the fold, prioritize above it

Finally, tell the browser what is urgent. Add `loading="lazy"` to images below the
fold so they are not fetched until the user scrolls near them, saving bandwidth on
content they may never see. Conversely, do *not* lazy-load your hero image — it is
your Largest Contentful Paint element, so mark it high priority and let it load
immediately. The through-line is the same as the rest of responsive images: give
the browser accurate signals about size, format, and urgency, and it will make
better decisions than a hard-coded choice ever could. The responsive-image
exercise builds exactly this markup.
