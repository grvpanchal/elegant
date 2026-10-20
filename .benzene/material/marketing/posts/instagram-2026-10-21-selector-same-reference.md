---
channel: instagram
date: 2026-10-21
format: carousel
claim: A selector that returns a new object re-renders its component on every store change, because useSelector compares with ===; memoizing on stable inputs takes it to zero.
source: "skills/state-selectors/SKILL.md; templates/chota-react-redux/src/containers/TodoListContainer.jsx; render counts measured on React 19.2.5 + React-Redux 9.2.0 under jsdom on 2026-10-17"
campaign: state-selectors
slides: .benzene/material/marketing/slides/selector-same-reference.md
alt_text: "Seven slides on the selector term: useSelector compares results with ===, a selector that builds a new object re-renders on every change, shallowEqual only hides it on the unfiltered view, createSelector on stable inputs fixes it, and a toBe test makes it a gate."
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=instagram&utm_medium=social&utm_campaign=state-selectors
first_comment: "Practice question: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=instagram&utm_medium=social&utm_campaign=state-selectors"
---
Same state in, same reference out. That's the whole contract of a selector, and the half most code breaks is the second one.

Swipe for what we found in our own React-Redux template:

1. useSelector compares every new result with the last one using ===. Same contents don't count, only the same object.
2. Our todo list selector returned { ...todo, todoItems }, a new object on every call. 3 theme toggles meant 3 re-renders of a list that never changed.
3. shallowEqual looks like the fix. It works on the "All" filter and fails on "Active", because filter() makes a new array every time.
4. createSelector over inputs that are already stable takes it to 0.
5. One test makes it stick, even when a coding agent writes the next selector: change an unrelated slice and expect the same reference back. toBe, not toEqual.

Everything on Elegant starts from one frontend term, the Agent Skill that encodes it, and a practice question that runs in your browser. This week's term is the selector. Build createSelector yourself, with a counter that proves it only recomputes when it should. Free, no sign-up.

Link in bio, and the full link is in the first comment.

Save this for the next time you review a selector.

#frontend #redux #javascript #reactjs #webdev
