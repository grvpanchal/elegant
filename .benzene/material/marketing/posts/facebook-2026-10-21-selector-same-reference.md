---
channel: facebook
date: 2026-10-21
format: carousel
claim: A selector that returns a new object re-renders its component on every store change, because useSelector compares with ===; memoizing on stable inputs takes it to zero.
source: "skills/state-selectors/SKILL.md; templates/chota-react-redux/src/containers/TodoListContainer.jsx; render counts measured on React 19.2.5 + React-Redux 9.2.0 under jsdom on 2026-10-17"
campaign: state-selectors
slides: .benzene/material/marketing/slides/selector-same-reference.md
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=facebook&utm_medium=social&utm_campaign=state-selectors
---
Quick one for anyone who writes or reviews Redux code: how many times does this todo list re-render when you toggle the theme three times?

useSelector((state) => getVisibleTodos(state.todo, filterId))

…where getVisibleTodos returns { ...todo, todoItems }.

We ran it in our own template on React 19.2 and React-Redux 9.2. The answer is 3. The list didn't change at all, but useSelector compares results with ===, and a freshly built object is never === to the last one. The theme lives in a different slice, and it doesn't matter.

The slides go through the patch most people reach for (shallowEqual, which only works while the filter is "All"), the fix (createSelector over inputs that are already stable: 0 re-renders), and the one test that keeps a coding agent from bringing the bug back.

Want to see it for yourself? Build createSelector by hand in this free practice question. It runs in your browser with its tests, no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=facebook&utm_medium=social&utm_campaign=state-selectors

So, before you swipe: what did you guess, 0, 1 or 3? And which fix would you have shipped?
