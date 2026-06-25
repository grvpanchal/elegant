# Server App Shell

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-app-shell)

> `server-app-shell` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

App Shell architecture — the cached HTML/CSS/JS skeleton (header, nav, footer) served instantly via Service Worker while dynamic content streams in. Use when building PWAs, wiring service-worker caches, inlining critical CSS, or adding offline fallbacks and skeleton loading states.

## When to use

Designing the root layout and service-worker cache strategy for a PWA; separating static shell from dynamic content; adding offline fallback pages; optimising first-paint with inlined critical CSS.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-app-shell
```

Or copy the [`server-app-shell/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/shell/**/*.{jsx,tsx,js,ts}`
- `**/layout/**/*.{jsx,tsx}`
- `**/app/**/*.{jsx,tsx}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
