---
title: "A selector that returns a new object re-renders on every store change"
date: 2026-10-17
description: "useSelector compares with ===, so a selector that builds an object re-renders on any change. shallowEqual hides it; memoized stable inputs fix it."
tags: [redux, selectors, performance, ai]
canonical_url: https://elegantfrontend.training/blog/selectors-must-return-the-same-reference.html
ai_assistance: assisted
related_practice: [memoized-selector, selector-memoization, harness-state-shape]
syndication:
  - {channel: devto, canonical_url: https://elegantfrontend.training/blog/selectors-must-return-the-same-reference.html}
  - {channel: hashnode, canonical_url: https://elegantfrontend.training/blog/selectors-must-return-the-same-reference.html}
  - {channel: medium, canonical_url: https://elegantfrontend.training/blog/selectors-must-return-the-same-reference.html}
---
Toggle the theme in our React-Redux template and the todo list re-renders. Toggle it three times and it re-renders
three times. Nothing in the list changed, and the theme lives in a different slice of the store. The cause is one line
in a container and one return statement in a selector. It is also exactly the kind of bug a coding agent copies, because
the code is correct and every test that checks values passes: a selector that hands back a new object on every call.

This article was written with AI assistance and reviewed by the Elegant team before publication. Every code block below
was run. Every library behaviour it describes was checked against the installed source of React 19.2.5, React-Redux
9.2.0 and Reselect 5.1.1, not recalled from memory.

## The line

The container in `templates/chota-react-redux/src/containers/TodoListContainer.jsx` reads:

```jsx
const todoData = useSelector((state) =>
  getVisibleTodos(state.todo, selectedFilter.id)
);
```

`getVisibleTodos` in `todo.selectors.js` ends with `return { ...todo, todoItems: visibleTodos }`. The function is
pure and correct, and its unit tests pass. Given the same todos and filter, it returns the same todos. What it never
returns is the same object.

## What useSelector actually compares

`useSelector` subscribes to the store. When the root state changes, it runs your selector against the new state and
compares the result with the previous one. React-Redux 9's default equality function is literally `(a, b) => a === b`.
If the two results differ, the component re-renders. It never looks inside them. An object literal is a new reference
every time it is evaluated, so the comparison fails on every state change, in any slice.

Follow one theme toggle through it. The config reducer returns a new object, so the root state is new. The selector
runs, the spread builds a new object, and `===` fails. `TodoListContainer` re-renders, and so does the `TodoList`
organism it hands `todoData` to.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 720 320" role="img" aria-labelledby="sref-t sref-d" class="blog-figure__svg" font-family="Open Sans, Helvetica, Arial, sans-serif">
  <title id="sref-t">One unrelated store change, two selectors: only the memoized one keeps the same reference</title>
  <desc id="sref-d">A theme action produces a new root state in which the todo slice is unchanged. A plain selector builds a new object, the === check fails and the component re-renders. A memoized selector sees unchanged inputs, returns its cached object, the === check holds and the render is skipped.</desc>
  <defs><marker id="sref-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#606c71"/></marker></defs>
  <rect x="0" y="0" width="720" height="320" rx="14" fill="#fff7f2"/>
  <rect x="20" y="128" width="140" height="64" rx="10" fill="#f3f6fa" stroke="#155799" stroke-width="2"/>
  <text x="90" y="155" text-anchor="middle" font-size="13" font-weight="700" fill="#202028">dispatch</text>
  <text x="90" y="175" text-anchor="middle" font-size="12" fill="#606c71">theme: "dark"</text>
  <rect x="190" y="118" width="160" height="84" rx="10" fill="#f3f6fa" stroke="#155799" stroke-width="2"/>
  <text x="270" y="145" text-anchor="middle" font-size="13" font-weight="700" fill="#202028">new root state</text>
  <text x="270" y="166" text-anchor="middle" font-size="12" fill="#606c71">config: new object</text>
  <text x="270" y="185" text-anchor="middle" font-size="12" fill="#606c71">todo: same reference</text>
  <g stroke="#606c71" stroke-width="2" fill="none" marker-end="url(#sref-a)">
    <path d="M160 160 L186 160"/>
    <path d="M350 145 C 370 145, 370 88, 384 88"/>
    <path d="M350 175 C 370 175, 370 232, 384 232"/>
    <path d="M560 88 L586 88"/>
    <path d="M560 232 L586 232"/>
  </g>
  <rect x="388" y="52" width="172" height="72" rx="10" fill="#ffffff" stroke="#fe854c" stroke-width="2.5"/>
  <text x="474" y="78" text-anchor="middle" font-size="13" font-weight="700" fill="#202028">plain selector</text>
  <text x="474" y="98" text-anchor="middle" font-size="12" fill="#606c71">builds { ...todo, todoItems }</text>
  <text x="474" y="114" text-anchor="middle" font-size="12" fill="#606c71">new object every call</text>
  <rect x="388" y="196" width="172" height="72" rx="10" fill="#ffffff" stroke="#155799" stroke-width="2.5"/>
  <text x="474" y="222" text-anchor="middle" font-size="13" font-weight="700" fill="#202028">memoized selector</text>
  <text x="474" y="242" text-anchor="middle" font-size="12" fill="#606c71">inputs todo, filter id unchanged</text>
  <text x="474" y="258" text-anchor="middle" font-size="12" fill="#606c71">returns the cached object</text>
  <rect x="590" y="56" width="112" height="64" rx="10" fill="#fe854c"/>
  <text x="646" y="83" text-anchor="middle" font-size="13" font-weight="700" fill="#202028">=== fails</text>
  <text x="646" y="103" text-anchor="middle" font-size="12" fill="#202028">re-render</text>
  <rect x="590" y="200" width="112" height="64" rx="10" fill="#155799"/>
  <text x="646" y="227" text-anchor="middle" font-size="13" font-weight="700" fill="#ffffff">=== holds</text>
  <text x="646" y="247" text-anchor="middle" font-size="12" fill="#ffffff">no render</text>
  <text x="360" y="304" text-anchor="middle" font-size="12" fill="#606c71">useSelector re-renders when the new result is not === the last one. It never compares contents.</text>
</svg>
<figcaption>The theme lives in another slice, yet the plain selector re-renders the list on every toggle. The memoized selector returns the object it already returned.</figcaption>
</figure>

React-Redux even tells you. In development, the first time a `useSelector` call runs its selector, it runs it twice
with the same state and warns if the two results are not equal: "Selector unknown returned a different result when
called with the same parameters. This can lead to unnecessary rerenders." It says "unknown" because the selector is an
anonymous arrow. That is the second reason to name selectors: the warning can then point at the one at fault.

## Count it

You don't need React to see the rule. This script models it: rerun the selector when the root state changes, and count
a render when the equality check fails. It runs on Node with nothing to install.

```js
// rerender-rule.mjs: run with `node rerender-rule.mjs` (no dependencies).
// A model of the rule useSelector applies: when the root state changes,
// rerun the selector; re-render only if !equals(previous, next).
const reducers = {
  todo: (s = { todoItems: [{ id: 1, completed: false }, { id: 2, completed: true }] }) => s,
  filter: (s = "SHOW_ALL", a) => (a.type === "filter" ? a.id : s),
  config: (s = { theme: "light" }, a) => (a.type === "theme" ? { ...s, theme: a.theme } : s),
};
const reduce = (state = {}, action) =>
  Object.fromEntries(Object.entries(reducers).map(([k, r]) => [k, r(state[k], action)]));

// The template's selector, minus the error branch.
const getVisibleTodos = (todo, filter) => ({
  ...todo,
  todoItems: filter === "SHOW_ALL" ? todo.todoItems : todo.todoItems.filter((t) => !t.completed),
});

const refEqual = (a, b) => a === b;
const shallowEqual = (a, b) =>
  Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((k) => a[k] === b[k]);

// A one-entry memo on input references: the shape of createSelector.
const memoOn = (inputs, fn) => {
  let last = null, result;
  return (state) => {
    const args = inputs.map((pick) => pick(state));
    if (!last || args.some((v, i) => v !== last[i])) { result = fn(...args); last = args; }
    return result;
  };
};

function rendersOnThemeToggles(filter, selector, equals) {
  let state = reduce(undefined, { type: "@@init" });
  state = reduce(state, { type: "filter", id: filter });
  let selected = selector(state), renders = 0;
  for (const theme of ["dark", "light", "dark"]) {
    state = reduce(state, { type: "theme", theme });   // an unrelated slice changes
    const next = selector(state);
    if (!equals(selected, next)) renders++;
    selected = next;
  }
  return renders;
}

const plain = (s) => getVisibleTodos(s.todo, s.filter);
const memo = () => memoOn([(s) => s.todo, (s) => s.filter], getVisibleTodos);

console.table({
  "plain, ===":          { ALL: rendersOnThemeToggles("SHOW_ALL", plain, refEqual),     ACTIVE: rendersOnThemeToggles("SHOW_ACTIVE", plain, refEqual) },
  "plain, shallowEqual": { ALL: rendersOnThemeToggles("SHOW_ALL", plain, shallowEqual), ACTIVE: rendersOnThemeToggles("SHOW_ACTIVE", plain, shallowEqual) },
  "memoized, ===":       { ALL: rendersOnThemeToggles("SHOW_ALL", memo(), refEqual),    ACTIVE: rendersOnThemeToggles("SHOW_ACTIVE", memo(), refEqual) },
});
```

It prints 3 and 3 for the plain selector, 0 and 3 with `shallowEqual`, and 0 and 0 when memoized. We got the same
counts from the real libraries. We rendered the container's exact `useSelector` line with React 19.2.5 and React-Redux
9.2.0 under jsdom: one render on mount, then the numbers in the table.

## shallowEqual is a patch that passes the demo

The usual review suggestion is `useSelector(selector, shallowEqual)`. `shallowEqual` compares each top-level field with
`===` instead of comparing the object itself. Look at the middle row. On "All", `getVisibleTodos` puts the original
`todoItems` array into the new object. Every field matches, and the re-renders disappear. On "Active" or "Completed",
`filter()` builds a new array on every call, `todoItems` fails `===`, and all three re-renders come back.

"All" is the default filter. It is the state every screenshot, demo and quick manual check is taken in. So the patch is
green exactly where nobody looks, and wrong as soon as a user filters the list. An equality function whose verdict
depends on which branch of the selector ran is not a fix, and we reject it in review.

## Memoize on inputs that are already stable

The fix is to stop building the result when nothing it depends on has changed. `createSelector` takes input selectors
and a result function. It calls the result function only when an input changes by reference. Otherwise it returns the
cached result: the same object. The inputs here are `state.todo`, which the todo reducer replaces only when a todo
changes, and the selected filter's `id`, which is a string. The theme reducer touches neither.

```js
// visible-todos.test.mjs: `npm i reselect@5`, then `node --test visible-todos.test.mjs`
import { test } from "node:test";
import assert from "node:assert/strict";
import { createSelector } from "reselect";

const getVisibleTodos = (todo, filterId) => ({
  ...todo,
  todoItems: filterId === "SHOW_ACTIVE" ? todo.todoItems.filter((t) => !t.completed) : todo.todoItems,
});

// Input selectors return references the reducers already keep stable.
const selectTodo = (state) => state.todo;
const selectFilterId = (state) => state.filters.find((f) => f.selected).id;

export const selectVisibleTodos = createSelector([selectTodo, selectFilterId], getVisibleTodos);

const state = {
  todo: { todoItems: [{ id: 1, completed: false }, { id: 2, completed: true }] },
  filters: [{ id: "SHOW_ALL", selected: false }, { id: "SHOW_ACTIVE", selected: true }],
  config: { theme: "light" },
};

test("an unrelated slice changes, the reference does not", () => {
  selectVisibleTodos.resetRecomputations();
  const before = selectVisibleTodos(state);
  const after = selectVisibleTodos({ ...state, config: { theme: "dark" } });
  assert.equal(after, before); // === , not deepEqual
  assert.equal(selectVisibleTodos.recomputations(), 1);
});

test("the slice it reads changes, the reference does", () => {
  const before = selectVisibleTodos(state);
  const todo = { todoItems: [...state.todo.todoItems, { id: 3, completed: false }] };
  const after = selectVisibleTodos({ ...state, todo });
  assert.notEqual(after, before);
  assert.equal(after.todoItems.length, 2);
});
```

That file holds the fix and its guardrail together. The first test is the one that matters. A slice the selector does
not read changes, and the selector must return the identical object. `assert.equal` in `node:assert/strict` is `===`;
in Jest or Vitest that is `toBe`, never `toEqual`. A `recomputations()` count of 1 proves the result function didn't
even run. Point the same test at the plain wrapper and it fails on its first assertion.

Two Reselect 5 details matter here. First, `createSelector` now memoizes with `weakMapMemoize` by default, which keeps
a cache entry for each distinct set of arguments. The one-entry cache that older guides describe still exists as
`lruMemoize`, with `maxSize = 1`, but it is no longer the default. Second, the input selectors must be stable
themselves. Put the `filter()` in an input selector and the cache misses on every call. Reselect 5 checks this in
development too: "An input selector returned a different result when passed same arguments."

## Make the rule a gate, not a sentence

Our `state-selectors` Agent Skill already says it in prose: don't "create selectors that return new objects every time".
An agent will agree with that sentence and then copy the nearest selector in the codebase. Here, the nearest selector is
`getVisibleTodos`. Prose tells an agent what good looks like. Only a check tells it whether it got there. So the harness
for this term is three checks that need no human:

1. The reference test above, next to every derived selector.
2. Component tests that render under `<Provider store={store} stabilityCheck="always">`. React-Redux then checks every
   selector call, not only the first, and a `console.warn` spy fails the test when it complains.
3. A prompt that names the inputs and defines done as those checks passing:

```text
Add selectVisibleTodos to todo.selectors.js with createSelector.
Inputs: selectTodo and the selected filter's id. No derived field in state.
TodoListContainer reads only selectVisibleTodos.
Done: the reference test passes and no test logs a console warning.
```

With those in place, the reviewer stops asking "does this look right?" and starts asking "did the gate run?". The test
runner answers that one.

## Practise it

The practice question [Memoize a derived selector](https://elegantfrontend.training/practice/memoized-selector.html)
has you write `createSelector` yourself, with the classic one-entry cache and a `recomputations()` counter, and run its
tests in the browser. Once you have written the cache by hand, you can tell from a diff whether an agent's selector will
ever hit it. It is free and needs no account. The
[Selectors term page](https://elegantfrontend.training/state/selectors.html) shows the same selector in Redux, Redux
Toolkit, NgRx and Pinia, next to the reducer, middleware and operations around it.
