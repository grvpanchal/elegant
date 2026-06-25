# UI Story

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-story)

> `ui-story` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Storybook story authoring — Component Story Format (CSF) with default-export metadata and named-export stories, argTypes for Controls, play functions for interaction tests, and coverage of edge states (empty/error/loading/long-text). Use when writing `.stories.jsx/ts` files or reviewing Storybook coverage for a component.

## When to use

Writing or reviewing `.stories.{js,jsx,ts,tsx}` files; adding argTypes for the Controls addon; covering edge-case states (empty/error/loading/long-text/icon-only); wiring play functions for interaction testing.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-story
```

Or copy the [`ui-story/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/*.stories.{js,jsx,ts,tsx}`
- `**/*.story.{js,jsx,ts,tsx}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
