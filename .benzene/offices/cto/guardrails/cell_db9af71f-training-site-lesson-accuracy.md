# Guardrail scout: elegant-cto-training-site-b-a / training-site-lesson-accuracy

scout `scout_55515574` · cell `cell_db9af71f` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill's requirements center on two primary metrics: lesson accuracy (specifically course count) and pricing synchronization. A `finance` check is the optimal way to ensure the documentation matches the master financial records, while a `claims` check validates the specific quantity requirements for courses and lessons.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_23f1ac5e
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:site-build, verify:site-health, verify:no-secrets, verify:courses, verify:seo, verify:pricing-sync, verify:checkout, verify:learner-journey
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:template-agents-config | sections | rejected: no document matches ['skills/*/AGENTS.md'] |  |  | 0.0 | The standard explicitly requires every template's AGENTS.md to have these sectio |
| verify:site-builds | sections | rejected: fails on the clean workspace: docs/_site/index.html: missing section 'all' | docs/_site/index.html: missing section 'all' |  | 0.0 | The standard demands a successful Jekyll build resulting in index.html, implying |
| verify:site-health | sections | rejected: duplicates the inherited check verify:site-health |  |  | 0.0 | This check enforces general frontend quality on all built pages, catching struct |
| verify:npm run build-demos | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.0 | Running the build demonstration ensures the core functionality (site generation) |
| verify:site-builds | sections | rejected: fails on the clean workspace: docs/_site/index.html: missing section 'all' | docs/_site/index.html: missing section 'all' |  | 0.0 | The previous round failed because the site build was missing a required section, |
| verify:template-agents-config | sections | rejected: no document matches ['skills/*/AGENTS.md'] |  |  | 0.0 | The previous round failed because the required sections in the AGENTS.md files w |
| verify:site-build | command | rejected: duplicates the inherited check verify:site-build; `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm r |  |  | 0.0 | This re-runs the core build check to ensure the process itself is valid and does |
| verify:site-health | sections | rejected: duplicates the inherited check verify:site-health; no document matches ['docs/_site/**'] |  |  | 0.0 | This check re-enforces the site health standard specifically on the built output |
| verify:npm run build-demos | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.0 | This re-runs the demo build command to catch execution timing issues or general |
| verify:pricing-sync | finance | rejected: duplicates the inherited check verify:pricing-sync; no document matches [] |  |  | 0.0 | Ensures that all tiers in docs/_data/pricing.yml match the prices defined in .be |
| verify:free-courses | claims | rejected: no document matches [] |  |  | 0.0 | Validates that docs/_data/courses.yml contains at least 4 courses, with the requ |

## Applied

- forbidden /TODO/
- judge rubric

Text checks: required [], forbidden ["TODO"]; judge rubric: The pricing_sync check must ensure zero variance between the master record and the public yaml. The free_courses claim must verify both the count of unique courses and the total count of lessons.
