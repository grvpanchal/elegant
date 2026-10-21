# Write path, read path: same store, different rules

A store has two paths. The write path tells you when it's broken. The read path doesn't. One fails loudly, the other fails quietly — and quiet failures cost you re-renders you never asked for.

---

# The write path fails loudly

Action → middleware → reducer → store. Mutate state and the component stops updating. Forget the default case and Redux throws at creation: the slice reducer "returned undefined during initialization". Call Date.now() in a reducer and the same action gives a different state every run — flaky test, obvious bug.

---

# The read path fails quietly

Store → selector → component. Every test passes, but a selector that returns { ...todo, todoItems } creates a new object on every call. Any store change re-renders the component. No error, just work nobody asked for.

---

# Same values, new reference

A selector can return the right todos and still break the app. { ...todo, todoItems } passes a value check but fails a reference check. Every store change triggers a re-render the user never asked for.

---

# Test the reference, not only the value

```
expect(selectVisibleTodos(nextState))
  .toBe(selectVisibleTodos(state))
```

where nextState changed a slice the selector doesn't read. toBe, not toEqual. toEqual would pass on the bug.

---

# Practise the read path

Free practice question: memoized selector. No sign-up.

https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors