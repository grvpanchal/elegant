---
channel: x
date: 2026-10-25
format: thread
claim: A selector test that only checks values passes on a bug; check the reference with toBe and a recomputations counter so an unrelated slice change never changes the returned object.
source: "skills/state-selectors/SKILL.md; templates/chota-react-redux/src/containers/TodoListContainer.jsx; render counts measured on React 19.2.5 + React-Redux 9.2.0 under jsdom on 2026-10-17"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
A selector test that checks values passes on a bug.

{ ...todo, todoItems } returns the right todos every time — and a new object every time. useSelector re-renders on every store change.

The test that catches it checks the reference, not the contents.

---
toBe, not toEqual.

An unrelated slice changes, the selector must return the identical object:

expect(selectVisibleTodos(nextState)).toBe(selectVisibleTodos(state))

---
Add a recomputations() counter.

assert.equal(selectVisibleTodos.recomputations(), 1)

One recompute, not five. That's the gate an agent can't argue past.

---
Build the memoizer yourself, free and with no sign-up:

https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors

#frontend #redux
