# Guardrail scout: elegant-cto-training-site-a / training-site-landing-pages

scout `scout_ca896008` · cell `cell_c1e6e994` · models: poolside/laguna-s-2.1:free, poolside/laguna-s-2.1:free, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill owns the landing pages of the training site (home, courses index, practice index, pricing). The inherited checks cover site build, health, SEO, pricing sync, checkout, and learner journey, but none explicitly validates the landing-page markdown sources — their front matter, required sections, and critical links. The previous build-demos command timed out, so a faster syntax or content ch

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

- **Which markdown files are the authoritative landing pages (home, courses index, practice index, pricing)? The current guess is docs/index.md, docs/courses/index.md, docs/practice/index.md, docs/pricing/index.md.** -> Confirm the exact four files; if any lives under a different path (e.g., docs/landing/), adjust the files list in the sections and file_pattern checks. (by recommendation; scout recommended: Confirm the exact four files; if any lives under a different path (e.g., docs/landing/), adjust the files list in the sections and file_pattern checks.)
- **Is there a fast validation script (under 30 s) that checks only landing-page content — e.g., a Node script that parses front matter and required links — or should we rely on the existing npm run test (which runs the full suite)?** -> If a targeted script exists (e.g., scripts/check-landing-pages.mjs), add a command verifier for it; otherwise the two content checks above are sufficient and deterministic. (by recommendation; scout recommended: If a targeted script exists (e.g., scripts/check-landing-pages.mjs), add a command verifier for it; otherwise the two content checks above are sufficient and deterministic.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:build-demos | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 61s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 61.5 | the project's own CI gate; fails if templates or demo builds break |
| verify:pricing-sync | claims | rejected: duplicates the inherited check verify:pricing-sync |  |  | 0.0 | every tier in pricing.md must appear in pricing.yml with the same price_usd |
| verify:sandbox-checkout | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | docs/_config.yml must set paypal.env: sandbox and a client_id for sandbox checko |
| verify:build-demos | command | rejected: fails on the clean workspace: `npm run build-demos` failed (exit 124): timed out after 60s; took 60s, over the 60s budget | `npm run build-demos` failed (exit 124): timed out after 60s |  | 60.0 | the project's own build script for the demo/template layer this skill produces; |
| verify:pricing-data | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | pricing-sync depends on docs/_data/pricing.yml listing every tier with price_usd |
| verify:landing-pages-front-matter | sections | rejected: fails on the clean workspace: docs/index.md: front-matter field 'description' missing or empty | docs/index.md: front-matter field 'description' missing or e |  | 0.0 | Each landing page must have title, layout, and description front matter for Jeky |
| verify:landing-pages-cta-links | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | Landing pages must contain links to /courses/, /practice/, and /pricing/ so the |

## Applied

- required //courses//
- required //practice//
- required //pricing//

Text checks: required ["/courses/", "/practice/", "/pricing/"], forbidden []
