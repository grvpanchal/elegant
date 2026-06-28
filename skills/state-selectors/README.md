# State Selectors

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-selectors)

> `state-selectors` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Selector functions for reading state — plain selector functions colocated with slices, optional Reselect/createSelector memoisation, input-selector composition, and parameterised selector factories. Use when extracting state into components, avoiding redundant re-renders from filtered lists, or abstracting state shape behind selector helpers.

## When to use

Writing selector helpers colocated with slices; deriving data (filtered/sorted lists, aggregated stats), optionally memoising with createSelector; factoring parameterised selectors; replacing raw `state.x.y` access in components.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill state-selectors
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
