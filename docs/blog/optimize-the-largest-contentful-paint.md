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
reading_minutes: 4
related_practice: [responsive-image-set, render-strategy-choice]
---

Largest Contentful Paint measures when the biggest element in the viewport — usually
a hero image, a headline, or a large text block — finishes rendering. It is the Core
Web Vital that correlates most with "does this page feel slow," because it is the
moment the user sees the main thing they came for. The good news is that LCP has a
small number of common causes, so fixing it is more of a checklist than a mystery.

## Find the LCP element first

You cannot optimize what you have not identified, so step one is to find *which*
element is your LCP — dev tools and field data will name it. It is usually one of a
few things: a hero image, a large heading, a banner, or a background image. Knowing
the specific element focuses the work, because the fix depends on what it is. Teams
waste effort optimizing things that are not the LCP element while the actual culprit
— often one late-loading hero image — sits unaddressed.

## If it's an image, prioritize it

When the LCP element is an image (the common case), the fixes are concrete. Do *not*
lazy-load it — lazy-loading your hero delays the very thing LCP measures; that
attribute is for below-the-fold images. Mark it high priority (`fetchpriority="high"`)
so the browser fetches it before less important resources. Preload it if it is
discovered late (e.g. set via CSS). Serve it in a modern format at the right size via
`srcset` so the bytes are minimal. And give it explicit dimensions so it does not also
cause layout shift. Most bad LCP scores on image-led pages are one un-prioritized,
oversized hero.

## Clear the critical path

The other big lever is the critical rendering path, because the LCP element cannot
paint until the browser gets through the render-blocking work in front of it.
Render-blocking CSS, synchronous scripts in the head, and slow server responses all
push LCP later. So inline critical CSS and defer the rest, add `defer`/`async` to
scripts, and get the first byte fast (a slow server or an un-cached HTML document
delays everything downstream). If the LCP element is text, a web font that loads late
can delay it too — so preload the font and use `font-display: swap` so text paints in
a fallback immediately.

## Measure in the field, not just the lab

Your local lab score on a fast machine and connection lies about what real users
experience, so trust field data (real-user monitoring) over a one-off lab run. LCP
varies enormously with device and network, and the users with poor scores are exactly
the ones on slow phones and connections you are not testing on. Optimize for the real
distribution: prioritize the hero, clear the critical path, and verify with field
metrics. The responsive-image exercise is the single highest-leverage LCP fix (the
right hero image, prioritized), and the render-strategy exercise decides how fast the
HTML that contains it arrives in the first place.
