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

## The capability guardrail (`harness/`)

`harness/capabilities.yml` is the executable definition of what the training
site under `docs/` must be able to do — 63 capabilities benchmarked against
greatfrontend.com (question formats, an in-browser workspace with tests, worked
solutions, study plans, playbooks, progress tracking) plus one that is ours:
every unit of practice is also an Agent Skill, and `harness`-format exercises
ship their own eval. `harness/check_harness.py` measures every one of them.

```bash
python3 harness/check_harness.py                  # full report, exit 1 on failure
python3 harness/check_harness.py --next           # the single highest-priority deficit
python3 harness/check_harness.py --failures-only --scope incremental --changed <paths>
python3 harness/gen_readme.py                     # regenerate harness/README.md from the spec
```

**Run it before opening a PR that touches `docs/`.** Two flags decide what you
are judged by: `--scope incremental` drops whole-site volume targets ("write 12
quiz questions") that no single change can close, and `--changed <paths>`
restricts per-page capabilities to the files you actually wrote. Capabilities
declare `requires:` (a plan is pointless before the bank exists, so `--next`
never hands out blocked work) and `owns:` (a capability whose territory your
change never touched is skipped, not failed).

Adding a capability means editing **both** `capabilities.yml` (the intent,
reviewable) and `check_harness.py` (the measurement, a `@check("<id>")`
function). A spec entry with no implementation fails loudly. Then run
`gen_readme.py` — `harness/README.md` is generated, never hand-edited.

The capability count stated above is itself checked: `harness.docs` compares
any "N capabilities" claim in this file, `README.md` and `harness/README.md`
against the spec, because that sentence went stale the first time the count
changed and nothing noticed.

### Functional capabilities (`harness/functional/`)

The capabilities in the `functional` group are not file checks — they drive a
real Chromium against the built site and assert behaviour: a coding question's **starter must
fail** its own tests while the reference solution **passes in the browser**,
the quiz grades, the filters narrow and compose, progress survives a reload, a
plan renders its steps, no page throws, and the workspace is operable from the
keyboard.

```bash
node harness/functional/run.mjs --site <built-dir>      # the browser suite alone
python3 harness/check_harness.py --group functional     # via the guardrail (builds first)
```

They need `node`, `playwright` and the Jekyll gems; each is skipped with an
explicit reason when missing, never silently passed. The site is built once per
process and shared with `health.build`, so a full run costs about ten seconds.

This group is the reason no human review is required to call the site healthy:
static checks prove form, these prove function. **Never edit a scenario to make
it pass** — it is the standard, not the test of the test.

`--next` sorts regressions (`scope: incremental`, "what exists is wrong") ahead
of growth (`scope: cumulative`, "not enough yet"), so a broken filter is handed
out before a missing question.

### Accounts, and the frontier

Two groups need context before you change them.

**`account`** — greatfrontend.com has real accounts; this site is static Jekyll
on GitHub Pages with no server, so an account here is a *named profile on this
device*: progress namespaced per profile, a portable JSON export that carries a
profile to another browser, and `registerProvider` as the seam a hosted
deployment swaps for a real identity provider. It is **not authentication** —
nothing is verified — and `account.honest_copy` fails if `docs/account/index.md`
stops saying so, because that caveat is exactly what gets edited out for looking
untidy. `docs/assets/js/account.js` owns identity; `progress.js` reads the
namespace from it, so **account.js must load before progress.js** on any page
that shows progress.

**`frontier`** — parity targets the site does not have yet (editor affordances,
company guides). A capability that gets built **leaves** this group: it moves to
the group it belongs in and becomes `required`, which is what stops the frontier
being a place things go to be forgotten. They are declared and
measured so the gap stays visible, `required: false` so they never block a
contribution, and `scope: cumulative` so `--next` hands them out only after
everything required is green. **A frontier check is a real measurement, not a
placeholder**: when someone builds the feature it turns green without being
rewritten. The composite sits below `pass_threshold` while the frontier is
open, and that is the honest reading — do not lower the threshold to go green.

`required: false` stops a frontier item blocking an unrelated contribution. It
must **not** stop it blocking the task sent to build it, or a cell writes one
file, the composite still clears threshold and it is told the work is done — it
did exactly that for four rounds. So a capability named in `--must` (or in
`$BENZENE_INSTRUCTION`) is required *for that run* whatever the spec says, and
`harness.scoping` runs the checker against itself both ways to prove the two
behaviours still differ.

## Training-site sections under `docs/`

Beyond the concept docs, `docs/` carries the practice surfaces:

- `docs/practice/<slug>.md` — one question per file, `layout: question`. Front
  matter is a contract (`format`, `difficulty`, `layer`, `topics`, `skill`,
  `minutes`); `harness/README.md` has the full schema. `docs/_data/questions.yml`
  is **generated** by `scripts/sync-questions-registry.py` — never hand-edit it.
- `docs/practice/workspace/<slug>/{starter,solution,tests}.js` — required for
  `format: coding`. `tests.js` default-exports `async (subject) => [{name, pass,
  message?}]` and runs unchanged in the browser playground and under Node in the
  guardrail, so "solved" means the same thing in both. Keep it dependency-free.
- `docs/plans/` + `docs/_data/plans.yml` — study plans, `layout: plan`. The
  budget is checked twice: against the questions it contains, and against
  `plan_horizons` in the spec, so a plan named `three-months` cannot be an
  afternoon.
- `docs/playbooks/` — long reads, `layout: doc`, 800+ words of body prose.
- `docs/assets/js/{playground,progress,practice-index,certificate}.js` — the
  workspace runner, localStorage progress, the bank's client-side filtering,
  and the printable certificate. No backend: the site is static.
- `docs/practice/workspace/<slug>/runtime.json` — marks a **component**
  question. Its starter, solution and tests import `@runtime`, a bare specifier
  the question layout's import map points at
  `docs/assets/vendor/runtime-preact.mjs` (vendored preact + htm, ~16 KB, no
  build step and no CDN — the guardrail's browser has no outbound network).
  It must be a bare specifier: the learner's code runs from a `blob:` URL, and
  `blob:` is not hierarchical, so an absolute path has no base to resolve
  against and throws. These tests need a DOM, so `workspace.tests_pass` skips
  them under Node and says which ones; `workspace.framework_runtime` covers
  them in Chromium.

## The agents that build the site (`agents/`)

`agents/frontend-harness.yaml` is the Benzene genome for the cell that grows and
maintains `docs/` against `harness/`. It lives here, not in the framework repo,
because it is **about this site**: its verifiers run `harness/check_harness.py`
and its skills name `docs/practice/`, `docs/_data/plans.yml` and
`harness/capabilities.yml`. Rename a capability and the genome answering to it
moves in the same commit — `harness.agent_manifest` fails when they drift.

```bash
export OPENROUTER_API_KEY=sk-or-...   # every role uses a free model
bza agents/frontend-harness.yaml .    # the workspace is this repository
```

`agents/skills/` holds the six operating skills (`author-question`,
`author-plan`, `author-playbook`, `fix-site-health`, `fix-functional`,
`build-capability`). `AgentManifest.load` resolves `skills: [name]` against
`agents/skills/<name>/SKILL.md` first, so genome and skills travel together.

**These are not the Agent Skills under `/skills/`.** Those are content
(`ui-atom`, `server-ssr`) published for learners, listed in
`docs/_data/skills.yml`, and offered by the download widget. Keeping the cell's
operating instructions out of that registry is deliberate — `agents/skills/` is
never synced into it. The engine itself is
[`grvpanchal/benezene-agent`](https://github.com/grvpanchal/benezene-agent).

## Doc reviewer subagent

A custom subagent at `.claude/agents/doc-reviewer.md` reviews terminology docs (`docs/{ui,server,state}/*.md`) for readability + learner engagement, with durable memory in `.github/doc-review/state.json`. **Before opening a PR that touches any doc under those paths**: list the modified docs, invoke the `doc-reviewer` subagent on each (one at a time so memory updates are resumable), commit any fixes it applies, and surface in the PR description any issues it reports. The agent is allowed to fix small issues in place (paragraph rewrites, stale headings, missing transitions) but stops and reports for anything structural or that would touch >40 lines. See `.github/doc-review/README.md` for the schema and workflow.
