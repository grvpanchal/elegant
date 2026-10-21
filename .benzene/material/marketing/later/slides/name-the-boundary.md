# Name the boundary

Writing createSelector takes an agent seconds. Knowing the todo list needs one is the job.

Four decisions, on one bug from our own template.

---

# The bug is one line

```js
return { ...todo, todoItems };
```

A new object on every call. The todo list rendered again on every one of 3 theme toggles, and its data never changed.

---

# 1. Which layer?

The filtered list is derived state. A selector computes it from the store when it is read.

Nothing stores it beside the todos, so there is no second copy to drift.

---

# 2. What is the contract?

Same state in, same reference out.

useSelector compares with ===, so the selector hands back the same object until state.todo or the filter changes.

---

# 3. What proves it?

```js
expect(selectTodoData(next))
  .toBe(selectTodoData(state));
```

next changed only the theme. toBe, not toEqual: toEqual passes on the bug.

---

# 4. When is it done?

When that test passes and React-Redux's stability check stays silent under stabilityCheck="always".

Not when the screen looks right: it looked right with the bug.

---

# Practise the boundary, free

Build a memoized selector and watch its recomputations() counter. In your browser, no sign-up.

elegantfrontend.training/practice/memoized-selector.html
