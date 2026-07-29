# Server Index File

[![skills.sh](https://skills.sh/b/grvpanchal/elegant)](https://skills.sh/grvpanchal/elegant/server-index-file)

> `server-index-file` — an [Agent Skill](https://agentskills.io) from [elegant](../../README.md).

Index files as entry-point contracts — `index.html` as the directory default (Apache `DirectoryIndex` / Nginx `index`), the SPA host document with its mount node and deferred module script, `index.js` directory resolution and barrel exports, bundler entry points, and `package.json` `main`/`module`/`exports`. Use when editing an HTML entry document, wiring a bundler entry, adding or debugging a barrel file, configuring SPA history fallback, or fixing "Cannot find module" on a package entry.

## When to use

Editing or reviewing an `index.html` host document; adding a barrel `index.js` and hitting circular-import or tree-shaking problems; setting a bundler entry or output dir; configuring Nginx/Apache directory index and SPA fallback; declaring `main`/`module`/`types`/`exports` for a publishable package; debugging 403 on a directory URL or 404 on a deep SPA route.

## Install

Add this skill to your agent with the [skills.sh](https://skills.sh) CLI:

```sh
npx skills add grvpanchal/elegant --skill server-index-file
```

Or copy the [`server-index-file/`](.) folder into your agent's skills directory.

## Auto-activates on

Agents surface this skill when editing files matching:

- `**/index.html`
- `**/src/index.{js,jsx,ts,tsx}`
- `**/{pages,state,components,ui,utils}/index.{js,jsx,ts,tsx}`

## Full guidance

See [`SKILL.md`](./SKILL.md) for the complete pattern, examples, and review checklist.
