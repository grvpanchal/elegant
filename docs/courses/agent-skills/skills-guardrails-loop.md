---
title: "A skill, a guardrail and a loop"
layout: lesson
course: agent-skills
slug: skills-guardrails-loop
term: ui/atomic-design
skill: ui-atomic-design
practice: harness-link-checker
description: "The three parts of an agent harness, what each one is for, and why a shared vocabulary is what lets a skill find the right files."
insight: "A skill says how the work is done, a guardrail measures whether it was, and the loop feeds the measurement back as the next instruction. Without an executable check, a skill is a paragraph nobody can run."
---

## The gap is not the model

The [agent harness playbook]({{ '/playbooks/agent-harness.html' | relative_url }})
opens with the problem you will meet on day one: an agent that writes frontend
code is easy to start and hard to trust. The gap between the two is not model
quality. It is whether anything in your setup can tell, without a human reading
the diff, that the work is right. That thing is a harness, and it has three parts.

## Three parts, three jobs

- **The skill is the procedure.** It says which files to read first, what the
  output must look like and what is forbidden. It is a runbook, not a
  personality: a competent new hire could follow it without asking a question.
- **The guardrail is the measurement.** It runs after the agent finishes and
  returns a number and a list of defects. It must be *executable* — a parser, a
  count, a compiler, a test runner — because a guardrail that asks a model
  whether the work is good inherits the blind spots of the model that did it.
- **The loop joins them.** The guardrail's output becomes the next message the
  agent sees: not "try again", but the actual failing assertion or the actual
  missing front-matter key. Agents are far better at fixing a named defect than
  at avoiding an unnamed one.

## Why the vocabulary comes first

A skill only helps if it is applied to the right code, and that needs a codebase
organised in words a skill can name. Every `chota-*` template keeps the same
layout — `src/ui/atoms`, `molecules`, `organisms`, `templates`, `skeletons` —
and the `ui-atomic-design` skill describes the five levels as "a shared
vocabulary and folder-structure convention". Its quality gates include "no
logic skipping levels (atoms don't fetch data)".

The [Atomic Design]({{ '/ui/atomic-design.html' | relative_url }}) doc insists
the levels are a mental model, not a workflow: you do not build every atom
before the first molecule. For a harness, the important half of that sentence is
"shared language". You cannot write a guardrail for "good components". You can
write one for "files under `ui/atoms` import nothing from `src/state`", because
the level is now a folder and the rule is now a path.

## Close your first loop today

Start with the smallest useful check, the one in the
[link checker question]({{ '/practice/harness-link-checker.html' | relative_url }}):
walk a folder of markdown, resolve every relative link, and exit non-zero with
the source file and line of each broken one. Break four links on purpose — a
typo, a moved page, a dead anchor, a link inside a code sample — then give the
agent nothing but the checker:

```text
Run `python3 check_links.py docs/` and fix every link it reports.
Change nothing else. After each round, paste the full report.
Stop after 3 rounds and tell me what is still failing.
```

Count the rounds. Then check the report also says how many links it skipped,
because a checker that quietly skips what it does not understand reports
success on a completely broken site — and you will believe it.
