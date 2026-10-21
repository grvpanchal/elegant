---
channel: x
date: 2026-10-27
format: thread
claim: A selector that returns a new object re-renders its component on every dispatch; shallowEqual hides it only on the unfiltered view, and createSelector over stable inputs fixes it.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js and src/containers/TodoListContainer.jsx; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
A selector that returns a new object re-renders its component on every dispatch, even when nothing it shows changed.

Our own React-Redux template does it: 3 theme toggles, and the todo list rendered again on every one.

---

Why: after every dispatch, useSelector runs the selector again and compares the result with ===.

getVisibleTodos ends with
return { ...todo, todoItems }

A new object on every call, so === never holds.

---

The usual patch, useSelector(fn, shallowEqual), half works.

"All" filter: todoItems is the store's own array. 0 renders.
"Active": filter() builds a new array per call. A render on every toggle again.

---

The fix is memoizing on inputs that are already stable:

createSelector([s => s.todo, s => getSelectedFilter(s).id], getVisibleTodos)

The theme changes; those two inputs don't. 0 renders, on both filters.

---

Hand a coding agent the test, not a review comment: change a slice the selector doesn't read, then expect(next).toBe(prev). toEqual passes on the bug.

Build createSelector yourself, free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
