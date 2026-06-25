# Server SSG

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-ssg)

> `server-ssg` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Static Site Generation — build-time HTML pre-rendering, getStaticProps/getStaticPaths, ISR revalidate intervals, and fallback strategies (false/true/blocking). Use when choosing SSG vs SSR for a route, tuning ISR revalidation, or handling dynamic-route pre-rendering for blogs, docs, and marketing pages.

## When to use

Deciding SSG vs SSR vs CSR for a given page; setting up getStaticProps/getStaticPaths; picking a fallback strategy for dynamic routes; configuring ISR revalidate windows for semi-static content.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-ssg
```

Or copy the [`server-ssg/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/pages/**/*.{jsx,tsx,vue,md,mdx}`
- `**/*static*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
