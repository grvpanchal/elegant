---
channel: x
date: 2026-10-31
format: thread
claim: A selector test that only checks values passes on the bug; check the reference with toBe after an unrelated slice changes, and count recomputations().
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js; toBe, toEqual and recomputations() checked 2026-10-19 on Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json); skills/state-selectors/SKILL.md"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
A selector test that checks values passes on the bug.

{ ...todo, todoItems } returns the right todos every time, and a new object every time. toEqual is happy. useSelector renders the list on every dispatch.

---

Check the reference instead. Change a slice the selector doesn't read:

const next = { ...state, config: { ...state.config, theme: "dark" } }
expect(selectTodoData(next)).toBe(selectTodoData(state))

Plain selector: fails. Memoized: passes.

---

Then count. After the theme change, selectTodoData.recomputations() is still 1: the result function never ran again. Every Reselect 5 selector exposes it.

Build the memoizer and its counter yourself, free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
