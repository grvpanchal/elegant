# State State

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-state)

> `state-state` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

State-management fundamentals — deciding between local (useState), lifted, global (Redux/Zustand), server (React Query), and URL state; single-source-of-truth rules; unidirectional data flow. Use when choosing where a piece of data should live, refactoring prop-drilling, or introducing server-state caching.

## When to use

Deciding local vs lifted vs global vs server vs URL state for new data; eliminating duplicated state; replacing manual fetch + useState with React Query/RTK Query; moving shareable filters into URL searchParams.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/state-state
```

Or copy the [`state-state/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/state/**/*.{js,ts}`
- `**/store/**/*.{js,ts}`
- `**/*State*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
