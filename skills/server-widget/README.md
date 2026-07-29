# Server Widget

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-widget)

> `server-widget` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Embeddable widgets — a tiny async loader snippet, Shadow DOM vs iframe isolation, origin-validated `postMessage` protocols, iframe height negotiation with `ResizeObserver`, container-query responsiveness, bundle budgets with lazy features, and a versioned public API with deprecation shims. Use when packaging UI to run inside someone else's page, writing the embed snippet, or debugging style/global leakage between widget and host.

## When to use

Packaging a component as a self-contained embed for third-party sites; choosing Shadow DOM vs iframe isolation; designing the loader snippet and its early-call queue; wiring bidirectional postMessage with origin checks; sizing an iframe to its content; keeping widget CSS and globals from leaking into the host; versioning a public embed API without breaking existing installs.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-widget
```

Or copy the [`server-widget/`](.) folder into your agent's skills directory.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/widget/**/*.{js,ts,jsx,tsx}`
- `**/*widget*.{js,ts,jsx,tsx}`
- `**/embed/**/*.{js,ts,html}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
