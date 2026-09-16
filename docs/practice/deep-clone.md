---
title: Deep clone a value
layout: question
slug: deep-clone
format: coding
difficulty: medium
layer: state
topics: [operations, state]
skill: state-operations
minutes: 30
summary: Copy nested data without sharing references — including the cycle that makes the naive version hang forever.
---

A reducer needs to copy incoming API data before storing it, so later mutations
by other code cannot reach into the store.

Implement `deepClone(value)`:

- Plain objects and arrays are copied recursively; no nested reference is shared
  with the input.
- `Date`, `Map` and `Set` are cloned as their own types, not as `{}`.
- Primitives, `null` and functions come back as-is (functions are not cloned).
- A **cyclic** structure clones without hanging, and the clone has the same
  cycle.
- The same object appearing twice clones to the same object twice — the shape
  of the graph is preserved, not flattened into copies.

{% include code-playground.html %}

## Solution

### Approach 1: recursion with a seen-map

```js
export default function deepClone(value, seen = new Map()) {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  if (Array.isArray(value)) {
    const out = [];
    seen.set(value, out);                      // BEFORE recursing
    for (const item of value) out.push(deepClone(item, seen));
    return out;
  }
  if (value instanceof Map) {
    const out = new Map();
    seen.set(value, out);
    for (const [k, v] of value) out.set(deepClone(k, seen), deepClone(v, seen));
    return out;
  }
  if (value instanceof Set) {
    const out = new Set();
    seen.set(value, out);
    for (const v of value) out.add(deepClone(v, seen));
    return out;
  }

  const out = Object.create(Object.getPrototypeOf(value));
  seen.set(value, out);
  for (const key of Reflect.ownKeys(value)) out[key] = deepClone(value[key], seen);
  return out;
}
```

The whole exercise is the one line order matters on: `seen.set(value, out)`
happens **before** recursing into children. Register after, and a cycle
recurses forever. Register before, and a child that points back at its parent
finds the half-built clone and links to it — which is exactly the structure you
want.

That same map is what preserves shared references. Clone `{a: x, b: x}` without
it and you get two distinct copies of `x`; with it, both properties point at one
clone, like the original.

### Approach 2: `structuredClone`

```js
export default function deepClone(value) {
  return structuredClone(value);
}
```

Built in, handles cycles, Dates, Maps, Sets, TypedArrays and Blobs, and is
faster than anything you will write. Use it when you can.

It is not always a drop-in. It **throws** on functions, DOM nodes, `WeakMap`
and symbols, it drops the prototype (a class instance comes back as a plain
object), and it loses non-enumerable and accessor properties. For API payloads
— plain JSON-shaped data — none of that matters and it is the right answer. For
arbitrary application state it can throw on something you did not know was in
there.

`JSON.parse(JSON.stringify(x))` is the third option and the one to avoid: it
silently drops `undefined`, functions and symbols, turns `Date` into a string
and `NaN`/`Infinity` into `null`, and throws on a cycle.

## Trade-offs

**Do you need a deep clone at all?** Usually not. Immutable updates with spread
copy only the path you changed and share everything else, which is cheaper and
is what makes reference equality a useful signal for
[selectors](../state/selectors.html) and memoised components. Deep-cloning an
API response on every action defeats that: every object is new, so every
downstream memo misses.

The legitimate use is a trust boundary — data from outside your control that
something else may still mutate — and there, cloning once at the edge is right.

**Prototypes.** Preserving the prototype with `Object.create` keeps class
instances working and is usually what you want for domain objects; it also
means you can clone something with a getter that throws. Plain-object output is
safer and lossier.

**Cost.** Deep cloning is O(nodes) in time and memory. On a 5,000-item response
in a reducer that runs on every keystroke, that is the performance bug — and it
will not show up on your fixture of three.

## Related

- Reading: [Operations](../state/operations.html) · [State](../state/state.html) · [Reducer](../state/reducer.html)
- Agent Skill: `state-operations`
