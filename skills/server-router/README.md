# Server Router

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-router)

> `server-router` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Client-side routing patterns — declarative route tables, dynamic segments, protected routes, lazy-loaded chunks, scroll restoration, and accessible focus management on navigation. Use when wiring React Router/Vue Router/Angular Router, adding an auth guard, or fixing missing 404/scroll-to-top behaviour.

## When to use

Setting up or restructuring the route table; extracting params with useParams/useNavigate; adding ProtectedRoute/auth guards; lazy-loading route components; fixing scroll restoration or accessibility announcements on navigation.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-router
```

Or copy the [`server-router/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/routes/**/*.{jsx,tsx,js,ts}`
- `**/*Router*.{jsx,tsx}`
- `**/*routes*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
