---
title: Guardrail a docs site's links
layout: question
slug: harness-link-checker
format: harness
difficulty: easy
layer: server
topics: [links, seo, page]
skill: server-links
minutes: 25
summary: The smallest useful guardrail — write a link checker, point an agent at a site with broken links, and measure how many rounds it takes to go green.
eval:
  rubric:
    - "The checker exits non-zero and names every broken link with its source file and line."
    - "A link to an anchor that does not exist on the target page is reported."
    - "External (http/https) links are skipped, not silently counted as passing."
    - "Running the checker twice on an unchanged site produces identical output."
  threshold: 0.75
---

Start a harness with the easiest possible check, because the point of the first
one is to learn the loop, not to solve a hard problem.

Write `check_links.py` (or `check-links.mjs`) that walks a folder of markdown
pages and exits 0 only when every internal link resolves.

**Rules to encode**

1. A markdown link `[text](target)` whose target is relative must resolve to a
   file that exists. Pages are authored as `.md` and served as `.html`, so
   `../ui/atom.html` resolves against `ui/atom.md`.
2. A target ending in `/` resolves against that directory's `index.md`.
3. A fragment (`page.html#section`) must match a heading on the target page,
   slugified the way the site generator does it.
4. `http:`, `https:`, `mailto:` and template expressions are skipped — and the
   report says how many were skipped, so "no failures" cannot mean "nothing was
   checked".
5. Links inside fenced code blocks are not links.

**Then run it.** Break four links in four different ways — a typo, a moved
page, a dead anchor, a link that only exists inside a code sample — and let an
agent fix them with your checker's output as the only instruction.

## Deliverables

- The checker script.
- A fixture site with the four broken links.
- A log: what the checker said, what the agent changed, and how many rounds.

## Eval

Scored by the rubric in this page's front matter at a threshold of **0.75**.
Read it first — it is the spec.

Rule 4 is the one that carries the lesson. A link checker that quietly skips
everything it does not understand reports success on a completely broken site,
and you will believe it. Making the skip count visible is the difference
between a guardrail and a decoration.

## How to think about it

Rules 1 and 2 are twenty lines and will catch most real breakage. Write them,
run them, and look at what they say about a site you already believe is fine —
that first report is the most informative thing that will happen in this
exercise.

Rule 5 is where naive implementations fail, and the failure is instructive: a
regex over the whole file finds links inside code samples, reports them as
broken, and now your agent "fixes" a code example. A guardrail's false
positives are more expensive than its misses, because an agent cannot tell one
from the other — it just tries to satisfy whatever you printed.

Rule 3 is the first one that needs you to model the generator's behaviour
rather than the file system, which is the moment a checker stops being generic
and starts being about your site. That is normal and fine; write down the
slugification rule you assumed, because it will be wrong once.

## Trade-offs

Checking anchors requires parsing every target page, which turns an O(links)
check into O(pages). On a site of a few hundred pages that is still under a
second; at ten thousand it wants an index built once and reused.

Skipping external links keeps the check fast, offline and deterministic — and
means a dead external link ships. That is the right default: an external
checker belongs in a nightly job, not in the loop that gates a change, because
its failures are not caused by the change.

## Related

- Reading: [Links](../server/links.html) · [SEO](../server/seo.html)
- Playbook: [The agent harness](../playbooks/agent-harness.html)
- Agent Skill: `server-links`
