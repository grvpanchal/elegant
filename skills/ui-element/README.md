# UI Element

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-element)

> `ui-element` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Element concepts — the distinction between Component (blueprint), Element (`{ type, props }` description object), and DOM node (browser primitive), plus custom-element registration via `customElements.define`. Use when teaching the JSX→createElement→DOM pipeline or registering Web Components with observedAttributes lifecycle.

## When to use

Clarifying Component vs Element vs DOM-node terminology; reading how JSX desugars to createElement calls; registering custom elements with observedAttributes/attributeChangedCallback; waiting on customElements.whenDefined.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/ui-element
```

Or copy the [`ui-element/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/components/**/*.{jsx,tsx,vue,js,ts}`
- `**/ui/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
