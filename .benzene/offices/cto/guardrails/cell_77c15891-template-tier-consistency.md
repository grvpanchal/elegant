# Guardrail scout: elegant-cto-template-harness-b-b / template-tier-consistency

scout `scout_94255f56` · cell `cell_77c15891` · models: google/gemma-4-e2b, google/gemma-4-e2b, nvidia/nemotron-3-ultra-550b-a55b:free, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 4 · escalated to the evolver

> The skill requires docs/_data/pricing.yml to contain exactly four tier entries with slugs free, monthly, annual, lifetime. The project's test script (npm run test) is the primary gate and should invoke the agents tier check from .benzene/checks/templates.py. As a deterministic fallback, file_pattern checks verify each required slug appears and no other slug values exist.

## Inventory

```
workspace: /home/gaurav/.cache/benzene/worktrees/elegant/chg_c00cb625
package.json scripts: build-demos = `bash demos.sh`, build-book = `node scripts/book/print-book.mjs`, test = `cross-env CI=true concurrently --kill-others-on-fail "npm in`
tsconfig.json: no; pytest: no; mkdocs.yml: no; record (.benzene): yes
CI commands: `npm install`; `npm run build-demos`
tools on PATH: node, npm, npx, pytest, make
files the parent wrote for this skill: none
checks the skill already inherits: verify:showcase, verify:template-integrity, verify:template-agents, verify:todo-stability
commands a candidate may run (prefixes): `npm run build-demos`; `npm run build-book`; `npm run test`; `npm test`; `npm install`; `npm run build-demos`; `node --check`
```

## Questions

- **What command runs the 'agents' tier check from .benzene/checks/templates.py against docs/_data/pricing.yml? The allowed command prefixes are npm scripts only — is there an npm script (e.g., npm run test) that invokes it, or should I propose a file_pattern check as the primary guard?** -> If npm run test runs the templates.py agents tier, use that as a command check. Otherwise, file_pattern with the four required slugs and a forbidden pattern for any other slug: values is the deterministic fallback. (by recommendation; scout recommended: If npm run test runs the templates.py agents tier, use that as a command check. Otherwise, file_pattern with the four required slugs and a forbidden pattern for any other slug: values is the deterministic fallback.)
- **What is the exact YAML structure of docs/_data/pricing.yml? Specifically, are tiers listed as a sequence of mappings each containing a 'slug' key (e.g., '- slug: free'), or a different key name?** -> Assuming standard list-of-mappings with 'slug' keys. If the key differs (e.g., 'id', 'tier'), the required_patterns/forbidden_patterns need adjustment. (by recommendation; scout recommended: Assuming standard list-of-mappings with 'slug' keys. If the key differs (e.g., 'id', 'tier'), the required_patterns/forbidden_patterns need adjustment.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:pricing-tiers | sections | rejected: fails on the clean workspace: docs/_data/pricing.yml: missing section 'free' docs/_data/pricing.yml: missing section 'monthly' docs/_data/pricing.yml: | docs/_data/pricing.yml: missing section 'free' docs/_data/pr |  | 0.0 | ensures that exactly the four required tier entries exist in the pricing data. |
| verify:pricing-tiers | sections | rejected: fails on the clean workspace: docs/_data/pricing.yml: missing section 'free' docs/_data/pricing.yml: missing section 'monthly' docs/_data/pricing.yml: | docs/_data/pricing.yml: missing section 'free' docs/_data/pr |  | 0.0 | ensure the required four tier entries exist in the pricing file |
| verify:pricing-agents-tier | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.1 | The project's test suite runs the agents tier of .benzene/checks/templates.py wh |
| verify:pricing-has-free | file_pattern | accepted | docs/_data/pricing.yml matches | docs/_data/pricing.yml: lines matching the pattern removed -> docs/_data/pricing | 0.0 | Free tier must be present with exact slug |
| verify:pricing-has-monthly | file_pattern | rejected: fails on the clean workspace: docs/_data/pricing.yml does not contain /slug: monthly/ | docs/_data/pricing.yml does not contain /slug: monthly/ |  | 0.0 | Monthly tier must be present with exact slug |
| verify:pricing-has-annual | file_pattern | rejected: fails on the clean workspace: docs/_data/pricing.yml does not contain /slug: annual/ | docs/_data/pricing.yml does not contain /slug: annual/ |  | 0.0 | Annual tier must be present with exact slug |
| verify:pricing-has-lifetime | file_pattern | accepted | docs/_data/pricing.yml matches | docs/_data/pricing.yml: lines matching the pattern removed -> docs/_data/pricing | 0.0 | Lifetime tier must be present with exact slug |
| verify:pricing-no-extra-slugs | file_pattern | accepted | docs/_data/pricing.yml matches | docs/_data/pricing.yml: lines matching the pattern removed -> docs/_data/pricing | 0.0 | No tier slugs other than the four allowed |

## Applied

- verify:pricing-has-free
- verify:pricing-has-lifetime
- verify:pricing-no-extra-slugs
