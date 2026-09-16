---
name: build-capability
description: Implement a capability the training site declares but does not have yet — a frontier item whose Playwright scenario already fails with a specific description of what is missing.
triggers: [frontier, capability, not built yet, never built, implement, build the feature, framework runtime, runtime.json, editor affordances, syntax highlighting, console pane, resizable, company guides, playground runner, workspace.framework_runtime, workspace.editor_affordances, content.company_guides, this is growth]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
guardrail:
  required_patterns: ["Confidence:"]
  max_chars: 16000
  # Verifiers are inherited from the manifest on purpose: a skill that declares
  # its own `verifiers:` REPLACES the manifest's list, which would drop the
  # browser suite this skill exists to satisfy.
---
A capability in the `frontier` group is something the site's guardrail already
describes and measures, and the site does not do yet. Its scenario in
`harness/functional/run.mjs` is failing right now, and the failure message is
the specification — it was written to say what is missing, not just that
something is.

This is different from `fix-functional`. There, something worked and broke.
Here, it never worked, and the work is to build it.

It is also different from `author-question`. A frontier instruction often
mentions questions — "a coding question should be able to declare a framework
runtime" — but the work is **in the site's machinery**, not in the bank. Adding
a `runtime.json` to a question without building the runner that reads it
declares a capability that does not exist, and the guardrail will reject it.

## Procedure

1. Read the failing capability in `harness/capabilities.yml` — its `why`, its
   `owns` (the files you are allowed to touch) and its `requires` (what must
   already be green).
2. Read its scenario in `harness/functional/run.mjs`. **The scenario is the
   contract.** It names the exact selectors, files and behaviour it looks for.
3. `read_workspace_file` every file in `owns` before writing any of them.
4. Build the smallest thing that makes the scenario's assertions true for real.
5. Answer with one line per file and one line on what now works that did not.

## The rule that matters most

**Never edit the scenario, and never edit `harness/`.** Changing the
measurement so it stops failing is the one move that is always wrong here, and
it is the move that will feel most efficient when the feature is hard. If you
believe a scenario asks for the wrong thing, say so in your answer and change
nothing — that is a decision for a person.

## Constraints you cannot design around

- The site is **static Jekyll on GitHub Pages**. There is no server, no build
  step for site JavaScript, and no package manager at the repo root. Everything
  ships as plain ES modules served as files.
- No bundler, no TypeScript, no framework for the site's own scripts. If a
  capability seems to need one, it needs a CDN module and a dynamic `import()`
  instead.
- Every `localStorage` read and write goes in a try/catch. Private mode and
  blocked site data must degrade, not throw.
- A new script must not break `functional.console_clean`: no uncaught errors,
  no 404 on a local asset, on any page.
- Liquid runs before Markdown, so a code sample containing `{{` needs
  `{% raw %}` around its block, and every `{%` closes with `%}`.

## Answer format, always

- One `Wrote: <path> — <what it does>` line per file.
- One line naming the capability you closed and what a learner can now do.
- `Confidence: <low|medium|high>` as the last line.
