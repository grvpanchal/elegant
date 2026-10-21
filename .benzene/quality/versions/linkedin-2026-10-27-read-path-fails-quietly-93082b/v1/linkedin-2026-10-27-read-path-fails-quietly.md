---
channel: linkedin
date: 2026-10-27
format: document
claim: The write path of a Redux store fails loudly and the read path fails quietly, so selectors need a reference test (toBe), not only a value test.
source: "Redux 5.0.1 combineReducers error text, run 2026-10-19; templates/chota-react-redux/src/state/todo/todo.selectors.js; render counts measured 2026-10-19 (.benzene/material/marketing/evidence/selector-rerenders.json); docs/state/reducer.md and docs/state/selectors.md (Common Mistakes)"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
slides: .benzene/material/marketing/slides/read-path-fails-quietly.md
document_title: "Write path fails loudly, read path fails quietly"
first_comment: "Practise the read path: build a memoized selector and count its recomputations. Free, no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
A Redux store has two paths, and only one of them tells you when it is broken.
The other one passes every test you are likely to write.

The write path is loud. Leave the default case out of a reducer and createStore throws before the app starts:

"The slice reducer for key "todo" returned undefined during initialization."

Mutate state in place and the screen stops updating. Someone notices the same day.

The read path is quiet. A selector that returns { ...todo, todoItems } hands back the right todos on every call, so every value test passes. It also hands back a new object on every call, so every dispatch, in any slice, renders the component that reads it again. In our React-Redux template the todo list rendered on each of 3 theme toggles. Nothing threw. React-Redux logs one warning in development, the first time the selector runs, and nothing in production.

So the read path needs its own kind of test. Check the reference, not only the value:

expect(selectTodoData(next)).toBe(selectTodoData(state))

where next changed a slice the selector doesn't read. toEqual passes on the bug. toBe fails on it.

If you review state code a coding agent wrote, that is the line to look for. A reducer bug shows up in the app. A selector bug shows up only in the profiler, or in a test that compares references.

The deck has both paths side by side. The practice question is in the first comment.

#redux #react #frontend #testing
