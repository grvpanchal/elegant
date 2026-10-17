---
title: "Write the guardrail before the skill"
layout: lesson
course: agent-skills
slug: guardrail-first
term: ui/story
skill: ui-story
practice: harness-atom-guardrail
description: "Start from 'how would I know this was wrong?', turn an atom's rules into a script, and let the skill become the checklist that passes it."
insight: "Prose is easy to produce, so people write the skill first and end up with a standard nobody can run. Write the check first — a missing story file is a file-existence test — and the skill becomes the checklist that makes the check pass on the first try."
---

## The order people get wrong

The [agent harness playbook]({{ '/playbooks/agent-harness.html' | relative_url }})
names the mistake: writing the skill first feels productive because prose is
easy, and it produces a harness where the standard lives in a paragraph nobody
can run. Start instead from one question — *how would I know this was wrong?* —
and write that check. For a component the playbook lists three: does the folder
have a story file, does the source import from the store, is the interactive
element reachable by keyboard.

## Why the story file is rule one

A [Story]({{ '/ui/story.html' | relative_url }}) is "a component development
snapshot" — one visual state with precise props and data, or in the doc's
words, "unit tests for the eyes". Every atom in the templates ships one:
`templates/chota-react-redux/src/ui/atoms/Button/` holds
`Button.component.jsx`, `Button.style.css`, `Button.stories.js` and
`Button.test.jsx`.

The atom guardrail question makes a missing story a failure, because "an atom
nobody can see in isolation is not reusable". It is also the cheapest check
there is. The question splits its rules in two:

- **Structural** — the three files exist; the component is under 120 lines.
  File-system facts: they cost nothing and never give a false negative. Write
  these first.
- **Semantic** — no import from `src/state`, `src/containers` or a store
  package; no `useEffect`, `onMounted` or `ngOnInit` doing I/O; every button,
  link and input has an accessible name.

Stories keep paying later. The `ui-story` skill's quality gates ask for a story
per meaningful state — error, empty, loading — with `args` rather than inline
props, and the accessibility gate in the next lesson renders each component
*from its stories*. The story is what turns a component into something a script
can render.

## A first checker

```js
// node check-atom.mjs src/ui/atoms/Button
import { readdirSync, readFileSync } from "node:fs";
const dir = process.argv[2].replace(/\/$/, ""), name = dir.split("/").pop(), files = readdirSync(dir), fail = [];
for (const kind of ["component", "style", "stories"])
  if (!files.some((f) => f.startsWith(`${name}.${kind}.`))) fail.push(`${dir}: missing ${name}.${kind}.* (rule 1)`);
const src = files.find((f) => f.startsWith(`${name}.component.`));
if (src && /from\s+["'][^"']*(\bstate\/|containers\/|redux|@ngrx|pinia)/.test(readFileSync(`${dir}/${src}`, "utf8")))
  fail.push(`${dir}/${src}: atom imports from the store (rule 2)`);
fail.forEach((line) => console.log(line));
process.exit(fail.length ? 1 : 0);
```

Every message names the file and the rule, as the question's rubric requires,
and no rule asks a model for an opinion. A regex over import lines is the right
first pass; upgrade it when a false positive actually bites. The accessible-name
rule will not survive regexes for long — it is a property of the rendered DOM,
which is where the templates' Vitest setups take over.

## Now write the skill, then run the loop

With the check in place, the skill is just the checklist that makes it pass
first time. Point an agent at a broken atom:

```text
Make `node check-atom.mjs src/ui/atoms/Badge` exit 0.
Do not edit check-atom.mjs. Paste its output after every attempt.
```

Record how many attempts it takes, and watch for gaming: the 120-line rule can
be met by moving code into a sibling file. When that happens, the rule measured
the proxy instead of the thing.
