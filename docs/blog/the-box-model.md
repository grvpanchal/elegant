---
title: "The box model, and why box-sizing: border-box exists"
layout: post
slug: the-box-model
date: 2026-07-10
author: The Elegant team
category: terminology
tags: [ui, css, layout, box-model]
description: 'Every element is a box of content, padding, border, and margin. The one setting that changes how width is measured — box-sizing — is why your 50% columns overflow, and why every reset sets it to border-box.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [responsive-image-set]
---

Every element the browser lays out is a rectangular box made of four nested layers:
the content, the padding around it, the border around that, and the margin outside.
Most layout confusion — columns that overflow, elements wider than you set them —
comes down to one question about these layers: when you say `width: 300px`, which
layers does that 300px include? The answer depends on a single property, and
getting it wrong is the classic CSS papercut.

## The four layers

From the inside out: **content** is the text or image; **padding** is space inside
the element, between content and border, and it takes the background; **border** is
the line around the padding; **margin** is space outside the border, separating this
box from its neighbours, and it is transparent. Understanding that padding is inside
(and coloured) while margin is outside (and transparent) resolves a lot of "why is
there a gap" and "why is the background not filling" confusion. They are different
layers with different behaviour, not interchangeable spacing.

## The width trap: content-box vs border-box

By default (`box-sizing: content-box`), `width: 300px` sets the *content* to 300px,
and any padding and border are added *on top*. So a `width: 300px` box with `20px`
padding and a `2px` border is actually 344px wide on the page. This is why two
`width: 50%` columns with padding overflow their container — each is 50% *plus* its
padding, which is more than 100% together. It surprises everyone the first time, and
it keeps surprising until you change the setting.

## border-box makes width mean what you think

Set `box-sizing: border-box` and `width: 300px` means the box is 300px *including*
padding and border — the content shrinks to make room. Now 50% means 50% of the
container, padding and all, and columns behave. This is so much more intuitive that
essentially every CSS reset starts with `*, *::before, *::after { box-sizing:
border-box; }`, making it the default for the whole document. If you have ever
wondered why resets include that line, this is why: it makes `width` predictable.

## Margin collapse, the other surprise

The box model has one more gotcha worth knowing: vertical margins between adjacent
block elements *collapse* — a `20px` bottom margin next to a `30px` top margin
produces `30px` of space between them, not `50px`. This is deliberate (it keeps
stacked paragraphs from double-spacing) but it surprises people debugging a gap that
is smaller than the numbers suggest. Collapse happens only vertically, only between
block-level siblings (and parent/first-child in some cases), and flex/grid children
do not collapse — which is one more reason modern layouts feel more predictable.
The responsive-image exercise runs straight into box-sizing, since an image's box
and its intrinsic size interact exactly here.
