---
channel: linkedin
date: 2026-10-23
format: image
media: docs/assets/img/ui-server-state.png
media_alt: "UI - Server - State: the three layers of the Universal Frontend Architecture."
claim: Agents write the code, but someone still has to name which layer a value belongs to and what "done" means as a test; that vocabulary is the job a displaced frontend developer can still own.
source: "docs/_data/plans.yml (state-essentials); docs/state/selectors.md; skills/state-selectors/SKILL.md; docs/practice/memoized-selector.md"
campaign: state-selectors
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
first_comment: "This week's term as one practice question, free and with no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
If an agent took the typing part of your frontend job, it didn't take the naming part.

Someone still has to say which layer a value belongs to, what crosses a boundary, and what "done" means as a test.

This week we spent five posts on one word: selector. The agent can write one in a second. Whether it returns the same reference until its inputs change is decided by the person who knows the word well enough to:
→ ask for createSelector with the right inputs
→ spot { ...todo, todoItems } in a diff and know it re-renders on every store change
→ reject shallowEqual as the fix, because filter() builds a new array every call
→ write the toBe() test that keeps the next fifty selectors honest

That's how elegantfrontend.training is built. One frontend term from the UI, Server or State layer. Then the open-source Agent Skill that turns it into rules a coding agent follows. Then a practice question with real tests that runs in your browser.

The free State essentials plan walks the State layer in 315 minutes: eight term docs (state, store, actions, reducer, selectors, middleware, AJAX, CRUD), then eight practice questions, ending with a guardrail for a store's shape.

If you're between jobs and rebuilding, start with the term you'd be least confident explaining in an interview. For a lot of people that's this one.

Practice question in the first comment. No account needed.

#frontend #careers #ai #webdevelopment #redux
