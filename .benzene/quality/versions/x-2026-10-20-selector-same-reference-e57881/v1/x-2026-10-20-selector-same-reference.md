---
channel: x
date: 2026-10-20
format: thread
claim: A selector that returns a new object re-renders its component on every store change; shallowEqual hides it only on the unfiltered view, and memoizing on stable inputs fixes it.
source: "templates/chota-react-redux/src/containers/TodoListContainer.jsx and src/state/todo/todo.selectors.js; render counts measured on React 19.2.5 + React-Redux 9.2.0 under jsdom on 2026-10-17; skills/state-selectors/SKILL.md"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
A selector that returns a new object re-renders its component on every store change.

We measured it in our own React-Redux template: 3 theme toggles, 3 re-renders of a todo list that never changed.

---

Why: useSelector reruns after every state change and compares with ===.

The container did:
useSelector(s => getVisibleTodos(s.todo, id))

and getVisibleTodos returns { ...todo, todoItems }. A new object on every call, so === never holds.

---

The tempting patch is useSelector(fn, shallowEqual).

It passes on the "All" filter, where todoItems is the same array. It fails on "Active": filter() builds a new array every call. 0 re-renders in the demo, 3 in real use.

---

The fix: memoize on inputs that are already stable.

createSelector([s => s.todo, s => selectFilter(s).id], getVisibleTodos)

Theme toggles now: 0 re-renders. React-Redux 9's dev warning ("returned a different result when called with the same parameters") goes quiet too.

---

For coding agents, make it a test instead of a review comment: an unrelated slice changes, so the selector must return the same reference. toBe, not toEqual.

Write createSelector yourself, free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
