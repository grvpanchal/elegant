# State AJAX

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-ajax)

> `state-ajax` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Async data-fetching patterns — Fetch vs Axios, service-layer organisation, AbortController cancellation, and integration with Redux Toolkit's createAsyncThunk for pending/fulfilled/rejected state transitions. Use when writing or reviewing HTTP call sites, standardising loading/error handling, or wiring request cancellation in effects.

## When to use

Choosing between fetch and axios; setting up an apiClient with interceptors; integrating async requests with Redux/NgRx slices; cancelling in-flight requests on unmount via AbortController; handling loading/error/success state uniformly.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill state-ajax
```

Or copy the [`state-ajax/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/api/**/*.{js,ts}`
- `**/services/**/*.{js,ts}`
- `**/store/**/*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
