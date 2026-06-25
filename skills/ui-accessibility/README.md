# UI Accessibility

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-accessibility)

> `ui-accessibility` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Web accessibility (a11y) patterns — semantic HTML, ARIA attributes, keyboard navigation (Tab/Enter/Space/Arrows), focus management, colour contrast, and WCAG POUR principles. Use when reviewing components for a11y compliance, adding aria-labels to icon-only buttons, or wiring arrow-key navigation for custom dropdowns/menus.

## When to use

Reviewing components for WCAG AA compliance; replacing `<div onclick>` with semantic HTML; adding ARIA roles/labels for custom widgets; implementing keyboard navigation or focus traps in modals; auditing colour contrast.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/ui-accessibility
```

Or copy the [`ui-accessibility/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/components/**/*.{jsx,tsx,vue,js,ts}`
- `**/ui/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
