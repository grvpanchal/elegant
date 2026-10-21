# Selector: same state in, same reference out

The read path of the State layer. A selector is a pure function from state to what a component renders. Its contract has two halves: derive, don't store. And until an input changes, return the very same reference.

---

# useSelector compares with ===

After every store change, React-Redux reruns your selector and compares the new result with the last one by reference. A different reference means the component re-renders. Equal contents don't count.

---

# This line re-renders on every change

```js
useSelector((state) =>
  getVisibleTodos(state.todo, filterId)
);
// getVisibleTodos returns { ...todo, todoItems }:
// a new object on every call
```

We measured it in our own template: 3 theme toggles, 3 re-renders of a list that never changed.

---

# shallowEqual passes the demo, fails the filter

`useSelector(fn, shallowEqual)` compares each top-level field. On "All", todoItems is the same array, so nothing re-renders. On "Active", filter() builds a new array on every call, and all 3 re-renders come back.

---

# Memoize on inputs that are already stable

```js
const selectVisibleTodos = createSelector(
  [(s) => s.todo, (s) => selectFilter(s).id],
  getVisibleTodos
);
```

The theme changes, s.todo and the filter id don't, so the cached object comes back. 0 re-renders.

---

# Make it a gate your agent has to pass

```js
const a = selectVisibleTodos(state);
const b = selectVisibleTodos({ ...state, config });
expect(b).toBe(a); // ===, not toEqual
expect(selectVisibleTodos.recomputations()).toBe(1);
```

An unrelated slice changed. The reference must not.

---

# Build the memoizer yourself, free

Practice question "Memoize a derived selector": write createSelector with a recomputations() counter and run its tests in the browser. No sign-up.

elegantfrontend.training/practice/memoized-selector.html
