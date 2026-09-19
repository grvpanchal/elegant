# The capability guardrail

`harness/` is the executable definition of what the Frontend AI Harness
training site must be able to do. It exists so that "is the site finished?" is
a number, not an opinion — and so an agent working on the site is corrected by
the same measurement a reviewer would use.

Feature parity is benchmarked against [GreatFrontend](https://www.greatfrontend.com/):
question formats, an in-browser workspace with tests, worked solutions with
multiple approaches, study plans, playbooks and progress tracking. The
*content* is ours — the Universal Frontend Architecture split into UI, Server
and State — and so is one capability GreatFrontend has no equivalent for: every
unit of practice is also an Agent Skill, and `harness`-format exercises ship
their own eval.

## Run it

```bash
python3 harness/check_harness.py                 # full report, exit 1 on failure
python3 harness/check_harness.py --json          # machine-readable
python3 harness/check_harness.py --next          # the single highest-priority deficit
python3 harness/check_harness.py --group workspace
python3 harness/check_harness.py --only bank.schema
python3 harness/check_harness.py --scope incremental --changed docs/practice/x.md
python3 harness/check_harness.py --sync          # regenerate docs/_data/*.yml first
python3 harness/check_harness.py --build         # also run `jekyll build` (slow)
```

Only PyYAML is required. `node` runs the executable workspace check and the
Playwright functional suite; `bundle exec jekyll` builds the site those browser
scenarios run against (built once per process and shared). Each is skipped with
an explicit "skipped" line when it is not installed, never silently passed over.

```bash
node harness/functional/run.mjs --site <built-dir>   # the browser suite on its own
```

`--next` is what an agent loop consumes: one failing capability, why it exists,
the current measurement, and the specific files to fix.

## Scope: one contribution, or the whole site

Two axes narrow a run, and both exist because an author must not be judged by
work that is not theirs:

* `--scope incremental` drops the **cumulative** capabilities — the volume
  targets like "twelve quiz questions" that no single contribution can close.
  `--scope cumulative` keeps only those.
* `--changed <paths>` restricts every per-page capability to the files named.
  Registry, plan and volume checks stay site-wide, because those are properties
  of the site, not of a page.

An agent's per-task verifier is therefore
`--sync --scope incremental --changed {touched}`, while the site-wide target it
works toward is the unscoped `--next`.

## How a capability is scored

Each check returns a score in `[0, 1]` — usually a ratio such as "6 of 8
questions have a solution". The report is:

```
score      = weighted mean of every check
passing    = every `required: true` check is at 1.0  AND  score >= 0.95
```

A check marked `required: false` (shown with a `~` in the report) drags the
composite down but never blocks on its own — those are the capabilities that
should improve over time rather than gate a change.

## Editing the spec

`harness/capabilities.yml` holds the thresholds; `harness/check_harness.py`
holds one function per check id, registered with `@check("<id>")`. Adding a
capability means adding both — the spec entry so the intent is reviewable, and
the function so the intent is measurable. A spec entry with no implementation
fails loudly rather than passing by default. Then run
`python3 harness/gen_readme.py` to refresh the table below.

## The contract a question must satisfy

One markdown file per question under `docs/practice/`, front matter:

```yaml
---
title: Memoize a derived selector
layout: question
slug: memoized-selector     # must equal the filename
format: coding              # quiz | coding | ui-coding | system-design | harness
difficulty: medium          # easy | medium | hard
layer: state                # ui | server | state
topics: [selectors, state]  # at least one, from docs/_data/topics/*.csv
skill: state-selectors      # must exist as skills/<slug>/SKILL.md
minutes: 25                 # 5..120
frameworks: [react, vue]    # ui-coding only, at least 2
summary: One line for the bank listing.
---
```

`format: coding` additionally needs `docs/practice/workspace/<slug>/`:

| File | Role |
|---|---|
| `starter.js` | what the learner sees in the editor |
| `solution.js` | the reference implementation, run under Node by `workspace.tests_pass` |
| `tests.js` | `export default async (subject) => [{name, pass, message?}, ...]` |

`format: harness` additionally needs an `eval:` block with a `rubric:` list of
at least two measurable items and a `threshold:` in `(0, 1]`.

After adding or editing a question:

```bash
python3 scripts/sync-questions-registry.py    # regenerates docs/_data/questions.yml
```

## The capabilities

### content

The reference layer under `docs/{ui,server,state}/`. Practice without a concept page to fall back on is a quiz, not training.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `content.concept_docs` | 2 | yes | cumulative | `45` | A reference layer is the prerequisite for practice: >= `45` concept docs under docs/{ui,server,state}. |
| `content.concept_quiz` | 2 | yes | cumulative | 90% | At least 90% of concept docs must carry an inline MCQ (recall before practice). |
| `content.skill_registry_sync` | 1 | yes | incremental | all | docs/_data/skills.yml must list exactly the skills/<slug>/SKILL.md folders that exist. |
| `content.company_guides` | 2 | yes | cumulative | `4` | Company-specific preparation guides, each naming the loop a company runs and the questions in the bank that map to it. |
| `content.guides_honest` | 2 | yes | incremental | all | A company guide asserts a named third party's hiring process. It must say on the page that the loop is the commonly reported shape, not sourced from or endorsed by the company, and subject to change — the caveat is the first thing edited out for looking untidy. |
| `content.house_rules` | 2 | yes | incremental | all | No page may teach a claim this repo already knows is false — see house_rules. |

### question_bank

The five practice formats and the registry that makes them findable. This is the GreatFrontend parity surface: quiz, coding, UI coding, system design — plus our fifth, `harness`.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `bank.registry` | 3 | yes | incremental | all | docs/_data/questions.yml must exist and match docs/practice/*.md one-for-one. |
| `bank.schema` | 3 | yes | incremental | all | Every question's front matter must satisfy question_schema (missing keys and bad enums are failures). |
| `bank.formats` | 3 | yes | cumulative | `quiz` >= 12, `coding` >= 12, `ui-coding` >= 10, `system-design` >= 6, `harness` >= 6 | All five practice formats must be populated to the per-format minimum. |
| `bank.difficulty_mix` | 1 | yes | cumulative | `1` | Every format needs at least `1` question at each difficulty (easy/medium/hard). |
| `bank.layer_coverage` | 2 | yes | cumulative | `8` | Each architecture layer (ui/server/state) needs >= `8` questions. |
| `bank.topic_coverage` | 2 | no | cumulative | 60% | At least 60% of the topics in docs/_data/topics/*.csv must be practised by a question. |
| `bank.slug_quality` | 1 | yes | incremental | all | A slug is a permanent URL. `quiz-sample-1` passes every other check and tells nobody what the page contains. |
| `bank.distinct` | 1 | no | incremental | 60% | No two questions in the same format may overlap more than 60% on title and summary — a volume target with no distinctness check rewards padding. |
| `bank.unique_slugs` | 1 | yes | incremental | all | Question slugs must be unique and equal to their filename. |

### solutions

A question without a worked solution is homework. Every solved format ships one, with more than one approach and an honest account of what each costs.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `solutions.present` | 3 | yes | incremental | all | Every coding / ui-coding / system-design question needs a '## Solution' section. |
| `solutions.approaches` | 2 | yes | incremental | `2` | Coding questions need >= `2` '### Approach' subsections — GreatFrontend's 'multiple approaches' promise. |
| `solutions.tradeoffs` | 1 | yes | incremental | all | Every solution needs a '## Trade-offs' or '## Complexity' section, not just working code. |
| `solutions.no_placeholders` | 1 | yes | incremental | all | No TODO / TBD / lorem ipsum / 'coming soon' in a published question. |

### workspace

The in-browser workspace and the executable contract behind it. `tests.js` runs in the learner's browser and under Node in this checker, so "solved" means the same thing in both.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `workspace.runner` | 3 | yes | incremental | all | docs/assets/js/playground.js must exist and export a runner that executes a solution against its tests. |
| `workspace.include` | 1 | yes | incremental | all | docs/_includes/code-playground.html must exist so a question page can embed the workspace. |
| `workspace.wired` | 2 | yes | incremental | all | Every coding question must embed the playground with a ```js starter and a ```js tests block. |
| `workspace.tests_pass` | 4 | yes | incremental | all | Executable: each coding question's reference solution must pass its own tests under Node. A question whose tests do not pass is not a question. |
| `workspace.editor_affordances` | 2 | yes | incremental | all | The workspace must have syntax highlighting, a resizable editor and a console pane, so a learner debugging with console.log does not have to open devtools. |
| `workspace.framework_runtime` | 3 | yes | incremental | all | A coding question with a runtime.json must render components in the browser: its starter fails its own component tests and its reference solution passes them. |

### frameworks

The promise the six `chota-*` templates make: the same exercise in more than one framework.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `frameworks.multi` | 2 | yes | incremental | `2` | Every ui-coding question needs starter code for >= `2` frameworks (the six chota-* templates are the promise). |
| `frameworks.known` | 1 | yes | incremental | all | Framework ids on a question must exist in enums.framework and map to a templates/chota-* project. |

### plans

Study plans with declared time budgets, checked two ways — against the questions they contain, and against what their name claims.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `plans.registry` | 3 | yes | cumulative | `4` | docs/_data/plans.yml needs >= `4` plans (1 week, 1 month, 3 months, and a curated shortlist). |
| `plans.items_resolve` | 3 | yes | incremental | all | Every item in a plan must resolve to an existing question slug or concept doc path. |
| `plans.duration_fit` | 2 | yes | incremental | 25% | A plan's summed minutes must be within +/-25% of its declared budget, or the schedule is a lie. |
| `plans.horizon_fit` | 2 | yes | incremental | all | A plan named for a horizon must declare a budget that horizon could plausibly mean — see plan_horizons. |
| `plans.pages` | 2 | yes | incremental | all | Every plan in the registry needs a page under docs/plans/ using layout: plan. |

### playbooks

The long reads. Measured for depth so none of them decays into a stub.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `playbooks.count` | 2 | yes | cumulative | `4` | docs/playbooks/ needs >= `4` guides (interview, system design, state, agent harness). |
| `playbooks.depth` | 1 | yes | incremental | `800` | A playbook under `800` words is a stub, not a guide. |

### progress

Per-learner progress in `localStorage`. No account, no backend, no telemetry — and a certificate when a plan is finished.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `progress.tracker` | 2 | yes | incremental | all | docs/assets/js/progress.js must persist per-question completion in localStorage (static site, no backend). |
| `progress.wired` | 1 | yes | incremental | all | The practice index and every plan page must render the progress include. |
| `progress.certificate` | 1 | no | incremental | all | docs/plans/certificate.md closes the loop on a finished plan. |

### discovery

Filtering, search and navigation. A capability nobody can find does not exist.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `discovery.index` | 2 | yes | incremental | all | docs/practice/index.md must render the bank with filters for format, difficulty, layer and topic. |
| `discovery.nav` | 1 | yes | incremental | all | Site nav must link Practice, Plans and Playbooks — capabilities nobody can find do not exist. |
| `discovery.search` | 1 | yes | incremental | all | docs/assets/js/practice-index.js must filter/search the question registry client-side. |

### health

Front matter, links, alt text, heading order and the Jekyll build. The floor everything else stands on.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `health.front_matter` | 2 | yes | incremental | all | Every page under docs/ needs title + layout front matter. |
| `health.internal_links` | 2 | yes | incremental | all | No broken internal markdown links. |
| `health.alt_text` | 1 | yes | incremental | all | Every image needs alt text. |
| `health.heading_order` | 1 | no | incremental | all | Heading levels must not skip (h2 -> h4), which breaks screen-reader outlines. |
| `health.liquid_syntax` | 3 | yes | incremental | all | An unterminated Liquid tag fails the build of the entire site, not just its own page. |
| `health.build` | 3 | no | incremental | all | `bundle exec jekyll build` must succeed; skipped when the gems are not installed. |

### functional

A real Chromium against the built site (`harness/functional/run.mjs`). Everything above proves the site is well *formed*; this group proves it *works* — the Run button executes the question's tests, the quiz grades, the filter filters, progress survives a reload. This is the group that removes the human from the healing loop, because a functional capability no longer needs anyone to click it.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `functional.playground` | 4 | yes | incremental | all | In a real browser: a coding question's starter must FAIL its tests, the reference solution must PASS, and passing must record progress. |
| `functional.quiz` | 3 | yes | incremental | all | A quiz must grade a wrong answer as wrong, a right answer as right, and show its explanation. A quiz that does not grade is a bullet list. |
| `functional.filters` | 2 | yes | incremental | all | Filters must narrow the bank, compose with each other, clear, and show an empty state. A bank nobody can narrow is a list. |
| `functional.progress` | 2 | yes | incremental | all | Completion must persist across a reload and move the counter. Progress that does not survive a reload is not progress. |
| `functional.plans` | 2 | yes | incremental | all | A plan page must render its steps from the registry and track progress. If the layout breaks, the page renders an empty promise. |
| `functional.console_clean` | 3 | yes | incremental | all | No uncaught exception and no broken local asset on any key page — either one silently disables a capability while every static check still passes. |
| `functional.keyboard` | 2 | yes | incremental | all | The workspace must be reachable and operable from the keyboard. A site that teaches accessibility cannot need a mouse. |

### account

Accounts on a site with no server. greatfrontend.com has real ones; this is static Jekyll on GitHub Pages, so an account here is a named profile on this device, with progress namespaced to it and a portable export — a smaller promise, kept exactly. It is not authentication, and the page says so. A real identity provider goes behind `registerProvider`, and `account.provider_seam` proves that abstraction actually works rather than merely existing.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `account.honest_copy` | 2 | yes | incremental | all | The account page must keep saying a profile is not authentication, and account.js must keep the registerProvider seam. |
| `account.profiles` | 3 | yes | incremental | all | Two profiles must keep separate progress, and the signed-in one must survive a reload. Sharing a laptop must not mean sharing a record. |
| `account.portable` | 3 | yes | incremental | all | A profile and its progress must survive an export / wipe / import round trip — with no server to sync to, that IS the account following you. |
| `account.guest_progress` | 2 | yes | incremental | all | Accounts arrived after progress did. Signing in and out must not strand work done before a profile existed. |
| `account.provider_seam` | 2 | yes | incremental | all | A third-party provider must be swappable through registerProvider, with progress following its identity. An abstraction nobody has exercised is not a seam. |
| `account.oauth_pkce` | 3 | yes | incremental | all | Signing in must be a real Authorization Code + PKCE flow against a configured issuer — response_type=code, an S256 challenge, state and nonce — not a typed name. |
| `account.widget_painted` | 2 | yes | incremental | all | Every page that renders the account widget must load the script that paints it. The nav includes the widget on every layout; a layout that skips identity-scripts.html shows Sign in and Sign out side by side, and the home page did. |
| `account.verified_credentials` | 3 | yes | incremental | all | Signing in must cost a credential the site did not invent — checked by the provider, never by this page — and a wrong password must be refused out loud. A name you type is not a credential. |
| `account.token_verified` | 3 | yes | incremental | all | The ID token's signature must be checked against the issuer's JWKS and its iss/aud matched. Decoding a JWT's payload is base64, not authentication, and a client that only decodes accepts an identity anyone can type. |
| `account.session_expiry` | 2 | yes | incremental | all | An ID token past its `exp` must be refused, and the page must say why — a sign-in button that silently does nothing is worse than no button. |
| `account.no_client_secret` | 2 | yes | incremental | all | A static site is a public client: everything it ships is readable. A client secret, API key or private key committed under docs/ is published, not configured — PKCE exists so none is needed. |
| `account.identity_sync` | 3 | yes | incremental | all | Progress recorded under a verified identity must be there on another device. Credentials that do not carry progress leave the learner exactly where a named local profile already left them. |

### frontier

Parity targets the site does not have yet. Declared and measured so the gap stays visible, `required: false` so they never block a contribution, and ordered after everything required so the cluster grows into them one at a time instead of all at once. A frontier check is a real measurement — when someone builds the feature it turns green without being rewritten.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `workspace.theming` | 2 | no | cumulative | all | The site must follow prefers-color-scheme in both directions, workspace included. A learner practising at night gets a white rectangle, and that is where they stop. |
| `workspace.shortcuts` | 2 | no | cumulative | all | Ctrl/Cmd+Enter must run the question's tests from the editor, and the page must say so. Every editor a candidate has used runs on that chord. |
| `bank.curated_lists` | 2 | no | cumulative | `2` | Curated named lists (the 'top N questions' shape) are how most people start, and are not the same thing as a time-boxed study plan: no schedule, just an ordered set worth doing first. |
| `landing.hero` | 3 | no | cumulative | all | The first screen of the home page must be about practising frontend interviews — a headline that says so, a primary CTA that lands on the working question bank, and 'no sign-up required' because it is true — at 1440px and at 390px with no sideways scroll. Today the first screen sells a CLI. |
| `landing.proof` | 2 | no | cumulative | all | The home page must state how much there is to practise — the question total and the count per format — and every number must equal the bank as rendered, so a claim cannot outlive the content it describes. |
| `landing.surfaces` | 2 | no | incremental | all | The home page must link a student to every practice surface — the bank, plans, playbooks, company guides and the account page — each with a line saying what it is for. A surface the front door does not mention does not exist to a first visit. |
| `landing.workspace_preview` | 3 | no | cumulative | all | The home page must carry a live workspace for one real question — editor enabled, Run executes that question's own tests — so a student can try the product before reading about it. A screenshot of an editor is a promise; a Run button is proof. |

### harness

The axis GreatFrontend does not have: every unit of practice is also an Agent Skill, and every `harness` exercise ships its own eval with a numeric threshold.

| check | weight | required | scope | threshold | fails when |
|---|---|---|---|---|---|
| `harness.skill_map` | 3 | yes | incremental | all | Every question names a `skill:` that exists under skills/<slug>/SKILL.md — practice and agent capability are the same artefact. |
| `harness.eval_spec` | 3 | yes | incremental | all | Every harness-format question must declare an `eval:` block with rubric items and a numeric threshold. Teaching people to build guardrails means shipping one per exercise. |
| `harness.skill_coverage` | 2 | no | cumulative | 50% | At least 50% of the Agent Skills in skills/ should be exercised by a question. |
| `harness.scoping` | 3 | yes | incremental | all | The scoping flags must keep discriminating: out-of-scope work must not fail a contribution, and a capability the task was dispatched to fix must. A regression in either is silent and expensive. |
| `harness.agent_manifest` | 2 | yes | incremental | all | agents/organisation.yaml must hold the purpose, a COO, and a CTO whose genome names only skills that exist and keeps its verifiers on harness/check_harness.py with --changed. An organisation that drifts off the guardrail is one nobody is measuring. |
| `harness.docs` | 1 | yes | incremental | all | harness/README.md must document every capability, and any prose file stating a capability count must state the real one. |

## Using it as an agent verifier

The checker is designed to be the executable half of an agent's guardrail. In a
Benzene manifest it is two lines — one that finds the work, one that judges it:

```yaml
guardrail:
  verifiers:
    - type: command
      name: verify:capabilities          # the site-wide target: discovers the next deficit
      command: [python3, harness/check_harness.py, --sync, --next]
      required: false                    # no single contribution can close a volume target
      cwd: "."
    - type: command
      name: verify:contribution          # what this task actually wrote
      command: [python3, harness/check_harness.py, --sync, --scope, incremental, --changed, "{touched}"]
      cwd: "."
```

The agent's loop is then: `--next` produces the instruction, the agent writes
files, the checker runs again, and its output becomes the correction message on
failure. Nothing in that loop needs a human, and nothing in it needs the model
to be right about whether it was right.

`manifests/frontend-harness-openrouter.yaml` in the
[benzene-agent](https://github.com/grvpanchal/benezene-agent) repository is the
genome that does this, running entirely on free models.
