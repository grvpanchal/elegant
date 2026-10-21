# Guardrail scout: elegant-cto-training-site-a / training-site-health-seo

scout `scout_4499cfee` · cell `cell_c1e6e994` · models: poolside/laguna-s-2.1:free, poolside/laguna-s-2.1:free, nvidia/nemotron-3-ultra-550b-a55b:free · rounds: 3 · escalated to the evolver

> The skill training-site-health-seo guards the training site's health and SEO standards. The workspace already inherits verify:site-health and verify:seo (which check built pages for broken links, images, h1 count, meta description, og:image, twitter:card, canonical), plus verify:site-build, verify:no-secrets, verify:learner-journey. The daughter's mistakes would be regressions in these areas. The 

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

- **Which script is the real gate for site health and SEO — `npm run test` (the full CI suite) or a dedicated command like `npm run verify:seo`?** -> Use `npm run test`; the inventory lists it and it runs concurrently with kill-on-fail, matching the CI command `npm install && npm run build-demos`. (by recommendation; scout recommended: Use `npm run test`; the inventory lists it and it runs concurrently with kill-on-fail, matching the CI command `npm install && npm run build-demos`.)
- **Does docs/_config.yml contain the expected SEO keys (url, title, description, twitter_username, og_image) and does docs/_data/courses.yml use a top-level `courses:` list with `lessons:` arrays?** -> Assume standard Jekyll SEO keys in _config.yml and a `courses:` array in courses.yml; the sections checks will validate presence of these keys. (by recommendation; scout recommended: Assume standard Jekyll SEO keys in _config.yml and a `courses:` array in courses.yml; the sections checks will validate presence of these keys.)

## Candidates

| check | type | verdict | clean | spoiled | seconds | why |
|---|---|---|---|---|---|---|
| verify:site-build | command | rejected: duplicates the inherited check verify:site-build; `python3 .benzene/checks/site.py build` is not in the inventory (allowed: npm run build-demos; npm r |  |  | 0.0 | the Jekyll build must complete with 0 errors and produce docs/_site/index.html; |
| verify:courses-data | sections | rejected: fails on the clean workspace: docs/_data/courses.yml: missing section 'UI' docs/_data/courses.yml: missing section 'State' docs/_data/courses.yml: mis | docs/_data/courses.yml: missing section 'UI' docs/_data/cour |  | 0.0 | courses.yml must list the four free courses the showcase requires; a missing or |
| verify:template-js-syntax | command | rejected: fails on the clean workspace: `node --check templates/**/src/**/*.js` failed (exit 1): node:internal/modules/cjs/loader:1459 throw err; ^ Error: | `node --check templates/**/src/**/*.js` failed (exit 1): nod |  | 0.0 | Catches syntax errors in JS files written by this skill under templates/ before |
| verify:built-index-seo | sections | rejected: fails on the clean workspace: docs/_site/index.html: missing section '<meta name="description"' docs/_site/index.html: missing section '<meta property | docs/_site/index.html: missing section '<meta name="descript |  | 0.0 | Ensures the built homepage carries the four required SEO tags; fails if any are |
| verify:test-suite | command | rejected: fails on the clean workspace: `npm run test` failed (exit 127): > elegant@0.0.3 test > cross-env CI=true concurrently --kill-others-on-fail "npm insta | `npm run test` failed (exit 127): > elegant@0.0.3 test > cro |  | 0.2 | The project's test script is the real gate; it runs the full CI suite (site-buil |
| verify:seo-config | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | Jekyll's _config.yml holds the canonical URL, site title, description, twitter h |
| verify:courses-data | sections | rejected: sections check names no headings, front matter or patterns |  |  | 0.0 | The free-courses standard requires ≥4 courses, ≥5 lessons each, ≥20 free lessons |

## Applied

- nothing: the skill keeps its inherited guardrail
