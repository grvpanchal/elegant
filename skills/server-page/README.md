# Server Page

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-page)

> `server-page` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Page components — the thin data-fetching layer that binds a route to a template, invoking getServerSideProps/getStaticProps and passing props down. Use when creating a new route, choosing SSR vs SSG vs ISR for a page, or reviewing whether a page is doing template-level work it shouldn't.

## When to use

Adding a new route/page file; deciding between getServerSideProps, getStaticProps, and ISR; wiring SEO head tags; keeping pages thin and templates dumb.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-page
```

Or copy the [`server-page/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/pages/**/*.{jsx,tsx,vue}`
- `**/app/**/*.{jsx,tsx}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
