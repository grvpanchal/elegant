---
title: "Keys in lists are identity, and using the index breaks it"
layout: post
slug: keys-in-lists-are-identity
date: 2026-07-08
author: The Elegant team
category: terminology
tags: [ui, react, lists, reconciliation]
description: 'A list key tells the framework which item is which across renders. Use a stable id and reordering and editing just work; use the array index and you get lost input, wrong animations, and state attached to the wrong row.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [data-table-sort, infinite-scroll-list]
---

When you render a list, the framework needs to know which rendered item corresponds
to which item after the data changes — did this row move, get removed, or get
edited? That is what a `key` answers. Get it right (a stable id) and reordering,
insertion, and deletion just work. Get it wrong (the array index) and you get a
class of baffling bugs: input landing in the wrong field, animations firing on the
wrong element, component state attached to the wrong row.

## Keys are for identity across renders

Between two renders, the framework diffs the old list against the new one to compute
the minimal DOM changes. The key is the identity it matches on: "the item with key
42 was at position 0, now it is at position 2, so move its DOM node" rather than
"rebuild everything." With correct keys, a reorder is a cheap move and the DOM node
(and its state, its focus, its scroll position) travels with the item. The key is
the thread that ties a piece of data to its rendered instance across time.

## Why the index is a trap

Using the array index as the key means the key describes the *position*, not the
*item*. So when the list reorders, the item at position 0 changes but its key
(0) does not — the framework thinks "same item, different data" and reuses the DOM
node for a different item. Now any state tied to that node (the text you typed in an
input, the row you expanded, an in-progress animation) stays with the *position*
while the *data* moves, so your input value is suddenly attached to the wrong row.
For a static list that never reorders, index keys are harmless; for anything that
reorders, filters, or has items inserted at the top, they are a bug generator.

## Use a stable id from the data

The correct key is a stable, unique identifier that belongs to the item itself — a
database id, a UUID, a natural unique field. It must be stable across renders (not
regenerated each time) and unique among siblings (not across the whole app). If your
data has no id, that is often a signal to add one at the source rather than
inventing one at render time. `Math.random()` as a key is the worst option — it
changes every render, so the framework rebuilds every node every time, killing
performance and any preserved state.

## Where it bites in practice

The bug is most visible exactly where lists are dynamic: a sortable table (rows
reorder, so index keys attach sort state and inputs to the wrong row), an infinite
scroll (items prepend or the list re-sorts), a filterable list (items appear and
disappear). In all of these, a stable id makes the framework do the right, minimal
thing, and an index key produces the "why is my input in the wrong row" mystery.
The data-table exercise reorders rows on sort — the exact case index keys break —
and the infinite-scroll exercise grows a list where item identity has to survive new
pages.
