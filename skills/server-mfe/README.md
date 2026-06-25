# Server MFE

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-mfe)

> `server-mfe` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Micro-frontend architecture — independently deployable UI modules stitched together via Module Federation, import maps, or web components, with shared runtimes, versioned contracts, and an event-bus for cross-MFE comms. Use when splitting a monolith UI by team/domain, configuring a shell+remotes topology, or budgeting bundle size per MFE.

## When to use

Splitting a UI by bounded context or team ownership; configuring Module Federation shared deps and remotes; choosing between MFE integration strategies (Module Fed vs web components vs iframes vs import maps); designing cross-MFE event communication.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/server-mfe
```

Or copy the [`server-mfe/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/mfe/**/*.{jsx,tsx,js,ts}`
- `**/remote/**/*.{js,ts}`
- `**/shell/**/*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
