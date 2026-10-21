# Guardrail scout: elegant-cto-docs-maintainer / docs-maintainer

scout `scout_d39b3648` · cell `cell_aefb0b66` · models: qwen/qwen3.7-flash, qwen/qwen3.7-flash · rounds: 2

> the skill writes structured markdown docs in docs/<layer>/<slug>.md backed by skills folders. The registry (docs/_data/topics/*.csv) is the source of truth, but the workspace inventory does not list a pre-existing verification script for doc structure compliance, so I must use a deterministic content check on the files the skill produces. A 'sections' check ensures the mandatory headings and front

## Inventory

```
workspace: /home/gaurav/Documents/Projects/elegant-harness/elegant
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:terminology-docs
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **Does the skill output documents under a specific sub-path (e.g., only docs/ui/)? If so, what are the exact directories?** -> I will assume all .md files under docs/ are valid targets to be safe, but if it's just docs/ui/, the check can be tightened. (by recommendation; scout recommended: I will assume all .md files under docs/ are valid targets to be safe, but if it's just docs/ui/, the check can be tightened.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:doc-structure | sections | rejected: fails on the clean workspace: docs/IMPLEMENTATION_SUMMARY.md: no front matter docs/IMPLEMENTATION_SUMMARY.md: front-matter field 'title' missing or em | docs/IMPLEMENTATION_SUMMARY.md: no front matter docs/IMPLEME |  | 0.4 | catches missing front matter or wrong layout which makes docs un-indexable |

## Applied

- nothing: the skill keeps its inherited guardrail

Error: scout model failed: model qwen/qwen3.7-flash could not produce valid ScoutProposal: no JSON found: line 1 column 1 (char 0)
