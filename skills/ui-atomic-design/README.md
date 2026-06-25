# UI Atomic Design

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-atomic-design)

> `ui-atomic-design` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Atomic-design methodology — five-level component hierarchy (Atoms → Molecules → Organisms → Templates → Pages) as a shared vocabulary and folder-structure convention. Use when organising a new UI library, deciding which folder a component belongs in, or onboarding a team to the atomic-design vocabulary.

## When to use

Laying out an atoms/molecules/organisms/templates/pages folder structure; classifying a new component by level; resolving team debates about whether something is a molecule or organism; teaching the vocabulary.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-atomic-design
```

Or copy the [`ui-atomic-design/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/**/*.{jsx,tsx,vue,js,ts}`
- `**/components/**/*.{jsx,tsx,vue,js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
