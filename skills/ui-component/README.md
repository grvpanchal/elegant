# UI Component

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-component)

> `ui-component` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

General component design — encapsulation of HTML/CSS/JS, single-responsibility, framework-agnostic patterns (props in, events out), colocated styles, and isolation-testable units. Use when reviewing any component's structure, refactoring a god component, or writing a native Web Component.

## When to use

Reviewing a component for single-responsibility and encapsulation; splitting a "god component" that does too much; wiring props-in/events-out boundaries; authoring native custom elements with Shadow DOM.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-component
```

Or copy the [`ui-component/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/components/**/*.{jsx,tsx,vue,js,ts}`
- `**/ui/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
