---
channel: linkedin
date: 2026-10-20
claim: The write path of a store fails loudly and the read path fails quietly, so test selectors for references, not only for values.
source: docs/state/selectors.md and docs/state/reducer.md (Common Mistakes); skills/state-reducer/SKILL.md; skills/state-selectors/SKILL.md; Redux 5.0.1 createStore error text, run on 2026-10-17
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
slides: .benzene/material/marketing/slides/read-path-fails-quietly.md
document_title: Write path fails loudly, read path fails quietly
first_comment: "Practise the read path, free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---

A selector can return exactly the right value and still break your app. The bug never throws. Every test passes. The component just re-renders on every store change, for no reason.

The write path is louder. Mutate state in a reducer and the component stops updating. Forget the default case and Redux throws when the store is created — the slice reducer "returned undefined during initialization". Call Date.now() inside a reducer and the same action produces a different state on every run, so its unit test turns flaky. Obvious, fast, loud.

The read path works differently. Store → selector → component. A selector that returns { ...todo, todoItems } gives the right todos every time, so a value test stays green. It also gives a new object every time, so every store change — in any slice — re-renders the component that reads it. No error. Just work nobody asked for.

That's why our selector tests check references, not only values:

expect(selectVisibleTodos(nextState)).toBe(selectVisibleTodos(state))

…where nextState changed a slice the selector doesn't read. toBe, not toEqual. toEqual would pass on the bug.

Practise the read path for free — link in the first comment.

#frontend #redux #state #selectors #javascript