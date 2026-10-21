# Guardrail scout: elegant-cto-training-site-b / training-site-lesson-accuracy

scout `scout_c6a3d1fe` · cell `cell_a2b47b76` · models: poolside/laguna-s-2.1:free, poolside/laguna-s-2.1:free, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill ensures every lesson maps to a frontend term (UI, Server, State, Agent Skills) and its downloadable Agent Skill. Previous checks failed on clean workspace: a script had syntax errors and lessons lack a '## Lesson' heading. Need checks that validate lesson–skill linkage and front-matter completeness against the actual repository structure.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_88bc9da5
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:site-build, verify:site-health, verify:no-secrets, verify:courses, verify:seo, verify:pricing-sync, verify:checkout, verify:learner-journey
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **What is the exact glob for lesson markdown files—only docs/courses/agent-skills/*.md or all of docs/courses/**/*.md?** -> Use docs/courses/**/*.md to cover every course folder (UI, State, Server, Agent Skills). (by recommendation; scout recommended: Use docs/courses/**/*.md to cover every course folder (UI, State, Server, Agent Skills).)
- **Does a working validation script already exist at scripts/validate-lesson-skills.mjs, or should the check use the project's test suite (npm run test) which may already cover lesson accuracy?** -> Prefer npm run test if it includes lesson-skill validation; otherwise add a tiny validate-lesson-skills.mjs that the check can syntax-check. (by recommendation; scout recommended: Prefer npm run test if it includes lesson-skill validation; otherwise add a tiny validate-lesson-skills.mjs that the check can syntax-check.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:build-site | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.0 | the Jekyll site must build successfully with all lessons and their linked skills |
| verify:lesson-skill-link | sections | rejected: fails on the clean workspace: docs/courses/agent-skills/anatomy-of-a-skill.md: missing section '## Agent Skill' docs/courses/agent-skills/eval-a-skill | docs/courses/agent-skills/anatomy-of-a-skill.md: missing sec |  | 0.1 | each lesson must declare its frontend term and link to the matching skill folder |
| verify:skill-folder-exists | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | every skill referenced by a lesson must have a README.md in its folder under ski |
| verify:lesson-skill-link | command | rejected: fails on the clean workspace: `node --check scripts/check-lesson-skill-link.mjs` failed (exit 1): node:internal/modules/cjs/loader:1459 throw err; | `node --check scripts/check-lesson-skill-link.mjs` failed (e |  | 0.0 | Ensures every lesson markdown in docs/courses/ has a matching folder in skills/, |
| verify:lesson-front-matter | sections | rejected: fails on the clean workspace: docs/courses/agent-skills/anatomy-of-a-skill.md: missing section '## Lesson' docs/courses/agent-skills/eval-a-skill.md: | docs/courses/agent-skills/anatomy-of-a-skill.md: missing sec |  | 0.0 | Validates lesson markdown files have required front matter and structure for sit |
| verify:lesson-front-matter | sections | rejected: fails on the clean workspace: docs/courses/agent-skills/index.md: front-matter field 'term' missing or empty docs/courses/agent-skills/index.md: front | docs/courses/agent-skills/index.md: front-matter field 'term |  | 0.1 | Every lesson must declare its term (UI/Server/State/Agent Skills) and the skill |
| verify:lesson-skill-exists | command | rejected: fails on the clean workspace: `node --check scripts/validate-lesson-skills.mjs` failed (exit 1): node:internal/modules/cjs/loader:1459 throw err; | `node --check scripts/validate-lesson-skills.mjs` failed (ex |  | 0.0 | A lightweight Node script that reads each lesson's front-matter 'skill' field an |

## Applied

- nothing: the skill keeps its inherited guardrail
