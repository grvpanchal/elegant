# State Reducer

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-reducer)

> `state-reducer` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Reducer design — pure `(state, action) => newState` functions, immutable updates (spread or Immer), default-case handling, and combineReducers composition. Use when writing or reviewing slice reducers, fixing accidental mutations, or splitting a monolithic reducer by domain.

## When to use

Writing new reducers or RTK slices; auditing for accidental state mutation or impure operations (Date.now, fetch) inside reducers; composing reducers with combineReducers; testing reducer cases in isolation.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/state-reducer
```

Or copy the [`state-reducer/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/store/**/*.{js,ts}`
- `**/reducers/**/*.{js,ts}`
- `**/*Reducer*.{js,ts}`
- `**/*slice*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
