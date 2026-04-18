# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`elegant` is a tiny Node.js CLI (`index.js`, published as the `elegant` bin) whose only job is to copy one of the sub-directories under `templates/` into the user's `cwd` as a new project. There is no build step, bundler, or framework for the CLI itself — `index.js` uses `readline-sync` to pick a template and `fs-extra` to copy it.

Each directory under `templates/` (e.g. `chota-react-redux`, `chota-angular-ngrx`, `chota-vue-pinia`, `chota-wc-saga`, ...) is a **standalone, independently-versioned front-end project** with its own `package.json`, `node_modules`, tooling, and test runner. They are shipped as the CLI's payload, not as a workspace — there is no root `node_modules` linking, no monorepo tool, no shared dep graph. Treat each template as its own app.

`instructions/` contains prose design guidelines (atomic design layers, state patterns, SSR/SSG/MFE notes) that describe the architecture the templates implement. `docs/` is a Jekyll site published to GitHub Pages; `demos.sh` builds every template's production app + Storybook into `docs/demos/` and then runs `bundle exec jekyll build`.

## Common commands

From the repo root:

- `node index.js [template-name]` — run the CLI locally. With no arg, it shows a numbered picker of the `templates/` dirs. `-v` prints the version.
- `npm test` — installs deps for **every** template with `--legacy-peer-deps` and runs each template's `npm test` concurrently via `concurrently --kill-others-on-fail` (set `CI=true`). This is heavy; prefer running a single template's tests directly.
- `npm run build-demos` — runs `demos.sh`, which `cd`s into each template, runs `npm run build` and `npm run build-storybook`, copies output into `docs/demos/` and `docs/demos/storybooks/`, then builds the Jekyll site. Assumes every template already has deps installed.

Working inside a single template (`cd templates/<name>`):

- Always install with `npm install --legacy-peer-deps` — the root `npm test` and CI both use this flag, and templates rely on it.
- React CRA templates (`chota-react-redux`, `chota-react-saga`, `chota-react-rtk`): `npm start`, `npm run build`, `npm test`, `npm run storybook`.
- `chota-vue-pinia`: `npm run dev` (also `start`), `npm run build`, `npm run type-check` (`vue-tsc --noEmit`), `npm test` runs `cypress run` e2e.
- `chota-angular-ngrx`: `npm start` / `ng serve`, `ng build`, `ng test` (Karma), `ng lint`.
- `chota-wc-saga`: Web Test Runner (`web-test-runner.config.mjs`), rollup build, Storybook.

To run a single test file, use the template's native test runner directly (e.g. `npx react-scripts test src/path/File.test.js` inside a React template, `npx cypress run --spec ...` in the Vue template, `ng test --include=...` in Angular).

## Architecture notes that span files

**The CLI is argv-driven, not flag-parsed.** `index.js` iterates `process.argv` looking for the literal string `index.js` and then treats the next arg as either `-v` or a template name that must match a folder in `templates/`. There is no arg parser; adding new flags means editing that loop.

**Templates are chosen by directory listing.** `fse.readdirSync(templatesDir)` is the source of truth for what's offered — adding a new boilerplate is purely a matter of dropping a directory into `templates/`. Nothing in `index.js` or `package.json` enumerates them. `demos.sh` and `.github/workflows/ci.yml`, however, **do** hard-code the template list, so new templates require updates in three places: the folder, `demos.sh`, and `ci.yml`.

**All templates share the same atomic-design source layout** (`src/ui/{atoms,molecules,organisms,templates,skeletons}`, `src/containers`, `src/state`, `src/pages`, `src/utils`). The `instructions/` docs (`ui-atom`, `ui-molecule`, `ui-organism`, `state-*`, `server-*`) describe this layout and the expected patterns for actions/reducers/selectors, accessibility, theming, SSR/SSG, micro-frontends, etc. When changing a template's structure, keep it consistent with these instructions and with the sibling templates — the value proposition is that all six are interchangeable shells over the same architecture.

**State management differs per template family** — Redux (classic), Redux Toolkit (slices), Redux Saga (rootSagas.js + per-feature sagas), NgRx (feature slices with effects), Pinia (Composition-API stores), and Saga-for-web-components. The request/success/fail action triple and try/catch-in-saga error pattern is shared across the Redux-family templates.

**CI (`.github/workflows/ci.yml`) both tests and publishes.** Node 20 + Ruby 3.3; installs root deps, then each template (with `--legacy-peer-deps`), runs `npm run build-demos`, uploads `docs/_site`, and on `push` deploys to GitHub Pages. The `npm test` step is currently commented out in CI — tests are expected to pass locally but aren't gated in CI.

## Conventions worth preserving

- Use `--legacy-peer-deps` for every install inside a template; CI, root scripts, and the success message printed by the CLI all assume it.
- File-name suffix convention inside templates: `.component.*`, `.style.*`, `.stories.*`, `.type.*` (or `.type.js` with JSDoc for web components). PascalCase for component files, camelCase identifiers, UPPER_SNAKE_CASE for Redux action type constants.
- Don't introduce a bundler, TypeScript, or lint config at the repo root — the root package is intentionally a thin CLI with only `colors`, `fs-extra`, `readline-sync` as runtime deps.
