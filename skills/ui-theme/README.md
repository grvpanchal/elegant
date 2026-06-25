# UI Theme

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-theme)

> `ui-theme` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Design-token systems — semantic CSS custom properties for colours, spacing, typography, and shadows, with light/dark theme switching via `[data-theme]` overrides. Use when setting up a token catalogue, auditing components for hardcoded colours/magic numbers, or adding dark-mode support via token swaps.

## When to use

Setting up or extending a design-token catalogue; replacing hardcoded colours/spacing with `var(--token)` references; implementing dark-mode via `[data-theme="dark"]` overrides; enforcing semantic names (--color-error) over value names (--color-red).

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/ui-theme
```

Or copy the [`ui-theme/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/theme/**/*.{css,scss,less}`
- `**/styles/**/*.{css,scss,less}`
- `**/tokens/**/*`
- `**/*theme*.{css,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
