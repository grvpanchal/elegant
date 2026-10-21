# Guardrail scout: elegant-cto-template-harness-b-a-b / template-references-consistency

scout `scout_a7c9ff47` · cell `cell_b0d3bbab` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 4 · escalated to the evolver

> The skill modifies template directory structures (removes Skeleton from chota-angular-ngrx, normalizes chota-angular-n) and creates/updates AGENTS.md files. The project's own test script (npm run test) runs the inherited verify:template-integrity and verify:template-agents checks which validate structure and AGENTS.md content across all templates. A sections check on the seven AGENTS.md files prov

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_c6160457
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.html, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.spec.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.stories.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.style.css, templates/chota-angular-ngrx/src/ui/skeletons/Skeleton/Skeleton.component.spec.ts, templates/chota-angular-ngrx/src/ui/skeletons/Skeleton/Skeleton.component.html, templates/chota-angular-ngrx/src/ui/skeletons/Skeleton/Skeleton.component.ts, templates/chota-angular-ngrx/src/ui/skeletons/Skeleton/Skeleton.stories.ts, templates/chota-angular-ngrx/src/ui/skeletons/Skeleton/Skeleton.style.css, templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.component.html, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.component.spec.ts, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.component.ts
documents among them: templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md, docs/ui/element.md, docs/ui/component.md
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **Which npm script runs the template-integrity and template-agents checks that the skill already inherits? The inventory lists build-demos, build-book, and test; I recommend npm run test as the CI gate since it runs with CI=true and concurrently.** -> npm run test (by recommendation; scout recommended: npm run test)
- **The parent wrote templates/chota-angular-ngrx/AGENTS.md — is that the sole deliverable for the agents check, or do the other templates' AGENTS.md files also need verification? I recommend checking all seven AGENTS.md files listed in the inventory.** -> verify all seven AGENTS.md files (by recommendation; scout recommended: verify all seven AGENTS.md files)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:template-references-consistency | command | rejected: `sh -c ls -d templates/chota-angular-ngrx/src/ui/templates/Layout && ls -d templates/chota-angular-ngrx/src/ui/skeletons/Skeleton && python3 .benzene/ |  |  | 0.0 | Verify the structure modifications (removal of Skeleton and existence of Layout) |
| verify:agent-file-creation | file_pattern | rejected: does not fail when the work is broken (templates/chota-angular-ngrx/AGENTS.md: lines matching the pattern removed): uninformative | templates/chota-angular-ngrx/AGENTS.md matches | templates/chota-angular-ngrx/AGENTS.md: lines matching the pattern removed -> te | 0.0 | Ensure the required file is created, as specified in the skill instructions. |
| verify:template-references-consistency | command | rejected: `ls -d templates/chota-angular-ngrx/src/ui/templates/Layout` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; |  |  | 0.0 | check if the target directory exists, ensuring the first part of the operation i |
| verify:template-references-consistency-2 | command | rejected: `ls -d templates/chota-angular-ngrx/src/ui/skeletons/Skeleton` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test |  |  | 0.0 | check if the directory to be removed exists, ensuring we have a baseline. |
| verify:template-references-consistency-3 | command | rejected: `python3 .benzene/checks/templates.py agents` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; npm i |  |  | 0.0 | ensure the required file creation step is executed and verifiable. |
| verify:ci-gate | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.1 | Runs the full CI gate including inherited verify:template-integrity (directory s |
| verify:agents-md-structure | sections | accepted | 7 document(s) carry every required section | templates/chota-angular-ngrx/AGENTS.md: headings and front matter removed; templ | 0.0 | Each AGENTS.md must contain the four required sections per template-agents-confi |

## Applied

- verify:agents-md-structure
