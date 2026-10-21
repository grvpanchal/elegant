---
channel: facebook
date: 2026-10-28
format: carousel
claim: A selector that returns a new object re-renders its component on every dispatch, because useSelector compares with ===; createSelector over stable inputs takes it to zero.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js and src/containers/TodoListContainer.jsx; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
slides: .benzene/material/marketing/slides/selector-same-reference.md
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=facebook&utm_medium=social&utm_campaign=state-selectors
---
A question for anyone who reviews React-Redux code. A todo list reads its data with

useSelector((state) => getVisibleTodos(state.todo, filterId))

and getVisibleTodos returns { ...todo, todoItems }. You toggle the theme 3 times. The todos don't change. Does the list render again?

We ran it in our own template, on React 19.2 and React-Redux 9.2: yes, on every toggle. useSelector compares the new result with the last one using ===, and an object built fresh on every call never passes. It doesn't matter that the theme lives in a different slice.

The slides go through the fix most people try first (shallowEqual, which works on the "All" filter and fails on "Active"), the one that holds (createSelector over state.todo and the filter id: 0 renders), and the one-line test that keeps it that way.

To watch a cache do its job, build createSelector yourself in this free practice question. It runs in your browser with its tests, no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=facebook&utm_medium=social&utm_campaign=state-selectors

Which fix would you have reached for first?
