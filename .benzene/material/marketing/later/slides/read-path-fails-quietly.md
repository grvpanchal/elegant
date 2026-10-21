# Write path, read path

A Redux store has two paths. The write path tells you when it breaks. The read path doesn't, so it needs a different kind of test.

---

# The write path fails loudly

Leave the default case out of a reducer and createStore throws before the app starts:

"The slice reducer for key "todo" returned undefined during initialization." Mutate state in place and the screen stops updating.

You find out the same day.

---

# The read path fails quietly

A selector that returns { ...todo, todoItems } gives the right todos on every call, and a new object on every call.

Every dispatch, in any slice, renders the component again. Nothing throws. Production logs nothing.

---

# Measured: a render on every toggle

Our React-Redux template, on React 19.2 and React-Redux 9.2.

The theme lives in another slice, yet the list rendered again on each of 3 toggles.

Memoized with createSelector: 0.

---

# Test the reference, not only the value

```js
expect(selectTodoData(next))
  .toBe(selectTodoData(state));
```

next changed only a slice the selector doesn't read. toEqual passes on the bug; toBe fails on it.

---

# Practise the read path, free

Build a memoized selector and count its recomputations, in your browser. No sign-up.

elegantfrontend.training/practice/memoized-selector.html
