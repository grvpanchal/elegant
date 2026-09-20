---
title: "The portfolio that gets interviews shows depth, not a wall of clones"
slug: the-portfolio-that-gets-interviews
layout: post
date: 2026-06-18
author: The Elegant team
category: career
tags: [career, portfolio, interview, projects]
description: 'A dozen tutorial to-do apps say less than one project built to a real standard — tested, accessible, deployed, and explained. Depth on a few things beats breadth across many, because depth is what a reviewer cannot fake-detect.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [design-search-experience, accessible-combobox, data-table-sort]
---

A portfolio of a dozen tutorial to-do apps says almost nothing, because a reviewer
has seen a thousand of them and knows they were followed, not built. One project
taken to a *real* standard — tested, accessible, deployed, and explained — says far
more, because that standard is exactly what cannot be faked by following along. The
hiring signal is **depth, not breadth**: not "how many things did you touch" but "how
well did you finish one." A reviewer scanning portfolios is looking for evidence that
you would meet the team's bar, and that evidence lives in the parts of a project that
tutorials skip.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="pf2-t pf2-d" class="blog-figure__svg">
  <title id="pf2-t">Many shallow clones signal little; one deep project signals the hiring bar</title>
  <desc id="pf2-d">Left: many small identical project tiles, all shallow. Right: one larger project annotated with tested, accessible, deployed, and explained.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">breadth</text>
  <g fill="#fff4ec" stroke="#fe854c" stroke-width="1.5"><rect x="40" y="45" width="55" height="35" rx="4"/><rect x="105" y="45" width="55" height="35" rx="4"/><rect x="170" y="45" width="55" height="35" rx="4"/><rect x="40" y="90" width="55" height="35" rx="4"/><rect x="105" y="90" width="55" height="35" rx="4"/><rect x="170" y="90" width="55" height="35" rx="4"/></g>
  <text x="132" y="150" text-anchor="middle" fill="#819198" font-size="9">six clones, all shallow</text>
  <line x1="320" y1="18" x2="320" y2="175" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">depth</text>
  <rect x="390" y="45" width="180" height="80" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="480" y="72" text-anchor="middle" fill="#157878" font-size="10">one real project</text>
  <g fill="#157878" font-size="8" text-anchor="middle"><text x="480" y="92">✓ tested  ✓ accessible</text><text x="480" y="106">✓ deployed  ✓ explained</text></g>
  <text x="480" y="150" text-anchor="middle" fill="#819198" font-size="9">shows the bar you build to</text>
</svg>
<figcaption>Six clones read as "followed a tutorial six times." One project finished to a real standard reads as "builds to a bar" — which is the thing being hired.</figcaption>
</figure>

## The four things that signal depth

A project reads as senior when it carries the parts tutorials omit. **Tests** show
you protect behaviour; **accessibility** shows you build for everyone; a **live
deployment** shows you can ship; and a **README that explains the decisions** shows
you can reason. A reviewer checks for these fast:

```text
Repo has a tests/ dir with real assertions        → protects behaviour
Tab through the deployed app — keyboard works      → builds accessibly
There's a live URL, not just a repo                → can actually ship
README explains WHY, not just "npm install"        → can reason about trade-offs
```

Any one of these is more signal than a sixth clone; all four on one project is a
strong yes.

## The README is where the reasoning lives

Code shows *what* you did; the README is your only channel for *why*, and "why" is
what a reviewer wants from a senior candidate. Write it as an engineer explaining
decisions to a colleague, not as install instructions:

```markdown
## Decisions
- SSR for the first page (SEO matters for a public catalogue), CSR after hydration.
- Server data in a query cache, not Redux — it needs caching/refetch, not ownership.
- Trade-off: chose optimistic updates for the cart; rollback tested in cart.test.js.

## Known limits
- No pagination yet; the list is capped at 100. Next step: cursor-based paging.
```

Those few lines demonstrate trade-off reasoning, honesty about limits, and knowledge
of the very concepts an interview probes — before anyone opens the code.

## Depth over breadth, and one flagship

The winning shape is a small portfolio with one *flagship* project built end to end,
plus perhaps one or two smaller focused pieces (a genuinely accessible combobox, a
data table with real sorting) that each demonstrate one skill deeply. Cut the
tutorial clones — they dilute the signal rather than adding to it. And make the
flagship something you can *talk about* in the interview, because "walk me through a
project" is where a deep one pays off and a shallow one collapses. Depth is legible
and unfakeable; breadth is neither. The design-search-experience, accessible-combobox,
and data-table-sort exercises are exactly the kind of finished-to-a-standard pieces a
portfolio is stronger for, each one small enough to polish fully and rich enough to
discuss.
