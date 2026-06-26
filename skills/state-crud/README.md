# State CRUD

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-crud)

> `state-crud` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

CRUD patterns for state slices — consistent `domain/create|read|update|delete` action naming, request/success/error triples per operation, and normalised `{ byId, allIds }` entity shapes for O(1) lookups. Use when designing a new entity slice, standardising action-type names, or refactoring array-shaped state.

## When to use

Designing a new entity slice (todos, users, products); standardising request/success/error naming across async operations; normalising state from arrays to byId/allIds; wiring async thunks or sagas for all four CRUD ops.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill state-crud
```

Or copy the [`state-crud/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/store/**/*.{js,ts}`
- `**/slices/**/*.{js,ts}`
- `**/*Actions*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
