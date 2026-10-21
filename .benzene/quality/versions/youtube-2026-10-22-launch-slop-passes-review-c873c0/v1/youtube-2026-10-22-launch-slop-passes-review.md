---
channel: youtube
date: 2026-10-22
format: short
aspect: "9:16"
duration_s: 45
title: "This code passes every test. It's still AI slop."
tags: [ai slop, coding agents, frontend architecture, react, redux, useSelector, agent skills, frontend]
claim: AI slop often passes review and every value test; a one-line reference check catches it, and Elegant teaches that pattern for 45 frontend terms.
source: "templates/chota-react-redux/src/state/todo/todo.selectors.js; render counts measured 2026-10-19 on React 19.2.5, React-Redux 9.2.0 and Reselect 5.1.1 (.benzene/material/marketing/evidence/selector-rerenders.json); docs/_data/book.yml (45 terms); skills/ (45 Agent Skills)"
campaign: launch
showcase_url: https://elegantfrontend.training/practice/?utm_source=youtube&utm_medium=video&utm_campaign=launch
---
# This code passes every test. It's still AI slop.

Free practice questions with real tests, no sign-up:
https://elegantfrontend.training/practice/?utm_source=youtube&utm_medium=video&utm_campaign=launch

Slop isn't always broken code. This selector, from our own React-Redux template, returns the right todos on every call, so
every value test passes. It also returns a new object on every call, and useSelector compares with ===, so the todo list
re-rendered on every theme toggle (React 19.2, React-Redux 9.2). One createSelector over stable inputs takes it to zero,
and one line, expect(select(next)).toBe(select(state)), makes sure no agent brings it back.

That's what Elegant teaches for 45 frontend terms across UI, Server and State: the term, the open-source Agent Skill that
encodes it, and a practice question where you write the check.

#ai #frontend #react

## Shots

| Time | Picture | Caption |
|---|---|---|
| 0–4 s | Code close-up: return { ...todo, todoItems }, a column of green test ticks beside it | Every test passes. It's still slop. |
| 4–11 s | Screen recording: the theme toggle clicked 3 times; a render counter beside the todo list goes up on every click | The list re-renders on every toggle |
| 11–19 s | Diagram: dispatch, selector runs again, new object === last object? A red "false" arrow into "render" | A new object never === the last one |
| 19–28 s | Code: the toBe line runs red; createSelector added; it runs green and the counter stays still through 3 toggles | One line catches it. One line fixes it. |
| 28–37 s | Site: the three layers UI, Server, State; a term page; its SKILL.md; its practice question running tests | 45 terms. Each with a skill and a check. |
| 37–45 s | The practice bank on elegantfrontend.training, a question opening in the browser | Free, no sign-up. Link in the description |

## Script

- 0–4 s: "This code passes every test. It's still AI slop."
- 4–11 s: "Toggle the theme three times, and the todo list renders again every time. Its data never changed."
- 11–19 s: "The selector builds a new object on every call. useSelector compares with triple equals, and a new object never passes."
- 19–28 s: "One reference check catches it. One createSelector fixes it. Zero renders."
- 28–37 s: "That's how Elegant teaches all forty-five frontend terms: the rule, the Agent Skill that encodes it, and the check an agent can't argue with."
- 37–45 s: "The practice questions are free, with no sign-up. Link in the description."
