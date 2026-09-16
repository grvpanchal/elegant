---
title: Memoize a derived selector
layout: question
slug: memoized-selector
format: coding
difficulty: medium
layer: state
topics: [selectors, state, store]
skill: state-selectors
minutes: 25
summary: Build a createSelector-style memoizer that recomputes only when its inputs change by reference.
---

A container re-renders on every store change. Each render calls
`visibleTodos(state)`, which filters and sorts a 5,000-item array. The array
almost never changes; the filter almost never changes; the work happens anyway.

Implement `createSelector(...inputSelectors, resultFn)`:

- Calling the returned selector runs every input selector against `state`.
- If **every** input result is reference-equal (`===`) to the previous call's,
  return the cached result without calling `resultFn`.
- Otherwise call `resultFn(...inputs)`, cache both the inputs and the result,
  and return it.
- Expose `selector.recomputations()` — how many times `resultFn` actually ran.
- The cache is one entry deep (last call only), which is what Reselect does.

{% include code-playground.html %}

## Solution

### Approach 1: last-arguments cache

Keep the previous input array and the previous result in the closure. On each
call, map the input selectors over `state`, then compare the new array to the
old one element by element with `===`. Any difference is a miss.

```js
export default function createSelector(...fns) {
  const resultFn = fns.pop();
  const inputs = fns;
  let lastArgs = null;
  let lastResult;
  let recomputations = 0;

  function selector(state) {
    const next = inputs.map((fn) => fn(state));
    const hit =
      lastArgs !== null &&
      lastArgs.length === next.length &&
      next.every((value, i) => value === lastArgs[i]);
    if (!hit) {
      lastResult = resultFn(...next);
      lastArgs = next;
      recomputations += 1;
    }
    return lastResult;
  }

  selector.recomputations = () => recomputations;
  return selector;
}
```

The comparison is O(number of input selectors), not O(size of the data), which
is the whole point: comparing four references beats re-sorting 5,000 rows.

### Approach 2: generic memoizer plus a thin selector

Split the two jobs. `memoize(fn, equals)` handles caching for any function;
`createSelector` only composes input selectors and delegates.

```js
function memoize(fn, equals = (a, b) => a === b) {
  let lastArgs = null;
  let lastResult;
  return Object.assign(
    (...args) => {
      const hit =
        lastArgs !== null &&
        lastArgs.length === args.length &&
        args.every((value, i) => equals(value, lastArgs[i]));
      if (!hit) {
        lastResult = fn(...args);
        lastArgs = args;
        memoized.misses += 1;
      }
      return lastResult;
    },
    { misses: 0 }
  );
}
```

This version costs one extra function call per read but lets you swap the
equality function — shallow-equal for selectors that build fresh objects,
`Object.is` when `NaN` inputs matter. Reselect ships exactly this seam as
`createSelectorCreator`.

## Trade-offs

| | Cache depth 1 | Unbounded cache |
|---|---|---|
| Memory | constant | grows with distinct inputs |
| Alternating states (list A, list B, A, B…) | misses every call | hits every call |
| Correctness after a store reset | self-correcting | stale entries linger |

Depth 1 is the right default because a React tree reads a selector with the
same `state` many times in a row and with a *new* `state` exactly once per
dispatch. The pathological alternating case shows up with parameterised
selectors (`selectTodoById(state, id)`), which is why those need a selector
*per id* rather than a deeper cache.

Recomputation count is the honest metric here: wall-clock timings on a warm JIT
will tell you the memoized and unmemoized versions are both "fast" on small
fixtures. `recomputations()` does not lie.

## Related

- Reading: [Selectors](../state/selectors.html) · [Store](../state/store.html)
- Agent Skill: `state-selectors`
