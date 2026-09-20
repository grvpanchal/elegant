---
title: "Immutability is how you detect change cheaply"
slug: immutability-is-how-you-detect-change-cheaply
layout: post
date: 2026-09-03
author: The Elegant team
category: terminology
tags: [state, immutability, performance, react]
description: Immutable updates are not about purity for its own sake. They let the framework decide 'did this change?' with a reference check instead of a deep scan — which is what keeps re-renders bounded.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [counter-reducer, memoized-selector, normalize-entities]
---

Immutability in a frontend store is not functional-programming aesthetics. It is
a performance mechanism. When you never mutate state in place — you replace the
parts that changed with new objects — the framework can answer the most frequent
question it asks, *"did this change?"*, with a single `===` reference comparison
instead of a deep, recursive scan of the data. That one substitution, cheap
identity check for expensive structural check, is what keeps re-renders and
selector recomputes bounded as your state grows.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="im-t im-d" class="blog-figure__svg">
  <title id="im-t">A mutated object keeps its reference; an immutable update creates a new one</title>
  <desc id="im-d">On the left the same object reference before and after a mutation, so an equality check sees no change. On the right a new object reference after an immutable update, so the check detects the change instantly.</desc>
  <text x="150" y="28" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">mutate in place</text>
  <rect x="70" y="50" width="70" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="105" y="75" text-anchor="middle" fill="#c2571a" font-size="11">ref A</text>
  <path d="M140 70 L210 70" stroke="#819198" stroke-width="2" marker-end="url(#im-a)"/><text x="175" y="60" text-anchor="middle" fill="#819198" font-size="10">edit</text>
  <rect x="210" y="50" width="70" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="245" y="75" text-anchor="middle" fill="#c2571a" font-size="11">ref A</text>
  <text x="175" y="120" text-anchor="middle" fill="#c2571a" font-size="10">A === A → "no change" (WRONG)</text>
  <line x1="320" y1="30" x2="320" y2="200" stroke="#dce6f0"/>
  <text x="470" y="28" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">immutable update</text>
  <rect x="390" y="50" width="70" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="425" y="75" text-anchor="middle" fill="#157878" font-size="11">ref A</text>
  <path d="M460 70 L530 70" stroke="#819198" stroke-width="2" marker-end="url(#im-a)"/><text x="495" y="60" text-anchor="middle" fill="#819198" font-size="10">copy+edit</text>
  <rect x="530" y="50" width="70" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="565" y="75" text-anchor="middle" fill="#157878" font-size="11">ref B</text>
  <text x="470" y="120" text-anchor="middle" fill="#157878" font-size="10">A !== B → "changed" (instant, correct)</text>
  <defs><marker id="im-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Mutation keeps the reference, so a fast identity check misses the change. Replacing the object changes the reference, so the check catches it.</figcaption>
</figure>

## Mutation is invisible to a reference check

React's `memo`, `useMemo`, `useSelector`, and `reselect` all compare by reference.
So a `push` into an existing array is the classic bug: the data changed, but the
array is the *same object*, so `prev === next` is true and nothing updates:

```js
// BROKEN — same array reference, so React sees no change and won't re-render
state.items.push(newItem);
return state;

// CORRECT — a new array; the reference differs, so the change is detected
return { ...state, items: [...state.items, newItem] };
```

The spread copies only the top level, which is exactly enough: you create a new
`items` array and a new state object, while unchanged siblings keep their old
references and their consumers correctly skip re-rendering.

## Copy only the path that changed

Immutable updates do *not* mean deep-cloning the whole tree — that would be slow
and would change every reference, defeating the point. You copy only along the
path from the root to the thing you changed; everything off that path is shared:

```js
// update one nested field: new objects only on the root → user → prefs path
return {
  ...state,
  user: { ...state.user, prefs: { ...state.user.prefs, theme: "dark" } },
};
```

Now `state.user.prefs` is a new reference (its consumers update) but
`state.posts` is the *same* reference (its consumers correctly do nothing). This
"structural sharing" is why immutable state is fast, not slow.

## Let a tool enforce it, then reap the checks

Writing nested spreads by hand is error-prone, which is why Redux Toolkit bundles
Immer: you write code that *looks* mutative and Immer produces the immutable copy
with correct structural sharing underneath. That is a convenience over the manual
spread, not a different model — the output is still new references on the changed
path. Once your updates are honestly immutable, everything downstream gets cheaper
and more correct at once: `memo` prevents wasted renders, `reselect` returns
stable references, and time-travel debugging can hold past states without them
being mutated out from under it. The normalize-entities exercise pairs naturally
with this — a normalised, immutably-updated store is where reference-based change
detection pays off the most.
