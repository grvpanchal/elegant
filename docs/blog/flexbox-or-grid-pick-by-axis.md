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
reading_minutes: 3
related_practice: [data-table-sort, responsive-image-set]
---

"Should I use flexbox or grid?" is asked as if it were a matter of taste. It is
not. Flexbox lays out content along **one** axis — a row or a column. Grid lays
out along **two** — rows and columns at once. Decide how many axes your layout
has and the answer falls out.

## One axis: flexbox

A navigation bar, a row of tags, a toolbar, a stack of form fields — these are
one-dimensional. Items flow along a line, wrap if you let them, and size
themselves from their content with `flex-grow`, `flex-shrink`, and `flex-basis`.
Flexbox shines when you want items to *distribute* space among themselves:
"these three buttons share the row, this one pushes to the right." You are not
positioning items on a matrix; you are arranging them on a line.

## Two axes: grid

A page layout with a header, sidebar, content, and footer; a photo gallery; a
calendar; a card layout that must align both across and down — these are
two-dimensional. Grid lets you define columns and rows explicitly
(`grid-template-columns`, `grid-template-rows`) and place items into that matrix,
including making one item span multiple cells. The killer feature is alignment
in both directions at once: with flexbox you fight to get cards to line up in a
grid; with grid, they just do.

## Responsive layout without media queries

The axis rule also explains why grid and flexbox have quietly retired a lot of
media queries. `flex-wrap` lets a one-axis row reflow onto multiple lines when it
runs out of room, so a toolbar collapses gracefully with no breakpoint. On the
grid side, `repeat(auto-fit, minmax(16rem, 1fr))` says "fit as many 16rem columns
as you can, then stretch them" — the layout re-columns itself as the container
changes width, again with no media query. Both are examples of intrinsic,
content-driven responsiveness: the layout responds to the space available rather
than to hard-coded device widths. Reaching for a media query first is often the
tell that you are fighting your layout tool instead of using it; try `wrap` and
`auto-fit` before you write a breakpoint, and reserve media queries for genuine
design changes rather than mechanical reflow.

## Where people go wrong

The common mistake is nesting flexboxes to fake a grid — a row of columns, each
a column of rows — and then wondering why alignment drifts when content lengths
differ. That is the tell that you have a two-axis problem and reached for a
one-axis tool. The opposite mistake is rarer: using grid for a simple button row
adds ceremony for no gain.

They compose, of course. A grid cell often contains a flex container; a flex
item is often a small grid. The point is not that one replaces the other, but
that you choose per layout by counting axes rather than by habit. Once you frame
it that way, the "debate" is just a lookup: one line, flexbox; a matrix, grid.
The sortable data table exercise is a good place to feel where each belongs.
