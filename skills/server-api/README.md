# Server API

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-api)

> `server-api` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

API service-layer patterns — axios/fetch client with interceptors, domain-scoped service objects (UserService, ProductService), auth-token refresh, request cancellation, and error normalisation. Use when adding or reviewing HTTP call sites, organising services under api/ or services/, or centralising cross-cutting request concerns.

## When to use

Creating or refactoring API clients and service modules; adding auth-refresh or error interceptors; replacing scattered fetch/axios calls with a typed service layer; wiring AbortController cancellation.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/server-api
```

Or copy the [`server-api/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/api/**/*.{js,ts}`
- `**/services/**/*.{js,ts}`
- `**/*Service*.{js,ts}`
- `**/*Api*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
