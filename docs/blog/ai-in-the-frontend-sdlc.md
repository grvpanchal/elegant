---
title: "Where AI actually fits in the frontend development lifecycle"
slug: ai-in-the-frontend-sdlc
layout: post
date: 2026-08-09
author: The Elegant team
category: ai-and-frontend
tags: [ai, workflow, guardrails, sdlc]
description: 'AI is not one thing you bolt onto the end of development. It shows up at every stage — scaffolding, implementing, reviewing, testing — and it is strong at some and dangerous at others. Knowing which is the whole skill.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 5
related_practice: [harness-skill-eval, harness-atom-guardrail, harness-a11y-gate]
---

AI is not a single feature you bolt onto the end of development. It shows up at
*every* stage of the lifecycle — scaffolding, implementing, reviewing, testing,
documenting — and it has a very different competence profile at each. It is
excellent at generating boilerplate and terrible at deciding whether behaviour is
*correct*; strong at drafting a component and weak at holding your architecture in
mind. Using AI well is not "adopt AI"; it is knowing, stage by stage, where to lean
on it and where to keep it on a short leash. Get that map wrong and you either leave
value on the table or ship confident-looking bugs.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="as2-t as2-d" class="blog-figure__svg">
  <title id="as2-t">AI's competence varies by lifecycle stage</title>
  <desc id="as2-d">Stages across the lifecycle — scaffold, implement, review, test, document — each marked as a strength (green) or a caution (orange) for AI.</desc>
  <g font-size="9" text-anchor="middle">
    <rect x="20" y="60" width="110" height="50" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="75" y="82" fill="#157878">scaffold</text><text x="75" y="98" fill="#157878">✓ strong</text>
    <rect x="145" y="60" width="110" height="50" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="200" y="82" fill="#157878">implement</text><text x="200" y="98" fill="#819198">✓ with a spec</text>
    <rect x="270" y="60" width="110" height="50" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="325" y="82" fill="#c2571a">review</text><text x="325" y="98" fill="#c2571a">⚠ assist only</text>
    <rect x="395" y="60" width="110" height="50" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="450" y="82" fill="#c2571a">test</text><text x="450" y="98" fill="#c2571a">⚠ no oracle</text>
    <rect x="520" y="60" width="100" height="50" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="570" y="82" fill="#157878">document</text><text x="570" y="98" fill="#157878">✓ good draft</text>
  </g>
  <g stroke="#819198" stroke-width="2" marker-end="url(#as2-a)"><path d="M130 85 L143 85"/><path d="M255 85 L268 85"/><path d="M380 85 L393 85"/><path d="M505 85 L518 85"/></g>
  <defs><marker id="as2-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Same tool, different competence per stage: lean on it to scaffold, implement (with a spec) and document; keep it assistive for review and testing, where "correct" is a human call.</figcaption>
</figure>

## Where to lean on it: scaffold, implement, document

At the front of the lifecycle AI is a genuine multiplier. **Scaffolding** — a
component shell, a reducer skeleton, a test file's structure — is repetitive and
low-risk, exactly the model's strength. **Implementation** is strong *when you hand
it a boundary*: a precise spec produces good code, a vague ask produces plausible
mush. And **documentation** — a first-draft README, JSDoc, a changelog — is a solid
starting point you edit rather than write from scratch:

```text
"Scaffold a FormField molecule in src/ui/molecules/: label + input + error,
 takes { label, id, error, ...inputProps }, no store access, no fetch."
→ a strong first draft, because the boundary was drawn in the prompt
```

## Where to keep it on a leash: review and testing

Two stages are dangerous to hand over, and for the same reason: they require a notion
of *correct* the model does not have. In **review**, AI can flag surface issues but
cannot judge whether an abstraction is right or a boundary was crossed — treat it as a
second pair of eyes, never the deciding one. In **testing**, the trap is sharper: ask
a model to write tests for existing code and it will assert that the *current*
behaviour, bugs included, is correct, because it has no oracle for what the code
*should* do:

```js
// AI "test" for buggy code — it enshrines the bug as the expected value
expect(discount(100, "SAVE10")).toBe(100);   // should be 90 — but the model asserts the bug
```

You supply the oracle; the model supplies the scaffolding around it.

## The map is the skill, and the guardrail is the safety net

Knowing this competence map — lean on scaffold/implement/document, stay in control of
review/test — is most of using AI well, but it is not enough on its own, because the
map tells you where the risk *is*, not how to catch it when you're moving fast. That
is what the guardrail is for: encode the architecture and quality rules as checks so
the "dangerous" stages have a machine backstop. A model that erodes a boundary during
implementation trips a lint rule; a test suite that would pass a broken component
fails a real assertion you wrote. AI across the lifecycle plus a guardrail is the
combination that lets you move at the model's speed without shipping at the model's
error rate. The harness-skill-eval and harness-a11y-gate exercises build exactly the
backstops the review and test stages need, which is where the map becomes a working
process.
