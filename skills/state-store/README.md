# State Store

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/state-store)

> `state-store` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Redux store architecture — configureStore setup, slice organisation by domain, normalised state shape, Provider wiring, typed hooks (useAppDispatch/useAppSelector), and DevTools. Use when scaffolding a new Redux store, splitting state into slices, or auditing state shape for normalisation and serialisability.

## When to use

Scaffolding a new configureStore; organising slices by domain; enforcing a single-store rule; shaping state as `{ byId, allIds }`; wiring `<Provider>` and typed hooks at the app root.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill state-store
```

Or copy the [`state-store/`](.) folder into `~/.claude/skills/`.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/store/**/*.{js,ts}`
- `**/redux/**/*.{js,ts}`
- `**/*Store*.{js,ts}`
- `**/*slice*.{js,ts}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
