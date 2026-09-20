---
title: "How to prepare for a frontend interview without boiling the ocean"
layout: post
slug: how-to-prepare-for-a-frontend-interview
date: 2026-07-22
author: The Elegant team
category: career
tags: [interview, career, preparation, practice]
description: 'Most candidates prepare by grinding random problems and hoping. The loop is legible: prepare per round — utilities, UI components, system design, behavioural — and drill the specific muscle each one tests.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [accessible-combobox, debounce-utility, design-search-experience]
---

Most people prepare for a frontend interview by grinding random problems and hoping
the overlap is enough. It rarely is, because a frontend loop is not one skill — it
is a small set of distinct rounds, each testing a different muscle. Prepare against
the *structure* of the loop rather than a pile of problems, and the work becomes
finite and legible: figure out which rounds you will face, and drill the specific
thing each one measures. That turns "study everything" into a short, targeted list,
which is the difference between preparation that fits in two weeks and preparation
that never feels done.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="pi-t pi-d" class="blog-figure__svg">
  <title id="pi-t">The four rounds of a frontend loop and the muscle each drills</title>
  <desc id="pi-d">Four boxes — JS utilities, UI component, system design, behavioural — each labelled with the skill it tests and how to practise it.</desc>
  <g font-size="9" text-anchor="middle">
    <rect x="20" y="55" width="140" height="80" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="90" y="48" fill="#157878" font-weight="700">JS utility</text><text x="90" y="85" fill="#155799">debounce, curry</text><text x="90" y="102" fill="#819198">recall + edge cases</text>
    <rect x="175" y="55" width="140" height="80" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="245" y="48" fill="#c2571a" font-weight="700">UI component</text><text x="245" y="85" fill="#155799">combobox, tabs</text><text x="245" y="102" fill="#819198">build + a11y</text>
    <rect x="330" y="55" width="140" height="80" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="400" y="48" fill="#157878" font-weight="700">system design</text><text x="400" y="85" fill="#155799">a feed, a search</text><text x="400" y="102" fill="#819198">trade-offs</text>
    <rect x="485" y="55" width="135" height="80" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="552" y="48" fill="#157878" font-weight="700">behavioural</text><text x="552" y="85" fill="#155799">conflict, impact</text><text x="552" y="102" fill="#819198">stories (STAR)</text>
  </g>
  <text x="320" y="165" text-anchor="middle" fill="#819198" font-size="9">prepare per round — each drills a different muscle</text>
</svg>
<figcaption>Four rounds, four muscles. Preparing against this structure — not a random problem pile — is what makes the work finite.</figcaption>
</figure>

## Map your loop, then drill per round

Before grinding, find out the loop's shape — recruiters will usually tell you. Then
assign practice per round rather than in general. For the **utility round**, drill
the classic implementable primitives until they are muscle memory, edge cases
included:

```js
// the kind of thing the utility round wants — write it, then handle the edges
function debounce(fn, wait) {
  let t;
  const debounced = (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  debounced.cancel = () => clearTimeout(t);   // the edge case that scores: cancellation
  return debounced;
}
```

For the **component round**, practise building an accessible widget end to end —
not just the visible part but the keyboard and focus behaviour, because that is
where these rounds are won.

## Practise output under a clock, not just input

The biggest preparation mistake is passive input — reading solutions and nodding —
when the interview tests *output* under time pressure. Simulate it: set a timer,
build the thing from an empty file, and only then compare to a reference. A rough
schedule that respects the round structure:

```text
Week 1  utilities: debounce/throttle, curry, deepClone, EventEmitter, promise pool
Week 2  components: combobox, tabs, modal, data table — build each timed, a11y included
Week 3  system design: 3 features (feed, search, chat) — practise the trade-off talk
Ongoing behavioural: 6 STAR stories written out, one per common theme
```

The point is coverage of *rounds*, not volume of *problems*.

## Don't neglect the two rounds people skip

Two rounds get under-prepared because they feel un-drillable, and both are
learnable. **System design** has no right answer, so candidates freeze — but the
score is your reasoning, so practise *narrating trade-offs* (CSR vs SSR here, and
why) rather than memorising an architecture. **Behavioural** gets waved away as
"just talking," but a rambling answer to "tell me about a conflict" sinks strong
engineers; write six concrete stories in STAR form ahead of time. Prepare against
the four rounds, drill output under a clock, and cover the two everyone skips, and
you have a plan that ends — rather than an ocean you keep bailing. The
debounce-utility and accessible-combobox exercises are the highest-yield reps for
the first two rounds, and design-search-experience is a full system-design rehearsal.
