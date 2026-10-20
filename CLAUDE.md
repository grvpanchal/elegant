# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`elegant` is a tiny Node.js CLI (`index.js`, published as the `elegant` bin) whose only job is to copy one of the sub-directories under `templates/` into the user's `cwd` as a new project. There is no build step, bundler, or framework for the CLI itself — `index.js` uses `readline-sync` to pick a template and `fs-extra` to copy it.

Each directory under `templates/` (`chota-react-redux`, `chota-react-rtk`, `chota-react-saga`, `chota-angular-ngrx`, `chota-vue-pinia`, `chota-wc-saga`) is a **standalone, independently-versioned front-end project** with its own `package.json`, `node_modules`, tooling, and test runner. They are shipped as the CLI's payload, not as a workspace — there is no root `node_modules` linking, no monorepo tool, no shared dep graph. Treat each template as its own app.

`skills/` contains Agent Skills (one folder per skill, each with a `SKILL.md`) following the [Agent Skills open standard](https://agentskills.io) — prose design guidelines (atomic design layers, state patterns, SSR/SSG/MFE notes) that describe the architecture the templates implement and that can be published to skills.sh or dropped into `~/.claude/skills/`. `docs/` is a Jekyll site published to GitHub Pages; `demos.sh` builds every template's production app + Storybook into `docs/demos/` and then runs `bundle exec jekyll build`.

## Common commands

From the repo root:

- `node index.js [template-name]` — run the CLI locally. With no arg, it shows a numbered picker of the `templates/` dirs. `-v` prints the version.
- `npm test` — installs deps for **every** template and runs each template's `npm test` concurrently via `concurrently --kill-others-on-fail` (sets `CI=true`). This is heavy; prefer running a single template's tests directly.
- `npm run build-demos` — runs `demos.sh`, which `cd`s into each template, runs `npm run build` and `npm run build-storybook`, copies output into `docs/demos/` and `docs/demos/storybooks/`, then builds the Jekyll site. Assumes every template already has deps installed.

Working inside a single template (`cd templates/<name>`):

- Plain `npm install` works; `--legacy-peer-deps` is no longer required on any template.
- React templates (`chota-react-redux`, `chota-react-rtk`, `chota-react-saga`) — Vite 8 + Vitest 4 + Storybook 10:
  `npm start` / `npm run dev` for dev, `npm run build`, `npm test` (Vitest run), `npm run storybook`, `npm run build-storybook`.
- `chota-vue-pinia` — Vite 8 + Vue 3.5 + Pinia 3 + Vitest 4 + Cypress 13:
  `npm run dev` (also `start`), `npm run build` (runs `vue-tsc --noEmit` first), `npm test` (Vitest), `npm run test:e2e` (Cypress), `npm run type-check`, Storybook as above.
- `chota-angular-ngrx` — Angular 21 + NgRx 21 + Karma + Storybook 10:
  `npm start` / `ng serve`, `ng build`, `ng test` (Karma — needs a Chrome/Chromium; set `CHROME_BIN` if headless), `ng lint`, Storybook as above.
- `chota-wc-saga` — Vite 8 + Lit 3 + Redux Saga + `@web/test-runner` + Storybook 10:
  `npm start` (Vite dev), `npm run build`, `npm test` (Web Test Runner via Playwright launcher — honours `WTR_CHROMIUM_PATH` to override the browser binary), Storybook as above.

To run a single test file, use the template's native test runner directly:
- `npx vitest run src/path/File.test.jsx` inside any React/Vue template.
- `ng test --include='**/file.spec.ts' --watch=false` in Angular.
- `npx web-test-runner --files='test/foo.test.js'` in the WC template.

## Architecture notes that span files

**The CLI is argv-driven, not flag-parsed.** `index.js` iterates `process.argv` looking for the literal string `index.js` and then treats the next arg as either `-v` or a template name that must match a folder in `templates/`. There is no arg parser; adding new flags means editing that loop.

**Templates are chosen by directory listing.** `fse.readdirSync(templatesDir)` is the source of truth for what's offered — adding a new boilerplate is purely a matter of dropping a directory into `templates/`. Nothing in `index.js` or root `package.json` enumerates them. `demos.sh` and `.github/workflows/ci.yml`, however, **do** hard-code the template list, so new templates require updates in three places: the folder, `demos.sh`, and `ci.yml`.

**All templates share the same atomic-design source layout** (`src/ui/{atoms,molecules,organisms,templates,skeletons}`, `src/containers`, `src/state`, `src/pages` / `src/views`, `src/utils`). The `skills/` folder (`ui-atom/SKILL.md`, `ui-molecule/SKILL.md`, `ui-organism/SKILL.md`, `state-*/SKILL.md`, `server-*/SKILL.md`) documents this layout and the expected patterns for actions/reducers/selectors, accessibility, theming, SSR/SSG, micro-frontends, etc. When changing a template's structure, keep it consistent with these skills and with the sibling templates — the value proposition is that all six are interchangeable shells over the same architecture.

**State management differs per template family** — Redux (classic), Redux Toolkit 2 (slices), Redux Saga + @redux-devtools/extension, NgRx (feature slices with effects), Pinia 3 (option-store form: `defineStore('id', { state, getters, actions })`), and Redux-Saga-for-web-components. The request/success/fail action triple and try/catch-in-saga error pattern is shared across the Redux-family templates.

**React templates use `.jsx` for JSX-bearing sources.** Vite 8's rolldown-based transform rejects JSX in `.js` files; components / containers / pages / providers / tests that contain JSX use `.jsx`, while pure-logic files (state, selectors, helpers) stay `.js`. Each React template has `type: "module"` so runtime imports are ESM — top-level `import` is preferred over `require` in tests (Vitest's module graph doesn't reliably resolve extensionless `require` calls under strict ESM).

**CI (`.github/workflows/ci.yml`) both tests and publishes.** Node 20 + Ruby 3.3; installs root deps, then each template, runs `npm run build-demos`, uploads `docs/_site`, and on `push` deploys to GitHub Pages. The `npm test` step is currently commented out in CI — tests are expected to pass locally but aren't gated in CI.

## Conventions worth preserving

- File-name suffix convention inside templates: `.component.*`, `.style.*`, `.stories.*`, `.type.*` (or `.type.js` with JSDoc for web components). PascalCase for component files, camelCase identifiers, UPPER_SNAKE_CASE for Redux action type constants.
- React 19 removed `defaultProps` on function components — use default parameter values instead.
- Test-framework compat: Vitest is the runner in React/Vue templates. Tests use `vi.*` (not `jest.*`); mocks use `vi.mock(path, async (importOriginal) => ...)` and import the mocked members directly rather than using the removed `vi.requireActual` / `vi.requireMock`. `clearMocks` and `restoreMocks` are on in `vite.config.js` / `vitest.config.js` for test isolation.
- Don't introduce a bundler, TypeScript, or lint config at the repo root — the root package is intentionally a thin CLI with only `colors`, `fs-extra`, `readline-sync` as runtime deps.

## Accounts

There are two ways to be someone here, and they are not the same thing.

A **device profile** (`account.js`, provider `local`) is a name you type:
progress namespaced per profile, a portable JSON export, no verification at all.
`docs/account/index.md` must keep saying so: that caveat is exactly what gets
edited out for looking untidy.

A **real account** (`account-supabase.js`, provider `supabase`) is a credential
checked by Supabase. The rule that file exists to enforce: **a token you decoded
is not a token you verified.** A JWT payload is base64, so reading a name out of
it proves nothing — every session is checked against the project's published
JWKS (ES256 / EC P-256) for signature, `iss` and `exp` before it is allowed to
mean anything, on every page load and not just at sign-in. `progress-sync.js`
then mirrors progress to the identity, so it reaches the next browser.

Load order is fixed and lives in **one** place, `_includes/identity-scripts.html`:
account.js (the seam) → the `window.ELEGANT_SUPABASE` config → account-supabase.js
→ progress.js (reads the namespace from account.js) → progress-sync.js (needs
both). The config is assigned with `||` so an embedder, or a test, can
override it. Two mistakes already made here, both silent: the provider registers
on `window.ElegantAccount`, **not** `window.Account`; and `restore()` runs inside
the provider rather than the page controller, because every page that records
progress needs to know who is signed in and only the account page has a
controller.

The **publishable key is in `_config.yml` on purpose** — `sb_publishable_*` is
designed to ship in client code. It is safe *only* while row-level security is
on, because the key alone is what the database sees. Never add a service-role
key anywhere under `docs/`.

Only the **email** provider is enabled on the project. `account-supabase.js`
does sign-up (confirmation email, so no session until the link is followed),
password sign-in, magic link (`/otp`), password reset (`/recover`, then
`PUT /user` from the account page), refresh-token renewal and
`logout?scope=local`. Signing in is `docs/account/index.md` and creating an
account is `docs/account/create.md` (`/account/create/`); one controller,
`account-supabase-page.js`, wires whichever forms a page has. Email links from
both return to `/account/` (the only Redirect URL the Supabase project allows) as
`#access_token=…&type=…` (or `#error=…`); the provider verifies that token like
any other, wipes it from the address bar, and also handles it on `hashchange`.
Every page change of identity goes through `ElegantAccount.useProvider()`, which
announces `account:changed` on **document** — listen there, not on `window`.

`progress-sync.js` reads and writes exactly one table, `public.progress
(user_id, slug, done, updated_at)`, created with RLS by
`supabase/migrations/0001_progress.sql` — which has to be **run by hand in the
Supabase SQL editor** (`supabase/README.md`). Until it is, PostgREST answers
404 `PGRST205`; sync reports `unavailable` (remembered per tab for 10 minutes so
pages do not repeat the request) and everything stays device-only. Its status
(`window.ElegantProgressSync.status()/describe()`, `progress:sync` events) is
what the dashboard and account page show as "Synced" vs "Device only" — keep
one source for that sentence. Never make a page wait on sync.

## Training-site sections under `docs/`

Beyond the concept docs, `docs/` carries the practice surfaces:

- `docs/practice/<slug>.md` — one question per file, `layout: question`. Front
  matter is a contract (`format`, `difficulty`, `layer`, `topics`, `skill`,
  `minutes`). `docs/_data/questions.yml`
  is **generated** by `scripts/sync-questions-registry.py` — never hand-edit it.
- `docs/practice/workspace/<slug>/{starter,solution,tests}.js` — required for
  `format: coding`. `tests.js` default-exports `async (subject) => [{name, pass,
  message?}]` and runs unchanged in the browser playground and under Node in
  tests, so "solved" means the same thing in both. Keep it dependency-free.
- `docs/plans/` + `docs/_data/plans.yml` — study plans, `layout: plan`. A
  plan's budget must match the questions it contains and its name, so a plan
  named `three-months` cannot be an afternoon.
- `docs/playbooks/` — long reads, `layout: doc`, 800+ words of body prose.
- `docs/guides/` — company interview-loop guides, `layout: doc`, each naming the
  rounds and linking the bank questions that map to them. They assert a named
  third party's hiring process, so each one must carry the provenance note (commonly reported, not sourced from the company,
  subject to change). Soften the claims or delete a guide; never delete the note.
