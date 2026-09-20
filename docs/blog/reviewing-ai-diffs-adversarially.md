---
title: "Review an AI diff adversarially: assume it works and looks for the catch"
slug: reviewing-ai-diffs-adversarially
date: 2026-08-07
layout: post
author: The Elegant team
category: ai-and-frontend
tags: [ai, review, quality, architecture]
description: 'The question for an AI diff is never "does it run" — it usually does. It is "what would make this wrong that the tests do not cover?" Reviewing AI code well means reading it looking for the plausible-but-broken.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 5
related_practice: [harness-a11y-gate, harness-state-shape, presentational-vs-container]
---

Reviewing human code and reviewing AI code are different activities, because they
fail differently. A junior's mistake usually *looks* like a mistake — a typo, an
obvious gap. A model's mistake looks *correct*: it runs, it reads fluently, it passes
the happy-path test, and it is wrong in a way you have to go looking for. So the
question to bring to an AI diff is never "does it work?" (it usually does) but "what
would make this wrong that isn't obvious and the tests don't cover?" You review it
**adversarially** — assuming it works, and hunting for the plausible-but-broken —
because plausibility is exactly what the model is optimised to produce.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="rv-t rv-d" class="blog-figure__svg">
  <title id="rv-t">AI failures hide behind plausibility; adversarial review targets the hidden half</title>
  <desc id="rv-d">A diff shown as an iceberg: above water, runs and reads well and passes happy-path. Below water, invented APIs, crossed boundaries, weakened tests, missing edge cases — the review target.</desc>
  <rect x="120" y="28" width="400" height="46" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="320" y="56" text-anchor="middle" fill="#157878" font-size="10" font-weight="700">runs · reads well · passes happy path</text>
  <line x1="40" y1="86" x2="600" y2="86" stroke="#155799" stroke-width="2" stroke-dasharray="6 4"/>
  <rect x="120" y="98" width="400" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/>
  <g fill="#c2571a" font-size="9" text-anchor="middle"><text x="200" y="125">invented API</text><text x="320" y="125">crossed boundary</text><text x="450" y="125">weakened test</text><text x="320" y="145">missing edge case · silent error swallow</text></g>
</svg>
<figcaption>The visible half always looks fine — that's what a model produces. Adversarial review spends its attention below the waterline, on the failures that hide behind plausibility.</figcaption>
</figure>

## Hunt the model's characteristic failures

AI diffs fail in recognisable ways, so review is partly a checklist of its habits.
**Invented APIs**: a method or prop that sounds right but does not exist. **Crossed
boundaries**: a fetch that wandered into a presentational component. **Weakened
tests**: an assertion loosened so the code passes. **Swallowed errors**: a `catch`
that hides a failure. Read *for* these:

```js
// characteristic AI failure — a catch that makes the code "work" by hiding the bug
try {
  const data = await fetchUser(id);
  setUser(data);
} catch (e) {
  // ⚠ swallowed: the UI shows an empty state on failure and no one knows why
}
```

A human rarely writes this on purpose; a model writes it to make the function "not
throw," which reads as done and is a silent failure.

## Check the edges the happy path skips

The happy-path test the model wrote passes; the edges it did not think of are where
the bug lives. For every AI diff, mentally run the empties, the nulls, the
concurrent, and the large: what does this do with zero items, a null response, two
calls racing, a 10,000-row list?

```js
// the model handled the list; did it handle the empty and the error?
{items.map((i) => <Row key={i.id} {...i} />)}
// what renders when items is [] ? when the fetch failed and items is undefined?
// adversarial review asks these before merge, not the on-call engineer at 2am
```

## The scalable version: encode the review

Doing this by hand on every diff does not scale to the volume a model produces —
which is the whole reason the failures slip through. So the durable move is to
convert your recurring adversarial checks into guardrails: a lint rule that forbids a
fetch in the UI layer, a shape test that catches a boundary crossing, an
accessibility gate that catches the missing keyboard handler. The check runs on every
diff, tired-proof and at machine speed, catching the *mechanical* half so your
human review can spend its attention on the half a check cannot judge — is this the
right abstraction, does this design age well. Adversarial reading plus encoded checks
is how you review AI code at the rate AI writes it. The harness-a11y-gate,
harness-state-shape, and presentational-vs-container exercises each turn one class of
"plausible-but-broken" into a check that catches it automatically.
