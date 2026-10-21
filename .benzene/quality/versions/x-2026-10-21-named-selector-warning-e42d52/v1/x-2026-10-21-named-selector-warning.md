---
channel: x
date: 2026-10-21
format: thread
claim: Naming a selector makes React-Redux's dev warning name the culprit instead of "unknown", and the state-selectors Agent Skill makes the recomputations() gate the definition of done.
source: skills/state-selectors/SKILL.md; docs/state/selectors.md; React-Redux 9 dev warning Selector unknown returned a different result when called with the same parameters on anonymous arrows; templates/chota-react-redux/src/containers/TodoListContainer.jsx
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors
---
A memoized selector returns the same reference when its inputs don't change. An anonymous arrow selector returns "unknown" in React-Redux's dev warning — you can't tell which one re-renders.

---

Name the selector. The warning then names the culprit, and the recomputations() counter proves the cache held.

---

The state-selectors Agent Skill names the inputs and makes the gate the definition of done. Not a review comment. A test.

---

Build it yourself: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=x&utm_medium=social&utm_campaign=state-selectors

#redux #selectors