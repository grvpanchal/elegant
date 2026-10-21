---
channel: linkedin
date: 2026-10-26
format: document
claim: A selector that returns a new object re-renders its component on every dispatch, because useSelector compares with ===; shallowEqual hides it only on the unfiltered view, and createSelector over stable inputs takes it to zero.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js and src/containers/TodoListContainer.jsx; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json); skills/state-selectors/SKILL.md"
campaign: state-selectors
slides: .benzene/material/marketing/later/slides/selector-same-reference.md
document_title: "Selector: same state in, same reference out"
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
first_comment: "Build createSelector yourself and watch recomputations() prove the cache held. Free, runs in your browser, no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
Our own React-Redux template re-renders its todo list every time you change the theme.
The list's data never changes. We measured it: every one of 3 theme toggles rendered it again.

The container reads the list like this:

useSelector((state) => getVisibleTodos(state.todo, filterId))

getVisibleTodos ends with return { ...todo, todoItems }, a new object on every call. After every dispatch, React-Redux runs the selector again and compares the result with the last one using ===. A new object never passes, so a change in a slice the list doesn't read (the theme lives in config) renders the list anyway.

The usual patch is useSelector(fn, shallowEqual). It works on the "All" filter, where todoItems is the store's own array. Switch to "Active" and filter() builds a new array on every call: the renders come back, one per toggle.

What fixes it is memoizing on inputs that are already stable:

const selectTodoData = createSelector(
  [(s) => s.todo, (s) => getSelectedFilter(s).id],
  getVisibleTodos
)

The theme changes; state.todo and the filter id don't; the cached object comes back. 0 renders, on both filters.

The rule we give a coding agent is one line: same state in, same reference out. The check that enforces it is one line too. Change a slice the selector doesn't read, then expect(selectTodoData(next)).toBe(selectTodoData(state)). toBe, not toEqual: toEqual passes on the bug.

The deck walks through each step with the code. The practice question, where you build createSelector yourself and count its recomputations, is in the first comment.

#react #redux #frontend #javascript
