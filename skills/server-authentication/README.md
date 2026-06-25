# Server Authentication

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-authentication)

> `server-authentication` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Authentication patterns — JWT access+refresh token flows, httpOnly-cookie storage, axios refresh interceptors, auth context providers, and protected-route guards. Use when building login/logout, handling 401 retry loops, choosing secure token storage, or guarding routes that require a session.

## When to use

Implementing login/logout and session bootstrap; wiring access/refresh-token refresh in API interceptors; deciding between memory, cookie, and localStorage token storage; protecting routes behind auth guards.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/server-authentication
```

Or copy the [`server-authentication/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/auth/**/*.{js,ts}`
- `**/*auth*.{js,ts}`
- `**/login/**/*.{jsx,tsx}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
