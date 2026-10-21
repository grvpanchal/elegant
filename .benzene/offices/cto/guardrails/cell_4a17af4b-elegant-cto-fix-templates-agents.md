# Guardrail scout: elegant-cto-docs-maintainer-b-r1-b / elegant-cto-fix-templates-agents

scout `scout_7d30375c` · cell `cell_4a17af4b` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill is responsible for maintaining the integrity of AGENTS.md files within the templates and ensuring they conform to the 'template-agents-config' standard (specifically the four required sections). Additionally, as part of the CTO office, it must ensure the site builds correctly ('site-builds').

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_d231bb1a
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: docs/_data/pricing.yml, docs/ui/element.md, docs/ui/component.md, docs/ui/props.md, templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, today.sh, docs/ui/events.md, templates/chota-react-zustand/AGENTS.md, docs/ui/molecule.md, docs/ui/skeleton.md, docs/ui/atomic-design.md, docs/ui/atom.md
documents among them: docs/ui/element.md, docs/ui/component.md, docs/ui/props.md, templates/chota-angular-ngrx/AGENTS.md, templates/chota-react-redux/AGENTS.md, templates/chota-react-rtk/AGENTS.md, templates/chota-react-saga/AGENTS.md, docs/ui/events.md, templates/chota-react-zustand/AGENTS.md, docs/ui/molecule.md, docs/ui/skeleton.md, docs/ui/atomic-design.md
checks the skill already inherits: verify:showcase, verify:terminology-docs, verify:skill-doc
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **Which npm command (e.g., 'build-book' or 'build-demo') is the official gate for the 'site-builds' requirement?** -> npm run build-book (by recommendation; scout recommended: npm run build-book)
- **Is there a specific list or script that validates the 'at least 8 skills' count, or should we rely on the presence of the 'Skills' section as the primary indicator for this skill?** -> Rely on the 'sections' check for the four required headers. (by recommendation; scout recommended: Rely on the 'sections' check for the four required headers.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:agent-skills-documentation | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Ensures that the Agent Skill documentation files are present and act as a consis |
| verify:agent-skill-structure | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: no front matter templates/chota-angular-ngrx/AGENTS.md: front-matter field 'Arch | templates/chota-angular-ngrx/AGENTS.md: no front matter temp |  | 0.0 | Enforces the structure required by the 'template-agents-config' standard, ensuri |
| verify:site-builds | command | rejected: `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm run build-book; npm run test; npm test; npm install |  |  | 0.0 | Verifies that the entire documentation structure compiles successfully via Jekyl |
| verify:skill-documentation-presence | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Ensures all Agent Skills have corresponding documentation files (assuming skills |
| verify:agent-skill-doc | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: no front matter templates/chota-angular-ngrx/AGENTS.md: front-matter field 'name | templates/chota-angular-ngrx/AGENTS.md: no front matter temp |  | 0.0 | enforces the structure required by the 'template-agents-config' standard, ensuri |
| verify:agent-skills-presence | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | ensures that every template actually contains the required AGENTS.md files, whic |
| verify:skill-doc | sections | rejected: duplicates the inherited check verify:skill-doc |  |  | 0.0 | enforces the structure for the core UI documentation, ensuring essential context |
| verify:agent_config_structure | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/AGENTS.md: missing section 'Build a todo app' templates/chota-react-redux/AGENTS.md: missin | templates/chota-angular-ngrx/AGENTS.md: missing section 'Bui |  | 0.0 | Ensures each template's AGENTS.md contains the four mandatory sections required |
| verify:site_build_success | command | rejected: fails on the clean workspace: `npm run build-book` failed (exit 1): > elegant@0.0.3 build-book > node scripts/book/print-book.mjs file:///home/gaura | `npm run build-book` failed (exit 1): > elegant@0.0.3 build- |  | 0.2 | Validates the 'site-builds' standard by ensuring the build process completes wit |

## Applied

- forbidden /PAYPAL_SECRET/
- forbidden /SUPABASE_SECRET/
- forbidden /service_role/
- forbidden /sk-or-v1/
- forbidden /lin_api_/
- judge rubric

Text checks: required [], forbidden ["PAYPAL_SECRET", "SUPABASE_SECRET", "service_role", "sk-or-v1", "lin_api_"]; judge rubric: If the 'skills' count in AGENTS.md is less than 8, the 'sections' check will pass (as it only checks for headers), but the content may be insufficient. However, since no dedicated tool exists to count
