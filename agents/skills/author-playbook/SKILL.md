---
name: author-playbook
description: Write a long-form playbook for the Frontend AI Harness site — an interview, system design, state or agent-harness guide of at least 800 words.
triggers: [playbook, guide, long read, interview guide, playbooks.count, playbooks.depth, write a guide]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
guardrail:
  required_patterns: ["docs/playbooks/", "Confidence:"]
  max_chars: 16000
  # Verifiers are inherited from the manifest on purpose. A skill that declares
  # its own `verifiers:` REPLACES the manifest's list (GuardrailSpec.merged uses
  # exclude_unset), which would drop the site-wide `verify:capabilities` and
  # leave bza with nothing to discover work from.
  #
  # A deterministic Jev gate on prose quality: a playbook is 800+ words a person
  # will read, so "generic AI slop" is a real failure the file checks cannot
  # catch. Jev returns the same verdict for the same text every time, so a
  # failing playbook heals (the cell rewrites) rather than shipping filler. Runs
  # only when the genome carries a `decider` role; skipped offline.
  decisions:
    - name: not-ai-slop
      question: "Is this playbook genuine, specific writing, or generic AI slop — cliches, padding, and advice so vague it could describe any topic?"
      type: choice
      criteria:
        ai_slop: "cliche-ridden, vague, padded; could be about anything; no concrete detail an expert would recognise"
        genuine: "specific and concrete; a named technique, a real failure mode, a number or example only someone who did the work would write"
      reject: [ai_slop]
---
A playbook is the long read: how to prepare for something, how to reason about
it out loud, and what the common failure looks like. The guardrail measures
length (800 words of body prose, excluding code and headings) because a
playbook that is really a list of links teaches nothing.

## Procedure

1. `list_workspace_files docs/playbooks` — do not duplicate an existing guide.
2. `list_workspace_files docs/practice` and `read_workspace_file
   docs/_data/questions.yml` — a playbook earns its place by sending the reader
   to specific practice, so collect the slugs you will link.
3. Write `docs/playbooks/<slug>.md`.

## The page

```markdown
---
title: <the guide's name>
layout: doc
slug: <filename without .md>
description: <one line; it is the card summary on /playbooks>
order: 20
---

# <title>

<An opening that states the problem the reader actually has. Not "this guide
covers X" — start with the situation.>

## <a section per stage of the thing you are explaining>

<At least 150 words each. Concrete. Name the trade-off, then say which side
you would take and why.>

## Practice

- [<question title>](../practice/<slug>.html) — <one line on what it drills>
```

## Rules

- 800 words minimum of prose. Code blocks and headings do not count toward it.
- Every internal link must resolve. Check with `list_workspace_files` first;
  a link to a page that does not exist fails the guardrail.
- No `TODO`, `TBD` or "coming soon".
- Write for someone who has read the concept pages and is now trying to do the
  thing. Skip the definitions; they are elsewhere on the site.
- Opinions are welcome and should be argued. "It depends" without saying what
  it depends on is filler.

## Answer format, always

- `Wrote: docs/playbooks/<slug>.md`
- The body word count you are claiming.
- `Confidence: <low|medium|high>` as the last line.
