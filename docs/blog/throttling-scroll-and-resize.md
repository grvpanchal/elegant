---
title: "Scroll and resize fire constantly — throttle them or pay for it"
slug: throttling-scroll-and-resize
date: 2026-06-28
layout: post
author: The Elegant team
category: terminology
tags: [ui, performance, events, throttle]
description: 'Scroll and resize can fire dozens of times a second, and doing real work in their handlers is a reliable way to jank the page. Throttle them, or move the work to the platform APIs built for exactly this.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [infinite-scroll-list, debounce-utility]
---

`scroll` and `resize` are firehose events: a single scroll gesture can fire the handler
dozens of times a second, and each firing runs your callback on the main thread. Put
real work in there — reading layout, updating many elements, recalculating positions —
and you have built a reliable way to drop frames, because you are doing heavy work far
more often than the screen can even repaint. The fix is one of two things: **throttle**
the handler so it runs at most a few times per second, or — better where it applies —
move the work to a **platform API built for exactly this**, which does the observing off
the main thread entirely. Doing neither is the default, and the default janks.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="ts2-t ts2-d" class="blog-figure__svg">
  <title id="ts2-t">Raw scroll fires far more than the frame budget allows; throttling caps it</title>
  <desc id="ts2-d">Top: dozens of scroll events per second, each running heavy work, exceeding the 16ms frame budget. Bottom: a throttled handler runs a few times a second, within budget.</desc>
  <text x="20" y="40" fill="#c2571a" font-size="10" font-weight="700">raw</text>
  <g stroke="#fe854c" stroke-width="2.5">
    <line x1="90" y1="28" x2="90" y2="52"/><line x1="110" y1="28" x2="110" y2="52"/><line x1="130" y1="28" x2="130" y2="52"/><line x1="150" y1="28" x2="150" y2="52"/><line x1="170" y1="28" x2="170" y2="52"/><line x1="190" y1="28" x2="190" y2="52"/><line x1="210" y1="28" x2="210" y2="52"/><line x1="230" y1="28" x2="230" y2="52"/><line x1="250" y1="28" x2="250" y2="52"/><line x1="270" y1="28" x2="270" y2="52"/>
  </g>
  <text x="360" y="45" fill="#c2571a" font-size="9">heavy work every firing → jank</text>
  <text x="20" y="115" fill="#157878" font-size="10" font-weight="700">throttled</text>
  <g stroke="#157878" stroke-width="2.5"><line x1="90" y1="103" x2="90" y2="127"/><line x1="180" y1="103" x2="180" y2="127"/><line x1="270" y1="103" x2="270" y2="127"/></g>
  <text x="360" y="120" fill="#157878" font-size="9">runs ~10x/sec, within the frame budget</text>
</svg>
<figcaption>Raw scroll fires far faster than the screen repaints, so heavy work piles up and drops frames. Throttling caps the rate to something the frame budget can absorb.</figcaption>
</figure>

## Throttle the handler to a sane rate

If you must run work on scroll — updating a progress bar, a sticky header, a
scrollspy — throttle it so it fires at most every N milliseconds during the gesture,
which is *rate-limiting during* the burst (distinct from debounce, which waits for the
burst to *end*):

```js
function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) { last = now; fn(...args); }   // at most once per interval
  };
}
window.addEventListener("scroll", throttle(updateStickyHeader, 100));  // ~10x/sec, smooth
```

Debounce here would be wrong — the header would only update *after* the user stops
scrolling, not during — which is exactly why throttle is the tool for continuous events.

## Better: let the platform observe off the main thread

The modern move is to not listen to scroll or resize at all for the common cases,
because the platform now has observers that do the watching *off* the main thread and
call you back only when something meaningful changes. `IntersectionObserver` for "is
this element visible" (lazy-load, infinite scroll, scrollspy) and `ResizeObserver` for
"did this element's size change":

```js
// no scroll handler at all — the browser tells you when the sentinel enters view
const io = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) loadNextPage();   // fires only when it matters
});
io.observe(document.querySelector("#load-more-sentinel"));
```

This is strictly better than a throttled scroll handler for visibility work: no
main-thread polling, no rate to tune, and it does not fire when nothing changed.

## Keep the handler cheap, and read layout carefully

Whichever you use, keep the callback light. The expensive trap inside a scroll handler
is *forcing layout* — reading `offsetTop`/`getBoundingClientRect` mid-scroll makes the
browser reflow synchronously on every call, which janks even a throttled handler. Batch
reads, cache measurements, and defer visual updates to `requestAnimationFrame` so they
land in sync with the paint. The decision tree is short: for "is it visible / what
size is it," reach for `IntersectionObserver`/`ResizeObserver`; for genuine
scroll-position work that has no observer, throttle the handler and keep it free of
forced layout. Either way, never let a firehose event run heavy work at firehose rate.
The infinite-scroll-list exercise is the canonical `IntersectionObserver` case, and
debounce-utility builds the sibling technique for the events that want quiet, not a
rate cap.
