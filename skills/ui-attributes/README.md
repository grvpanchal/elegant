# UI Attributes

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-attributes)

> `ui-attributes` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

HTML attribute semantics — boolean attributes (presence = true), attribute-vs-property distinction, `data-*` metadata, and ARIA attributes for accessibility. Use when fixing `disabled="false"` bugs, adding custom metadata to elements, or understanding why JSX `disabled={false}` differs from HTML `disabled="false"`.

## When to use

Debugging boolean-attribute bugs (disabled="false" stays disabled); distinguishing attributes (markup) from properties (DOM); using data-* for custom metadata; wiring ARIA attributes on interactive elements.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-attributes
```

Or copy the [`ui-attributes/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/components/**/*.{jsx,tsx,vue,js,ts,html}`
- `**/ui/**/*.{jsx,tsx,vue,js,ts,html}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
