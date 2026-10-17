---
title: "Anatomy of a SKILL.md"
layout: lesson
course: agent-skills
slug: anatomy-of-a-skill
term: ui/atom
skill: ui-atom
practice: atom-boundaries
description: "Read skills/ui-atom/SKILL.md section by section: the frontmatter that decides when it loads, and the body that decides what the agent does."
insight: "A good SKILL.md is a checklist the agent can follow and you can check. Every rule in ui-atom — no data fetching, primitive props, an accessible name — is a boundary of the Atom term, which is exactly why it can be tested."
---

## The frontmatter decides when it loads

Every skill in this repository is one folder with one `SKILL.md`, written to the
Agent Skills standard. Open `skills/ui-atom/SKILL.md` and the first thing you
read is YAML:

```yaml
--- # excerpt
name: ui-atom
description: Atomic-design guidance for UI Atoms — the smallest single-purpose
  building blocks (buttons, inputs, icons, labels). Use when authoring or
  reviewing components under ui/atoms, components/atoms, or when deciding
  whether a component belongs at the atom level.
when_to_use: Creating or reviewing Atom-level components; ...
paths:
  - "**/ui/atoms/**/*.{jsx,tsx,vue,js,ts}"
  - "**/atoms/**/*"
---
```

`name` matches the folder. `description` says what the skill is, then when to
use it — the trigger is written into the sentence. `when_to_use` lists the
situations. `paths` are globs: the skills README says the agent loads the
`SKILL.md` when they match the file you are editing.

## The body decides what the agent does

The body follows the spine all 45 skills here share (a few add a section, such
as a decision table):

1. **What is an Atom?** — one paragraph, distilled from the term doc.
2. **Key Principles** — three: single responsibility, framework-agnostic props,
   design-token integration.
3. **Best Practices** — a DO list and a DON'T list.
4. **Code Patterns** — *Recommended*, then *Avoid*: a Button that holds
   `useState` and calls `fetch`, beside the version where the parent owns the
   logic and the atom takes `loading` as a prop.
5. **Related Terminologies**, then **Quality Gates**, then a `Source:` line
   pointing at `/docs/ui/atom.md`.

The DON'T list is the part an agent most needs, because each line is a
boundary of the [Atom]({{ '/ui/atom.html' | relative_url }}) term: "Fetch data
inside atoms", "Hardcode colors/spacing — use theme tokens", "Create atoms that
render other atoms (that's a molecule)". The term doc's common mistakes — atoms
that are too complex, inconsistent prop interfaces, ignored accessibility — are
the same boundaries seen from the other side.

The `Source:` line matters more than it looks. When the skill and the doc
disagree, you know which one the skill was distilled from, and which to fix.

## Read it like a reviewer

The Quality Gates are five questions you can put to any diff:

- Single responsibility maintained
- Props are simple primitives or callbacks
- No data fetching or business logic
- Accessibility attributes included
- Uses design tokens from theme

Sort them. "No data fetching" is a script: search the component for `fetch`,
`axios` or `http`. "Accessibility attributes included" is partly a script.
"Single responsibility" is judgement. The scriptable gates become your
guardrail later in this course; the rest stay with you in review.

## Use it on the next atom

Before you hand an agent an atom, make the skill part of the contract:

```text
Read skills/ui-atom/SKILL.md before writing code.
When you finish, list each Quality Gate and quote the line of your
change that satisfies it. If a gate cannot be met, say which and why.
```

Then take the atom-boundaries quiz: if you cannot place a component on the
right side of the atom line, you cannot judge whether the agent did.
