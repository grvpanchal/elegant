# Guardrail scout: elegant-cto-docs-maintainer-b / resolve-metadata-checks

scout `scout_d30263e2` · cell `cell_be220e5a` · models: google/gemma-4-e2b · rounds: 1

> the skill deals with maintaining documentation and ensuring structural integrity across a repository structure (docs/, templates/, skills/). The most direct guards are checking the required contents of documentation files and the consistency of agent skill definitions.

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
| verify:skill-doc | sections | accepted | 45 document(s) carry every required section | skills/server-api/SKILL.md: headings and front matter removed; skills/server-app | 0.1 | Ensures that every Agent Skill has proper metadata (name, description) for disco |
| verify:template-agents-config | claims | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: '10' is not on the record: '10.' templates/chota-angular-ngrx/AGENTS.md: '11' is | templates/chota-angular-ngrx/AGENTS.md: '10' is not on the r |  | 0.0 | Enforces the required structure for Agent Skill configurations, ensuring all nec |
| verify:site-builds | command | rejected: `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; npm install |  |  | 0.0 | Verifies that the core documentation site can be built successfully, which is a |

## Applied

- verify:skill-doc
