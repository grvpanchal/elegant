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
reading_minutes: 5
related_practice: [data-table-sort, infinite-scroll-list]
---

When you render a list, the `key` is not a formality to silence a warning — it is
how the framework answers "which item is which" across two renders. Between the old
list and the new one, React matches elements by key to decide what moved, what was
added, and what was removed, then reuses the DOM and component state accordingly.
Give each item a **stable identity** (its `id`) and reordering, inserting, and
deleting all just work. Use the **array index** as the key and you have told React
that identity *is position* — so when positions change, it attaches the wrong
state to the wrong row, and you get lost input, misfired animations, and checkboxes
that follow the slot instead of the item.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="ky-t ky-d" class="blog-figure__svg">
  <title id="ky-t">Index keys tie state to position; id keys tie state to the item</title>
  <desc id="ky-d">A list is reordered. With index keys, the input state stays with the slot and ends up on the wrong item. With id keys, the state follows the item to its new position.</desc>
  <text x="160" y="26" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">key = index</text>
  <g font-size="9" text-anchor="middle">
    <rect x="40" y="40" width="110" height="26" rx="4" fill="#fff4ec" stroke="#fe854c"/><text x="95" y="57" fill="#c2571a">0: Ann ✎typed</text>
    <rect x="40" y="72" width="110" height="26" rx="4" fill="#f3f6fa" stroke="#819198"/><text x="95" y="89" fill="#819198">1: Bob</text>
  </g>
  <path d="M160 70 L200 70" stroke="#819198" stroke-width="2" marker-end="url(#ky-a)"/><text x="180" y="60" fill="#819198" font-size="8">reorder</text>
  <g font-size="9" text-anchor="middle">
    <rect x="210" y="40" width="110" height="26" rx="4" fill="#fff4ec" stroke="#fe854c"/><text x="265" y="57" fill="#c2571a">0: Bob ✎typed</text>
    <rect x="210" y="72" width="110" height="26" rx="4" fill="#f3f6fa" stroke="#819198"/><text x="265" y="89" fill="#819198">1: Ann</text>
  </g>
  <text x="180" y="120" text-anchor="middle" fill="#c2571a" font-size="9">edit landed on Bob — wrong item</text>
  <line x1="335" y1="30" x2="335" y2="180" stroke="#dce6f0"/>
  <text x="490" y="26" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">key = id</text>
  <g font-size="9" text-anchor="middle">
    <rect x="380" y="40" width="120" height="26" rx="4" fill="#e8f0f8" stroke="#157878"/><text x="440" y="57" fill="#157878">#a1 Ann ✎typed</text>
    <rect x="510" y="72" width="110" height="26" rx="4" fill="#e8f0f8" stroke="#157878"/><text x="565" y="89" fill="#157878">#a1 Ann ✎</text>
  </g>
  <path d="M500 53 L510 80" stroke="#157878" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#ky-a)"/>
  <text x="490" y="120" text-anchor="middle" fill="#157878" font-size="9">edit follows Ann to her new slot</text>
  <defs><marker id="ky-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Reorder the list: an index key keeps the typed text on slot 0 (now the wrong person); an id key carries the text with the item it belongs to.</figcaption>
</figure>

## The index says "identity is position"

Here is the bug in its natural habitat. The list has editable rows, and it uses the
index as the key:

```jsx
// index key: React thinks row 0 is always "the same" element
{items.map((item, i) => (
  <li key={i}>
    <input defaultValue={item.name} />   {/* DOM state keyed to POSITION */}
  </li>
))}
```

Prepend a new item and every existing item shifts down a slot. React, matching by
key, believes the element at index 0 is unchanged — so the text you typed, the
focus, and the DOM node all stay at index 0, now showing a *different* item's data.
Nothing looks obviously wrong until a user notices their input jumped rows.

## A stable id says "identity is the item"

Give each row its real id and the matching becomes correct: React finds "item #a1"
in both renders, knows it merely moved, and moves its DOM and state with it:

```jsx
// id key: React tracks each item by its true identity across reorders
{items.map((item) => (
  <li key={item.id}>
    <input defaultValue={item.name} />   {/* state stays with the ITEM */}
  </li>
))}
```

Now inserting, deleting, sorting, and filtering all preserve per-row state and
animations, because the key means what React assumes it means.

## When the index is actually fine

The nuance worth keeping: an index key is harmless when the list is **static** —
never reordered, never filtered, never inserted into except at the end, and its
items hold no per-element state (no inputs, no local toggles, no animations). A
render-once list of read-only labels can key by index without consequence. But the
moment any of those conditions might change, the index is a latent bug, and "we
might sort this later" is common enough that a stable id is the safe default. The
rule: key by whatever *is* the item's identity — a database id, a slug, a uuid —
and reach for the index only for a provably static, stateless list. The
data-table-sort exercise is the fastest way to feel this, because sorting is
exactly the operation that turns an index key from "fine" into "why did my
selection jump."
