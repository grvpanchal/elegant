---
title: "Composition beats configuration when a component grows props"
slug: composition-over-configuration
layout: post
date: 2026-07-04
author: The Elegant team
category: architecture
tags: [ui, components, api-design, composition]
description: 'When a component sprouts a dozen boolean props to cover every variation, the fix is usually not another prop — it is letting the caller compose the pieces. Configuration scales to a point; composition scales past it.'
cover: /assets/img/atomic-design.png
reading_minutes: 4
related_practice: [tabs-molecule, form-field-molecule]
---

A component starts simple, then a variation is needed, so you add a prop. Then
another variation, another prop. Soon `<Card>` has `showHeader`, `headerIcon`,
`footerButtons`, `variant`, `dense`, `bordered`, and a config object — and every new
requirement is another prop, another branch, another line in an ever-growing
signature. That trajectory is the tell that you have hit the ceiling of
configuration and should switch to composition: let the caller assemble the pieces
instead of toggling flags.

## Configuration is flags; composition is slots

A configured component exposes its variations as props and decides internally what
to render from them. A composed component exposes its *structure* and lets the
caller fill it: `<Card><Card.Header>…</Card.Header><Card.Body>…</Card.Body></Card>`.
The caller decides what goes in the header — an icon, a title, nothing — by putting
it there, rather than the card guessing from `headerIcon` and `headerTitle` props.
Composition moves the variation from inside the component (where it multiplies props)
to the call site (where it is just markup).

## Why configuration stops scaling

Every boolean prop doubles the theoretical number of states the component must
handle, and combinations interact — `dense` plus `bordered` plus `variant="danger"`
is a rendering path someone has to have thought about. Past a handful of props, the
component becomes a pile of conditionals nobody fully understands, and the next
variation is genuinely risky to add because you cannot predict what it breaks. The
prop explosion is not a naming problem you can tidy; it is the wrong axis of
extensibility, and adding a fourteenth prop just moves the ceiling slightly higher.

## Composition pushes flexibility to the caller

With composition, the component provides structure and behaviour (a card's spacing,
a tab set's keyboard handling and roles) and the caller provides content. New
variations need no change to the component — the caller just composes differently.
This is why component libraries favour compound components (`Tabs`, `Tab`,
`TabPanel`) and slots over mega-props: the library owns the hard parts (accessibility,
state) and the consumer owns the arrangement, so the library does not need a prop for
every use case its authors could imagine. The flexibility lives where the
requirements actually are — at the call site.

## Configuration still wins for the simple, closed case

This is not "always compose." For a genuinely simple, closed set of variations — a
button with three sizes and two colours — props are clearer and more constrained than
composition, and you do not want callers assembling a button from parts. The heuristic:
configuration for a small, fixed, well-understood set of variations; composition when
the variations are open-ended or the prop list is exploding. Reach for composition
when you feel yourself adding "just one more prop" for the third time. The tabs and
form-field exercises are compound components where the structure is exposed and the
caller composes — exactly the pattern this describes.
