---
title: A selector factory turns 5 recomputes per render into 1
date: 2026-10-20
description: A shared createSelector has one cache slot; five sibling rows calling it with five ids miss every time — a factory fixes it, measured with a counter.
tags: [state, selectors]
canonical_url: https://elegantfrontend.training/blog/selector-factories-stop-cache-thrashing.html
ai_assistance: assisted
related_practice: [memoized-selector, selector-memoization, harness-state-shape]
syndication:
  - {channel: devto, canonical_url: https://elegantfrontend.training/blog/selector-factories-stop-cache-thrashing.html}
  - {channel: hashnode, canonical_url: https://elegantfrontend.training/blog/selector-factories-stop-cache-thrashing.html}
  - {channel: medium, canonical_url: https://elegantfrontend.training/blog/selector-factories-stop-cache-thrashing.html}
---

This article was written with AI assistance and reviewed by the Elegant team before publishing, the way every
article on this site is: a draft from a model, checked against `docs/state/selectors.md` and
`skills/state-selectors/SKILL.md`, and against a small script we ran ourselves rather than took on faith.

The claim is specific: a selector built with Reselect's `createSelector` keeps exactly one cached `(args) -> result)`
pair. Give it five sibling rows, each calling it with a different `id` in the same render pass, and every single call
misses — five recomputes, not five cache hits. The fix the skill names in one line, "parameterised selector
factories," drops that to one recompute per row. We didn't want to just repeat the warning, so we instrumented both
versions with a recompute counter and counted the calls instead of asserting the number.

## The mechanism

Reselect's default memoizer does a shallow-equal check against the *previous* call's arguments only. It is not a
map keyed by argument — it is a single slot. `selectTodoById(state, 'a')` caches `('a', ...)`. The very next call,
`selectTodoById(state, 'b')`, compares `'b'` against the cached `'a'`, finds a mismatch, and reruns the combiner.
When a list renders five `TodoRow` components and each one calls the *same* shared selector instance with its own
`id`, the cache is overwritten five times in a single render pass — every call is a miss, because every call's
arguments differ from whatever was cached a moment ago by a sibling. On the next render, if the ids are the same and
nothing re-mounted, you still get five misses again, because the last row to render during the first pass is the
only one whose id survives in the cache.

A selector factory sidesteps the problem by giving each row its *own* selector instance, created once via
`useMemo(makeSelectTodoById, [])`, so each instance's single cache slot belongs to one id for the component's
lifetime. Five instances, five slots, five ids that never evict each other.

## Code example 1 — the shared selector thrashes

```javascript
import { createSelector } from 'reselect';

let recomputes = 0;
const selectTodos = (state) => state.todos;
const selectTodoById = createSelector(
  [selectTodos, (_, id) => id],
  (todos, id) => {
    recomputes++;
    return todos.find((t) => t.id === id);
  }
);

const state = { todos: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }] };

['a', 'b', 'c', 'd', 'e'].forEach((id) => selectTodoById(state, id));
console.log(recomputes); // 5 — one shared cache slot, every call is a miss

// Render it again with the same five ids, in the same order:
['a', 'b', 'c', 'd', 'e'].forEach((id) => selectTodoById(state, id));
console.log(recomputes); // 10 — still thrashing, the cache never catches up
```

Ten recomputes for ten calls is a 0% hit rate. That is the number the skill's one-liner implies but does not show;
running the counter is how we confirm it rather than take the warning on faith.

## Code example 2 — the factory gives each row its own slot

```javascript
import { createSelector } from 'reselect';

const makeSelectTodoById = () => {
  let recomputes = 0;
  const selector = createSelector(
    [(state) => state.todos, (_, id) => id],
    (todos, id) => {
      recomputes++;
      return todos.find((t) => t.id === id);
    }
  );
  selector.recomputes = () => recomputes;
  return selector;
};

const state = { todos: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }] };
const ids = ['a', 'b', 'c', 'd', 'e'];

// One selector instance per row, each created once via useMemo(makeSelectTodoById, [])
const perRow = ids.map(() => makeSelectTodoById());

perRow.forEach((sel, i) => sel(state, ids[i])); // first render: 5 misses, unavoidable
perRow.forEach((sel, i) => sel(state, ids[i])); // second render: all hits

console.log(perRow.map((s) => s.recomputes())); // [1, 1, 1, 1, 1]
```

The first render still costs five recomputes — there is no way to populate five caches for free. What changes is the
second render and every one after it: each row's own instance holds its own id, so nothing evicts a sibling's
result. The ten calls across two renders cost five recomputes instead of ten, and the gap widens with every
subsequent render the list survives without remounting.

## The figure

<svg viewBox="0 0 640 260" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Shared selector cache vs factory cache</title>
  <rect width="640" height="260" fill="#fff7f2" />
  <text x="20" y="28" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="16" fill="#202028">shared: 1 slot, 5 misses</text>
  <rect x="270" y="10" width="90" height="40" rx="6" fill="#fe854c" />
  <text x="315" y="35" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13" fill="#fff7f2" text-anchor="middle">1 slot</text>
  <g stroke="#155799" stroke-width="2" fill="none">
    <path d="M40 30 L270 30" marker-end="url(#arrow)" />
    <path d="M140 60 L270 36" marker-end="url(#arrow)" />
    <path d="M360 36 L500 30" marker-end="url(#arrow)" />
    <path d="M360 30 L600 60" marker-end="url(#arrow)" />
  </g>
  <text x="20" y="60" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="11" fill="#606c71">a, b, c, d, e →</text>
  <text x="20" y="150" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="16" fill="#202028">factory: 5 slots, 5 hits on replay</text>
  <g font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="12" fill="#fff7f2">
    <rect x="40" y="170" width="100" height="40" rx="6" fill="#202028" stroke="#155799" stroke-width="2" />
    <text x="90" y="195" text-anchor="middle">id: a</text>
    <rect x="160" y="170" width="100" height="40" rx="6" fill="#202028" stroke="#155799" stroke-width="2" />
    <text x="210" y="195" text-anchor="middle">id: b</text>
    <rect x="280" y="170" width="100" height="40" rx="6" fill="#202028" stroke="#155799" stroke-width="2" />
    <text x="330" y="195" text-anchor="middle">id: c</text>
    <rect x="400" y="170" width="100" height="40" rx="6" fill="#202028" stroke="#155799" stroke-width="2" />
    <text x="450" y="195" text-anchor="middle">id: d</text>
    <rect x="520" y="170" width="100" height="40" rx="6" fill="#202028" stroke="#155799" stroke-width="2" />
    <text x="570" y="195" text-anchor="middle">id: e</text>
  </g>
  <text x="40" y="235" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="11" fill="#606c71">each row's instance keeps its own id — nothing evicts a sibling</text>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 Z" fill="#155799" />
    </marker>
  </defs>
</svg>

## Where this bites in practice

The failure mode is quiet because nothing throws. The list still renders the right rows with the right data — it
just redoes work it didn't have to. In a five-row list the extra recomputes are invisible. In a 5,000-row virtualised
table where every visible row calls a shared parameterised selector, that same 0% hit rate turns a cheap `.find()`
into the thing a profiler flags, and the fix is never "memoize harder." It's giving each row its own cache.

The `state-selectors` skill's own quality gate, "memoization for expensive computations," is easy to tick by adding
`createSelector` anywhere and calling it done. The gate doesn't distinguish a selector that is actually hit from one
that thrashes on every call. If you are building a harness that grades a store's shape — the kind of check the
`harness-state-shape` practice question asks you to write — a recompute counter like the one above is a cheap way to
make that gate mean something: assert the hit rate, not just the presence of `createSelector`.

## Try it

The `memoized-selector` practice question asks you to build a `createSelector`-style memoizer from scratch and prove
it only recomputes when its inputs change by reference — the exact mechanism this article measured. If you want the
quiz-length version first, `selector-memoization` covers the same ground in four questions. Both run in the browser,
free, no sign-up:
https://elegantfrontend.training/practice/memoized-selector/?utm_source=blog&utm_medium=social&utm_campaign=selector-factories
