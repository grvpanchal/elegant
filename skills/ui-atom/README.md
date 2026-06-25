# UI Atom

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-atom)

> `ui-atom` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Atomic-design guidance for UI Atoms — the smallest single-purpose building blocks (buttons, inputs, icons, labels). Use when authoring or reviewing components under ui/atoms, components/atoms, or when deciding whether a component belongs at the atom level.

## When to use

Creating or reviewing Atom-level components; deciding whether a component is an atom vs. molecule; enforcing single-responsibility and design-token consumption in primitives.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill ui-atom
```

Or copy the [`ui-atom/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/atoms/**/*.{jsx,tsx,vue,js,ts}`
- `**/components/atoms/**/*`
- `**/atoms/**/*`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
