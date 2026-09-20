---
title: "Debounce and throttle are different tools for different problems"
layout: post
slug: debounce-and-throttle-are-different-tools
date: 2026-09-05
author: The Elegant team
category: terminology
tags: [ui, performance, events, javascript]
description: Both limit how often a function runs, but they answer different questions. Debounce waits for quiet; throttle enforces a steady rate. Using the wrong one makes a search box feel broken.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [debounce-utility, design-search-experience]
---

Debounce and throttle both reduce how often a function runs in response to a
burst of events, and they are constantly confused because that one-line summary
makes them sound interchangeable. They are not. They answer different questions.
Debounce asks *"has the user stopped?"* and runs once after the burst goes
quiet. Throttle asks *"has enough time passed?"* and runs at a steady maximum
rate during the burst. Pick the wrong one and the feature feels broken in a way
that is hard to name — a search box that fires on every keystroke, or a
scroll handler that stutters.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 250" role="img" aria-labelledby="dt-t dt-d" class="blog-figure__svg">
  <title id="dt-t">Debounce fires once after quiet; throttle fires at a steady rate</title>
  <desc id="dt-d">A row of rapid event ticks. Debounce produces one call after the events stop. Throttle produces evenly spaced calls during the burst. A moving dot rides the debounce timeline and fires at the end.</desc>
  <text x="20" y="40" fill="#606c71" font-size="12" font-weight="700">events</text>
  <g stroke="#155799" stroke-width="3">
    <line x1="120" y1="30" x2="120" y2="55"/><line x1="150" y1="30" x2="150" y2="55"/><line x1="180" y1="30" x2="180" y2="55"/><line x1="215" y1="30" x2="215" y2="55"/><line x1="245" y1="30" x2="245" y2="55"/><line x1="290" y1="30" x2="290" y2="55"/>
  </g>
  <line x1="110" y1="70" x2="610" y2="70" stroke="#dce6f0"/>
  <text x="20" y="115" fill="#c2571a" font-size="12" font-weight="700">debounce</text>
  <line x1="110" y1="130" x2="610" y2="130" stroke="#dce6f0"/>
  <circle cx="380" cy="105" r="9" fill="#fe854c"/><text x="380" y="150" text-anchor="middle" fill="#c2571a" font-size="11">one call, after quiet</text>
  <path d="M290 105 L370 105" stroke="#fe854c" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#dt-a)"/>
  <text x="20" y="195" fill="#157878" font-size="12" font-weight="700">throttle</text>
  <g fill="#157878"><circle cx="120" cy="185" r="9"/><circle cx="215" cy="185" r="9"/><circle cx="310" cy="185" r="9"/></g>
  <text x="430" y="189" fill="#157878" font-size="11">steady calls, every N ms during the burst</text>
  <defs><marker id="dt-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#fe854c"/></marker></defs>
  <circle r="6" fill="#c2571a">
    <animateMotion dur="4s" repeatCount="indefinite" keyPoints="0;0.7;0.7;1" keyTimes="0;0.6;0.75;1" calcMode="linear" path="M120 90 L290 90 L370 105 L380 105"/>
  </circle>
</svg>
<figcaption>Same burst of events. Debounce waits for the gap and fires once; throttle ignores the gaps and fires on a fixed cadence.</figcaption>
</figure>

## Debounce: wait for the user to stop

Debounce delays the call until the events *pause* for a set interval. Every new
event resets the timer, so nothing runs until the burst goes quiet. This is
exactly right for a search-as-you-type box: you want to hit the API once the
user finishes typing, not on every keystroke.

```js
function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);                 // each event cancels the pending call
    timer = setTimeout(() => fn(...args), wait);
  };
}

const search = debounce((q) => fetchResults(q), 300);
input.addEventListener("input", (e) => search(e.target.value));
// types "cats" fast → ONE fetch, 300ms after the last keystroke
```

Use debounce for search inputs, autosave-after-editing, resize handlers that
recompute a layout, and validating a field once the user leaves it. The tell is
"do the work once, when the activity settles."

## Throttle: enforce a steady maximum rate

Throttle runs the function at most once per interval *during* a continuous
burst — it does not wait for quiet, it caps the rate. This is what you want for
a scroll or mousemove handler: you need periodic updates while the burst is
still happening, just not sixty of them a second.

```js
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {        // enough time passed? run and mark
      last = now;
      fn(...args);
    }
  };
}

const onScroll = throttle(() => updateStickyHeader(), 100);
window.addEventListener("scroll", onScroll);
// scrolls continuously → the header updates ~10x/sec, smoothly, not per frame
```

## Picking the wrong one is the bug

Debounce a scroll handler and the sticky header never moves *while* you scroll —
it only snaps into place after you stop, because debounce is still waiting for
quiet that a continuous scroll never gives it. Throttle a search box and you
fire a request every 300ms *during* typing, hammering the API with queries for
half-typed words. The question to ask is never "which is faster" — it is "do I
want the result **after** the activity, or **during** it?" After the burst,
debounce; throughout the burst, throttle. The debounce-utility exercise builds
the timer-reset version above and is the fastest way to make the distinction
stick in your hands rather than just your notes.
