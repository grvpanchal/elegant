# Server Container

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-container)

> `server-container` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Container/presentational component split — "smart" containers connect to the store, fetch data, and orchestrate loading/error/empty states; "dumb" children just render props. Use when extracting data logic from views, introducing custom hooks, or reviewing `*Container` components.

## When to use

Splitting a component into container + presentational pair; connecting a view to Redux/NgRx/Pinia; extracting reusable data logic into a custom hook; reviewing whether a presentational component accidentally imports store code.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-container
```

Or copy the [`server-container/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/containers/**/*.{jsx,tsx,vue}`
- `**/*Container*.{jsx,tsx,vue}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
