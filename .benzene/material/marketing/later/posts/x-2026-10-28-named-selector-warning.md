---
channel: x
date: 2026-10-28
format: thread
claim: React-Redux 9's stability warning says "unknown" for an inline arrow and checks only the first run by default; name the selector and set stabilityCheck="always" in tests to make it a gate.
source: "react-redux 9.2.0 dist/react-redux.mjs (selector.name || 'unknown'; stabilityCheck default 'once'), read 2026-10-19; warnings counted 2026-10-19 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
React-Redux 9 warns when a selector returns a new object for the same state. Our template's todo list gets:

"Selector unknown returned a different result when called with the same parameters."

"unknown" is the function's name. An inline arrow has none.

---

Name it and the warning names the culprit:

const selectTodoData = (s) => getVisibleTodos(s.todo, getSelectedFilter(s).id)

Now it reads "Selector selectTodoData returned a different result". Memoizing it is what makes it stop.

---

The check runs once per useSelector by default: the first run only.

A shallowEqual selector mounted on "All" (stable), then switched to "Active" (unstable), 3 theme toggles: 0 warnings.

stabilityCheck="always": 7.

---

So in tests: <Provider store={store} stabilityCheck="always">, spy on console.warn, fail on any call. The rule becomes a red test instead of a review comment.

Practice: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
