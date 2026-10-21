---
channel: instagram
date: 2026-10-28
format: carousel
claim: A selector that returns a new object re-renders its component on every dispatch, because useSelector compares with ===; createSelector over stable inputs takes it to zero.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json); skills/state-selectors/SKILL.md"
campaign: state-selectors
slides: .benzene/material/marketing/later/slides/selector-same-reference.md
alt_text: "Seven slides on the selector: useSelector compares results with ===; a selector that returns { ...todo, todoItems } renders the list on every theme toggle; shallowEqual fixes the All filter but not Active; createSelector over state.todo and the filter id takes it to 0; a toBe test keeps it there."
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=instagram&utm_medium=social&utm_campaign=state-selectors
first_comment: "Practice question: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=instagram&utm_medium=social&utm_campaign=state-selectors"
---
Same state in, same reference out. A selector that breaks the second half renders its component again on every dispatch.

What the slides show, from our own React-Redux template:

1. useSelector compares each result with the last one using ===. Equal contents in a new object still count as a change.
2. The todo list's selector returned { ...todo, todoItems }, a new object on every call. We toggled the theme 3 times, and the list rendered again every time. Its data never changed.
3. shallowEqual fixes it on the "All" filter and not on "Active", where filter() makes a new array on every call.
4. createSelector over state.todo and the filter id: 0 renders, on both filters.
5. The test that keeps it fixed: change a slice the selector doesn't read and expect the same object back. toBe, not toEqual.

This week's term on Elegant is the selector. The practice question has you build createSelector yourself and count how often it recomputes. Free, in your browser, no sign-up.

Link in bio. The full link is in the first comment.

#react #redux #javascript #frontend #webdev
