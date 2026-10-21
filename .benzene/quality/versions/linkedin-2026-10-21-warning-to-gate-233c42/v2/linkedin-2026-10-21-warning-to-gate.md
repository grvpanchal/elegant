---
channel: linkedin
date: 2026-10-21
format: document
claim: React-Redux 9 already detects unstable selectors in development; set stabilityCheck to always in tests and fail on the warning, and the rule becomes a gate an agent cannot argue past.
source: "react-redux 9.2.0 dist/react-redux.mjs (Provider stabilityCheck, default 'once'; useSelector warning text), read from templates/chota-react-redux/node_modules on 2026-10-17; skills/state-selectors/SKILL.md"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
slides: .benzene/material/marketing/slides/warning-to-gate.md
document_title: "Selector warning to test gate"
first_comment: "Practice question behind this week's posts: build createSelector with a recomputations() counter and watch unstable selectors fail the gate. Free, no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---

One warning. Two calls. React-Redux 9 calls your selector twice with the same state — if the two results aren't ===, it says so. Save this before your next code review.

"Selector unknown returned a different result when called with the same parameters. This can lead to unnecessary rerenders."

"unknown" because the selector was an inline arrow with no name. Name it — selectVisibleTodos — and the warning tells you exactly which one is unstable.

The check runs once by default, then stops. An unstable selector slips past on every later call. stabilityCheck="always" runs it on every call, which is what a test suite needs.

In component tests, render under <Provider store={store} stabilityCheck="always">. Spy on console.warn and fail the test when it's called. One spy, one assertion. One unstable selector, one red test before review.

Then the prompt can stay short:

"Add selectVisibleTodos with createSelector in todo.selectors.js. Inputs: selectTodo and the selected filter id. The component reads only the selector. Done means: the stability test passes and no test logs a warning."

The checks carry the rules. The test runner reports "done", not an opinion. That's the harness idea behind every lesson on elegantfrontend.training.

#frontend #redux #ai #softwaretesting
