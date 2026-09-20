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
reading_minutes: 5
related_practice: [skeleton-list, infinite-scroll-list]
---

A spinner and a skeleton screen both fill the gap while data loads, but they say
different things to the user. A spinner says "wait — something is happening,
somewhere, for some amount of time." A skeleton says "here is the *shape* of what
is coming, in this *exact spot*, any moment now." The second feels faster even when
the actual load time is identical, and it shifts the layout less when the content
arrives. Those are not aesthetic preferences; they come from how people perceive
waiting and how the browser lays out a page — and once you know why, the choice is
rarely close.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="sk-t sk-d" class="blog-figure__svg">
  <title id="sk-t">A spinner is a placeholder with no shape; a skeleton previews the real layout</title>
  <desc id="sk-d">Left: a card area with a centred spinner and no structure. Right: a card area with grey skeleton blocks matching the shape of an avatar, title and lines that the content will occupy.</desc>
  <text x="150" y="26" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">spinner</text>
  <rect x="60" y="40" width="180" height="130" rx="8" fill="#f3f6fa" stroke="#dce6f0" stroke-width="2"/>
  <circle cx="150" cy="105" r="18" fill="none" stroke="#fe854c" stroke-width="4" stroke-dasharray="70 30"/>
  <text x="150" y="150" text-anchor="middle" fill="#819198" font-size="9">no hint of the shape</text>
  <line x1="330" y1="20" x2="330" y2="185" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">skeleton</text>
  <rect x="390" y="40" width="200" height="130" rx="8" fill="#f3f6fa" stroke="#dce6f0" stroke-width="2"/>
  <circle cx="420" cy="70" r="16" fill="#e6edf5"/>
  <rect x="448" y="58" width="120" height="12" rx="4" fill="#e6edf5"/><rect x="448" y="76" width="80" height="10" rx="4" fill="#eef2f7"/>
  <rect x="408" y="105" width="164" height="10" rx="4" fill="#e6edf5"/><rect x="408" y="122" width="164" height="10" rx="4" fill="#eef2f7"/><rect x="408" y="139" width="110" height="10" rx="4" fill="#eef2f7"/>
  <text x="480" y="185" text-anchor="middle" fill="#157878" font-size="9">same layout, pre-drawn</text>
</svg>
<figcaption>The spinner occupies the space without describing it; the skeleton draws the actual layout in grey, so the arriving content drops into place instead of appearing from nowhere.</figcaption>
</figure>

## The perception argument

Waiting feels shorter when it is *filled and legible*. A spinner is an
indeterminate, contentless signal — it gives the eye nothing to do and no sense of
progress, so the wait feels open-ended. A skeleton previews the structure, so the
brain reads it as "the page is nearly here, it is assembling," which is a shorter
subjective wait for the same clock time. This is the same reason a progress bar
beats an hourglass: perceived performance is about certainty and structure, not
just milliseconds.

## The layout-stability argument

The mechanical benefit is that a skeleton occupies the *real* dimensions of the
content that is coming, so when the data arrives it fills the boxes already on
screen — no jump. A spinner usually sits in a differently-sized container, so the
content pops in and shoves the page around, hurting Cumulative Layout Shift. Match
the skeleton to the final layout and the transition is seamless:

```jsx
function UserCard({ user, loading }) {
  if (loading) {
    return (
      <article className="card">
        <div className="skeleton skeleton--avatar" />
        <div className="skeleton skeleton--title" />   {/* same box the name will use */}
        <div className="skeleton skeleton--line" />
      </article>
    );
  }
  return <article className="card"><Avatar src={user.avatar} /><h3>{user.name}</h3></article>;
}
```

```css
.skeleton { background: #e6edf5; border-radius: 4px; }
.skeleton--avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton--title  { width: 60%; height: 16px; margin: 8px 0; }   /* mirrors the h3 */
.skeleton { animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: 0.55; } }   /* the subtle shimmer that says "loading" */
```

## When a spinner is still the right call

Skeletons are not universal. They fit content whose shape you *know* in advance —
lists, cards, tables, profiles — which is most of a data-driven UI. A spinner is
fine, and simpler, for short indeterminate waits where a skeleton would be
overkill: a button's own "saving…" state, a full-page route transition, an action
whose result has no predictable layout. The rule of thumb: if you can draw the
shape of what is loading, draw it; if you genuinely cannot, or the wait is a brief
in-place action, a spinner is honest. Avoid the worst of both — a spinner that
flashes for 80ms (show nothing under ~200ms) or a skeleton that lingers long after
the data arrived. The skeleton-list exercise builds a skeleton that matches its
real list layout, which is the detail that turns "loading placeholder" into "the
page is already here, just greyed out."
