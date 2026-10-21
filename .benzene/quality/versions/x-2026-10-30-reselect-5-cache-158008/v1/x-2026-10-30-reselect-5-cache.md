---
channel: x
date: 2026-10-30
format: thread
claim: Reselect 5's default createSelector caches one result per set of arguments (weakMapMemoize), so a selector called with alternating ids no longer thrashes; the one-slot cache that needed a selector factory per component was Reselect 4's.
source: "Reselect 5.1.1 (templates/chota-react-rtk/node_modules/reselect), recomputations counted 2026-10-19 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
"createSelector caches one call, so selectTodoById(state, id) thrashes when two rows pass different ids."

That was Reselect 4. Reselect 5's default is weakMapMemoize: one cached result per set of arguments.

---

Measured on Reselect 5.1.1: 10 calls on the same state, alternating ids 1 and 2.

Default createSelector: 2 recomputations.
lruMemoize with size 1 on both layers, the old behaviour: 10.

---

So a selector factory per row (makeSelectTodoById, then useMemo in the component) fixes a cache you probably don't have any more. Check the version before adding one. Keep it if you pinned lruMemoize.

---

What hasn't changed: the cache keys are references. An input selector that builds a new object misses every time, on any version.

Build a one-slot cache yourself and count its recomputations, free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
