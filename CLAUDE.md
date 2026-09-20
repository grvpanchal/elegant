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
site under `docs/` must be able to do — 79 capabilities benchmarked against
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

**`account`** — there are now two ways to be someone here, and they are not the
same thing.

A **device profile** (`account.js`, provider `local`) is a name you type:
progress namespaced per profile, a portable JSON export, no verification at all.
`account.honest_copy` fails if `docs/account/index.md` stops saying so, because
that caveat is exactly what gets edited out for looking untidy.

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
both). The config is assigned with `||` so an embedder, or the guardrail, can
override it. Two mistakes already made here, both silent: the provider registers
on `window.ElegantAccount`, **not** `window.Account`; and `restore()` runs inside
the provider rather than the page controller, because every page that records
progress needs to know who is signed in and only the account page has a
controller.

The **publishable key is in `_config.yml` on purpose** — `sb_publishable_*` is
designed to ship in client code. It is safe *only* while row-level security is
on, because the key alone is what the database sees. Never add a service-role
key: `account.no_client_secret` scans everything under `docs/` for exactly that.

**`frontier`** — parity targets the site does not have yet. Editor affordances
and company guides were its first two members; both were built and both left,
which is the rule, not a tidy-up — a capability that gets built moves to the
group it belongs in and becomes `required`, which is what stops the frontier
being a place things go to be forgotten.

**The group is currently empty** — every parity target found this session was
built and left. The workspace items `theming` and `shortcuts` were built by
one-task `bza` runs (a `prefers-color-scheme: dark` block; a shared `run()`
that the Run button and Ctrl/Cmd+Enter both call, with a visible `<kbd>` hint),
each verified by its own scenario; the shortcuts cell also dropped the Run
button's `disabled` attribute — a real regression caught and restored before
commit, which one-task runs make a one-file review rather than a needle in a
multi-task diff. `bank.curated_lists` (now in `question_bank`, required) was
finished by hand: `bza`'s discovery kept timing out because completed runs
leaked orphaned Chromium processes that made the next `--sync --next` cold-start
past 900s, so the cell was handed "timed out" as its instruction and could do
nothing with it. `docs/_data/lists.yml` holds three curated lists (the "top N"
shape, distinct from time-boxed plans), each an ordered set of real bank slugs
rendered by `_layouts/list.html`; the check was also fixed — it read
`Page.slug`, not `q["slug"]`, so it crashed the moment a real lists.yml existed.
Leaked `headless_shell` processes are the thing to kill between `bza` runs.

The **front door** left the frontier for the new `landing` group, all four
`required`: `landing.hero` (a practice headline as the FIRST screen — the CLI
template picker moved below, into the page body), `landing.proof` (the question
total and per-format counts, computed by Liquid over `site.data.questions` so a
figure cannot outlive the bank), `landing.surfaces` (the five surfaces linked
with a line each; its check follows the page's includes, because a link is no
less real for living in a partial) and `landing.workspace_preview` (a real
coding question's editor and Run button on the home page itself, which needed
`playground.js` added to the home layout). They were added after a screenshot
showed the home page selling the CLI while the practice product sat behind four
nav links — seventy-four capabilities measured what the site could do, and none
measured what a student saw first. A `bza` run wrote the hero copy before a
container restart killed it; the layout restructure and the other three were
finished by hand against the same checks.

`account.oauth_pkce` left the frontier on the organisation's first live run:
the CTO cell wrote `docs/assets/js/account-oidc.js` — a real Authorization
Code + PKCE flow, S256, state and nonce, ID token verified against the
issuer's JWKS — and it is now `required` in `account`. Two things about that
are worth knowing. The cell's task was reported NOT_VIABLE (it blew the
latency ceiling), yet the file it left was correct; the failing check was a
race in the *scenario*, which asserted state on the redirect back before the
client had finished the exchange. It failed one run in three on a correct
implementation, and the fix was a bounded wait, not a weaker assertion. And
the real Supabase project still has **every external provider disabled**, so
this flow works against the harness's issuer and any OIDC issuer you
configure via `site.oidc` — enabling a provider there is deployment
configuration, not a site gap.

### Testing auth without a network

**The guardrail's Chromium has no outbound network.** A `fetch` to supabase.co
from a page under test fails, every time — verified, not assumed. So the live
project can never be the test target, and a suite that pointed at it would only
pass on a laptop with wifi. Two in-process servers stand in:

- `harness/functional/supabase.mjs` — the shapes the site actually uses: GoTrue
  signup/token/user/logout, a PostgREST-ish `/rest/v1/progress`, and an ES256
  JWKS, because that is what the real project publishes. A client written
  against this one verifies against that one. It **enforces row ownership from
  the token's `sub`**, so a sync implementation that forgets row-level security
  cannot pass by reading rows it was never entitled to.
- `harness/functional/issuer.mjs` — a generic OIDC issuer (RS256, PKCE enforced
  at the token endpoint), for the social-sign-in frontier item.

