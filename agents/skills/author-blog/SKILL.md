---
name: author-blog
description: Write one measured, engaging blog post for the Frontend AI Harness site — a short, opinionated read (>= 400 words) on frontend architecture, terminology, or frontend in the age of AI, that ends by sending the reader into the practice bank.
triggers: [blog, blog post, article, write a post, blog.count, blog.depth, blog.engagement, marketing post]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
guardrail:
  required_patterns: ["docs/blog/", "Confidence:"]
  max_chars: 16000
  # Verifiers are inherited from the office on purpose. Declaring `verifiers:`
  # here REPLACES the office's list (GuardrailSpec.merged uses exclude_unset),
  # which would drop the `blog` capability check the office is judged by.
  #
  # A deterministic Jev gate on prose quality. A blog post is public marketing a
  # person will read and judge the product by; "generic AI slop" is the exact
  # failure the file checks (schema, word count, links) cannot catch. Jev returns
  # the same verdict for the same text every time, so a post it calls slop heals
  # — the cell rewrites — rather than shipping filler under the site's name. Runs
  # only when the genome carries a `decider` role; skipped offline.
  decisions:
    - name: not-ai-slop
      question: "Is this blog post specific, opinionated writing grounded in the Universal Frontend Architecture, or generic AI slop — cliches, hedging, and advice so vague it could describe any topic?"
      type: choice
      criteria:
        ai_slop: "cliche-ridden, vague, padded; lists options without committing; could be about any framework or any topic; no concrete detail, number, named technique or real failure mode"
        genuine: "specific and concrete; takes a position and defends it; names a real technique, trade-off, or failure mode an expert would recognise; grounded in this site's UI/Server/State architecture"
      reject: [ai_slop]
---
A blog post is a short, opinionated read — the marketing and SEO surface of the
site. It teaches one idea well, argues a position rather than hedging, and ends
by sending the reader to the exact practice questions that drill it. Every post
is measured by the site's own guardrail (the `blog` capability group): front
matter schema, engagement hooks, word count, distinctness, and the Jev slop
gate above. Write for a real reader, not for the checker — but pass the checker.

## Procedure

1. `list_workspace_files docs/blog` — do not duplicate an existing post's topic
   or its title. `read_workspace_file docs/_data/blog.yml` to see what is taken.
2. `list_workspace_files docs/practice` and `read_workspace_file
   docs/_data/questions.yml` — a post earns its place by sending the reader to
   specific practice, so collect the real slugs you will link in
   `related_practice`. Every one must exist, or `blog.engagement` fails.
3. Write `docs/blog/<slug>.md` with the front matter and shape below.

## The page

```markdown
---
title: "<the post's title>"
layout: post
slug: <filename without .md>
date: <YYYY-MM-DD>
author: The Elegant team
category: <one of: terminology | architecture | ai-and-frontend | career | interview>
tags: [<lower-case>, <at least two>, <no spaces per tag>]
description: <one line; it is the card summary on /blog and the meta description>
cover: <a path under /assets/img/ that exists — reuse a diagram, do not invent one>
reading_minutes: <integer; roughly your body word count / 200>
related_practice: [<question-slug>, <question-slug>]
---

<An opening that states the reader's real situation or the confusion the post
clears up. Not "in this post we will cover X".>

## <a section per stage of the idea>

<Concrete. Name the trade-off, then say which side you take and why. At least
two `##` headings so the table of contents has something to build.>

### <sub-points where they help>
```

The layout renders the byline, reading time, cover, table of contents (from your
`##`/`###` headings), a "keep reading" block, and the practice CTA automatically
from the front matter and the includes — you do not write those. You write the
prose and the front matter; the engagement furniture is the layout's job.

## Rules

- **400 words minimum** of body prose (code and headings do not count). A post
  under that is a note, not a read — `blog.depth` fails it.
- **At least two `##` headings**, so the table of contents is real.
- **At least two `tags`**, lower-case, no spaces inside a tag (they drive the
  filterable index).
- **A `cover` that exists.** Reuse an image under `docs/assets/img/`; never
  invent a path — a broken hero is worse than none.
- **At least one `related_practice` slug, and every slug must resolve** to a real
  question in `docs/_data/questions.yml`. This is the CTA that makes the post part
  of the product instead of a dead end.
- **`category` must be one of the five** in the schema; a new category is a spec
  change, not a post's decision.
- No `TODO`, `TBD`, or "coming soon". No "in conclusion" filler.
- Take a position. "It depends" is only allowed if you then say what it depends
  on and which way you would go.
- On an AI topic, be concrete about what the model is and is not good at — vague
  optimism reads as slop and the Jev gate will fail it.

## Answer format, always

- `Wrote: docs/blog/<slug>.md`
- The body word count you are claiming, and the `related_practice` slugs you
  linked (so the verifier's failure, if any, is easy to read).
- `Confidence: <low|medium|high>` as the last line.
