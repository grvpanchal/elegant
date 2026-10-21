# Guardrail scout: elegant-cto-template-harness / template-harness

scout `scout_65a6d230` · cell `cell_4d5592a9` · models: qwen/qwen3.7-flash, qwen/qwen3.7-flash · rounds: 2

> The skill requires maintaining template integrity (structure and content), agent configuration (AGENTS.md structure), and overall build stability. The workspace offers `npm run build-demos` which triggers `demos.sh` and likely runs the integrity checks mentioned in the skill description under `.benzene/checks/templates.py`. We use this command as the primary gate. Additionally, we add a determinis

## Inventory

```
workspace: /home/gaurav/Documents/Projects/elegant-harness/elegant
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:template-suite | command | rejected: `NPM RUN build-demos` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; npm install; npm run build-de |  |  | 0.0 | Runs the project's own demo/build script which invokes `.benzene/checks/template |
| verify:agents-headings | sections | rejected: no document matches ['Dtemplates/*/AGENTS.md'] |  |  | 0.0 | Ensures every template's agent instructions contain the mandatory structural sec |

## Applied

- required /## When to use/
- forbidden /TODO/

Text checks: required ["## When to use"], forbidden ["TODO"]

Error: scout model failed: model qwen/qwen3.7-flash could not produce valid ScoutProposal: no JSON found: line 1 column 1 (char 0)
