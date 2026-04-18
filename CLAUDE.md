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
