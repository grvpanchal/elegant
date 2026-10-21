# Guardrail scout: elegant-cto-template-harness-b-b / template-layout-consistency

scout `scout_f420654b` · cell `cell_77c15891` · models: google/gemma-4-e2b · rounds: 1

> the skill modifies file structure and creates documentation, requiring checks against the file system state and the created documents.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_c00cb625
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.html, templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md
documents among them: templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:template-integrity | file_pattern | rejected: duplicates the inherited check verify:template-integrity; file 'templates/**/Layout/Layout.component.html' does not exist in the workspace |  |  | 0.0 | ensures the core template exists and is structurally sound |
| verify:agents-doc | sections | accepted | 1 document(s) carry every required section | templates/chota-angular-ngrx/AGENTS.md: headings and front matter removed -> tem | 0.0 | ensures the required documentation sections are present for agent setup |
| verify:no-skeleton-dir | file_pattern | rejected: file 'templates/chota-angular-ngrx/Skeleton' does not exist in the workspace |  |  | 0.0 | enforces the deletion of the Skeleton directory as per the instruction |
| verify:template-agents | command | rejected: duplicates the inherited check verify:template-agents; `python3 .benzene/checks/templates.py agents` is not in the inventory (allowed: npm run build-d |  |  | 0.0 | verifies the integrity check specific to agent requirements |
| verify:template-integrity-2 | command | rejected: `python3 .benzene/checks/templates.py integrity` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; np |  |  | 0.0 | verifies the integrity check for template files |

## Applied

- verify:agents-doc
