---
name: author-blog
description: Produce ONE high-quality, patterns.dev-grade blog post for the Frontend AI Harness site — rich prose PLUS runnable code examples PLUS a themed inline-SVG diagram — by dividing the work across a cluster of specialised roles and healing until the blog guardrail passes.
triggers: [blog, blog post, article, write a post, rewrite blog, blog.code, blog.diagram, blog.depth, blog.engagement]
tools: [list_workspace_files, read_workspace_file, write_workspace_file]
# The cluster. Each stage runs on its own model role (agents/organisation.yaml):
# writer drafts prose and assembles, coder writes the examples, illustrator draws
# the SVG. Read-only stages feed the next; only `assemble` writes the file, then
# the blog guardrail decides and the cluster heals.
stages:
  - name: outline
    role: writer
    instruction: >
      Decompose the topic into 3-5 sections. Per section, decide whether it needs a
      runnable code example and where the ONE diagram best explains the mechanism.
      List the real related_practice slugs from docs/_data/questions.yml. When
      rewriting, first read the existing docs/blog/<slug>.md and KEEP its title,
      slug, date, category and cover. Output a section plan naming the code and
      diagram slots.
  - name: prose
    role: writer
    instruction: >
      Write the explanatory prose for each section from the outline: specific,
      opinionated, 400+ words of body total, interleaved with clear slots that say
      [CODE: ...] and [DIAGRAM: ...] where those belong. Name real techniques,
      trade-offs and failure modes.
  - name: code
    role: coder
    instruction: >
      For each [CODE] slot, write a runnable, idiomatic fenced code block with a
      language tag (```js / ```jsx / ```css). At least TWO in total. Each must
      illustrate a real point the prose makes - never decorative. Return the blocks
      keyed to their slots.
  - name: diagram
    role: illustrator
    instruction: >
      For the [DIAGRAM] slot, produce ONE inline, themed SVG wrapped in
      <figure class="blog-figure" data-blog-diagram> ... <figcaption>. Use the
      Elegant palette (orange #fe854c/#c2571a, blue #155799/#1e6bb8, teal #157878,
      neutral #606c71/#819198, border #dce6f0). Give the svg a viewBox, role="img",
      <title> and <desc>. It must actually draw the flow/architecture with
      rect/path/text/circle; animate a sequence with <animateMotion> where it
      explains motion. No empty placeholder.
  - name: assemble
    role: writer
    writes: true
    instruction: >
      Compose the outline, prose, code blocks and diagram into
      docs/blog/<slug>.md, replacing the [CODE]/[DIAGRAM] slots with the real
      blocks and the SVG figure, with correct front matter (keep the original
      title and slug when rewriting). write_workspace_file the result. It is then
      checked against the blog guardrail (blog.code, blog.diagram, blog.depth,
      blog.engagement) and the Jev slop gate; if any fails, fix the missing part
      and write again.
guardrail:
  required_patterns: ["docs/blog/", "```", "<svg", "Confidence:"]
  max_chars: 32000
  # Verifiers are inherited from the office (the `blog` capability group), so a
  # post is not "done" until blog.code, blog.diagram, blog.depth, blog.engagement,
  # blog.schema and blog.distinct all pass. Do NOT declare verifiers here.
  #
  # The Jev gate now judges richness, not just specificity: prose with no worked
  # code or no diagram is slop by this standard, and the gate says so, so the
  # cluster heals (adds what is missing) rather than shipping a wall of text.
  decisions:
    - name: not-ai-slop
      question: "Is this a rich, patterns.dev-grade post — specific prose interleaved with runnable code and a diagram that actually explains a flow — or is it generic AI slop: vague prose, no worked code, no real figure, advice that could describe any topic?"
      type: choice
      criteria:
        ai_slop: "wall of prose; no runnable code example, or code that is trivial/decorative; no diagram or an empty placeholder SVG; vague, hedging, could be about any framework; nothing an expert would recognise as concrete"
        genuine: "specific and opinionated; interleaves at least two runnable, correct code examples with the prose; carries a themed inline-SVG diagram that actually depicts the flow or architecture; names real techniques, trade-offs and failure modes"
      reject: [ai_slop]
---
A blog post here is held to the standard of patterns.dev and greatfrontend.com: it
**shows, it does not just tell.** That means every post interleaves three things —
explanatory prose, runnable code examples, and a themed diagram that depicts the
flow or architecture. A wall of prose, however specific, fails the guardrail
(`blog.code`, `blog.diagram`) and the Jev slop gate. Do not write one.

## The cluster: divide the post into deliverables

Do not write a blog as one undifferentiated draft. Divide it into deliverables,
each of which the cluster can produce and verify on its own. When run as a benzene
cluster these map to separate model roles (see agents/organisation.yaml); when run
by one cell, produce each part deliberately and in this order:

1. **Outline** (a planning pass): decompose the topic into 3–5 sections. Decide, per
   section, whether it needs a **code example** and where the **one diagram** best
   explains the mechanism. Collect the real `related_practice` slugs from
   `docs/_data/questions.yml`. Output: a section plan naming code and diagram slots.
2. **Prose** (the `writer` role): the explanatory text — specific, opinionated,
   interleaved with the slots the outline named. 400+ words of body prose.
3. **Code** (the `coder` role): the runnable code examples — at least **two**
   fenced blocks with a language tag (` ```js `, ` ```jsx `, ` ```css `), correct
   and idiomatic, each illustrating a real point the prose makes. Not decorative.
4. **Diagram** (the `illustrator` role): **one inline, themed SVG** that draws the
   flow or architecture (see the theme below). It must actually draw shapes — a
   `<figure class="blog-figure" data-blog-diagram>` wrapping an `<svg>` with
   `<rect>`/`<path>`/`<text>`/`<circle>` and a `<figcaption>`. An empty or
   placeholder SVG fails `blog.diagram`.
5. **Assemble & heal**: compose the parts into `docs/blog/<slug>.md`, then check
   against the blog guardrail. If any check or the Jev gate fails, fix the missing
   part (add code, add/repair the diagram, deepen the prose) and re-check. This is
   the self-heal loop — the post is not done until the standard passes.

## The Elegant diagram theme

The diagram must match the site. Use these palette tokens, and make it dark-mode
legible (avoid pure #fff fills; prefer strokes on a transparent/`#f3f6fa` ground):

- primary / accent: `#fe854c` (orange), `#c2571a` (deep orange text)
- structure / containers: `#155799` and `#1e6bb8` (blues)
- motion / highlight: `#157878` (teal)
- neutral text & arrows: `#606c71`, `#819198`; borders: `#dce6f0`
- Give the `<svg>` a `viewBox` (not fixed width), `role="img"`, and a `<title>`
  + `<desc>` for accessibility. Animate a flow with `<animateMotion>` where it
  genuinely explains a sequence (an event travelling, data flowing) — this is the
  "explainer", the site's substitute for a video: a diagram that moves.

## The page

```markdown
---
title: "<the post's title>"
layout: post
slug: <filename without .md>
date: <YYYY-MM-DD>
author: The Elegant team
category: <terminology | architecture | ai-and-frontend | career | interview>
tags: [<lower-case>, <at least two>]
description: '<one line; quote it if it contains a colon>'
cover: <an existing path under /assets/img/>
reading_minutes: <integer; body words / 200, rounded>
related_practice: [<question-slug>, <question-slug>]
---

<Opening: the reader's real situation.>

## <section>
<prose> ...then a themed <figure class="blog-figure"> with an inline <svg>.

## <section>
<prose> ...then a ```js code block that shows the point.
```

## Rules (each is a guardrail check — failing one fails the task)

- **≥ 2 runnable code blocks** with a language tag (`blog.code`). Correct, idiomatic,
  illustrating a real point — never decorative.
- **≥ 1 themed inline SVG** that actually draws a flow/architecture (`blog.diagram`).
- **≥ 400 words** of body prose, code and headings excluded (`blog.depth`).
- **≥ 2 tags, a cover that exists, reading_minutes, ≥ 1 resolving `related_practice`**
  (`blog.engagement`).
- Distinct title and description from every other post (`blog.distinct`).
- No `TODO`/`TBD`/"coming soon". Take positions; "it depends" only with the "on what".

## Answer format, always

- `Wrote: docs/blog/<slug>.md`
- code blocks: N, diagram: yes/no, body word count, `related_practice` slugs.
- `Confidence: <low|medium|high>` as the last line.
