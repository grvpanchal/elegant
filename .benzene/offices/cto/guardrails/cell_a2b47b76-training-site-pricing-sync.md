# Guardrail scout: elegant-cto-training-site-b / training-site-pricing-sync

scout `scout_68ec4984` · cell `cell_a2b47b76` · models: poolside/laguna-s-2.1:free, poolside/laguna-s-2.1:free, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill is training-site-pricing-sync, which must keep docs/_data/pricing.yml in sync with .benzene/material/finance/pricing.md. The inherited verify:pricing-sync check is the project's own gate for this skill, so it is the cheapest deterministic check that passes clean and fails spoiled. A second check is added to catch a spoiled copy where the pricing data file is missing or malformed, which t

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

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:pricing-yml-sync | claims | rejected: fails on the clean workspace: docs/_data/pricing.yml: '10.00' is not on the record: 'sandbox_amount_usd: "10.00"' .benzene/material/finance/pricing.md | docs/_data/pricing.yml: '10.00' is not on the record: 'sandb |  | 0.0 | every tier in pricing.md must appear in pricing.yml with the same price_usd; a m |
| verify:pricing-sync-inherited | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.2 | the inherited verify:pricing-sync check is the project's own gate; running the t |
| verify:pricing-sync | command | rejected: duplicates the inherited check verify:pricing-sync |  |  | 0.0 | the project's own inherited check for pricing sync; passes clean, fails when pri |
| verify:pricing-yml-exists | file_pattern | rejected: file None does not exist in the workspace |  |  | 0.0 | ensures the pricing data file exists and contains the price_usd field that the s |

## Applied

- nothing: the skill keeps its inherited guardrail

Error: scout model failed: The read operation timed out
