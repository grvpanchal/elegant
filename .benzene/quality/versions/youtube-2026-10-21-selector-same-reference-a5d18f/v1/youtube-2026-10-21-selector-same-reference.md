---
channel: youtube
date: 2026-10-21
format: short
aspect: "9:16"
duration_s: 45
title: "This selector re-renders on every store change (useSelector compares with ===)"
tags: [redux, react-redux, useSelector, selectors, createSelector, reselect, react, frontend]
claim: A selector that returns a new object re-renders its component on every store change, because useSelector compares with ===; memoizing on stable inputs takes it to zero.
source: "skills/state-selectors/SKILL.md (DON'T: 'Create selectors that return new objects every time'); templates/chota-react-redux/src/containers/TodoListContainer.jsx; render counts measured on React 19.2.5 + React-Redux 9.2.0 under jsdom on 2026-10-17"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=youtube&utm_medium=video&utm_campaign=state-selectors
---
# This selector re-renders on every store change (useSelector compares with ===)

Build the memoizer yourself, free and with no sign-up:
https://elegantfrontend.training/practice/memoized-selector.html?utm_source=youtube&utm_medium=video&utm_campaign=state-selectors

We found this in our own React-Redux template. The todo list selector returned { ...todo, todoItems }, a new object on every
call. React-Redux reruns the selector after every store change and compares the result with the last one using ===, so a
fresh object always re-renders. 3 theme toggles, 3 re-renders of a list that never changed (React 19.2, React-Redux 9.2).
shallowEqual hides it on the "All" filter and fails on "Active". createSelector over stable inputs takes it to 0, and one
toBe test keeps it there when a coding agent writes the next selector.

The term: selector, the read path of the State layer. Same state in, same reference out.

#redux #react #frontend

## Shots

| Time | Picture | Caption |
|---|---|---|
| 0–4 s | Screen recording: the theme toggle clicked 3 times; a render counter beside the todo list climbs 1, 2, 3 | The list re-rendered 3 times. It never changed. |
| 4–12 s | Code close-up: useSelector((state) => getVisibleTodos(state.todo, filterId)), then getVisibleTodos ending in return { ...todo, todoItems } highlighted | A new object on every call |
| 12–20 s | Diagram: store change, selector reruns, new result === last result? A red "false" arrow into "re-render" | useSelector compares with ===, not contents |
| 20–28 s | Split screen: shallowEqual added; the "All" filter shows 0 re-renders, then "Active" shows 3 again because filter() makes a new array | shallowEqual passes "All", fails "Active" |
| 28–37 s | Code: createSelector([(s) => s.todo, (s) => selectFilter(s).id], getVisibleTodos); the counter stays at 0 through 3 toggles | Memoize on inputs that are already stable: 0 |
| 37–45 s | Code: expect(b).toBe(a) on an unrelated slice change, then the practice page on elegantfrontend.training | Build it yourself, free: link in the description |

## Script

- 0–4 s: "Three theme toggles. Three re-renders. And this list never changed."
- 4–12 s: "Here's why. This selector builds a new object every time it runs."
- 12–20 s: "useSelector compares the new result with the last one using triple equals. A new object is never equal, so it re-renders."
- 20–28 s: "shallowEqual looks like the fix. It works on 'All', and fails on 'Active', because filter makes a new array."
- 28–37 s: "The fix: createSelector over inputs that are already stable. Zero re-renders."
- 37–45 s: "Then lock it in with a toBe test, so the next selector your agent writes keeps it. Build the memoizer yourself, free. Link in the description."
