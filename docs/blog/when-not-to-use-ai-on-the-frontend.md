---
title: "When not to use AI on the frontend"
slug: when-not-to-use-ai-on-the-frontend
date: 2026-08-02
layout: post
author: The Elegant team
category: ai-and-frontend
tags: [ai, judgement, architecture, workflow]
description: 'Using AI well includes knowing when not to. There are tasks where a model is slower, riskier, or actively misleading, and reaching for it there is not sophistication — it is a mistake that costs you more than typing would have.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 5
related_practice: [harness-state-shape, presentational-vs-container]
---

Using AI well includes knowing when *not* to. The reflex to prompt for everything is
not sophistication — for some tasks it is slower, riskier, or actively misleading
compared to just doing it yourself. A model is a fast, confident, forgetful junior:
brilliant at the bounded and repetitive, dangerous at the load-bearing and the subtle.
Reaching for it on the wrong task costs you more than typing would have, because you
pay to generate, then pay again to review something built to *look* right. Drawing the
line — where AI earns its speed and where it quietly costs you — is as much of the
skill as prompting is.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="wn-t wn-d" class="blog-figure__svg">
  <title id="wn-t">Reach for AI on bounded, verifiable work; not on load-bearing judgement</title>
  <desc id="wn-d">A dividing line. On the green side: boilerplate, transforms, first drafts, well-specified components. On the orange side: core architecture, security, subtle async, anything you can't verify.</desc>
  <rect x="30" y="40" width="270" height="110" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="165" y="34" text-anchor="middle" fill="#157878" font-size="10" font-weight="700">reach for AI</text>
  <g fill="#157878" font-size="9" text-anchor="middle"><text x="165" y="70">boilerplate, scaffolds</text><text x="165" y="90">data transforms</text><text x="165" y="110">first-draft docs</text><text x="165" y="130">well-specified components</text></g>
  <rect x="340" y="40" width="270" height="110" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="475" y="34" text-anchor="middle" fill="#c2571a" font-size="10" font-weight="700">do it yourself</text>
  <g fill="#c2571a" font-size="9" text-anchor="middle"><text x="475" y="70">core architecture</text><text x="475" y="90">security / auth</text><text x="475" y="110">subtle concurrency</text><text x="475" y="130">anything you can't verify</text></g>
</svg>
<figcaption>The line is roughly "bounded and verifiable" versus "load-bearing and subtle." AI's speed is real on the left and a trap on the right.</figcaption>
</figure>

## Don't hand it the load-bearing decisions

The clearest "no" is architecture. Where a piece of state lives, what the module
boundaries are, how the data flows — these require holding the whole system in mind
over time, which is exactly what a model cannot do. Ask it to design your state
architecture and it will produce a locally-plausible answer that erodes globally.
These decisions are cheap to make well and expensive to unwind, so they are the last
thing to delegate:

```text
Good ask:   "Implement this reducer to match this spec."         ← bounded
Bad ask:    "Design the state architecture for this app."         ← load-bearing judgement
```

Make the architecture yourself; let the model fill in the pieces once the shape is set.

## Don't trust it where you can't verify cheaply

The second "no" is anything you cannot *check* quickly, because AI's failures are
plausible. Security and auth are the sharp cases — a subtly wrong token check or a
CORS config that looks fine and leaks is worse than no help at all, since it reads as
correct. Same for gnarly concurrency: a race condition the model "handles" in a way
you cannot easily prove:

```js
// looks like it handles the race; does it? if you can't verify it fast, don't trust it
const id = ++latest;
const data = await fetchResults(q);
if (id !== latest) return;   // subtly right or subtly wrong — verify by hand, not by vibe
```

If confirming correctness would take longer than writing it, the model's speed is an
illusion.

## Don't use it to skip the learning you need

The subtlest "no" is when generating the code robs you of understanding you will need
later. If you do not yet grasp the event loop, having a model write your debounce
means you cannot debug it when it misbehaves — you have a black box in your own
codebase. Early in learning a concept, typing it yourself is the point; the slowness
*is* the learning. The rule of thumb across all three: reach for AI when the task is
**bounded and cheaply verifiable** — boilerplate, transforms, well-specified
components, first drafts — and do it yourself when it is **load-bearing, subtle, or
something you need to understand**. Knowing which side a task is on is judgement, and
judgement is precisely the thing the model does not have and you are paid for. The
harness-state-shape and presentational-vs-container exercises live on the "your call"
side of that line — the architectural decisions worth making, and defending, yourself.
