---
title: Write a guardrail for the ui-atom skill
layout: question
slug: harness-atom-guardrail
format: harness
difficulty: medium
layer: ui
topics: [atom, component, story, accessibility]
skill: ui-atom
minutes: 40
summary: Turn "this is a good atom" into a script an agent cannot argue with, then run an agent against it.
eval:
  rubric:
    - "The checker exits non-zero on at least three of the four seeded bad atoms."
    - "The checker exits zero on the reference atom in templates/chota-react-redux/src/ui/atoms/Button."
    - "Every failure message names the file and the rule that failed."
    - "No rule depends on an LLM judgement — each one is a parse, a count or a file-existence test."
  threshold: 0.75
---

An agent will happily produce a component that *looks* like an atom. The only
way to keep it honest is to hand it a script that decides.

Write `check_atom.py` (or `check-atom.mjs` — your choice of runtime) that takes
a path to an atom folder and exits 0 only when every rule below holds.

**Rules to encode**

1. The folder contains `<Name>.component.*`, `<Name>.style.*` and
   `<Name>.stories.*`. A missing story is a failure: an atom nobody can see in
   isolation is not reusable.
2. The component file imports nothing from `src/state`, `src/containers` or a
   store package. Atoms take props and emit events; store access is the
   boundary violation that matters.
3. The component has no `useEffect`/`onMounted`/`ngOnInit` that performs I/O
   (`fetch`, `axios`, `http`).
4. Interactive atoms expose an accessible name: a `<button>`, `<a>` or `<input>`
   in the template must have text content, `aria-label`, or an associated
   `<label>`.
5. The file is under 120 lines. Not a law of nature — a tripwire. Atoms that
   grow past it are usually molecules that have not admitted it yet.

**Then run it.** Point an agent (Claude Code, `bza`, or your own loop) at a
deliberately broken atom and let your script's output be the correction
message. Record how many attempts it took to go green.

## Deliverables

- The checker script.
- Four broken atoms, one per rule from 1–4, in a `fixtures/` folder.
- A short log: the agent's first attempt, what the checker said, and the attempt
  that passed.

## Eval

This exercise is scored by the rubric in this page's front matter, at a
threshold of **0.75**. Read it before you start — it is the spec, and it is
deliberately the same shape as a `guardrail:` block in a Benzene manifest or a
rubric in any agent harness.

The point of the threshold is that it is *below* 1.0. A guardrail that only
accepts perfection never ships; one that accepts anything teaches nothing. 0.75
here means "three of four rules bite, and the messages are actionable" — enough
to change an agent's behaviour, loose enough to survive a rule you got wrong.

## How to think about it

The rules split into two kinds, and mixing them up is the usual mistake:

**Structural rules** (1, 5) are file-system facts. They cost nothing, never
give a false negative, and catch the laziest failures. Write these first.

**Semantic rules** (2, 3, 4) need you to look inside the source. Resist the
urge to reach for a full parser on the first pass — a regex over import lines
gets rule 2 right in nearly every real file, and you will learn more from
watching *which* atoms it misjudges than from a day spent wiring up a TypeScript
AST walker. Upgrade the rule when a false positive actually bites you.

Rule 4 is the one that will not survive regexes for long, because "has an
accessible name" is a property of the rendered DOM, not the source text. That is
the honest boundary of a static checker, and finding it is half the exercise:
past that line you need to render the component and query it, which is what the
templates' Vitest setups already do.

## Trade-offs

A static checker is fast, deterministic and runs on every save; a rendering
checker is slower, flakier and correct about more things. Ship the static one,
and let the rules it cannot express become the first tests in the story file.

The deeper trade is between strictness and adoption. Every rule you add is a
rule someone will work around — rule 5 especially, which an agent can satisfy by
moving code into a sibling file. Watch for that in the log you keep: an agent
gaming a threshold is the most useful signal a guardrail ever gives you, because
it tells you the rule measured the proxy instead of the thing.

## Related

- Reading: [Atom](../ui/atom.html) · [Story](../ui/story.html) · [Accessibility](../ui/accessibility.html)
- Agent Skill: `ui-atom`
