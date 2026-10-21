# Guardrail scout: elegant-cto-docs-maintainer-a / audit-content-validity

scout `scout_eaf265f8` · cell `cell_9b4b0bc4` · models: google/gemma-4-e2b · rounds: 1

> the skill writes documentation and the standard requires strict content validity checks, specifically around structure and completeness based on established standards like `site-health` and `template-agents-config`.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_8e0f402d
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:terminology-docs
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:skill-doc | sections | accepted | 45 document(s) carry every required section | skills/server-api/SKILL.md: headings and front matter removed; skills/server-app | 0.1 | The skill documentation must adhere to a predictable structure, ensuring all nec |
| verify:skill-agent-config | claims | rejected: no document matches ['skills/*/AGENTS.md'] |  |  | 0.0 | The requirement for `template-agents-config` mandates specific sections in the A |
| verify:site-builds | command | rejected: `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; npm install |  |  | 0.0 | The `site-builds` standard requires the Jekyll site to build successfully, which |
| verify:showcase | command | rejected: duplicates the inherited check verify:showcase |  |  | 0.0 | The `showcase` standard demands that the full showcase (site) exists, ensuring t |

## Applied

- verify:skill-doc
