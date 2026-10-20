---
channel: linkedin
date: 2026-10-20
format: image
media: docs/assets/img/diagrams/state-system-diagram.png
media_alt: "The State layer: actions and action types flow through middleware to the reducer and the store; selectors read from the store."
claim: The write path of a store fails loudly and the read path fails quietly, so test selectors for references, not only for values.
source: "docs/state/selectors.md and docs/state/reducer.md (Common Mistakes); skills/state-reducer/SKILL.md; skills/state-selectors/SKILL.md; Redux 5.0.1 createStore error text, run on 2026-10-17"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
first_comment: "Practise the read path, free: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
Every bug in a Redux-family store sits on one of two paths. One of them tells you. The other doesn't.

The write path: action → middleware → reducer → store. Get it wrong and something visibly breaks. Mutate state in a reducer and the component never updates. Forget the default case and the store throws when it is created: the slice reducer "returned undefined during initialization". Call Date.now() inside a reducer and the same action gives a different state on every run, so its unit test turns flaky. Loud.

The read path: store → selector → component. Get it wrong and every test still passes. A selector that returns { ...todo, todoItems } gives the right todos every time, so a test that checks values is green. It also gives a new object every time, so every store change, in any slice, re-renders the component that reads it. No error. Just work nobody asked for, multiplied by every list on the page.

That's why our selector tests check references, not only values:

expect(selectVisibleTodos(nextState)).toBe(selectVisibleTodos(state))

…where nextState changed a slice the selector doesn't read. toBe, not toEqual. toEqual would pass on the bug.

The diagram is the State layer from our docs: selectors read from the store, and nothing on the read path is allowed to write back. Derive, don't store. Then return the same reference until an input changes.

If you review AI-written state code, review the read path on purpose. It's the half that won't fail for you.

#frontend #redux #javascript #softwaretesting
