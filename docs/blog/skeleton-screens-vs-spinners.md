---
title: "Skeleton screens beat spinners, and it is not close"
layout: post
slug: skeleton-screens-vs-spinners
date: 2026-07-23
author: The Elegant team
category: terminology
tags: [ui, ux, performance, loading]
description: 'A spinner says "wait, something is happening somewhere." A skeleton says "here is the shape of what is coming, in this exact spot." The second feels faster and shifts less, and the reasons are worth knowing.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [skeleton-list, infinite-scroll-list]
---

When content is loading, you have to show the user something, and the default
reach is a spinner. A better default is a skeleton screen — a grey placeholder in
the exact shape of the content that is coming. It is not just a style preference:
skeletons feel faster, reduce layout shift, and communicate more, and the reasons
are concrete enough to make it a default rather than a taste call.

## A spinner communicates almost nothing

A centered spinner says "something is loading, somewhere, for some unknown length
of time." It gives the user no sense of what is coming, how much of it there is, or
how the page will be laid out. It also tends to sit in the middle of an empty
container, so when the real content arrives it appears somewhere else and shoves
the layout around. And because a spinner is visually "busy," it can make a wait
*feel* longer — the animation draws attention to the fact that you are waiting.

## A skeleton previews the result

A skeleton shows the structure before the data: grey bars where the text will be,
a grey block where the image will go, laid out exactly where the real content will
land. This does two things. It tells the user what kind of content is coming and
roughly how much, so the wait feels purposeful rather than blank. And because the
skeleton occupies the same space the content will, there is no layout shift when
the data arrives — the grey bar is simply replaced by text in the same spot. The
perceived speed comes partly from that continuity: the page looked "ready" the
whole time, then just filled in.

## Layout stability is the measurable win

Beyond feel, skeletons directly improve Cumulative Layout Shift, a real Core Web
Vitals metric and a real annoyance — content jumping as things load causes
mis-taps and lost reading positions. A skeleton that matches the final content's
dimensions reserves the layout from the first paint, so nothing moves when data
arrives. This is the same principle as setting explicit `width`/`height` on images:
tell the browser the final size up front, and the page stays put. Skeletons apply
it to whole sections, not just images.

## When a spinner is still right

Skeletons are not universal. They fit content whose shape you know in advance — a
list of cards, an article, a profile. For an *action* with an unknown-shaped
result (submitting a form, a button that triggers a process), a spinner or a
progress indicator on the control itself is the right signal, because there is no
"shape of the result" to preview. And for a genuinely instant-or-nothing operation,
showing any loading state at all can be worse than showing none. The rule: preview
the shape when you know it (skeleton), indicate activity when you don't (spinner on
the control). The skeleton-list exercise builds the placeholder-to-content
transition, and the infinite-scroll exercise is where skeletons keep a growing list
from lurching as new pages load.
