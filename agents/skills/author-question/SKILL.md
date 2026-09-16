---
name: author-question
description: Author ONE new practice question for the training site — its page, worked solution and runnable workspace files. Adds content to the question bank; does not implement site features or repair the site (see build-capability and fix-functional).
triggers: [write a question, author a question, new practice question, add a question, more questions, question bank, bank.formats, bank.layer_coverage, bank.difficulty_mix, bank.topic_coverage, harness.skill_coverage, write N more]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
guardrail:
  required_patterns: ["docs/practice/", "Confidence:"]
  max_chars: 14000
  # Verifiers are inherited from the manifest on purpose. A skill that declares
  # its own `verifiers:` REPLACES the manifest's list (GuardrailSpec.merged uses
  # exclude_unset), which would drop the site-wide `verify:capabilities` and
  # leave bza with nothing to discover work from.
---
You add one question at a time to the question bank of a Jekyll training site
that lives in the workspace (`docs/` is the site, `harness/capabilities.yml` is
the spec every page is measured against). Read the spec before you write.

## Procedure

1. `read_workspace_file harness/capabilities.yml` — the `question_schema` and
   `enums` sections are the contract. Never guess an enum value.
2. `read_workspace_file docs/practice/memoized-selector.md` (a `coding`
   example), `docs/practice/atom-boundaries.md` (`quiz`),
   `docs/practice/design-embeddable-widget.md` (`system-design`) or
   `docs/practice/harness-atom-guardrail.md` (`harness`) — whichever format you
   were asked for. Match its structure and voice.
3. `list_workspace_files docs/practice` first and pick a slug nobody used. The
   slug names the subject (`presentational-vs-container`), never the format
   (`quiz-sample-1` is rejected).
4. **If you are writing `format: coding`, write the three workspace files
   FIRST** — `starter.js`, `solution.js`, `tests.js` — before the page. The
   guardrail executes `solution.js` against `tests.js`; a coding question
   without them is not a question and the task fails. Writing them first also
   means the page describes code that exists.
5. Write `docs/practice/<slug>.md`. Write nothing else.
6. Answer with every path you wrote and one line on what the question teaches.

**If you cannot write runnable tests for the idea you had, choose a different
idea — do not downgrade it to `format: quiz` to avoid the work.** The bank needs
coding questions; a quiz labelled as one it is not makes the gap invisible.

## Front matter, exactly

```yaml
---
title: <sentence case, no trailing period>
layout: question
slug: <must equal the filename without .md>
format: quiz | coding | ui-coding | system-design | harness
difficulty: easy | medium | hard
layer: ui | server | state
topics: [<one or more slugs from docs/_data/topics/*.csv>]
skill: <a folder that exists under skills/, e.g. ui-atom, state-selectors>
minutes: <integer 5..120>
frameworks: [react, vue]      # ui-coding only, at least two
summary: <one line for the bank listing>
---
```

`skill:` must name a real directory: check with
`list_workspace_files skills`. A skill that does not exist fails the guardrail.

## Body, by format

**quiz** — two to four `{% include quiz.html id="<slug>-N" question="..."
options="A|...;;B|...;;C|...;;D|..." correct="B" explanation="..." %}` blocks.
Options are separated by `;;`, never a single `;`. The explanation says why the
other answers are wrong, not just why the right one is right.

**coding** — a problem statement, then `{% include code-playground.html %}`,
then `## Solution` with **at least two** `### Approach` subsections, then
`## Trade-offs`.

**ui-coding** — a problem statement, then `## Solution` with at least two
`### Approach` subsections showing the component in each declared framework,
then `## Trade-offs`.

**system-design** — the brief and its constraints, then `## Solution` with the
shape, the decisions and a table of what you would measure, then
`## Trade-offs`.

**harness** — the exercise, its deliverables, then `## Eval`, then
`## Trade-offs`. This format also needs an `eval:` block in the front matter:

```yaml
eval:
  rubric:
    - "<a measurable statement, not an opinion>"
    - "<another one>"
  threshold: 0.75      # a number in (0, 1]
```

Every format ends with a `## Related` section linking the concept pages under
`../ui/<slug>.html`, `../server/<slug>.html` or `../state/<slug>.html`. Check
the file exists with `list_workspace_files docs/<layer>` before linking it: a
link to a page that does not exist fails the guardrail.

## The workspace files (`format: coding` only)

Three ES modules under `docs/practice/workspace/<slug>/`:

- `starter.js` — the signature, a doc comment stating the contract, and a body
  that throws `new Error("not implemented")`.
- `solution.js` — the reference implementation. Same exports as `starter.js`.
- `tests.js` — `export default async function tests(subject) { ... }` returning
  an array of `{name, pass, message}` objects, at least four of them. It must
  be dependency-free: it runs in a browser and under Node with no bundler.

`solution.js` is executed against `tests.js` by the guardrail. If it does not
pass, the question does not exist. Write the tests to fail loudly: a `message`
that shows the expected and the actual value, never just "failed".

## Rules

- One question per task. Do not edit `docs/_data/questions.yml` — it is
  generated.
- **Liquid runs before Markdown, so it parses inside code fences too.** Close
  every `{% include ... %}` with `%}` and never a bare `}` — an unterminated tag
  fails the build of the *entire site*, not just your page. If a code example
  contains `{{` (JSX `style={{ ... }}`, a template literal in braces), wrap that
  fenced block in `{% raw %}` and `{% endraw %}`.
- Check your facts against this repository's conventions before stating them.
  React 19 removed `defaultProps` on function components; Vitest removed
  `vi.requireActual`; no template needs `--legacy-peer-deps`. A confidently
  wrong explanation passes every automated check and teaches the wrong thing.
- Never invent a topic slug, a skill name or a concept page path.
- No `TODO`, `TBD`, `lorem ipsum` or "coming soon" anywhere on the page.
- Prose in `## Solution` and `## Trade-offs` explains the *why*. A code dump
  with no reasoning fails review even when it passes the tests.

## Answer format, always

- `Wrote: docs/practice/<slug>.md`, and one `Wrote:` line per workspace file.
  For `format: coding` that is four lines, never one.
- One line on what the question teaches.
- `Confidence: <low|medium|high>` as the last line.
