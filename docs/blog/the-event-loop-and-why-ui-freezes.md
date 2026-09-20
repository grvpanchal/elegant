---
title: "The event loop, and why a busy function freezes the whole UI"
slug: the-event-loop-and-why-ui-freezes
layout: post
date: 2026-07-01
author: The Elegant team
category: terminology
tags: [ui, javascript, performance, event-loop]
description: 'JavaScript runs on one thread, so a function that runs too long blocks everything — clicks, scrolls, rendering, all frozen until it returns. Understanding the event loop is understanding why, and how to keep the thread free.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [debounce-utility, retry-with-backoff]
---

JavaScript runs your code on a **single thread**. There is exactly one call
stack, and while a function sits on it, nothing else can run — not a click
handler, not a scroll, not the browser's own paint. So when a page "freezes,"
it is almost never the network or the framework: it is a function that took too
long to return, holding the one thread everything else is queued behind. The
event loop is the mechanism that decides what runs next, and once you can see it,
the freeze stops being mysterious and becomes a thing you can design around.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 260" role="img" aria-labelledby="el-t el-d" class="blog-figure__svg">
  <title id="el-t">The event loop moves queued tasks onto the one call stack</title>
  <desc id="el-d">A task queue on the left holds click, timer and render tasks. The event loop moves one at a time onto the single call stack, which must empty before the next task or a paint can run. A dot travels from the queue to the stack.</desc>
  <text x="120" y="30" text-anchor="middle" fill="#606c71" font-size="12" font-weight="700">task queue</text>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2">
    <rect x="60" y="45" width="120" height="34" rx="5"/><rect x="60" y="88" width="120" height="34" rx="5"/><rect x="60" y="131" width="120" height="34" rx="5"/>
  </g>
  <g text-anchor="middle" font-size="12" fill="#155799"><text x="120" y="67">click</text><text x="120" y="110">timer</text><text x="120" y="153">render</text></g>
  <path d="M190 62 C 300 62, 300 130, 400 130" fill="none" stroke="#157878" stroke-width="2" marker-end="url(#el-a)"/>
  <text x="300" y="50" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">event loop</text>
  <text x="300" y="66" text-anchor="middle" fill="#819198" font-size="11">only when the stack is empty</text>
  <rect x="400" y="90" width="180" height="130" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/>
  <text x="490" y="82" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">call stack (single)</text>
  <text x="490" y="160" text-anchor="middle" fill="#c2571a" font-size="12">one frame at a time</text>
  <text x="490" y="182" text-anchor="middle" fill="#819198" font-size="11">a long frame = frozen UI</text>
  <defs><marker id="el-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#157878"/></marker></defs>
  <circle r="7" fill="#157878">
    <animateMotion dur="3.5s" repeatCount="indefinite" path="M120 62 C 300 62, 300 130, 400 130"/>
  </circle>
</svg>
<figcaption>The loop can only move the next task onto the stack once the stack is empty — so a function that never returns starves clicks, timers, and paints alike.</figcaption>
</figure>

## One long function blocks everything

Here is a synchronous loop that takes a couple of seconds. While it runs, the
call stack is occupied, so the browser cannot process the button click that
started it, cannot repaint, cannot even show a spinner you set just before it:

```js
button.addEventListener("click", () => {
  status.textContent = "working...";   // this paint never happens until the end
  let total = 0;
  for (let i = 0; i < 2_000_000_000; i++) {
    total += i;                         // stack is busy for ~2s — UI is frozen
  }
  status.textContent = `done: ${total}`;
});
```

The `"working..."` text never appears, because the DOM change is only *painted*
when the stack empties — and it does not empty until the loop finishes, at which
point you overwrite it with `"done"`. The user sees a dead page and then a
result, with no feedback in between. That is the event loop working exactly as
designed; the bug is that we never gave it a chance to breathe.

## Yield the thread so the loop can run

The fix is to break the long work into chunks and *return* between them, letting
the event loop process a paint and any queued clicks before the next chunk. A
`setTimeout(…, 0)` re-queues the next slice as a fresh task, so the stack empties
in between:

```js
function sumInChunks(n, onProgress, done) {
  let i = 0, total = 0;
  function chunk() {
    const end = Math.min(i + 5_000_000, n);   // do a slice...
    for (; i < end; i++) total += i;
    onProgress(i / n);                          // ...report, then yield
    if (i < n) setTimeout(chunk, 0);            // next slice as a new task
    else done(total);
  }
  chunk();
}
```

Now the stack empties after each slice, the loop gets to paint the progress and
respond to input, and the page stays alive. For work that genuinely must run
without interruption — parsing a large file, heavy image processing — the right
answer is to move it off the main thread entirely with a **Web Worker**, which
runs on its own thread and messages results back, leaving the UI thread free for
what it is for. And when the pauses you want are between *user* events rather
than compute chunks, that is the job of debounce and throttle. The habit that
matters is the same in every case: never hold the one thread longer than a frame,
because everything the user can see or touch is waiting behind it. The
debounce-utility exercise builds the timer-based yielding that keeps event
handlers from monopolising it.
