# Guardrail scout: elegant-cto-docs-maintainer-b-r1-a / elegant-cto-fix-docs-metadata

scout `scout_e3fdbaab` · cell `cell_2b496b04` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> the skill ensures metadata integrity and pricing synchronization; 'npm test' is the primary gate for build and logic, 'sections' validates that documentation files contain necessary front-matter metadata, and 'forbidden_patterns' catches leaked credentials defined in the standard.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_d231bb1a
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:terminology-docs, verify:skill-doc
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **Does 'npm test' include the pricing-sync check logic?** -> Yes, as it is the primary gate for logic verification. (by recommendation; scout recommended: Yes, as it is the primary gate for logic verification.)
- **What specific keys are required in the documentation front_matter?** -> title and description (by recommendation; scout recommended: title and description)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:skill-doc | sections | rejected: duplicates the inherited check verify:skill-doc |  |  | 0.0 | The skill is directly tied to the Agent Skills; ensuring these files have requir |
| verify:template-agents-config | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: missing section 'Build a todo app' templates/chota-react-redux/AGENTS.md: missin | templates/chota-angular-ngrx/AGENTS.md: missing section 'Bui |  | 0.0 | The skill is part of a larger system that requires agents to document their setu |
| verify:agent-skill-commands | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | The skill description explicitly requires agents to state how to run their build |
| verify:site-builds | command | rejected: `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; npm install |  |  | 0.0 | The skill exists within a Jekyll site structure, and ensuring the core build pro |
| verify:skill-doc-integrity | command | rejected: nothing to spoil: the check names no file and the parent wrote none | `node --check` passed |  | 0.1 | A general check to ensure the file system integrity is maintained post-update, c |
| verify:skill-doc | sections | rejected: duplicates the inherited check verify:skill-doc |  |  | 0.0 | Enforce the required structure for all Agent Skill documentation, addressing pre |
| verify:template-agents-config | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: missing section 'Build a todo app' templates/chota-react-redux/AGENTS.md: missin | templates/chota-angular-ngrx/AGENTS.md: missing section 'Bui |  | 0.0 | Enforce the required sections in Agent skill configuration files, addressing pre |
| verify:agent-skill-commands | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Ensure that all agent skills explicitly document their commands, which is critic |
| verify:site-builds | command | rejected: `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; npm install |  |  | 0.0 | Validate the core site build process as required by the 'showcase' standard, ens |
| verify:all-agent-skills-exist | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Ensure all expected Agent Skills exist and are documented as per the repository |
| verify:build-and-logic | command | rejected: fails on the clean workspace: `npm test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm install - | `npm test` failed (exit 127): > elegant@0.0.3 test > cross-e |  | 0.1 | the primary gate for ensuring the site builds correctly and internal logic (like |
| verify:doc-metadata | sections | rejected: fails on the clean workspace: docs/IMPLEMENTATION_SUMMARY.md: no front matter docs/IMPLEMENTATION_SUMMARY.md: front-matter field 'title' missing or em | docs/IMPLEMENTATION_SUMMARY.md: no front matter docs/IMPLEME |  | 0.5 | ensures every documentation page has the required metadata fields. |

## Applied

- forbidden /sb_secret_/
- forbidden /service_role/
- forbidden /sk-or-v1-/
- forbidden /lin_api_/

Text checks: required [], forbidden ["sb_secret_", "service_role", "sk-or-v1-", "lin_api_"]