Both mint deliberately bad tokens on request (`flaw: "signature" | "expired"`,
plus `"issuer" | "audience" | "nonce"` on the OIDC one), because **"does the
site verify?" is only answerable by handing it something it should refuse.**
That is the difference between these and a presence check, and it is checked
both ways: `account_token_verified` asserts a forged token is refused *and* that
a correctly signed one is still accepted, because "refuses everything" is not
verification either.

One trap worth keeping in mind: a scenario that only asserts "not signed in,
with an error on screen" passes just as happily when the network is broken.
`account_session_expiry` therefore asserts the signup call and the JWKS fetch
actually reached the stand-in first. It passed for the wrong reason before that
was added.

While a frontier item is open it is declared and measured so the
gap stays visible, `required: false` so it never blocks an unrelated
contribution, and `scope: cumulative` so `--next` hands it out only after
everything required is green. **A frontier check is a real measurement, not a
placeholder**: when someone builds the feature it turns green without being
rewritten. The composite sits below `pass_threshold` while the frontier is
open, and that is the honest reading — do not lower the threshold to go green.

Promotion is not free. A frontier check written to prove a gap exists is often
a *presence* check — `workspace.editor_affordances` originally passed if three
`<div>`s carried the right `data-` attributes, which is fine as evidence of
absence and worthless as evidence of a working feature. Promoting it meant
rewriting the scenario to assert the overlay paints the editor's real text, the
handle actually resizes from the keyboard, and `console.log` actually reaches
the pane. **Tightening a scenario on promotion is the one edit the "never edit
a scenario to make it pass" rule permits** — it raises the standard rather than
lowering it — and it is the moment to do it, because after promotion the check
is `required` and nobody looks again.

`required: false` stops a frontier item blocking an unrelated contribution. It
must **not** stop it blocking the task sent to build it, or a cell writes one
file, the composite still clears threshold and it is told the work is done — it
did exactly that for four rounds. So a capability named in `--must` (or in
`$BENZENE_INSTRUCTION`) is required *for that run* whatever the spec says, and
`harness.scoping` runs the checker against itself both ways to prove the two
behaviours still differ.

It runs those arms against `harness.scoping_probe`, a capability carrying
`fixture: true` that always fails. A fixture is scaffolding, not a capability:
it is skipped unless `--only` names it, so it never reaches the report, the
composite, `--next` or the capability count. It exists because the self-test
needs a target whose verdict is known in advance, and it used to borrow a real
frontier capability for that — which worked until someone built the feature and
the self-test reported a regression in flags that had not regressed. **Do not
point `harness.scoping` at a real capability again**, and do not add a second
fixture without the same justification.

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
- `docs/guides/` — company interview-loop guides, `layout: doc`, each naming the
  rounds and linking the bank questions that map to them. They assert a named
  third party's hiring process, so `content.guides_honest` requires each one to
  carry the provenance note (commonly reported, not sourced from the company,
  subject to change). Soften the claims or delete a guide; never delete the note.
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

`agents/organisation.yaml` is the Benzene **organisation** for this site: one
purpose (the CEO seat, the only thing never chartered) and six offices founded
in order by the record, never by a clock. It lives here, not in the framework
repo, because it is **about this site** — `harness.agent_manifest` fails when it
drifts from the guardrail.

- **CTO** — `agents/frontend-harness.yaml`, the one office written by hand,
  because its verifiers are not an opinion: they run `harness/check_harness.py`.
  With no instruction, `bza` discovers work from `--next` (one deficit at a
  time), so what each cell works on is defined by the guardrail's output, not
  by anyone's prompt. Founded at the start.
- **COO** — founded when the CTO is `healed` (one verified build). From then
  on a human instruction (`-i "..."`) goes to the COO, which answers with a
  plan whose steps name **active offices only** — enforced by a JSON schema that
  `_refresh_coo_contract` rewrites at every founding — and dispatches them in
  waves. The COO has no write tools; it never does the work itself. Its plans
  land on the board: `board.kind: local` writes `.benzene/board/board.md`;
  `{kind: linear, team: <KEY>, project: <name>, api_key_env: LINEAR_API_KEY}`
  moves the same steps through a Linear team's workflow states.
- **CMO, CXO, CFO, CIO** — no genome file here. Each is chartered from the
  purpose by `bza` at founding (built-in charter, specialised by the evolver
  model), with the file-pattern verifiers in `organisation.yaml`. CXO founds on
  `--milestone launch`; CFO and CIO on `--metric` values, real or from the
  evaluation panels (`--evaluate cxo` is Product Hunt, `--evaluate cio` Shark
  Tank).

```bash
export OPENROUTER_API_KEY=sk-or-...
bza agents/organisation.yaml .                       # the CTO takes what --next finds
bza agents/organisation.yaml . -i "..."               # through the COO once founded
bza agents/organisation.yaml . --status --graph       # offices, treasury, .benzene/graph.html
```

