---
channel: youtube
date: 2026-10-28
format: short
aspect: "9:16"
duration_s: 45
title: "This selector re-renders on every dispatch (useSelector compares with ===)"
tags: [redux, react-redux, useSelector, selectors, createSelector, reselect, react, frontend]
claim: A selector that returns a new object re-renders its component on every dispatch, because useSelector compares with ===; createSelector over stable inputs takes it to zero.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js and src/containers/TodoListContainer.jsx; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=youtube&utm_medium=video&utm_campaign=state-selectors
---
# This selector re-renders on every dispatch (useSelector compares with ===)

Build the memoizer yourself, free and with no sign-up:
https://elegantfrontend.training/practice/memoized-selector.html?utm_source=youtube&utm_medium=video&utm_campaign=state-selectors

We found this in our own React-Redux template. The todo list's selector returned { ...todo, todoItems }, a new object on
every call. After every dispatch, React-Redux runs the selector again and compares the result with the last one using ===,
so a fresh object always renders the list again. We toggled the theme 3 times, and the list rendered again every time,
though its data never changed (React 19.2, React-Redux 9.2). shallowEqual fixes the "All" filter and fails on "Active".
createSelector over state.todo and the filter id takes it to 0, and one toBe test keeps it there when a coding agent
writes the next selector.

The term: selector, the read path of the State layer. Same state in, same reference out.

#redux #react #frontend

## Shots

| Time | Picture | Caption |
|---|---|---|
| 0–4 s | Screen recording: the theme toggle clicked 3 times; a render counter beside the todo list goes up on every click | 3 theme toggles. The list renders every time. |
| 4–12 s | Code close-up: useSelector((state) => getVisibleTodos(state.todo, filterId)), then getVisibleTodos ending in return { ...todo, todoItems } highlighted | A new object on every call |
| 12–20 s | Diagram: dispatch, selector runs again, new result === last result? A red "false" arrow into "render" | useSelector compares with ===, not contents |
| 20–28 s | Split screen: shallowEqual added; on "All" the counter stays still, on "Active" it climbs again because filter() makes a new array | shallowEqual passes "All", fails "Active" |
| 28–37 s | Code: createSelector([(s) => s.todo, (s) => getSelectedFilter(s).id], getVisibleTodos); the counter stays still through 3 toggles | Memoize on inputs that are already stable: 0 |
| 37–45 s | Code: expect(selectTodoData(next)).toBe(selectTodoData(state)) after a theme change, then the practice page on elegantfrontend.training | Build it yourself, free: link in the description |

## Script

- 0–4 s: "Three theme toggles. The list renders every time. And its data never changed."
- 4–12 s: "Here's why. This selector builds a new object every time it runs."
- 12–20 s: "After every dispatch, useSelector compares the new result with the last one using triple equals. A new object is never equal, so the list renders."
- 20–28 s: "shallowEqual looks like the fix. It works on 'All' and fails on 'Active', because filter makes a new array."
- 28–37 s: "The fix: createSelector over inputs that are already stable. Zero renders."
- 37–45 s: "Then lock it in with a toBe test, so the next selector your agent writes keeps it. Build the memoizer yourself, free. Link in the description."
