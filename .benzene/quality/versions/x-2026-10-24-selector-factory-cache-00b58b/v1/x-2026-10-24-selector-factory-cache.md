---
channel: x
date: 2026-10-24
format: thread
claim: A shared memoized selector with parameters thrashes its single cache slot when components pass different ids; a selector factory gives each instance its own cache.
source: "docs/state/selectors.md (Common Mistakes: sharing selector instances); skills/state-selectors/SKILL.md (Parameterized Selectors); templates/chota-react-redux/src/state/todo/todo.selectors.js"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
A memoized selector has ONE cache slot. Two components calling selectTodoById(state, id) with different ids evict each other on every render. The agent writes it once, shares it, and the cache never holds.

---

createSelector's default cache is size 1. Component A asks for todo 3, component B asks for todo 7. The last id was different, so every call recomputes. No cache hit, ever.

---

The fix: a selector factory. makeSelectTodoById() returns a fresh createSelector per component instance. Each instance gets its own cache slot. Call it with useMemo(makeSelectTodoById, []) inside the component.

---

Make it a gate: render two TodoItem rows with different ids, change one, the other's selector must not recompute. recomputations() stays 1 per instance. toBe, not toEqual.

---

Build the factory yourself, free and with no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors