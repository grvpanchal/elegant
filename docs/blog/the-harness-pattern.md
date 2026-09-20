---
title: "The harness pattern: make 'is it done' a number, not an opinion"
slug: the-harness-pattern
layout: post
date: 2026-08-01
author: The Elegant team
category: ai-and-frontend
tags: [ai, guardrails, harness, quality]
description: 'A harness is the set of checks that decide whether work is good enough, run automatically. Build one and "is this done" stops being a meeting and becomes an exit code — which is the only way autonomous or AI-heavy work stays honest.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 6
related_practice: [harness-link-checker, harness-bundle-budget, harness-skill-eval]
---

"Is this done?" is usually answered by an opinion in a meeting or a review
comment, which means it is answered differently by different people on different
days. A **harness** replaces that opinion with a number: the complete set of
checks that decide whether a piece of work is good enough, run automatically,
producing a pass or a fail. The value is not that checks are novel — tests and
linters are old — but that treating "done" as an *exit code* changes who can do
the work and how much you can trust it. It is the difference between a standard
you defend by hand and one the machine defends for you, which is the only way
autonomous or AI-heavy work stays honest at volume.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="hp-t hp-d" class="blog-figure__svg">
  <title id="hp-t">Work flows into a harness of checks that emits a single pass or fail</title>
  <desc id="hp-d">A change enters a harness box containing schema, links, budget, tests and accessibility checks; the harness emits one composite verdict, and a fail loops back for a fix.</desc>
  <rect x="20" y="85" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="65" y="109" text-anchor="middle" fill="#155799" font-size="11">change</text>
  <path d="M110 105 L175 105" stroke="#819198" stroke-width="2" marker-end="url(#hp-a)"/>
  <rect x="175" y="45" width="220" height="120" rx="10" fill="none" stroke="#157878" stroke-width="2.5" stroke-dasharray="4 3"/><text x="285" y="40" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">harness</text>
  <g fill="#e8f0f8" stroke="#157878" stroke-width="1.5" font-size="9" text-anchor="middle">
    <rect x="190" y="55" width="90" height="24" rx="4"/><text x="235" y="71" fill="#157878">schema</text>
    <rect x="290" y="55" width="90" height="24" rx="4"/><text x="335" y="71" fill="#157878">links</text>
    <rect x="190" y="88" width="90" height="24" rx="4"/><text x="235" y="104" fill="#157878">budget</text>
    <rect x="290" y="88" width="90" height="24" rx="4"/><text x="335" y="104" fill="#157878">tests</text>
    <rect x="240" y="121" width="90" height="24" rx="4"/><text x="285" y="137" fill="#157878">a11y</text>
  </g>
  <path d="M395 105 L460 105" stroke="#819198" stroke-width="2" marker-end="url(#hp-a)"/>
  <rect x="460" y="85" width="90" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="505" y="109" text-anchor="middle" fill="#c2571a" font-size="11">pass/fail</text>
  <path d="M505 125 C 505 185, 65 185, 65 127" fill="none" stroke="#c2571a" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#hp-a)"/><text x="285" y="182" text-anchor="middle" fill="#c2571a" font-size="9">fail → fix and re-run</text>
  <defs><marker id="hp-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Many checks, one verdict. "Done" is whatever makes the harness green — and a fail is a specific, actionable message, not a vibe.</figcaption>
</figure>

## A check is executable, specific, and unattended

The three properties that make a harness a harness: each check *runs* (it is code,
not a guideline), it names a *specific* deficit when it fails, and it runs
*without a human*. A link checker is a tiny, complete example — it turns "make
sure the links work" from a manual click-through into an exit code:

```js
// harness/links.test.js — every internal link resolves to a real page
const pages = new Set(allSlugs());
for (const link of internalLinks()) {
  const target = link.replace(/^\//, "").replace(/\/$/, "");
  test(`link ${link} resolves`, () => {
    expect(pages.has(target)).toBe(true);   // fails naming the exact dead link
  });
}
```

The failure message is not "something's off with the links" — it is `link
/guides/acme resolves`, red, pointing at the one that broke.

## The composite is the "done" signal

A single check is a test. A harness is the *whole set*, rolled into one number you
can gate on. That composite is what lets you say "green means shippable" with a
straight face, and it is what an autonomous or AI agent optimises against:

```bash
# the harness is the definition of done; CI gates on it, agents heal against it
$ node harness/check.js
  pass  schema        1.00
  pass  links         1.00
  FAIL  bundle-budget 0.00  entry chunk 340kb > 250kb budget
composite 0.83 — required failing: bundle-budget   # not done; here is exactly why
```

## Why it matters more now

When humans wrote all the code slowly, an informal "we'll catch it in review"
mostly kept up. When a model writes code faster than review can absorb, the
informal standard collapses — there is simply too much to eyeball. A harness
scales the way review cannot: it costs the same to run against one diff or a
thousand, it never gets tired or generous at 6pm, and it gives an AI a target it
can *heal* toward on its own. That is the real unlock — "is it done" becomes
something a machine can both check and chase. The harness-link-checker and
harness-bundle-budget exercises build two real checks from scratch, which is the
fastest way to feel the shift from opinion to exit code.
