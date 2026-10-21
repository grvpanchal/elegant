---
channel: linkedin
date: 2026-10-28
format: document
claim: React-Redux 9 already detects unstable selectors in development, but by default only on each useSelector's first run; stabilityCheck="always" plus a console.warn spy in tests turns the warning into a gate.
source: "react-redux 9.2.0 dist/react-redux.mjs (Provider stabilityCheck default 'once'; the warning names selector.name || 'unknown'), read in templates/chota-react-redux/node_modules on 2026-10-19; warnings counted 2026-10-19 (.benzene/material/marketing/evidence/selector-rerenders.json); skills/state-selectors/SKILL.md"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
slides: .benzene/material/marketing/slides/warning-to-gate.md
document_title: "Selector warning to test gate"
first_comment: "The practice question behind this week's posts: build createSelector with a recomputations() counter. Free, no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
React-Redux 9 already finds unstable selectors for you.
By default it looks once per useSelector and then stops.

In development, the first time a useSelector runs, React-Redux calls the selector a second time with the same state. If the two results are not ===, it logs:

"Selector unknown returned a different result when called with the same parameters. This can lead to unnecessary rerenders."

That is the line our own React-Redux template's todo list produces. Two details turn it into a gate.

1. "unknown" is the selector's function name. An inline arrow passed to useSelector has none. Define it as a named function, const selectTodoData = …, and the warning names the culprit: "Selector selectTodoData returned a different result…".

2. The default is stabilityCheck: "once". A selector that is stable on first render and unstable later slips past. We mounted a shallowEqual selector on the "All" filter, where it holds, switched to "Active", where it doesn't, and toggled the theme 3 times: 0 warnings. The same run under stabilityCheck="always": 7.

So in component tests, render under <Provider store={store} stabilityCheck="always">, spy on console.warn, and fail the test if it was called.

Then the instruction to a coding agent can be short, because the test carries the rule:

"Add selectTodoData to todo.selectors.js with createSelector over state.todo and the selected filter id. The container reads only that selector. Done when the component tests pass with stabilityCheck="always" and console.warn never fires."

An agent can argue with a review comment. It can't argue with a red test.

The deck has the setup step by step. The practice question is in the first comment.

#react #redux #frontend #testing
