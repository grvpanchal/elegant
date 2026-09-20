---
title: "AI-generated tests need a human oracle"
slug: ai-generated-tests-need-a-human-oracle
date: 2026-07-30
layout: post
author: The Elegant team
category: ai-and-frontend
tags: [ai, testing, quality, evals]
description: 'A model is great at writing test scaffolding and terrible at deciding what "correct" is. Ask it to test existing code and it will assert that the current behaviour — bugs and all — is right. The oracle has to be you.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 5
related_practice: [harness-skill-eval, debounce-utility, deep-clone]
---

Ask a model to "write tests for this function" and it will happily produce a dozen —
well-structured, nicely named, and quietly worthless, because it derived the expected
values *from the code you gave it*. If the code has a bug, the test asserts the bug is
correct. This is the oracle problem: a test needs a source of truth for what the
output *should* be, and that source cannot be the implementation under test. The model
is genuinely good at the *scaffolding* of testing — arranging, mocking, structuring —
and genuinely unable to supply the *oracle*. That part is yours, and confusing "the
model wrote tests" with "the behaviour is verified" is how a bug ships with a green
suite guarding it.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="ao-t ao-d" class="blog-figure__svg">
  <title id="ao-t">Deriving expectations from the code enshrines its bugs; the oracle must be external</title>
  <desc id="ao-d">Left: the model reads the code and writes a test asserting the code's current (buggy) output — a circular check. Right: a human supplies the intended output from the spec, catching the bug.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">model as oracle (circular)</text>
  <rect x="60" y="42" width="80" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="100" y="63" text-anchor="middle" fill="#c2571a" font-size="9">code</text>
  <rect x="180" y="42" width="80" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="220" y="63" text-anchor="middle" fill="#c2571a" font-size="9">test</text>
  <path d="M140 55 L178 55" stroke="#c2571a" stroke-width="2" marker-end="url(#ao-a)"/><path d="M180 68 L142 68" stroke="#c2571a" stroke-width="2" marker-end="url(#ao-a)"/>
  <text x="150" y="100" text-anchor="middle" fill="#c2571a" font-size="9">asserts the bug is correct</text>
  <line x1="330" y1="18" x2="330" y2="165" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">human oracle</text>
  <rect x="380" y="42" width="90" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="425" y="63" text-anchor="middle" fill="#157878" font-size="9">spec (intent)</text>
  <path d="M470 59 L520 59" stroke="#157878" stroke-width="2" marker-end="url(#ao-a)"/>
  <rect x="520" y="42" width="90" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="565" y="63" text-anchor="middle" fill="#155799" font-size="9">test</text>
  <text x="490" y="100" text-anchor="middle" fill="#157878" font-size="9">catches the bug</text>
  <defs><marker id="ao-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>If the expected value comes from the code, the test can only confirm the code equals itself. The oracle — what the output should be — has to come from the spec, i.e. you.</figcaption>
</figure>

## The circular test enshrines the bug

Here is the failure in miniature. The discount function has an off-by-one, and the
AI-written test "verifies" it — by reading the buggy output and asserting it:

```js
function applyDiscount(price, pct) { return price - price * pct; }  // pct is 0.1 for 10%… or is it?
// AI test, expectations derived FROM the code:
expect(applyDiscount(100, 10)).toBe(-900);   // asserts the bug (10 read as 1000%) as "correct"
```

Green suite, shipped bug. The test proved only that the code equals itself.

## The oracle comes from intent, not implementation

A useful test encodes what the output *should* be according to the spec — a value
you, the human, decide independently of the code. Write the expectation first, from
intent, and the same test now *catches* the bug:

```js
// oracle from the spec: "10% off 100 is 90"
expect(applyDiscount(100, 0.1)).toBe(90);   // FAILS on the buggy code — exactly right
```

The discipline is to state the expected value before looking at what the function
returns, so the test measures the code against your intent rather than against itself.

## Let the model scaffold, you supply the truth

This does not mean writing AI out of testing — it means splitting the work along the
line of what it is good at. Let the model generate the *structure*: the `describe`
blocks, the mocks, the arrange/act boilerplate, the list of cases worth covering
(empty, null, large, concurrent — it is good at brainstorming these). Then *you* fill
in every expected value from the spec, and reject any assertion whose expectation
was obviously lifted from the implementation. A good tell: an assertion with an oddly
specific magic number nobody would choose on purpose (`toBe(-900)`) is usually the
model reading the code. The oracle problem is not an AI quirk to work around; it is a
property of what a test *is*, and the model simply cannot be the oracle for the code
it is testing. The harness-skill-eval exercise is exactly about writing the oracle —
the eval that says what "correct" means — which is the part that stays human even as
everything around it is generated.
