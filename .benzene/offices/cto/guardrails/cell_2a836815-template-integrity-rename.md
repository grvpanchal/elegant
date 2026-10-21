# Guardrail scout: elegant-cto-template-harness-a-b / template-integrity-rename

scout `scout_e6c1af2e` · cell `cell_2a836815` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill fixes layer renames (Skeleton → Layout) in template ui/templates directories. The project's test suite (npm run test) includes the template-integrity gate that catches consistency findings across all templates. The .benzene/record tracks workspace state and can assert a zero Skeleton count. The docs/ui/element.md document describes the layer taxonomy and must reflect the canonical layer 

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_c6160457
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.html, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.spec.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.stories.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.style.css, docs/_data/pricing.yml, docs/ui/element.md
documents among them: docs/ui/element.md
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **Is there a specific script that performs the 'template-integrity' check mentioned in the standard?** -> If so, this should be used as a `command` check if it is faster than the full test suite. (by recommendation; scout recommended: If so, this should be used as a `command` check if it is faster than the full test suite.)
- **Does the record (.benzene/record) contain a count or tally of 'Skeleton' components currently in the workspace?** -> A `claims` check against this specific value would be the most deterministic way to verify the completion of the rename. (by recommendation; scout recommended: A `claims` check against this specific value would be the most deterministic way to verify the completion of the rename.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:npm run test | command | rejected: fails on the clean workspace: `npm test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm install - | `npm test` failed (exit 127): > elegant@0.0.3 test > cross-e |  | 0.2 | The skill modifies files and relies on the environment/tests to confirm the resu |
| verify:template-integrity | file_pattern | rejected: duplicates the inherited check verify:template-integrity; file None does not exist in the workspace |  |  | 0.0 | The skill operates on template documentation, so ensuring related integrity chec |
| verify:template-agents | sections | rejected: duplicates the inherited check verify:template-agents |  |  | 0.0 | The skill modifies file paths and names within template context; ensuring the ag |
| verify:npm run build-demos | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.0 | Running the full build process ensures that the renamed files do not introduce c |
| verify:no-skeletons | claims | rejected: no document matches [] |  |  | 0.0 | the record should track the number of legacy naming instances; a count > 0 indic |
| verify:no-skeleton-text | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | ensures the string 'Skeleton' does not appear in any template source files or pa |
| verify:template-integrity | command | rejected: duplicates the inherited check verify:template-integrity |  |  | 0.0 | The test suite runs the template-integrity check that fails on any layout or con |
| verify:no-skeleton-components | claims | rejected: no document matches .benzene/record |  |  | 0.0 | The record tallies components by layer name; a zero count for 'Skeleton' in the |
| verify:layer-taxonomy-doc | sections | accepted | 1 document(s) carry every required section | docs/ui/element.md: headings and front matter removed -> docs/ui/element.md: no | 0.0 | The element taxonomy document must list 'templates' layer with correct part name |

## Applied

- verify:layer-taxonomy-doc
- forbidden /Skeleton/

Text checks: required [], forbidden ["Skeleton"]
