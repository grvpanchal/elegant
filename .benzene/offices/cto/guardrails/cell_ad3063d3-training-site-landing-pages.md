# Guardrail scout: elegant-cto-training-site-a-a / training-site-landing-pages

scout `scout_e3240c92` · cell `cell_ad3063d3` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The primary goals of the landing-page skill are to ensure a functional Jekyll site and protect against credential leaks in documentation/templates; verify:site-build catches broken Liquid tags or construction errors, while verify:no-secrets ensures no keys enter the public codebase.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_6bd9de4a
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: docs/_data/pricing.yml, docs/skills/index.md, docs/_includes/blog-related.html, docs/blog/accessibility-is-not-a-checklist.md, docs/_config.yml, docs/cli.md, docs/index.md, docs/_layouts/default.html
documents among them: docs/skills/index.md, docs/blog/accessibility-is-not-a-checklist.md, docs/cli.md, docs/index.md
checks the skill already inherits: verify:showcase, verify:site-build, verify:site-health, verify:no-secrets, verify:courses, verify:seo, verify:pricing-sync, verify:checkout, verify:learner-journey
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:site-build | command | rejected: duplicates the inherited check verify:site-build; `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm r |  |  | 0.0 | Ensures the Jekyll build completes successfully without errors, matching the 'si |
| verify:skill-doc | sections | rejected: fails on the clean workspace: docs/skills/index.md: front-matter field 'name' missing or empty | docs/skills/index.md: front-matter field 'name' missing or e |  | 0.0 | Ensures that the main skill index document adheres to the structure required for |
| verify:pricing-sync | sections | rejected: duplicates the inherited check verify:pricing-sync |  |  | 0.0 | Checks the synchronization of pricing information across the YAML and markdown f |
| verify:skill-doc | sections | rejected: fails on the clean workspace: docs/skills/index.md: front-matter field 'name' missing or empty | docs/skills/index.md: front-matter field 'name' missing or e |  | 0.0 | The skill documents should follow a standard format, ensuring essential metadata |
| verify:skill-naming | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Skills must adhere to a predictable naming convention (e.g., one per term) which |
| verify:cli-doc | sections | rejected: fails on the clean workspace: docs/cli.md: front-matter field 'name' missing or empty docs/cli.md: front-matter field 'description' missing or empty | docs/cli.md: front-matter field 'name' missing or empty docs |  | 0.0 | CLI documentation should also follow a structured format to ensure operators und |
| verify:site-build | command | rejected: duplicates the inherited check verify:site-build; `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm r |  |  | 0.0 | Ensures that no Liquid errors occur during the Jekyll build process and that the |
| verify:no-secrets | command | rejected: duplicates the inherited check verify:no-secrets; `python3 .benzene/checks/site.py security` is not in the inventory (allowed: npm run build-demos; np |  |  | 0.0 | Prevents the accidental inclusion of secrets (API keys, passwords) in documentat |

## Applied

- forbidden /TODO/

Text checks: required [], forbidden ["TODO"]
