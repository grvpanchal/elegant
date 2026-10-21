---
channel: linkedin
date: 2026-10-19
format: document
claim: A selector that returns a new object re-renders its component on every store change, because useSelector compares with ===; memoizing on stable inputs takes it to zero.
source: "skills/state-selectors/SKILL.md (DON'T: 'Create selectors that return new objects every time'); templates/chota-react-redux/src/containers/TodoListContainer.jsx; render counts measured on React 19.2.5 + React-Redux 9.2.0 under jsdom on 2026-10-17"
campaign: state-selectors
slides: .benzene/material/marketing/slides/selector-same-reference.md
document_title: "Selector: same state in, same reference out"
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
first_comment: "Build the memoizer yourself, free and with no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---

2 selector rules that sound the same, but work differently: "same state in, same reference out" versus "a new object on every call". Only one keeps your todo list from re-rendering when the theme changes. Save this before your next code review.

We measured it in our own React-Redux template: 3 theme toggles, 3 re-renders of a todo list that never changed.

The container called:

useSelector((state) => getVisibleTodos(state.todo, filterId))

and getVisibleTodos ends with `return { ...todo, todoItems }`. A fresh object on every call. React-Redux reruns the selector after every store change and compares the result with the previous one using ===. A new object is never === to anything — so toggling the theme, which lives in a different slice, re-renders the list.

The patch most people reach for is shallowEqual. It passes on the "All" filter, where todoItems is the same array. It fails on "Active": filter() builds a new array every call, and all 3 re-renders come back.

The fix is memoizing on inputs that are already stable:

createSelector([(s) => s.todo, (s) => selectFilter(s).id], getVisibleTodos)

Theme toggles now: 0 re-renders.

The gate that keeps a coding agent from bringing the bug back: change an unrelated slice and expect the same reference back. toBe, not toEqual.

Build createSelector yourself, with a recomputations() counter, free and no sign-up. The link is in the first comment.

#frontend #redux #react #javascript #webdevelopment
