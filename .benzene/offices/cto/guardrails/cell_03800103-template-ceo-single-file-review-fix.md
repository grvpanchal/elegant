# Guardrail scout: elegant-cto-template-harness-a-a / template-ceo-single-file-review-fix

scout `scout_5cb88d55` · cell `cell_03800103` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill edits only the file(s) named in CEO feedback — typically a single component, selector, or container file, plus possibly AGENTS.md across multiple templates. The project's own test and demo-build scripts are the strongest regression gates; the course document and all template AGENTS.md files must retain their required heading structure.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_c6160457
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: docs/courses/state-layer/selectors.md, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.html, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.component.spec.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.stories.ts, templates/chota-angular-ngrx/src/ui/templates/Layout/Layout.style.css, templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.component.html, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.component.spec.ts, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.component.ts, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.stories.ts, templates/chota-angular-ngrx/src/ui/templates/Skeleton/Layout.style.css, templates/chota-angular-ngrx/src/ui/templates/Skeleton/.gitkeep
documents among them: docs/courses/state-layer/selectors.md, templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, templates/chota-react-zustand/AGENTS.md, templates/chota-vue-pinia/AGENTS.md, templates/chota-wc-saga/AGENTS.md
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **What is the exact main heading text in docs/courses/state-layer/selectors.md (e.g., '## Selectors', '## State Selectors', etc.)?** -> Use the exact heading text from the clean file for the required_sections check (by recommendation; scout recommended: Use the exact heading text from the clean file for the required_sections check)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:named_files | file_pattern | rejected: file 'templates/**/AGENTS.md' does not exist in the workspace |  |  | 0.0 | the skill operates by editing files named in feedback, which are primarily the A |
| verify:build_and_test | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.1 | the instruction requires that the target verification (verify:template-agents) p |
| verify:agent_structure | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: no front matter templates/chota-angular-ngrx/AGENTS.md: front-matter field 'Arch | templates/chota-angular-ngrx/AGENTS.md: no front matter temp |  | 0.0 | the instruction implies the agent configuration in AGENTS.md must be maintained |
| verify:agent_file_existence | file_pattern | rejected: file 'templates/**/AGENTS.md' does not exist in the workspace |  |  | 0.0 | Ensures all referenced AGENTS.md files exist before any operation is attempted, |
| verify:agent_doc_structure | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: no front matter templates/chota-angular-ngrx/AGENTS.md: front-matter field 'Arch | templates/chota-angular-ngrx/AGENTS.md: no front matter temp |  | 0.0 | Verifies the structure required by verify:template-agents, ensuring necessary se |
| verify:file_write_integrity | command | rejected: does not fail when the work is broken (docs/courses/state-layer/selectors.md: file emptied; templates/chota-angular-ngrx/src/ui/templates/Layout/Layou | `node --check` passed | docs/courses/state-layer/selectors.md: file emptied; templates/chota-angular-ngr | 0.0 | A general check that ensures file system operations (writing/editing) did not in |
| verify:file_content_match | claims | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: '4200' is not on the record: '/ Development / `npm start` / `ng serve` — starts | templates/chota-angular-ngrx/AGENTS.md: '4200' is not on the |  | 0.0 | This check is crucial. It must verify that the content of the edited files preci |
| verify:template_specific_read | file_pattern | rejected: file 'templates/**/AGENTS.md' does not exist in the workspace |  |  | 0.0 | Addresses the instruction to conditionally read package.json only if a file live |
| verify:file_content_adherence | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | This targets the prose rewriting instruction for documentation feedback, ensurin |
| verify:test | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.1 | Project's test suite catches regressions from any file edits |
| verify:build-demos | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.2 | Demo build catches compilation errors in template components and ensures templat |
| verify:selectors-doc | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | Course document must retain its heading structure; no front matter required |
| verify:agents-config | sections | accepted | 7 document(s) carry every required section | templates/chota-angular-ngrx/AGENTS.md: headings and front matter removed; templ | 0.0 | Every template's AGENTS.md must have the four standard sections per template-age |

## Applied

- verify:agents-config
