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
reading_minutes: 4
related_practice: [debounce-utility, retry-with-backoff]
---

JavaScript in the browser runs on a single thread, and that one fact explains a
whole category of "the page froze" bugs. If your code runs a long loop or a heavy
computation, nothing else can happen — no click handled, no scroll, no repaint —
until that code returns, because there is one thread and your code is holding it.
The event loop is the model that explains why, and knowing it tells you how to keep
the UI responsive.

## One thread, one call stack, a queue of tasks

The main thread has one call stack: it runs one thing at a time to completion.
Around it sits the event loop, which pulls the next task from a queue whenever the
stack is empty. A click, a timer firing, a network response arriving — each queues a
task, and the loop runs them one after another, each to completion, on the same
thread that also does layout and paint. So "asynchronous" does not mean "parallel":
your callbacks still run on the one thread, just later. Two pieces of your JavaScript
never run at the same instant.

## Why a long task freezes everything

Because a task runs to completion before the loop moves on, a function that takes 500ms
holds the thread for 500ms, during which no click is handled, no animation advances,
and no repaint happens — the page is frozen, and the user sees an unresponsive tab.
This is why a big synchronous loop, a huge JSON parse, or an expensive render janks
the UI: it is not that the work is slow in the abstract, it is that it monopolizes
the one thread everything else needs. The metric this shows up as is a long task and
poor interaction responsiveness (INP).

## Microtasks jump the queue

There is a subtlety worth knowing: promises resolve on the *microtask* queue, which
the event loop drains completely after each task, *before* rendering or the next
task. So `Promise.resolve().then(...)` runs sooner than `setTimeout(..., 0)`, and a
runaway chain of microtasks can starve rendering even without a long synchronous
loop — the loop keeps draining microtasks and never gets to paint. Knowing the
order (current task → all microtasks → render → next task) explains timing
surprises like "why did this run before that."

## Keeping the thread free

The fixes all amount to not hogging the thread. Break long work into chunks that
yield (`setTimeout`, `requestIdleCallback`, or `scheduler.postTask`) so the loop can
handle input between chunks. Move genuinely heavy computation off the main thread
into a Web Worker, which runs on its own thread and posts results back. And rate-limit
handlers that fire rapidly — debounce or throttle scroll, resize, and input — so you
are not queuing more work than the thread can clear. The debounce exercise is exactly
this thread-protection at the input layer, and understanding the loop is why
"just await it" does not make heavy synchronous work stop blocking.
