# Server Page

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-page)

> `server-page` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Page components — the thin route-level composition layer that binds a route to a layout template and the containers it hosts. In the elegant SPA templates a page is pure composition (no data fetching); in a Next.js app it additionally invokes getServerSideProps/getStaticProps. Use when creating a new route, composing containers inside a layout, or reviewing whether a page is doing template-level work it shouldn't.

## When to use

Adding a new route/page file; composing containers inside a layout template; (Next.js only) deciding between getServerSideProps, getStaticProps, and ISR; keeping pages thin and templates dumb.

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
