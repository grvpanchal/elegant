# Guardrail scout: elegant-cto-template-harness-b-b-b / template-tier-consistency

scout `scout_767e8137` · cell `cell_f1b2686e` · models: google/gemma-4-e2b · rounds: 1

> the skill writes a template file (`AGENTS.md`) and the instruction explicitly mentions checking for the presence and structure of files/sections within the template hierarchy (e.g., `templates/chota-angular-ngrx/AGENTS.md`), which maps directly to the `template-agents-config` standard, combined with the specific task instructions involving running a script and creating files.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_e90d254a
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: docs/_data/pricing.yml, templates/chota-angular-ngrx/src/ui/templates/Skeleton/.gitkeep, templates/chota-angular-ngrx/AGENTS.md
documents among them: templates/chota-angular-ngrx/AGENTS.md
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability, verify:pricing-has-free, verify:pricing-has-lifetime, verify:pricing-no-extra-slugs
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:template-agents | command | rejected: duplicates the inherited check verify:template-agents; `python3 .benzene/checks/templates.py agents` is not in the inventory (allowed: npm run build-d |  |  | 0.0 | the instruction explicitly states to run this command to list missing AGENTS.md |
| verify:template-agents-doc | sections | accepted | 1 document(s) carry every required section | templates/chota-angular-ngrx/AGENTS.md: headings and front matter removed -> tem | 0.0 | the skill description details requirements for the AGENTS.md file (Architecture, |
| verify:agent-file-presence | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | the skill description implies that an AGENTS.md file should exist for each templ |
| verify:tier-data-consistency | sections | rejected: fails on the clean workspace: docs/_data/pricing.yml: missing section 'free' docs/_data/pricing.yml: missing section 'monthly' docs/_data/pricing.yml: | docs/_data/pricing.yml: missing section 'free' docs/_data/pr |  | 0.0 | the skill description explicitly requires checking that `docs/_data/pricing.yml` |
| verify:pricing-tier-count | claims | accepted | 0 number(s) and id(s) across 1 document(s) are on the record | docs/_data/pricing.yml: every number changed -> docs/_data/pricing.yml: '987654' | 0.0 | this checks the specific requirement that there must be exactly four tiers in th |

## Applied

- verify:template-agents-doc
- verify:pricing-tier-count
