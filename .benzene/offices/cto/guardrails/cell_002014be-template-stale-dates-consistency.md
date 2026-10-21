# Guardrail scout: elegant-cto-template-harness-b-a / template-stale-dates-consistency

scout `scout_d658ba73` · cell `cell_002014be` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> the skill requires updating front matter in specific documentation files (`docs/ui/element.md`, etc.) with a date, and this must be verified against the content of the four files themselves. The existing checks failed on missing/empty front matter data or test execution failure.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_c00cb625
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
| verify:element-docs | sections | rejected: fails on the clean workspace: docs/ui/element.md: front-matter field 'reviewed' missing or empty docs/ui/component.md: front-matter field 'reviewed' m | docs/ui/element.md: front-matter field 'reviewed' missing or |  | 0.0 | ensure all UI documentation files have the required 'reviewed: YYYY-MM-DD' front |
| verify:agent-checks | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.1 | the skill inherits checks that rely on `.benzene/checks/templates.py` passing, s |
| verify:style-doc-dates | sections | rejected: fails on the clean workspace: docs/ui/element.md: front-matter field 'reviewed' missing or empty docs/ui/component.md: front-matter field 'reviewed' m | docs/ui/element.md: front-matter field 'reviewed' missing or |  | 0.0 | ensure the required 'reviewed' date exists in the front matter of all four speci |
| verify:test-execution | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.1 | ensure the base testing command executes successfully, as previously noted by th |
| verify:skill-doc | sections | rejected: fails on the clean workspace: skills/server-api/SKILL.md: missing section '## When to use' skills/server-app-shell/SKILL.md: missing section '## When | skills/server-api/SKILL.md: missing section '## When to use' |  | 0.1 | ... |

## Applied

- nothing: the skill keeps its inherited guardrail

Text checks: required [], forbidden ["TODO"]
