# UI Organism

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-organism)

> `ui-organism` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Atomic-design guidance for Organisms — complex feature-level sections (Header, ProductGrid, CommentSection) that compose molecules, render loading/error/empty states from props, and own responsive layout decisions. Organisms stay presentational; a Container connects them to state and passes data/events down. Use when authoring components under ui/organisms or deciding molecule vs organism boundaries.

## When to use

Creating or reviewing organism-level components; keeping organisms presentational (data and event callbacks arrive as props from a Container, not from store hooks inside the organism); keeping loading/error/empty rendering at this layer (not in molecules); defining responsive breakpoint behaviour per feature.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-organism
```

Or copy the [`ui-organism/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/organisms/**/*.{jsx,tsx,vue,js,ts}`
- `**/components/organisms/**/*`
- `**/organisms/**/*`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
