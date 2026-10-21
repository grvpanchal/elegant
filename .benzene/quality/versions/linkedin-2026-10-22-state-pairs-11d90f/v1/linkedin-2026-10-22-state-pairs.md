---
channel: linkedin
date: 2026-10-22
format: document
claim: Five State-layer terms come in look-alike pairs (event/action, reducer/selector, middleware/operation, store/state, plain/memoized selector), and a prompt that mixes one up gets the wrong half built.
source: "docs/state/{actions,reducer,selectors,middleware,operations,store,state}.md; docs/ui/events.md; skills/state-*/SKILL.md"
campaign: state-selectors
slides: .benzene/material/marketing/slides/state-pairs.md
document_title: "5 State pairs that sound similar but work differently"
showcase_url: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors
first_comment: "Start with the pair agents get wrong most, free and with no sign-up: https://elegantfrontend.training/practice/memoized-selector.html?utm_source=linkedin&utm_medium=social&utm_campaign=state-selectors"
---
5 State pairs that sound similar but work differently.
Mix one up in a prompt and the agent builds the wrong half.

Ask an agent to "store the filtered list" and you get a reducer doing a selector's job. Now a second copy of the truth drifts out of sync on the next edit. Ask it to "handle the click in the store" and you get a DOM event in an action payload. That isn't serialisable, so time-travel debugging and replay stop working.

The carousel takes the five pairs apart:
→ Event vs action: what the browser saw vs what the store records
→ Reducer vs selector: the write path vs the read path
→ Middleware vs operation: the pipeline vs one async job inside it
→ Store vs state: the container you keep vs the value it replaces
→ Plain vs memoized selector: same value, but only one returns the same reference

The last pair is the one this week's posts are about. useSelector compares results with ===, so a selector that builds a new object re-renders its component on every store change. A memoized one doesn't.

Save it for your next review of AI-written state code. Every term has its doc on elegantfrontend.training and an open-source Agent Skill that encodes it.

The practice question for the last pair is in the first comment.

#frontend #redux #javascript #interviewprep
