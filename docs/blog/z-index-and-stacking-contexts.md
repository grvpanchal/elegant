---
title: "z-index: 9999 doesn't work, and stacking contexts are why"
layout: post
slug: z-index-and-stacking-contexts
date: 2026-07-09
author: The Elegant team
category: terminology
tags: [ui, css, z-index, layout]
description: 'When your modal with z-index 9999 still hides behind the header, the problem is not a bigger number — it is that z-index only competes within a stacking context, and something created a new one you did not notice.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [tabs-molecule, accessible-combobox]
---

Every developer has done it: a modal renders behind the header, so you set
`z-index: 9999`, and it *still* renders behind the header. Bumping it to `99999`
does nothing. The instinct — a bigger number should win — is wrong because
`z-index` does not compare globally. It only orders elements **within the same
stacking context**, and the reason your modal loses is that some ancestor quietly
created a *new* stacking context, sealing your element's z-index inside it. Once
you understand stacking contexts, the fix stops being a number war and becomes
"find the context boundary and move the element out of it."

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="zi-t zi-d" class="blog-figure__svg">
  <title id="zi-t">z-index only competes inside its stacking context, not globally</title>
  <desc id="zi-d">A header context and a card context sit side by side at the root. Inside the card, a modal with z-index 9999 is trapped below the header because the whole card context ranks lower than the header context.</desc>
  <text x="320" y="24" text-anchor="middle" fill="#606c71" font-size="10">root stacking context</text>
  <rect x="40" y="40" width="240" height="60" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="160" y="66" text-anchor="middle" fill="#157878" font-size="10">header context — z:10</text><text x="160" y="86" text-anchor="middle" fill="#819198" font-size="9">wins: parent ranks higher</text>
  <rect x="330" y="40" width="270" height="130" rx="8" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="465" y="60" text-anchor="middle" fill="#155799" font-size="10">card context — z:1 (transform)</text>
  <rect x="355" y="80" width="220" height="70" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="465" y="108" text-anchor="middle" fill="#c2571a" font-size="10">modal z:9999</text><text x="465" y="128" text-anchor="middle" fill="#c2571a" font-size="9">trapped: whole card ranks below header</text>
  <path d="M330 70 L282 70" stroke="#606c71" stroke-width="2" marker-end="url(#zi-a)"/><text x="305" y="62" fill="#606c71" font-size="9">10 &gt; 1</text>
  <defs><marker id="zi-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#606c71"/></marker></defs>
</svg>
<figcaption>The modal's 9999 only ranks it inside the card context. Because the card context (z:1) sits below the header context (z:10), the whole card — modal included — loses.</figcaption>
</figure>

## z-index is local to a stacking context

A stacking context is a self-contained z-ordering world. Elements inside it are
ordered by their `z-index` *relative to each other*, but the context as a whole is
placed among its siblings by *its own* z-index. So a `z-index: 9999` element inside
a context whose root has `z-index: 1` can never rise above a sibling context with
`z-index: 2` — the 9999 is a rank *within* the 1, not a global rank. That is the
entire mystery:

```css
.header { position: relative; z-index: 10; }   /* header context, rank 10 */
.card   { position: relative; z-index: 1; }    /* card context, rank 1 */
.card .modal { z-index: 9999; }  /* rank 9999 INSIDE a context that ranks 1 */
/* result: modal sits below the header, because 1 < 10, and 9999 never escapes the 1 */
```

## What silently creates a context

The trap is that many innocuous properties create a stacking context, not just
`z-index`. A `transform`, an `opacity` below 1, a `filter`, `will-change`, a
`position: fixed`, and several others each start a new context — so a card with a
subtle `transform: scale()` on hover has, without anyone deciding to, sealed its
children's z-index:

```css
/* each of these quietly starts a new stacking context */
.card { transform: translateZ(0); }   /* or opacity: 0.99, filter: blur(0), etc. */
```

This is why "it worked, then I added a hover animation and the dropdown broke" is
such a common bug — the animation created the context.

## Fix it by escaping the context, not raising the number

Since the problem is *containment*, the fix is to get the overlay out of the
low-ranking context, not to inflate its z-index. Two durable moves: render the
overlay via a **portal** at the end of `<body>`, so it lives in the root context
and competes globally; or restructure so the overlay is not nested under an element
that starts a context. And to keep this from recurring, stop using arbitrary big
numbers — define a small set of named layer tokens (`--z-dropdown: 100;
--z-modal: 200; --z-toast: 300;`) so z-index becomes a designed, comparable scale
instead of an escalating guess. The `9999` habit is a symptom of not knowing where
the context boundaries are; once you can see them, ordering becomes deliberate. The
accessible-combobox exercise runs straight into this — a listbox that must escape
its input's stacking context to render on top — which is where the portal-plus-token
approach proves itself over a bigger number.
