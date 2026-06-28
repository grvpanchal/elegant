# State Actions

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-actions)

> `state-actions` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Redux/NgRx/RTK action design — plain-object events describing what happened, FSA-compliant structure, and request/success/error patterns for async flows. Use when writing action creators, RTK slices, or reviewing action-type naming and payload shape.

## When to use

Authoring or reviewing action creators, type constants, or RTK slice reducers; designing async action triples (request/success/error); enforcing FSA compliance and serialisable payloads.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill state-actions
```

Or copy the [`state-actions/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/store/**/*.{js,ts}`
- `**/actions/**/*.{js,ts}`
- `**/*Actions*.{js,ts}`
- `**/*slice*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
