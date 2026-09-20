---
title: "Flexbox or Grid? Pick by how many axes you are laying out"
layout: post
slug: flexbox-or-grid-pick-by-axis
date: 2026-09-12
author: The Elegant team
category: terminology
tags: [ui, css, layout, flexbox, grid]
description: 'The endless flexbox-versus-grid debate has a boring answer — one axis, use flexbox; two axes, use grid. Everything else is a corollary of that one distinction.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [data-table-sort, responsive-image-set]
---

"Should I use flexbox or grid?" is asked as if it were a matter of taste. It is
not. Flexbox lays out content along **one** axis — a row or a column. Grid lays
out along **two** — rows and columns at once. Count the axes your layout has and
the answer falls out.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 240" role="img" aria-labelledby="fg-t fg-d" class="blog-figure__svg">
  <title id="fg-t">Flexbox is one axis; Grid is two</title>
  <desc id="fg-d">Flexbox arranges items along a single line; Grid places items into a two-dimensional matrix of rows and columns.</desc>
  <text x="150" y="28" text-anchor="middle" fill="#c2571a" font-size="14" font-weight="700">flexbox — one axis</text>
  <line x1="30" y1="120" x2="270" y2="120" stroke="#fe854c" stroke-width="2" stroke-dasharray="4 4"/>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2">
    <rect x="40" y="95" width="50" height="50" rx="6"/><rect x="105" y="95" width="50" height="50" rx="6"/>
    <rect x="170" y="95" width="50" height="50" rx="6"/><rect x="235" y="95" width="26" height="50" rx="6"/>
  </g>
  <text x="150" y="185" text-anchor="middle" fill="#819198" font-size="12">items distribute along the line (grow / shrink)</text>
  <line x1="320" y1="40" x2="320" y2="210" stroke="#dce6f0" stroke-width="1"/>
  <text x="490" y="28" text-anchor="middle" fill="#c2571a" font-size="14" font-weight="700">grid — two axes</text>
  <g fill="#f3f6fa" stroke="#157878" stroke-width="2">
    <rect x="390" y="60" width="60" height="45" rx="6"/><rect x="460" y="60" width="60" height="45" rx="6"/><rect x="530" y="60" width="60" height="45" rx="6"/>
    <rect x="390" y="115" width="60" height="45" rx="6"/><rect x="460" y="115" width="60" height="45" rx="6"/><rect x="530" y="115" width="60" height="45" rx="6"/>
  </g>
  <line x1="378" y1="60" x2="378" y2="160" stroke="#157878" stroke-width="2" marker-end="url(#fg-a)"/>
  <line x1="390" y1="48" x2="590" y2="48" stroke="#157878" stroke-width="2" marker-end="url(#fg-a)"/>
  <defs><marker id="fg-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#157878"/></marker></defs>
  <text x="490" y="195" text-anchor="middle" fill="#819198" font-size="12">items align across AND down at once</text>
</svg>
<figcaption>One line of items → flexbox. A matrix that must align both ways → grid.</figcaption>
</figure>

## One axis: flexbox

A nav bar, a row of tags, a toolbar, a stack of fields — these are
one-dimensional. Items flow along a line, wrap if you let them, and size from
their content. Flexbox shines when items should *distribute* space among
themselves:

```css
.toolbar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.toolbar .spacer { flex: 1; }   /* eats the slack, pushing the rest to the right */
```

You are not positioning items on a matrix; you are arranging them on a line, and
`flex-grow`/`flex-shrink`/`flex-basis` decide how they share it.

## Two axes: grid

A page shell, a gallery, a card layout that must align both across and down —
these are two-dimensional. Grid lets you define columns and rows and place items
into that matrix, and the killer feature is alignment in both directions at once:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}
```

That one line also retires a pile of media queries: `auto-fit` fits as many
16rem columns as the container allows, then stretches them — the layout
re-columns itself as the width changes, with no breakpoint.

## The tell is who decides the sizing

There is a second way to say the same thing, and it is often faster to apply.
Flexbox is **content-driven**: items size from their own content first, then
share the leftover space along the one axis. Grid is **container-driven**: you
declare the tracks up front and items flow into that fixed structure. So when
the sizing question is "let each item be as wide as it needs, then distribute
the slack" — a toolbar, a tag list — that is flexbox. When it is "carve the
container into a known shape and place things into it" — a dashboard, a photo
wall that must line up in both directions — that is grid. If you find yourself
fighting a flex layout with fixed `flex-basis` values on every child to force
alignment, you have really declared a set of tracks the long way round, and grid
would say it in one line.

## Where people go wrong

The common mistake is nesting flexboxes to fake a grid — a row of columns, each a
column of rows — then wondering why alignment drifts when content lengths differ.
That drift is the tell that you have a two-axis problem and reached for a one-axis
tool. The opposite (grid for a simple button row) just adds ceremony.

They compose, of course: a grid cell often contains a flex row, and a flex item is
often a small grid. The point is not that one replaces the other, but that you
choose per layout by counting axes rather than by habit. Once you frame it that
way, the "debate" is a lookup — one line, flexbox; a matrix, grid. The
data-table exercise is a good place to feel where each belongs.
