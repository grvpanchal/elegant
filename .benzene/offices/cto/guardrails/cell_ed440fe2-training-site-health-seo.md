# Guardrail scout: elegant-cto-training-site-a-b / training-site-health-seo

scout `scout_7d97b774` · cell `cell_ed440fe2` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The core requirements of this skill involve ensuring no secrets are leaked (no-client--secret), confirming a minimum number of free courses in the pricing data (free-courses), and maintaining site integrity. Since custom scripts for site health/building aren't available in the inventory, I'll use 'file_pattern' to ensure core files match required standards and 'claims' to enforce the specific coun

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_6bd9de4a
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: docs/_data/pricing.yml, run_health.sh, run_health_v2.sh, run_health_check.sh, docs/_includes/head_seo_vars.html, docs/blog/accessibility-is-not-a-checklist.md, docs/blog/accessible-forms-labels-and-errors.md, docs/blog/actions-are-messages-not-setters.md, docs/blog/agent-skills-are-reusable-knowledge.md, docs/blog/ai-and-accessibility.md, docs/blog/ai-and-technical-debt.md, docs/blog/ai-cannot-hold-your-architecture.md, docs/_includes/head.html, docs/skills/index.md
documents among them: docs/blog/accessibility-is-not-a-checklist.md, docs/blog/accessible-forms-labels-and-errors.md, docs/blog/actions-are-messages-not-setters.md, docs/blog/agent-skills-are-reusable-knowledge.md, docs/blog/ai-and-accessibility.md, docs/blog/ai-and-technical-debt.md, docs/blog/ai-cannot-hold-your-architecture.md, docs/skills/index.md
checks the skill already inherits: verify:showcase, verify:site-build, verify:site-health, verify:no-secrets, verify:courses, verify:seo, verify:pricing-sync, verify:checkout, verify:learner-journey
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:npm run build-demos | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.0 | ensures the site structure can be built by running demos, linking to showcase re |
| verify:npm run test | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.2 | ensures the skill/site adheres to basic functional testing requirements. |
| verify:site-build | sections | rejected: duplicates the inherited check verify:site-build; sections check names no headings, front matter or patterns |  |  | 0.0 | verifies the core site structure is built correctly according to the standard. |
| verify:site-health | sections | rejected: duplicates the inherited check verify:site-health; sections check names no headings, front matter or patterns |  |  | 0.0 | ensures all built pages adhere to link/image structural rules, aligning with com |
| verify:template-agents-config | sections | rejected: no document matches ['skills/*/AGENTS.md']; sections check names no headings, front matter or patterns |  |  | 0.0 | ensures all Agent Skills have the required sections (Architecture, Skills, Comma |
| verify:skills/index | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | ensures the main skill index is present and correctly structured. |
| verify:site-build | command | rejected: duplicates the inherited check verify:site-build; `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm r |  |  | 0.0 | enforce the required Jekyll build process for site integrity. |
| verify:skills-documentation | sections | rejected: fails on the clean workspace: docs/skills/index.md: front-matter field 'date' missing or empty docs/blog/index.md: front-matter field 'date' missing o | docs/skills/index.md: front-matter field 'date' missing or e |  | 0.2 | ensure all skill and blog documentation follow a consistent structure, which is |
| verify:template-agents-config | sections | rejected: fails on the clean workspace: templates/chota-angular-ngrx/README.md: no front matter templates/chota-angular-ngrx/README.md: front-matter field 'Arch | templates/chota-angular-ngrx/README.md: no front matter temp |  | 1.6 | enforce the strict documentation requirements for template agents, as specified |
| verify:site-health | claims | rejected: duplicates the inherited check verify:site-health |  |  | 0.0 | ensure the final site structure contains required course and practice sections, |
| verify:skill-agent-manifests | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | ensure every skill has the required agent manifest documentation to satisfy temp |
| verify:no-secrets | file_pattern | rejected: duplicates the inherited check verify:no-secrets; file None does not exist in the workspace |  |  | 0.0 | Ensures that no restricted strings (like 'sb_secret_', 'service_role', or 'sk-or |
| verify:free-courses | claims | rejected: fails on the clean workspace: docs/_data/pricing.yml: '12' is not on the record: 'price_usd: 12' docs/_data/pricing.yml: '99' is not on the record: 'p | docs/_data/pricing.yml: '12' is not on the record: 'price_us |  | 0.0 | Validates that the pricing data file contains at least 4 free courses as require |

## Applied

- forbidden /sb_secret_/
- forbidden /service_role/
- forbidden /sk-or-v1-/
- forbidden /lin_api_/
- judge rubric

Text checks: required [], forbidden ["sb_secret_", "service_role", "sk-or-v1-", "lin_api_"]; judge rubric: If 'verify:no-secrets' fails, the daughter included a secret. If 'verify:free-courses' fails, the count of free courses is less than 4.
