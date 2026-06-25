# UI Molecule

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/ui-molecule)

> `ui-molecule` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Atomic-design guidance for Molecules — functional groups of atoms (SearchBar = input + button + icon; FormField = label + input + error) with a single cohesive purpose. Use when authoring or reviewing components under ui/molecules, composing atoms, or deciding atom vs molecule vs organism.

## When to use

Creating or reviewing molecule-level components; deciding whether a component is a molecule vs. an organism (no store connection = molecule); composing atoms without recreating their functionality; keeping molecules purely presentational.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant/ui-molecule
```

Or copy the [`ui-molecule/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/ui/molecules/**/*.{jsx,tsx,vue,js,ts}`
- `**/components/molecules/**/*`
- `**/molecules/**/*`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
