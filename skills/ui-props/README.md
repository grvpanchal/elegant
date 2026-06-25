# UI Props

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-props)

> `ui-props` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Component props design — read-only data passed parent→child, unidirectional flow with callback props for child→parent events, typed interfaces (TypeScript/PropTypes), and sensible defaults. Use when designing a component's public API, auditing prop names/counts, or fixing code that mutates props.

## When to use

Designing or reviewing a component's prop interface; replacing prop mutation with callback patterns; typing props with TypeScript/PropTypes; trimming bloated prop lists; picking default values for optional props.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/ui-props
```

Or copy the [`ui-props/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/components/**/*.{jsx,tsx,vue,js,ts}`
- `**/ui/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
