---
name: fix-functional
description: Repair a training-site capability that a real browser proved broken — the playground runner, quiz grading, bank filtering, progress persistence, plan rendering, page errors or keyboard access.
triggers: [functional, browser, playwright, playground, runner, quiz grading, filter, progress, localStorage, keyboard, console error, functional.playground, functional.quiz, functional.filters, functional.progress, functional.plans, functional.console_clean, functional.keyboard]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
guardrail:
  required_patterns: ["Confidence:"]
  max_chars: 12000
  # Verifiers are inherited from the manifest on purpose: a skill that declares
  # its own `verifiers:` REPLACES the manifest's list, which would drop the
  # browser suite this skill exists to satisfy.
---
A scenario in `harness/functional/run.mjs` drove a real browser against the
built site and an assertion failed. The failure message names the scenario and
what it expected. Your job is to make the behaviour true, not to make the
assertion pass.

## The difference that matters

Every other check on this site reads files. These ran the site. So the defect is
in behaviour, and the three places behaviour lives are:

- `docs/assets/js/*.js` — the runner (`playground.js`), progress
  (`progress.js`), bank filtering (`practice-index.js`), the certificate, and
  the quiz handler at the bottom of `main.js`.
- `docs/_includes/*.html` and `docs/_layouts/*.html` — the markup and the
  `data-*` attributes the JavaScript binds to. A renamed attribute breaks the
  behaviour with no error anywhere.
- `docs/practice/workspace/<slug>/*.js` — a question's own starter, solution
  and tests.

**Never edit `harness/`.** The suite is the standard. Changing a scenario so it
stops failing is the one move that is always wrong here, and it is the move that
will feel most efficient.

## Procedure

1. Read the failure message and find the matching scenario in
   `harness/functional/run.mjs`. It states, in code, exactly what must be true.
2. `read_workspace_file` every file in the surface that scenario drives, in
   full, before changing anything. The bug is usually a mismatch *between* two
   files — an attribute the markup emits and the script does not read — so
   reading only one of them wastes the attempt.
3. Make the smallest change that makes the behaviour true.
4. `write_workspace_file` the complete corrected file. The tool replaces the
   file, so write back everything you read.
5. Answer with one line per file and one line naming the mismatch you found.

## Reading the common failures

| Message | Where to look first |
|---|---|
| `the starter passed its own tests` | `workspace/<slug>/starter.js` — it must throw or return nothing, or the tests assert nothing |
| `all tests passed but the question was not marked done` | the `playground:results` listener in `progress.js`, and the `data-slug` on the playground element |
| `filtering by X hid every row` | the `data-<facet>` attribute on the rows vs the `data-filter` value in `practice-index.js` |
| `completion did not survive a reload` | the read path in `progress.js` — a write with no matching read looks fine until a reload |
| `the plan page rendered N steps` | `docs/_layouts/plan.html` and whether `docs/_data/plans.yml` has a matching `slug` |
| `HTTP 404: /assets/js/...` | a script tag pointing at a file that is not there |
| `Tab from the editor reached ...` | DOM order in `docs/_includes/code-playground.html` |

## Rules

- Change behaviour, never the test.
- Do not add a library, a build step or a framework. Everything here is plain
  ES modules served as static files, and it must stay that way.
- Do not "fix" a scenario by deleting the feature it covers.
- Guard every `localStorage` read and write in try/catch — private mode and
  blocked site data must degrade, not throw.
- If the failure is genuinely in a question's content rather than in the site's
  machinery, say so and fix the question's workspace files instead.

## Answer format, always

- One `Fixed: <path> — <what changed>` line per file.
- One line: the mismatch that caused it.
- `Confidence: <low|medium|high>` as the last line.
