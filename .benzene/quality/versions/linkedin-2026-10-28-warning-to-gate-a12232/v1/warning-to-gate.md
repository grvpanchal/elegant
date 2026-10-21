# The warning your console already sends

In development, React-Redux 9 calls a selector twice with the same state the first time it runs. If the two results aren't ===, it warns:

"Selector unknown returned a different result when called with the same parameters."

---

# Why it says "unknown"

The warning prints the selector's function name. An inline arrow passed to useSelector has none.

Name it, const selectTodoData = …, and the warning reads "Selector selectTodoData returned a different result".

---

# The default checks once

stabilityCheck defaults to "once": the first run of each useSelector.

A shallowEqual selector mounted on "All" (stable), switched to "Active" (unstable), 3 theme toggles: 0 warnings. With "always": 7.

---

# Fail the test when the console warns

```jsx
const warn = vi.spyOn(console, "warn");
render(
  <Provider store={store} stabilityCheck="always">
    <TodoListContainer />
  </Provider>
);
expect(warn).not.toHaveBeenCalled();
```

---

# The instruction that passes the gate

"Add selectTodoData to todo.selectors.js with createSelector over state.todo and the selected filter id.

The container reads only that selector.

Done when the component tests pass with stabilityCheck="always" and console.warn never fires."

---

# Why a test beats a review comment

The rule lives in the test, so the instruction stays short and "done" is what the runner reports. An agent can argue with a comment.

It can't argue with a red test.

---

# Build the memoizer yourself, free

Write createSelector with a recomputations() counter and run its tests in your browser. No sign-up.

elegantfrontend.training/practice/memoized-selector.html
