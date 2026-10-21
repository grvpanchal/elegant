---
channel: linkedin
date: 2026-10-29
format: document
claim: Five State-layer terms come in look-alike pairs (event/action, reducer/selector, middleware/operation, store/state, plain/memoized selector), and a prompt that swaps one gets the wrong half built.
source: "docs/ui/events.md; docs/state/{actions,reducer,selectors,middleware,operations,store,state}.md; skills/state-*/SKILL.md; the plain-selector render counts measured 2026-10-19 (.benzene/material/marketing/evidence/selector-rerenders.json)"
campaign: state-selectors
slides: .benzene/material/marketing/later/slides/state-pairs.md
document_title: "5 State pairs that sound alike, work differently"
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
first_comment: "Start with the last pair, the one that costs renders: build a memoized selector, free and with no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
5 State pairs that sound alike and work differently.
Swap one in a prompt and a coding agent builds the wrong half, correctly.

Event vs action. An event is what the browser saw: a click, with a target node. An action is what the store records: { type: "todo/toggled", payload: 3 }. Ask for the click to be "handled in the store" and the store ends up holding something it can't serialise.

Reducer vs selector. The write path, (state, action) => next, and the read path, state => view. "Store the filtered list" asks for a second copy of the todos that has to be kept in sync. "Select the filtered list" asks for a derivation that can't drift.

Middleware vs operation. Middleware is the pipeline every action passes through. An operation is one async job inside it: call the API, dispatch request, then success or fail.

Store vs state. The store is the object you keep, with getState, dispatch and subscribe. State is the value it replaces on every dispatch. A component that saves a copy of state is reading yesterday's.

Plain vs memoized selector. Both return the same value. Only the memoized one returns the same object until an input changes, and useSelector compares objects, not values. In our own React-Redux template, the plain one rendered the todo list again on every theme toggle.

None of these is a style preference. Each pair is a boundary, and when an agent writes the code, the prompt is where the boundary gets drawn. Every term has its page and an open-source Agent Skill on elegantfrontend.training.

The practice question for the last pair is in the first comment.

#redux #react #frontend #javascript
