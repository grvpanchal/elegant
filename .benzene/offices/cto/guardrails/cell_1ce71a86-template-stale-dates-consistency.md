# Guardrail scout: elegant-cto-template-harness-b-a-a / template-stale-dates-consistency

scout `scout_7036c515` · cell `cell_1ce71a86` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill must add a `reviewed: YYYY-MM-DD` front-matter field with today's date to four existing UI docs without breaking existing invariants (forbidden/required patterns, min_length, agents-tier template check). The current workspace lacks the `reviewed` field, so any check requiring it will fail on the clean workspace. The cheapest deterministic guards are: (1) the project's own agents-tier tem

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_c6160457
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **Should the new `reviewed` field be validated by these checks immediately, or only after the skill runs?** -> Add a separate sections check for the `reviewed` field after the skill succeeds; it will fail on the current clean workspace. (by recommendation; scout recommended: Add a separate sections check for the `reviewed` field after the skill succeeds; it will fail on the current clean workspace.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:skill-doc | sections | rejected: fails on the clean workspace: docs/ui/props.md: front-matter field 'reviewed' missing or empty docs/ui/events.md: front-matter field 'reviewed' missin | docs/ui/props.md: front-matter field 'reviewed' missing or e |  | 0.0 | ensure front matter contains `reviewed: YYYY-MM-DD` as required by the skill des |
| verify:template-agents | command | rejected: duplicates the inherited check verify:template-agents |  |  | 0.0 | the skill must pass the inherited `verify:template-agents` check, which is criti |
| verify:skill-doc | sections | rejected: fails on the clean workspace: docs/ui/props.md: front-matter field 'reviewed' missing or empty docs/ui/events.md: front-matter field 'reviewed' missin | docs/ui/props.md: front-matter field 'reviewed' missing or e |  | 0.0 | ensure front matter contains 'reviewed: YYYY-MM-DD' for all relevant UI document |
| verify:skill-doc_content | sections | rejected: fails on the clean workspace: docs/ui/element.md: missing section '## Reviewed' docs/ui/component.md: missing section '## Reviewed' docs/ui/props.md: | docs/ui/element.md: missing section '## Reviewed' docs/ui/co |  | 0.0 | ensure the presence of a section to explicitly review the content, complementing |
| verify:skill-doc_date_presence | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | enforce that the 'reviewed' key exists in the front matter for each file |
| verify:skill-doc_date_format | sections | rejected: fails on the clean workspace: docs/ui/props.md: front-matter field 'reviewed' missing or empty docs/ui/events.md: front-matter field 'reviewed' missin | docs/ui/props.md: front-matter field 'reviewed' missing or e |  | 0.0 | ensure the 'reviewed' date adheres to the YYYY-MM-DD format for consistency |
| verify:template-agents | command | rejected: duplicates the inherited check verify:template-agents; `python3 .benzene/checks/templates.py agents` is not in the inventory (allowed: npm run build-d |  |  | 0.0 | runs the agents-tier template check on all four files; must pass clean and will |
| verify:existing-front-matter | sections | rejected: fails on the clean workspace: docs/ui/element.md: front-matter field 'description' missing or empty docs/ui/component.md: front-matter field 'descript | docs/ui/element.md: front-matter field 'description' missing |  | 0.0 | ensures required front-matter fields remain present after the edit |
| verify:forbidden-patterns | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | checks that no forbidden patterns are introduced |
| verify:required-patterns | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | checks that required patterns remain present |

## Applied

- nothing: the skill keeps its inherited guardrail

Text checks: required [], forbidden ["TODO"]
