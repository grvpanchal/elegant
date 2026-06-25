# State Middleware

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-middleware)

> `state-middleware` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Redux middleware — the `store => next => action => {}` pipeline for side effects, logging, analytics, and async (thunk/saga). Use when writing custom middleware, wiring async thunks, ordering middleware in configureStore, or keeping side effects out of reducers.

## When to use

Adding logger/analytics/crash-reporting middleware; writing a custom thunk-style middleware; ordering middleware in configureStore (logger last); moving side effects out of reducers.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/state-middleware
```

Or copy the [`state-middleware/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/store/**/*.{js,ts}`
- `**/middleware/**/*.{js,ts}`
- `**/*Middleware*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
