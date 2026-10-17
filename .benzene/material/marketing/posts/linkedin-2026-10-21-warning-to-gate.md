---
channel: linkedin
date: 2026-10-21
format: image
media: docs/assets/img/ai-sdlc-flow.png
media_alt: "An agent workflow: requirements, design, contracts and topology feed an orchestrator agent; code connects to the State layer through selectors, actions and effects; evaluation loops back."
claim: React-Redux 9 already detects unstable selectors in development; set stabilityCheck to always in tests and fail on the warning, and the rule becomes a gate an agent cannot argue past.
source: "react-redux 9.2.0 dist/react-redux.mjs (Provider stabilityCheck, default 'once'; useSelector warning text), read from templates/chota-react-redux/node_modules on 2026-10-17; skills/state-selectors/SKILL.md"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
first_comment: "The practice question behind this week's posts, free and with no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
Your store library already knows when an agent wrote a bad selector. It's telling you in the console, and nobody is reading it.

In development, React-Redux 9 runs a stability check the first time each useSelector call runs its selector. It calls the selector twice with the same state. If the two results aren't ===, it warns:

"Selector unknown returned a different result when called with the same parameters. This can lead to unnecessary rerenders."

"unknown" because the selector was an inline arrow with no name. Name your selectors (selectVisibleTodos) and the warning tells you which one.

A warning is a review comment. An agent will read straight past it. Make it a gate:

1. In component tests, render under <Provider store={store} stabilityCheck="always">. The check then runs on every call, not only the first.
2. Fail the test when console.warn is called. One spy, one assertion.
3. Next to every derived selector, add the reference test: an unrelated slice changes, the selector returns the same object.

Then the prompt can be short, because the checks carry the rules:

"Add selectVisibleTodos with createSelector in todo.selectors.js. Inputs: selectTodo and the selected filter id. The component reads only the selector. Done means: the stability test passes and no test logs a warning."

That's the harness idea we teach on every lesson. The Agent Skill says what good looks like. The check says whether you got it. And "done" is something the test runner reports, not an opinion.

Practice question in the first comment: build createSelector yourself and watch its recomputations() counter.

#frontend #redux #ai #softwaretesting
