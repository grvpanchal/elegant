# Guardrail scout: elegant-cto-template-harness-b-a / template-references-consistency

scout `scout_bf17217e` · cell `cell_002014be` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill must add a reference line with a 2025-or-later date to each of three UI docs. A file_pattern check per file is the lightest deterministic gate: it passes when the skill inserts any 2025-2029 year (or full ISO date) and fails if the line is missing, the year is too old, or the file is untouched. The inherited verify:template-agents already covers the .benzene/checks/templates.py agents ti

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
| verify:component-doc-dates | sections | rejected: fails on the clean workspace: docs/ui/component.md: missing section 'reference_date' docs/ui/props.md: missing section 'reference_date' docs/ui/events | docs/ui/component.md: missing section 'reference_date' docs/ |  | 0.0 | the skill requires adding a date of 2025 or later to these files, so we check fo |
| verify:template-agents | command | rejected: duplicates the inherited check verify:template-agents; `python3 .benzene/checks/templates.py check_skill` is not in the inventory (allowed: npm run bu |  |  | 0.0 | the skill explicitly requires that the `agents` tier of `.benzene/checks/templat |
| verify:todo-stability | command | rejected: duplicates the inherited check verify:todo-stability |  |  | 0.0 | as a general guardrail against mistakes in the skill's execution, running the ex |
| verify:component-doc-dates | sections | rejected: fails on the clean workspace: docs/ui/component.md: missing section 'reference_date' docs/ui/props.md: missing section 'reference_date' docs/ui/events | docs/ui/component.md: missing section 'reference_date' docs/ |  | 0.0 | The skill explicitly requires adding a reference line containing a date of 2025 |
| verify:template-agents | command | rejected: duplicates the inherited check verify:template-agents |  |  | 0.0 | This check is kept to satisfy the requirement that `.benzene/checks/templates.py |
| verify:component-date-ref | file_pattern | rejected: fails on the clean workspace: docs/ui/component.md does not contain /202[5-9]/ | docs/ui/component.md does not contain /202[5-9]/ |  | 0.0 | Skill must add at least one reference line with a 2025+ date in component.md |
| verify:props-date-ref | file_pattern | rejected: fails on the clean workspace: docs/ui/props.md does not contain /202[5-9]/ | docs/ui/props.md does not contain /202[5-9]/ |  | 0.0 | Skill must add at least one reference line with a 2025+ date in props.md |
| verify:events-date-ref | file_pattern | rejected: fails on the clean workspace: docs/ui/events.md does not contain /202[5-9]/ | docs/ui/events.md does not contain /202[5-9]/ |  | 0.0 | Skill must add at least one reference line with a 2025+ date in events.md |

## Applied

- nothing: the skill keeps its inherited guardrail
