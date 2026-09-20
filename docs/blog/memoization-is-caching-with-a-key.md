---
title: "Memoization is just caching with a key you have to get right"
slug: memoization-is-caching-with-a-key
layout: post
date: 2026-06-30
author: The Elegant team
category: terminology
tags: [ui, performance, memoization, react]
description: 'Memoization caches a result against its inputs and returns the cache when the inputs repeat. Simple — except the whole thing depends on comparing inputs correctly, which is where most memoization quietly does nothing.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [memoized-selector, selector-memoization, debounce-utility]
---

Memoization is caching for function calls: remember the result of a call, keyed
by its inputs, and return the remembered result when the same inputs come back
instead of recomputing. That is the whole idea, and it is genuinely simple. The
part that trips everyone is the key — memoization only works if you can decide,
cheaply and correctly, whether the inputs are "the same." Get the comparison
wrong and the cache either never hits (so the memo does nothing) or hits when it
shouldn't (so you serve a stale answer). Most broken memoization is a broken key.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="mz-t mz-d" class="blog-figure__svg">
  <title id="mz-t">A memoized call: hit returns the cache, miss computes and stores</title>
  <desc id="mz-d">A call arrives with a key. If the key matches the cached key it is a hit and returns the stored value. If not it is a miss, computes the result, stores it against the new key, and returns it.</desc>
  <rect x="30" y="85" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="75" y="109" text-anchor="middle" fill="#155799" font-size="11">call(key)</text>
  <path d="M120 105 L190 105" stroke="#819198" stroke-width="2" marker-end="url(#mz-a)"/>
  <polygon points="190,80 250,105 190,130 130,105" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/>
  <text x="205" y="100" text-anchor="middle" fill="#c2571a" font-size="10">same</text><text x="205" y="114" text-anchor="middle" fill="#c2571a" font-size="10">key?</text>
  <path d="M250 105 L330 105" stroke="#157878" stroke-width="2" marker-end="url(#mz-a)"/><text x="290" y="96" text-anchor="middle" fill="#157878" font-size="10">hit</text>
  <rect x="330" y="85" width="120" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="390" y="109" text-anchor="middle" fill="#157878" font-size="11">return cache</text>
  <path d="M205 130 L205 165 L330 165" stroke="#c2571a" stroke-width="2" marker-end="url(#mz-a)"/><text x="250" y="158" fill="#c2571a" font-size="10">miss</text>
  <rect x="330" y="145" width="130" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="395" y="169" text-anchor="middle" fill="#c2571a" font-size="10">compute + store</text>
  <defs><marker id="mz-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
  <circle r="6" fill="#157878"><animateMotion dur="3s" repeatCount="indefinite" path="M75 105 L205 105 L390 105"/></circle>
</svg>
<figcaption>Every memo is this branch: a matching key returns the stored value; a new key pays the full cost once and remembers it.</figcaption>
</figure>

## A memo is a closure over a cache

At its simplest, memoization is a wrapper that keeps a map from a serialised key
to a result. This works when the arguments serialise cleanly to a string:

```js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);       // the key: get this right or nothing works
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = memoize((n) => { /* expensive */ return n * n; });
slowSquare(9);  // computes
slowSquare(9);  // cache hit — no recompute
```

## Reference equality is the key most frameworks use

`JSON.stringify` is fine for primitives but wrong for the hot path in a UI, where
inputs are objects and arrays. React's `useMemo` and Redux's `reselect` compare
inputs by **reference** (`===`), not by value — which is fast but means a *new
object with the same contents* counts as a change and busts the cache:

```jsx
// BROKEN: `config` is a new object every render, so the memo never hits
const value = useMemo(() => compute(config), [{ mode: "fast" }]);

// FIXED: a stable reference — same object across renders, so the key holds
const config = useRef({ mode: "fast" }).current;
const value = useMemo(() => compute(config), [config]);
```

This is the number-one reason a `useMemo` "does nothing": one of its dependencies
is freshly allocated on every render, so the key never matches and it recomputes
every time — you pay the memo's overhead *and* the full cost.

## Memoize the expensive and the shared, not everything

Memoization is not free: it holds memory and adds a comparison on every call. It
pays off for genuinely expensive computations, and for derived values shared by
many consumers (a selector feeding twenty components), where one recompute saves
twenty. It is waste on a cheap function called once — the comparison and the retained
reference cost more than the arithmetic you were trying to skip, and now the
garbage collector has more to track for no benefit. Worse, an unbounded cache is
a memory leak: a `Map` keyed on an ever-changing input grows forever unless you
cap it or evict old entries, so a memo on a high-cardinality key can quietly
consume the heap. The reselect pattern —
compose small memoized selectors so a change to one slice doesn't recompute
another's derived data — is where this earns its keep, and it is exactly what the
memoized-selector exercise builds: correct keys, reference-stable inputs, and a
cache that actually hits.
