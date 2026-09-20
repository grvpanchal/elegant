---
title: "The store is one source of truth, or it is not a source of truth"
layout: post
slug: the-store-is-one-source-of-truth
date: 2026-09-01
author: The Elegant team
category: terminology
tags: [state, redux, store, architecture]
description: A single source of truth is not a slogan — it is a constraint. The moment the same fact lives in two places, you own the job of keeping them in sync, and you will lose.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [simple-store, combine-reducers, counter-reducer]
---

"Single source of truth" gets repeated so often it sounds like a slogan, but it
is a hard constraint with teeth. It means every fact your app knows lives in
exactly **one** place, and everything else *derives* from it or *reads* it — never
copies it. The moment the same fact exists in two places, you have signed up for
a job you cannot do reliably: keeping them in sync on every change, forever. The
bugs that follow — a badge showing 3 while the list shows 4, a form that
remembers a value the server already changed — are not careless mistakes. They
are the guaranteed outcome of duplicated state.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="sot-t sot-d" class="blog-figure__svg">
  <title id="sot-t">One store read by many views versus the same fact copied into each view</title>
  <desc id="sot-d">On the left one store feeds three views, all consistent. On the right each view holds its own copy of the fact, and the copies have drifted to different values.</desc>
  <text x="150" y="28" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">one source</text>
  <rect x="105" y="45" width="90" height="40" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="150" y="70" text-anchor="middle" fill="#157878" font-size="11">store: 4</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#sot-a)"><path d="M120 85 L80 130"/><path d="M150 85 L150 130"/><path d="M180 85 L220 130"/></g>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2" font-size="10" text-anchor="middle">
    <rect x="45" y="132" width="70" height="30" rx="5"/><text x="80" y="152" fill="#155799">badge 4</text>
    <rect x="120" y="132" width="60" height="30" rx="5"/><text x="150" y="152" fill="#155799">list 4</text>
    <rect x="190" y="132" width="70" height="30" rx="5"/><text x="225" y="152" fill="#155799">title 4</text>
  </g>
  <line x1="320" y1="30" x2="320" y2="200" stroke="#dce6f0"/>
  <text x="470" y="28" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">copies drift</text>
  <g fill="#fff4ec" stroke="#fe854c" stroke-width="2" font-size="10" text-anchor="middle">
    <rect x="365" y="70" width="70" height="34" rx="5"/><text x="400" y="92" fill="#c2571a">badge 3</text>
    <rect x="445" y="70" width="60" height="34" rx="5"/><text x="475" y="92" fill="#c2571a">list 4</text>
    <rect x="515" y="70" width="70" height="34" rx="5"/><text x="550" y="92" fill="#c2571a">title 5</text>
  </g>
  <text x="470" y="150" text-anchor="middle" fill="#819198" font-size="10">three fields, three answers, no way to say which is right</text>
  <defs><marker id="sot-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Read from one store and every view agrees by construction. Copy the fact and the copies are free to disagree — and eventually will.</figcaption>
</figure>

## Duplication is a synchronisation contract you signed by accident

Say you keep a list in the store and *also* keep its length in a `count` field.
You have quietly promised that every code path touching the list also updates the
count. Miss one — a filter, a bulk delete, an optimistic update that rolls back —
and they disagree, with no way to tell which is right:

```js
// TWO sources: count can drift from items.length
state = { items: [...], count: 5 };

// DERIVE instead: count is always correct because it is computed, not stored
const count = state.items.length;      // one fact (items), one derivation (count)
```

The fix is never "add code to keep them in sync." It is "stop storing the second
one."

## Server data is a copy too — name it as such

The subtlest duplication is caching server data in a client store and then editing
the cached copy as if it were the truth. Now the truth lives on the server *and*
in your store, and they diverge the instant another user changes the record. The
honest model is that your store holds a **cached view** of server state, with its
own freshness, and the request/success/fail cycle is how you reconcile it:

```js
// the store is explicit that this is a cache of a remote fact, not the fact
case "USER_FETCH_SUCCEEDED":
  return { ...state, user: action.data, fetchedAt: action.at };
```

## Minimise, normalise, derive

Three habits keep the store a genuine single source of truth. **Minimise**: store
only irreducible facts. **Normalise**: store each entity once, by id, and
reference it elsewhere rather than embedding duplicate copies. **Derive**: compute
everything else with selectors on read. Together they mean there is exactly one
place to change any given fact, so there is exactly one thing to get right. The
simple-store exercise builds the dispatch-reducer-subscribe loop from scratch,
which is the clearest way to see why one store, read by everyone, is the only
arrangement that cannot silently disagree with itself.
