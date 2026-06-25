# UI Template

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-template)

> `ui-template` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Atomic-design guidance for Templates — page-level wireframes that arrange organisms into layout slots (hero/main/sidebar/footer) without fetching data. Use when authoring components under ui/templates, defining reusable page skeletons, or keeping layout decisions out of pages and organisms.

## When to use

Creating a reusable page layout that accepts content via slots/props; keeping data fetching out of templates (it belongs in pages); defining responsive breakpoints at the layout level; separating layout concerns from organism concerns.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-template
```

Or copy the [`ui-template/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/templates/**/*.{jsx,tsx,vue,js,ts}`
- `**/components/templates/**/*`
- `**/templates/**/*`
- `**/layouts/**/*`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
