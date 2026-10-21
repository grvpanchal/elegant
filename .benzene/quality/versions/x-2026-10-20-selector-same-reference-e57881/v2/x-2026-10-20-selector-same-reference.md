---
channel: x
date: 2026-10-20
claim: A selector that returns a new object re-renders its component on every dispatch; shallowEqual hides it only on the unfiltered view, and createSelector over stable inputs fixes it.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js and src/containers/TodoListContainer.jsx; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
Your selector returns a new object on every call. React-Redux compares the result with the last one using ===. A new object never matches, so the list re-renders on every dispatch — even when nothing it shows changed.

---

Our template's selector ends with `return { ...todo, todoItems }`. We toggled the theme 3 times. The list rendered again on every toggle. Its data never changed.

---

shallowEqual looks like the fix. It holds on "All" — todoItems is the store's own array. On "Active", filter() builds a new array per call, and the renders come back.

---

createSelector over inputs that are already stable:

createSelector([s => s.todo, s => getSelectedFilter(s).id], getVisibleTodos)

The theme changes; those two inputs don't. 0 renders, on both filters.

---

The check: change a slice the selector doesn't read, then expect(next).toBe(prev). toEqual passes on the bug. toBe catches it.

---

Build createSelector yourself: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
