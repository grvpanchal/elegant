---
channel: youtube
date: 2026-10-21
format: short
aspect: "9:16"
duration_s: 45
title: Why your todo list re-renders when you change the theme
tags: [redux, react-redux, useSelector, selectors, createSelector, reselect, react, frontend]
claim: A selector that returns a new object re-renders its component on every dispatch, because useSelector compares with ===; createSelector over stable inputs takes it to zero.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js and src/containers/TodoListContainer.jsx; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=youtube&utm_medium=video&utm_campaign=state-selectors
---

https://elegantfrontend.training/practice/memoized-selector.html?utm_source=youtube&utm_medium=video&utm_campaign=state-selectors

Why does a todo list re-render when you change the theme? In our own React-Redux template, toggling the theme three times re-rendered the list three times, even though its data never changed.

The selector returns { ...todo, todoItems } — a fresh object on every call. useSelector compares the new result with the last one using ===, so a fresh object always triggers a render. It doesn't matter that the theme lives in another slice.

shallowEqual works on the "All" filter and fails on "Active", because filter() builds a new array on every call. The fix that holds is createSelector over inputs that are already stable: state.todo and the selected filter's id. That takes the renders to zero.

Keep it fixed with a reference test: change a slice the selector doesn't read and expect the same object back — toBe, not toEqual.

Measured on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1. Build the memoizer yourself, free and with no sign-up.

#react #redux #frontend

## Shots

| Time | Picture | Caption |
|---|---|---|
| 0–4 s | Screen recording: the theme toggle clicked 3 times; a render counter beside the todo list climbs on every click; the todos never change | Three toggles. Three re-renders. |
| 4–11 s | Code close-up: the selector ends with return { ...todo, todoItems }, a fresh object on every call | A new object every time |
| 11–19 s | Diagram: dispatch → selector runs again → new result === last result? Red "false" arrow into "render" | useSelector compares references, not values |
| 19–27 s | Split screen: shallowEqual on "All" — counter still; on "Active" — counter climbs; filter() makes a new array | shallowEqual passes "All", fails "Active" |
| 27–36 s | Code: createSelector([(s) => s.todo, (s) => getSelectedFilter(s).id], getVisibleTodos); 3 toggles, counter at 0 | Stable inputs, zero renders |
| 36–45 s | Code: expect(selectTodoData(next)).toBe(selectTodoData(state)) after a theme change; then the practice page | Lock it with toBe. Link in description |

## Script

- 0–4 s: "Three theme toggles. The todo list re-renders all three times. Its data never changed."
- 4–11 s: "The selector returns a fresh object every time it runs. useSelector compares that result with the last one using ===, and a new object never passes."
- 11–19 s: "It doesn't matter that the theme lives in a different slice. Any dispatch runs the comparison, and a fresh object always triggers a render."
- 19–27 s: "shallowEqual works on the "All" filter and fails on "Active", because filter() makes a new array on every call."
- 27–36 s: "createSelector over inputs that are already stable — state.todo and the selected filter's id — takes it to zero renders."
- 36–45 s: "Lock it with a reference test: change a slice the selector doesn't read and expect the same object back. toBe, not toEqual. Build the memoizer yourself, free, no sign-up — link in the description."
