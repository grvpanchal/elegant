# UI Events

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-events)

> `ui-events` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

DOM event handling — capture/target/bubble phases, event delegation (one listener on a parent via `event.target.closest`), preventDefault vs stopPropagation, passive scroll listeners, and useEffect cleanup to avoid leaks. Use when wiring click/keyboard/scroll handlers, fixing listener memory leaks, or optimising lists with delegation.

## When to use

Delegating click handling from many children to one parent; wiring keyboard support (Enter/Space) alongside click; adding passive scroll/touch listeners; cleaning up listeners in useEffect return; choosing preventDefault vs stopPropagation.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-events
```

Or copy the [`ui-events/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/components/**/*.{jsx,tsx,vue,js,ts}`
- `**/ui/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
