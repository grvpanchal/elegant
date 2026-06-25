# State Operations

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-operations)

> `state-operations` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Async operation patterns — explicit idle/loading/succeeded/failed status tracking, optimistic updates with rollback, debouncing/batching, and race-condition handling via request cancellation. Use when designing async workflows, wiring createAsyncThunk pending/fulfilled/rejected handlers, or fixing stale-data bugs from out-of-order responses.

## When to use

Tracking loading/success/error per operation; implementing optimistic UI with rollback on failure; debouncing search/autosave; cancelling stale requests to avoid race conditions; showing skeleton/error/empty states uniformly.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/state-operations
```

Or copy the [`state-operations/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/store/**/*.{js,ts}`
- `**/operations/**/*.{js,ts}`
- `**/*thunk*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
