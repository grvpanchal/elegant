# Server Session

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-session)

> `server-session` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Session management — cookie sessions vs token sessions, `httpOnly`/`Secure`/`SameSite` cookie attributes, server-side session stores, access-token-in-memory with refresh-token rotation, idle (sliding) vs absolute timeouts, session fixation and rotation on login, server-side logout invalidation, and cross-tab sync via BroadcastChannel. Use when deciding where session state lives, hardening cookie flags, implementing timeouts, or fixing logout that doesn't actually log out.

## When to use

Choosing between a server-side cookie session and a stateless token session; setting or reviewing cookie attributes; implementing idle vs absolute timeout and inactivity warnings; rotating the session identifier on login to prevent fixation; making logout revoke server-side; keeping login/logout state consistent across tabs; deciding what may live in localStorage vs sessionStorage vs memory.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-session
```

Or copy the [`server-session/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/session/**/*.{js,ts}`
- `**/*session*.{js,ts,jsx,tsx}`
- `**/*token*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
