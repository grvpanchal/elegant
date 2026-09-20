---
title: "Evals are tests for the things unit tests can't check"
slug: evals-are-tests-for-judgement
layout: post
date: 2026-08-04
author: The Elegant team
category: ai-and-frontend
tags: [ai, evals, quality, testing]
description: 'A unit test checks that a function returns the right value. An eval checks that a piece of prose, a design, or an AI output meets a standard you can describe but not compute. As AI writes more, evals become as important as tests.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 5
related_practice: [harness-skill-eval, harness-atom-guardrail]
---

A unit test checks a computable fact: given this input, does the function return this
exact value? Enormous amounts of software quality are *not* computable that way. Is
this explanation clear? Is this component accessible in spirit, not just in attributes?
Did the AI's answer actually solve the problem, or just look like it did? An **eval** is
a test for those — a repeatable check against a standard you can *describe* but not
reduce to `===`. As AI writes more of our prose, designs, and code, evals become as
important as unit tests, because the questions worth asking about AI output are almost
all of the un-computable kind.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="ev-t ev-d" class="blog-figure__svg">
  <title id="ev-t">Unit tests check computable equality; evals check describable standards</title>
  <desc id="ev-d">Left: a unit test comparing output to an exact expected value. Right: an eval judging an output against a rubric or a stronger judge, producing a graded verdict.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">unit test</text>
  <rect x="50" y="45" width="200" height="30" rx="5" fill="#e8eefb" stroke="#155799" stroke-width="2"/><text x="150" y="64" text-anchor="middle" fill="#155799" font-size="9">output === expected ?</text>
  <text x="150" y="100" text-anchor="middle" fill="#819198" font-size="9">computable, exact, pass/fail</text>
  <line x1="330" y1="18" x2="330" y2="160" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">eval</text>
  <rect x="380" y="45" width="200" height="30" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="480" y="64" text-anchor="middle" fill="#157878" font-size="9">output vs rubric / judge</text>
  <text x="480" y="100" text-anchor="middle" fill="#819198" font-size="9">describable standard, graded verdict</text>
  <rect x="410" y="115" width="140" height="26" rx="5" fill="#fff4ec" stroke="#fe854c"/><text x="480" y="133" text-anchor="middle" fill="#c2571a" font-size="8">runs on every change, like a test</text>
</svg>
<figcaption>A unit test asks "does it equal?"; an eval asks "does it meet the standard?" Both run repeatably on every change — the eval just judges instead of comparing.</figcaption>
</figure>

## When the answer isn't computable, write a rubric

The core move is to make the un-computable *checkable* by writing down the standard as
a rubric — the criteria a human would use — and then applying it repeatably. For an
AI-authored explanation, "is this genuine or slop?" becomes a set of concrete tests:

```js
// eval: encode the standard you can describe, then check it on every draft
function evalExplanation(text) {
  return {
    hasConcreteExample: /```/.test(text),                 // shows, not just tells
    takesAPosition: !/it depends|there are many ways/i.test(text),  // commits
    rightLength: wordCount(text) >= 400,
    passed() { return this.hasConcreteExample && this.takesAPosition && this.rightLength; },
  };
}
```

Some criteria are mechanical like these; others need a *judge* — a stronger model or a
human — scoring against the rubric. Either way, the standard is written down and
applied the same way every time, which is what makes it a test and not a vibe.

## The eval must be able to fail the thing it checks

An eval is only meaningful if it can say *no*. A slop-detector that passes everything
is not a check; it is decoration. So a good eval is validated in both directions:
give it a known-bad output and confirm it fails, give it a known-good one and confirm
it passes:

```js
evalExplanation("It depends. There are many approaches.").passed();  // false — good, it rejects slop
evalExplanation(realPostWithCodeAndPosition).passed();               // true  — good, it accepts quality
```

An eval you never watched *reject* something is an eval you cannot trust to reject the
next thing.

## Evals are the harness for the un-computable

The reason this matters now is throughput and subject matter: AI produces a flood of
outputs whose quality is exactly the describable-but-not-computable kind — is the prose
good, is the design clear, did the answer really work. Human review does not scale to
that flood, and unit tests cannot express the question. Evals fill the gap: a
repeatable, describable standard that runs on every output like a test suite runs on
every commit, folded into the composite alongside the mechanical checks (one signal,
not the only one, since a judge can be wrong). This is precisely how a content
guardrail keeps AI-written material honest — the slop verdict fails the draft, so the
next one improves because the writing did, not because the check was loosened. The
harness-skill-eval exercise builds exactly this: the eval that says what "correct"
means for an output no `===` can grade.
