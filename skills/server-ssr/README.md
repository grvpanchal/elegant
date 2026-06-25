# Server SSR

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-ssr)

> `server-ssr` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Server-Side Rendering (SSR) patterns — initial HTML generation, client hydration, data prefetching via getServerSideProps/renderToString, and hydration-mismatch debugging. Use when adding SSR to a route, wiring Express/Next render pipelines, or choosing between SSR, SSG, and CSR.

## When to use

Adding SSR to pages/server code; debugging hydration mismatches or "window is not defined" errors; deciding SSR vs SSG vs CSR; serialising initial state for client takeover.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-ssr
```

Or copy the [`server-ssr/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/pages/**/*.{jsx,tsx,vue}`
- `**/server/**/*.{js,ts}`
- `**/*ssr*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
