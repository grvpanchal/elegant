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
A selector that returns a new object re-renders its component on every store change.
Even when nothing it shows has changed. We found one in our own React-Redux template.

The line:

useSelector((state) => getVisibleTodos(state.todo, filterId))

getVisibleTodos ends with return { ...todo, todoItems }. That's a new object on every call. React-Redux reruns the selector after every state change and compares the result with the previous one using ===. A fresh object is never === to anything. So toggling the theme, which lives in a different slice, re-renders the todo list. We counted: 3 theme toggles, 3 re-renders, on React 19.2 and React-Redux 9.2.

The carousel walks through it:
→ why "same contents" doesn't count, only the same reference does
→ the shallowEqual patch that passes on the "All" filter and fails on "Active"
→ the memoized selector that takes it to 0
→ the one-line test that turns the rule into a gate

Why this matters if you work with coding agents: an agent copies the nearest selector it can find. If that selector returns a new reference, so will the next fifty. Our state-selectors Agent Skill already lists "selectors that return new objects every time" as a don't. A rule in prose is a suggestion. The test is what makes it hold.

The practice question has you write createSelector by hand, with a recomputations() counter, and run the tests in your browser. Free, no sign-up. The link is in the first comment.

#frontend #redux #react #javascript #webdevelopment
