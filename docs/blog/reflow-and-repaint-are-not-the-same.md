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
reading_minutes: 3
related_practice: [infinite-scroll-list, skeleton-list]
---

The browser turns your DOM and CSS into pixels through a pipeline, and two stages
in it have very different costs. **Reflow** (layout) computes the geometry —
where every box goes and how big it is. **Repaint** fills in pixels — colors,
shadows, text. Reflow is the expensive one, because moving one box can shift
everything after it. Knowing which of your changes triggers which is the
difference between sixty frames a second and visible jank.

## What triggers each

Changing `color`, `background`, `visibility`, or `box-shadow` repaints but does
not reflow — the geometry is unchanged. Changing `width`, `height`, `top`,
`margin`, `font-size`, or adding and removing elements forces a reflow, because
the browser must recompute layout. A reflow is usually followed by a repaint;
a repaint alone is cheaper.

The trap is "layout thrashing": reading a geometric property (`offsetHeight`,
`getBoundingClientRect`) right after writing one, in a loop. Each read forces the
browser to flush a pending reflow so it can answer accurately, so a loop that
measures-then-mutates-then-measures reflows on every iteration. A list of fifty
items can trigger fifty synchronous reflows and drop frames on a device that
would have handled one.

## Batching reads and writes

The fix is to separate the phases: read all the geometry you need first, then do
all the writes. Or hand the timing to the browser with `requestAnimationFrame`,
which lets it batch layout for the next frame. For animation, prefer `transform`
and `opacity` — the compositor can animate those without reflow or even repaint,
on the GPU, which is why a `transform: translateX()` scroll is smooth where an
animated `left` stutters.

## The compositor is the fast path

There is a third stage below layout and paint: compositing, where the browser
takes already-painted layers and arranges them, often on the GPU. Properties that
only affect compositing — `transform` and `opacity` — can be changed without
reflow *or* repaint, which is why they animate smoothly even on modest hardware.
This is the concrete reason the advice "animate transform, not top/left" keeps
coming up: animating `left` reflows every frame, animating `transform` just
recomposites. You can hint the browser to promote an element to its own layer
with `will-change: transform`, but use it sparingly — every layer costs memory,
and promoting everything is its own performance bug. The mental hierarchy to
carry is cost-ordered: compositing is cheap, painting is moderate, layout is
expensive, and synchronous layout inside a loop is the thing that actually drops
your frames.

## Why it matters for lists

This is not academic. An infinite-scroll list that measures each row as it
inserts it will thrash; one that measures once and reuses the number stays
smooth. A skeleton screen that reserves the final layout avoids the reflow that a
late-arriving image would otherwise cause (and the layout shift the user sees).
When a list feels janky, the first question is: how many reflows am I forcing per
frame, and can I batch them into one? The infinite-scroll exercise is where this
bites first.