- `docs/assets/js/{playground,progress,practice-index,certificate}.js` — the
  workspace runner, localStorage progress, the bank's client-side filtering,
  and the printable certificate. No backend: the site is static.
- Progress keys (`progress.js`) are question slugs, plan concept-doc refs
  (`ui/atom`) and course lessons (`lesson:<course>/<slug>`); each value is the
  ISO time it was marked done (old exports may hold `true` — count it, never
  assume a date). The dashboard's heatmap reads those times.
- `docs/courses/` + `docs/_data/courses.yml` — free courses. The YAML owns
  order (course → modules → lesson slugs); each lesson page
  (`docs/courses/<course>/<slug>.md`, `layout: lesson`) owns its front-matter
  contract: `term` (`<layer>/<doc>`), `skill`, `practice` (a bank slug),
  `description`, `insight`, and a 300–600-word body grounded in the term doc and
  skill. A course page is `docs/courses/<course>/index.md` with `layout: course`.
  Reading time is computed from the body. Run `python3 scripts/check-courses.py`
  after any change; `_includes/course-data.html` resolves a course for every
  surface that lists lessons.
- `docs/dashboard/` — computed in the browser (`assets/js/dashboard.js`) from
  progress against a catalogue the page embeds from `docs/_data`; never
  hard-code a count.
