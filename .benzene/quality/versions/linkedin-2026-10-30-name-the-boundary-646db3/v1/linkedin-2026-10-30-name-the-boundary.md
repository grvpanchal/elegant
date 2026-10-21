---
channel: linkedin
date: 2026-10-30
format: document
claim: An agent writes createSelector in seconds; deciding that the code needs it (the layer, the reference contract, the test that proves it, and when it is done) is the part of frontend work a model does not do for you.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js; render counts and the stability check measured 2026-10-19 (.benzene/material/marketing/evidence/selector-rerenders.json); docs/state/selectors.md; skills/state-selectors/SKILL.md"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
slides: .benzene/material/marketing/slides/name-the-boundary.md
document_title: "Name the boundary: four decisions on one bug"
first_comment: "Practise the boundary yourself: build a memoized selector and watch its recomputations() counter. Free, no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
Writing createSelector takes a coding agent seconds.
Knowing that the todo list needs one is the job.

The bug in our own React-Redux template is one line: a selector that returns { ...todo, todoItems }. It renders the list again on every theme toggle, and the screen looks right the whole time. Fixing it takes four decisions, and none of them is typing.

1. Which layer is the filtered list? Derived state. A selector computes it from the store when it is read; nothing stores it beside the todos.

2. What is the selector's contract? Same state in, same reference out, because useSelector compares with ===.

3. What proves it? Change a slice the selector doesn't read and get the same object back: toBe, not toEqual.

4. When is it done? When that test passes and React-Redux's stability check stays silent under stabilityCheck="always". Not when the screen looks right, because it looked right with the bug.

Those decisions are about your app, not about React, so a model can't make them for you. Write them down and an agent can do the rest. Leave them out and you get code that looks finished.

That is what Elegant teaches, one term at a time: the term, the boundary it draws, and the check that proves it.

The deck walks the four decisions on the same bug. The practice question is in the first comment.

#frontend #careers #react #redux
