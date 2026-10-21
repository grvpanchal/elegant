# Selector: same state in, same reference out

A selector derives what a component needs from the store. Its contract has two halves: the right value, and the same object back until an input changes. Most selector bugs break the second half.

---

# useSelector compares with ===

After every dispatch, React-Redux runs your selector again and compares the result with the last one by reference. Equal contents in a new object still count as a change, and the component renders again.

---

# The line that renders on every dispatch

```js
useSelector((state) =>
  getVisibleTodos(state.todo, filterId)
);
// getVisibleTodos returns { ...todo, todoItems }
```

Our React-Redux template: every one of 3 theme toggles re-rendered a list that never changed.

---

# shallowEqual passes "All", fails "Active"

shallowEqual compares each top-level field. On "All", todoItems is the store's own array, so nothing renders. On "Active", filter() builds a new array on every call, and the list renders on every toggle again.

---

# Memoize on inputs that are already stable

```js
const selectTodoData = createSelector(
  [(s) => s.todo, (s) => getSelectedFilter(s).id],
  getVisibleTodos
);
```

The theme changes; state.todo and the filter id don't. 0 renders, on both filters.

---

# The gate: toBe, not toEqual

```js
const next = { ...state, config: { ...state.config, theme: "dark" } };
expect(selectTodoData(next)).toBe(selectTodoData(state));
```

A slice the selector doesn't read changed. The reference must not. toEqual passes on the bug.

---

# Build the memoizer yourself, free

Practice question "Memoize a derived selector": write createSelector with a recomputations() counter and run its tests in your browser. No sign-up.

elegantfrontend.training/practice/memoized-selector.html