The genome also carries a **`decider`** role (TypeSafe's `typesafe/jev-1.13`), a
structured-decision model that answers at `/api/alpha/decisions` with a typed,
calibrated, *deterministic* verdict — the same input gives the same answer, and
it cannot return a value outside the set you give it. Benzene uses it two ways:
to **route** an instruction to one of the six skills (a constrained choice,
~$0.00002, no off-list hallucination), and as a **guardrail decision gate**. The
`author-playbook` skill declares one: `not-ai-slop`, a choice between `ai_slop`
and `genuine`. A playbook Jev calls slop drops the guardrail score below
threshold, so the cell rewrites and the next draft is measured again — the slop
verdict becomes false because the prose improved, not because the check was
loosened. The gate is scoped to that prose skill (via the SKILL.md guardrail
override, which merges without dropping the inherited verifiers); code skills
carry no gate. Add more gates the same way — `score` gates (a 0..1 rubric) suit
"is this diagram clear enough to post?"-style quality bars.

Two honest limits, from TypeSafe's own guidance: **calibration is not
correctness** — a confident verdict can still be wrong, so a Jev gate is *one*
signal folded into the composite beside the file verifiers, never the only one,
and its penalty is scaled by the model's confidence. And Jev only *decides*;
the LLM still writes and reasons. It runs only when the genome has a `decider`
role and is skipped offline, so the guardrail suite stays hermetic. See
[TypeSafe's System One announcement](https://typesafe.ai/blog/introducing-system-one-models-and-jev)
and [a patterns reference](https://gist.github.com/pjburnhill/adf8d28efcad9df037bfdece178ef965).

`agents/skills/` holds the six operating skills (`author-question`,
`author-plan`, `author-playbook`, `fix-site-health`, `fix-functional`,
`build-capability`). `AgentManifest.load` resolves `skills: [name]` against
`agents/skills/<name>/SKILL.md` first, so genome and skills travel together;
`skills_dir: skills` in the organisation file points chartered offices at the
same folder.

**These are not the Agent Skills under `/skills/`.** Those are content
(`ui-atom`, `server-ssr`) published for learners, listed in
`docs/_data/skills.yml`, and offered by the download widget. Keeping the cell's
operating instructions out of that registry is deliberate — `agents/skills/` is
never synced into it. The engine itself is
[`grvpanchal/benezene-agent`](https://github.com/grvpanchal/benezene-agent).

One behaviour to know about. When a discovery verifier itself fails to run
— on the first live run `check_harness.py --sync --next` **timed out at 900s**
— the timeout becomes the instruction ("fails its checks: timed out"). The
cell cannot fix a timeout; it fixed something real nearby instead (broken
Liquid in `begin-boilerplate.html`), the verifier finished on its re-run, and
the cell was credited with a verified build — which is what **founded the
COO**. A real improvement and a real founding, but not causally linked, and
`--must` cannot bind here because no capability was named. Treat a verifier
timeout as an infrastructure event, not a task: if it recurs, raise
`timeout_s` on `verify:capabilities` or find what made the browser suite slow,
rather than reading the founding as evidence the office earned it.

That timeout has since been measured: the exact command that died runs in
**53 seconds alone**, and both times it exceeded its limit a second Chromium
suite or Jekyll build was running in parallel on this container. So the rule is
**never run `check_harness.py` or the functional suite while a `bza` run is in
progress** — the cell's verifiers are that same checker, and contention turns
a one-minute verify into a timeout that becomes the cell's next task.

The leak that made contention compound is now fixed at the source, so a killed
run no longer poisons the next one. `check_harness.py` starts the functional
runner in its own process group (`start_new_session`) and, on its 900s timeout,
SIGKILLs the whole group — a timed-out run's Chromium dies with `node` instead
of being orphaned. `harness/functional/run.mjs` closes the browser on
SIGTERM/SIGINT, and **sweeps at startup**: any run group reparented to init
(PPID 1) — an orphaned `run.mjs` node and every `headless_shell` under it, left
by a run the OS killed outright — is SIGKILLed by process group before this run
launches its own. The sweep never touches its own group, so a concurrent suite
is safe. The manual `pkill headless_shell` between runs is no longer needed;
it stays a valid emergency stop.

Two numbers to distrust. The COO's default objective is **throughput 20**, a
volume metric, which is exactly what a weak model games by opening twenty thin
steps; the plan guardrail (steps must be complete instructions the office can
verify alone) is what stands against that, and `skill repair` on `orchestrate`
is how it improves. And the treasury will read **burning** while cells cost
more than `value_usd: 0.05` per verified build — that is the CFO's honest
reading at these model prices, not a fault to tune away.

## Doc reviewer subagent

A custom subagent at `.claude/agents/doc-reviewer.md` reviews terminology docs (`docs/{ui,server,state}/*.md`) for readability + learner engagement, with durable memory in `.github/doc-review/state.json`. **Before opening a PR that touches any doc under those paths**: list the modified docs, invoke the `doc-reviewer` subagent on each (one at a time so memory updates are resumable), commit any fixes it applies, and surface in the PR description any issues it reports. The agent is allowed to fix small issues in place (paragraph rewrites, stale headings, missing transitions) but stops and reports for anything structural or that would touch >40 lines. See `.github/doc-review/README.md` for the schema and workflow.
