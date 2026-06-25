# State Selectors

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-selectors)

> `state-selectors` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Selector functions for reading state — Reselect/createSelector memoisation, input-selector composition, parameterised selector factories, and colocating selectors with slices. Use when extracting state into components, avoiding redundant re-renders from filtered lists, or abstracting state shape behind `selectXxx` helpers.

## When to use

Writing `selectXxx` helpers colocated with slices; memoising derived data (filtered/sorted lists, aggregated stats) with createSelector; factoring parameterised selectors (selectTodoById); replacing raw `state.x.y` access in components.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/state-selectors
```

Or copy the [`state-selectors/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/store/**/*.{js,ts}`
- `**/selectors/**/*.{js,ts}`
- `**/*Selectors*.{js,ts}`
- `**/*slice*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
