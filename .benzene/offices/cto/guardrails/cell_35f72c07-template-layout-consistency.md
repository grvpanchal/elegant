# Guardrail scout: elegant-cto-template-harness-b-b-a / template-layout-consistency

scout `scout_158bdb92` · cell `cell_35f72c07` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> the skill mandates four exact h2 sections in seven AGENTS.md files, deletion of the Skeleton directory from chota-angular-ngrx, and a Layout directory in every template; the inherited verify:template-integrity and verify:template-agents already run the two python scripts, so new checks only need to guard the AGENTS.md structure and the Layout/Skeleton layout

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_e90d254a
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.ts, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.component.ts, templates/chota-angular-ngrx/ui/templates/Layout/README.md, templates/chota-react-redux/ui/templates/Layout/README.md, templates/chota-react-rtk/ui/templates/Layout/README.md, templates/chota-react-saga/ui/templates/Layout/README.md, templates/chota-react-zustand/ui/templates/Layout/README.md, templates/chota-vue-pinia/ui/templates/Layout/README.md, templates/chota-wc-saga/ui/templates/Layout/README.md, templates/chota-angular-ngrx/ui/templates/Skeleton/README.md, templates/chota-angular-ngrx/ui/templates/README.md
documents among them: templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md, templates/chota-angular-ngrx/ui/templates/Layout/README.md, templates/chota-react-redux/ui/templates/Layout/README.md, templates/chota-react-rtk/ui/templates/Layout/README.md, templates/chota-react-saga/ui/templates/Layout/README.md, templates/chota-react-zustand/ui/templates/Layout/README.md
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability, verify:agents-doc
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **The skill says to create AGENTS.md in each chota-*/ui/templates/ directory, but the parent wrote them at templates/chota-*/AGENTS.md. Which location is the correct deliverable?** -> Use templates/chota-*/ui/templates/AGENTS.md as the skill specifies; if the parent misplaced them, the daughter should move them. (by recommendation; scout recommended: Use templates/chota-*/ui/templates/AGENTS.md as the skill specifies; if the parent misplaced them, the daughter should move them.)
- **The skill requires running `python3 .benzene/checks/templates.py integrity` and `python3 .benzene/checks/templates.py agents`, but these commands are not in the allowed prefixes. The inherited checks verify:template-integrity and verify:template-agents likely wrap these scripts. Should I rely solely on those inherited checks?** -> Yes, trust the inherited verify:template-integrity and verify:template-agents to execute the python scripts; do not add duplicate command checks. (by recommendation; scout recommended: Yes, trust the inherited verify:template-integrity and verify:template-agents to execute the python scripts; do not add duplicate command checks.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:agent-doc-structure | file_pattern | rejected: file 'templates/**/AGENTS.md' does not exist in the workspace |  |  | 0.0 | ensures that every required template has the mandatory four h2 sections in the c |
| verify:integrity-run-check | command | rejected: `python3 .benzene/checks/templates.py integrity agents` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm t |  |  | 0.0 | runs the post-modification checks mandated by the original skill, ensuring the i |
| verify:agents-doc-structure | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Ensures all necessary AGENTS.md files exist, which is the foundation for the req |
| verify:agent-doc-structure-content | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | Verifies the mandatory four sections required in every AGENTS.md file, which is |
| verify:build_and_test_commands | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.0 | Checks if the build command is executable (though not the exact required command |
| verify:build_and_test_commands-2 | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.2 | Checks if the test command is executable. |
| verify:integrity-script | command | rejected: `python3 .benzene/checks/templates.py integrity` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; np |  |  | 0.0 | Attempting to verify the execution of the required integrity script, even though |
| verify:agents-md-four-sections | sections | accepted | 1 document(s) carry every required section | templates/chota-angular-ngrx/AGENTS.md: headings and front matter removed -> tem | 0.0 | each AGENTS.md must contain the four mandated h2 sections in this exact order |
| verify:layout-readme-present | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | every template must have a Layout directory with a README.md; chota-angular-ngrx |
| verify:skills-links-present | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Skills section must link at least eight distinct skills/<name> entries; the patt |

## Applied

- verify:agents-md-four-sections
- forbidden /Skeleton/

Text checks: required [], forbidden ["Skeleton"]
