# UI DOM

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-dom)

> `ui-dom` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

DOM manipulation essentials — querySelector, textContent vs innerHTML (XSS risk), DocumentFragment batching to avoid reflow, and why direct DOM mutation inside React/Vue breaks reconciliation. Use when writing vanilla JS helpers, deciding between refs and querySelector, or debugging framework-vs-DOM conflicts.

## When to use

Writing vanilla-JS DOM code; batching inserts via DocumentFragment; using refs instead of querySelector inside React/Vue; avoiding innerHTML with untrusted input; understanding HTML source vs live DOM.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/ui-dom
```

Or copy the [`ui-dom/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/components/**/*.{jsx,tsx,vue,js,ts}`
- `**/ui/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
