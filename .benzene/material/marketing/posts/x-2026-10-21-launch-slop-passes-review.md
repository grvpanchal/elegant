---
channel: x
date: 2026-10-21
format: thread
claim: AI slop often passes review and every value test; a one-line reference check catches it, which is the pattern behind every Elegant term.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js; render counts measured 2026-10-19 (.benzene/material/marketing/evidence/selector-rerenders.json); skills/state-selectors/SKILL.md"
campaign: launch
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=launch
---
Slop that passes review, from our own React-Redux template:

return { ...todo, todoItems }

The right todos on every call, in a new object on every call. The list re-rendered on every theme toggle, and every value test stayed green.

---

useSelector compares with ===, and a fresh object never passes.

The fix is one createSelector over state.todo and the filter id: 0 renders.

The gate is one line:
expect(select(next)).toBe(select(state))

---

That's the pattern for all 45 terms on Elegant: name the rule, encode it as an Agent Skill, give it a check an agent can't argue with.

Build the memoizer yourself, free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=launch
