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
reading_minutes: 4
related_practice: [tabs-molecule, accessible-combobox]
---

Everyone has fought this: a dropdown or modal refuses to appear above another
element, so you bump its `z-index` to 9999, then 99999, and it still loses. The
number is not the problem. `z-index` does not compare globally — it only orders
elements *within the same stacking context* — and something on the page created a
new stacking context that your huge number cannot escape. Understanding stacking
contexts is the difference between fixing this and cargo-culting bigger numbers.

## z-index is local, not global

A stacking context is a self-contained layer with its own internal z-ordering.
`z-index` values only compete *inside* one context; they never reach across
contexts. So if your modal (z-index 9999) lives inside a context that is itself
behind the header's context, the modal loses no matter how high its number goes —
because the comparison that decides is between the two *contexts*, not between 9999
and the header's number. The whole modal, and its 9999, moves together as one unit
relative to other contexts.

## What creates a new stacking context

New stacking contexts are created by more things than people expect, which is why
they appear "by accident." The root element makes one. So does any positioned
element (`relative`, `absolute`, `fixed`, `sticky`) with a `z-index` other than
`auto`. And — the surprising ones — `opacity` less than 1, a `transform`, a
`filter`, `will-change`, `isolation: isolate`, and a few others create a context all
on their own, with no z-index involved. So a parent with `opacity: 0.99` or a
`transform` silently traps all its children's z-indexes inside a new context, and
your modal deep inside cannot climb out.

## Debugging the trap

When z-index "doesn't work," stop raising the number and go find the stacking
context boundary. Walk up from your element to the root, looking for an ancestor
with a transform, an opacity below 1, a filter, or a positioned + z-indexed style —
that ancestor is the ceiling your element cannot rise above. The fix is usually to
move the element out of that trapping context (render it higher in the tree) or to
adjust the *context's* stacking, not the element's. Browser dev tools can show the
stacking context tree, which turns this from guesswork into a lookup.

## The real fix for overlays: portals

For overlays specifically — modals, dropdowns, tooltips, toasts — the robust answer
is to not fight stacking contexts at all: render the overlay through a portal at the
top level of the DOM, outside whatever nested contexts your component lives in. Then
it is a sibling of the app root, competing at the top level where a sane z-index
actually wins. This is why UI libraries render their overlays in a portal at the end
of `<body>` — it sidesteps the entire stacking-context problem. The tabs and
combobox exercises both involve elements that must layer correctly, which is exactly
where stacking contexts start to matter.
