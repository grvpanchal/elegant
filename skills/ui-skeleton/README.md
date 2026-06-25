# UI Skeleton

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-skeleton)

> `ui-skeleton` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Skeleton loading placeholders — gray-shape stand-ins that mirror final content dimensions, use subtle shimmer/pulse animation, and prevent layout shift. Use when replacing generic spinners with content-shaped placeholders, reducing perceived latency on slow routes, or preventing CLS on image-heavy cards.

## When to use

Replacing generic spinners with content-shaped placeholders (CardSkeleton, ListSkeleton); preventing layout shift (CLS) during data load; designing shimmer/pulse animations; deciding when not to show a skeleton (<200ms loads).

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/ui-skeleton
```

Or copy the [`ui-skeleton/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/skeletons/**/*.{jsx,tsx,vue,js,ts}`
- `**/components/skeletons/**/*`
- `**/*Skeleton*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
