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
reading_minutes: 3
related_practice: [debounce-utility, design-search-experience]
---

Debounce and throttle both rate-limit a function, so they get lumped together and
swapped by mistake. They solve different problems. **Debounce** waits until the
activity stops — "do this once the user is done." **Throttle** enforces a maximum
rate — "do this at most every N milliseconds while activity continues." Pick by
whether you care about the *end* of a burst or a *steady cadence* during it.

## Debounce: wait for quiet

Debounce delays the call until a set time has passed with no new triggers. Every
new event resets the timer. This is right for search-as-you-type: you do not want
to fire a request on every keystroke, you want one request once the user pauses.
It is right for validating a field after typing stops, or saving a draft a moment
after the last edit. The trade-off is latency — nothing happens until the pause —
and the edge case is the trailing versus leading call: usually you want the
trailing one (act after the burst), sometimes both.

## Throttle: a steady rate

Throttle lets the function run immediately, then ignores calls until the interval
elapses, then allows one again. Use it when events fire continuously and you want
regular updates rather than a final one: scroll position, a resize handler, a
drag that repaints, pointer tracking. Debouncing a scroll handler would mean
*nothing* updates until the user stops scrolling — exactly wrong. Throttle keeps
it responsive at a bounded cost.

## The edges that separate a toy from a real one

Writing a debounce that merely delays is easy; writing one you would ship takes
care at the edges. Do you fire on the leading edge (act immediately, then ignore
the burst), the trailing edge (act after the pause), or both? Search-as-you-type
almost always wants trailing. Can the pending call be cancelled when the
component unmounts, so a resolved request does not set state on a dead component?
Does the debounced function return a promise the caller can await, or fire and
forget? Throttle has its own edge: after the interval, do you run with the most
recent arguments or the ones from when the timer started — the difference matters
for a live position. These are the details an interviewer probes and a production
utility handles, and they are why "just use a library" is fine until the library
makes a choice that does not match your case.

## The tell for each

Ask what "too often" means for your case. If the problem is "I only care about
the final value after they stop," debounce. If it is "I need updates while it
keeps happening, just not on every single event," throttle. A search box that
feels laggy is often a throttle where a debounce belonged (firing requests
mid-burst); a scroll effect that stutters or never updates is often a debounce
where a throttle belonged.

Both are a handful of lines with a timer and a closure, and writing one from
scratch — handling the trailing call and cancellation — is the fastest way to
understand the difference for good. The debounce exercise walks through exactly
that, and the search-experience design question is where the choice shows up.
