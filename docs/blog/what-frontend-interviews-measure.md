---
title: "What frontend interviews actually measure"
slug: what-frontend-interviews-measure
layout: post
date: 2026-09-15
author: The Elegant team
category: interview
tags: [interview, career, ui, state, system-design]
description: Frontend interviews are not quizzing you on trivia. Each round probes a specific axis — API recall, UI construction, state modelling, and trade-off reasoning — and knowing which is which is half the preparation.
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [accessible-combobox, debounce-utility, design-search-experience, normalize-entities]
---

A frontend interview can feel like a random quiz, but it is not. Each round is
designed to probe a specific axis of competence, and the questions are just vehicles
for measuring it. Knowing which axis a round is testing is half the battle, because
it tells you what the interviewer is actually listening for — and lets you supply
that signal on purpose instead of hoping your code speaks for itself. The four axes
recur across companies: can you recall and wield the platform's APIs, can you build
a correct interactive component, can you model state cleanly, and can you reason
about trade-offs at the system level.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="wm-t wm-d" class="blog-figure__svg">
  <title id="wm-t">The four axes an interview measures and the signal each one wants</title>
  <desc id="wm-d">Four axes — API recall, UI construction, state modelling, trade-off reasoning — each paired with what the interviewer is listening for.</desc>
  <g font-size="9" text-anchor="middle">
    <rect x="20" y="50" width="145" height="90" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="92" y="44" fill="#157878" font-weight="700">API recall</text><text x="92" y="82" fill="#155799">closures, events,</text><text x="92" y="96" fill="#155799">promises</text><text x="92" y="116" fill="#819198">"do you know the platform"</text>
    <rect x="180" y="50" width="145" height="90" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="252" y="44" fill="#c2571a" font-weight="700">UI construction</text><text x="252" y="82" fill="#155799">build a widget,</text><text x="252" y="96" fill="#155799">keyboard + a11y</text><text x="252" y="116" fill="#819198">"can you ship correct UI"</text>
    <rect x="340" y="50" width="145" height="90" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="412" y="44" fill="#157878" font-weight="700">state modelling</text><text x="412" y="82" fill="#155799">shape, transitions,</text><text x="412" y="96" fill="#155799">no impossible states</text><text x="412" y="116" fill="#819198">"can you tame complexity"</text>
    <rect x="500" y="50" width="120" height="90" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="560" y="44" fill="#157878" font-weight="700">trade-offs</text><text x="560" y="82" fill="#155799">CSR vs SSR,</text><text x="560" y="96" fill="#155799">cache vs fresh</text><text x="560" y="116" fill="#819198">"can you decide"</text>
  </g>
</svg>
<figcaption>Each round targets one axis and listens for one kind of signal. Name the axis and you know what to make loud.</figcaption>
</figure>

## Axis one and two: recall and construction

The **API recall** round hands you a small implementable problem and watches whether
you know the language and platform well enough to build without a reference — and
whether you find the edge cases:

```js
// they're measuring: do you reach for the right primitive, and do you see the edges?
function once(fn) {
  let called = false, result;
  return (...args) => {
    if (!called) { called = true; result = fn(...args); }  // the edge: memoise the result
    return result;                                          // subsequent calls return it
  };
}
```

The **UI construction** round measures whether you can build a *correct* interactive
component — and "correct" secretly includes keyboard operation, focus, and ARIA, not
just the pixels. Supply that signal by building the invisible half out loud.

## Axis three: state modelling

The **state modelling** axis is where senior signal concentrates. The interviewer
watches how you shape state — whether you avoid impossible combinations, derive
instead of duplicate, and keep the shape minimal. Reaching for a status enum over a
pile of booleans is exactly the signal they want:

```js
// weak signal: four booleans, most combinations invalid
// strong signal: one status the impossible states can't be expressed in
const state = { status: "idle", data: null, error: null };  // idle|loading|success|error
```

Modelling state well under time pressure is hard to fake, which is why this axis
carries so much weight.

## Axis four: trade-off reasoning, and using the map

The **trade-off** axis (usually the system-design round) has no right answer by
design; it measures whether you can name a tension, pick a side, and defend it —
CSR versus SSR, cache versus freshness, normalise versus embed. The practical payoff
of knowing the four axes is that you stop treating every round the same. In the
recall round, narrate edge cases; in the construction round, make accessibility
audible; in the modelling round, justify your state shape; in the design round, talk
trade-offs, not boxes. You are being scored on a specific axis each time, so supply
that axis's signal deliberately. The normalize-entities and accessible-combobox
exercises drill the modelling and construction axes respectively, and
design-search-experience is a rehearsal for the trade-off round.