- `docs/skills/index.md` (`/skills/`) — every Agent Skill, from
  `docs/_data/skill_index.yml`, which `scripts/sync-skills-registry.py`
  **generates** with `skills.yml` (never hand-edit it; re-run the script after
  adding a skill or editing a term's Key Insight). The deploy copies `skills/`
  beside it, so `/skills/<slug>/SKILL.md` is the download.
- Share cards: every page's `og:image` is `assets/img/og-default.png` unless it
  sets `image:` (`defaults` in `_config.yml`), and a page with no
  `description` gets one from `_plugins/page_descriptions.rb`: a question's
  `summary`, or a term doc's first Key Insight sentence. Any other page needs
  its own `description` (`material.py seo` fails without one).
- `docs/pricing/` + `docs/_data/pricing.yml` + `paypal:` in `_config.yml` —
  PayPal **sandbox** checkout (`assets/js/pricing.js`). Prices are placeholders
  owned by the CFO office (`price_usd: 0` = "Price to be set"); the sandbox
  order uses `sandbox_amount_usd`. Orders are created and captured client-side,
  receipts kept in localStorage under the account namespace
  (`elegant.purchases.v1<ns>`), and verification is the CFO office's,
  server-side. No PayPal secret ever goes in this repo, the SDK loads only when
  a paid tier is chosen, and nothing on the site is gated on payment.
  The page is **unpublished** until real prices are set: `published: false` on
  the page and `pricing_live: false` in `_config.yml`, which the nav, the home
  page and the dashboard read before linking it. Turn both on together.
- `docs/practice/workspace/<slug>/runtime.json` — marks a **component**
  question. Its starter, solution and tests import `@runtime`, a bare specifier
  the question layout's import map points at
  `docs/assets/vendor/runtime-preact.mjs` (vendored preact + htm, ~16 KB, no
  build step and no CDN).
  It must be a bare specifier: the learner's code runs from a `blob:` URL, and
  `blob:` is not hierarchical, so an absolute path has no base to resolve
  against and throws. These tests need a DOM, so they run in a
  browser, not under Node.

## The organisation (`.benzene/`)

The Benzene organisation that builds and runs this site lives in `.benzene/`:
its genome, offices, cells, lineage, heartbeat and inbox. It is committed as
part of the project. The engine is
[`grvpanchal/benezene-agent`](https://github.com/grvpanchal/benezene-agent).

## The book (`scripts/book/`)

`npm run build-book` prints **Elegant Frontend**, the whole glossary as one
PDF: three parts (UI, Server, State) in `docs/_data/topics/*.csv` order, one
chapter per term. `build-book.rb` joins each term's doc (summary, key insight,
description, the first code example with only its first framework tab, common
mistakes) with its skill's key principles, do/don't and quality gates;
`print-book.mjs` prints it with Chromium in two passes so the contents shows real
page numbers, and writes `docs/assets/book/{elegant-frontend.pdf,cover.jpg}`
plus `docs/_data/book.yml` (generated — never hand-edit), which the download card
(`_includes/book-download.html`, on the home page and `/book/`) reads. The PDF is
committed, not built in CI, so **re-run it after editing a term doc or skill**;
`source_sha256` in `book.yml` hashes the sources it was built from. The front
matter is a cover (the home page's "Why three layers" figures redrawn: the
UI-Server-State wordmark, the three sides as panels with their frameworks
feeding in), a title page with the author from `_config.yml`, and a page per
part. Chapter openers copy the term page's header (big centred logo, centred
title); the contents and part openers use the terminology page's orange tile.

## Doc reviewer subagent

A custom subagent at `.claude/agents/doc-reviewer.md` reviews terminology docs (`docs/{ui,server,state}/*.md`) for readability + learner engagement, with durable memory in `.github/doc-review/state.json`. **Before opening a PR that touches any doc under those paths**: list the modified docs, invoke the `doc-reviewer` subagent on each (one at a time so memory updates are resumable), commit any fixes it applies, and surface in the PR description any issues it reports. The agent is allowed to fix small issues in place (paragraph rewrites, stale headings, missing transitions) but stops and reports for anything structural or that would touch >40 lines. See `.github/doc-review/README.md` for the schema and workflow.
