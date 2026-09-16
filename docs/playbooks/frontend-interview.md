---
title: The frontend interview playbook
layout: doc
slug: frontend-interview
description: What frontend interviews actually test, how to prepare for each round, and the failure modes that sink otherwise strong candidates.
order: 10
---

# The frontend interview playbook

You have three weeks, a full-time job, and a loop with four rounds you have
only been given the names of. The temptation is to grind problems until
something sticks. That is the most expensive way to prepare, because frontend
loops do not test one skill four times — they test four different things, and
being strong at one of them tells an interviewer almost nothing about the
others.

## What each round is actually measuring

**The JavaScript round** is not about whether you have memorised
`Array.prototype` — it is about whether you understand the language's
execution model well enough to build something on top of it. That is why
`debounce`, `throttle`, `deepClone`, `promisify` and a mini event emitter come
up so often. Each one forces you to combine closures, timers, `this` binding
and the microtask queue, and each one has an obvious version that works and a
correct version that also handles the edge that matters: a debounce that drops
the trailing call, a clone that loops forever on a cycle, an emitter that
breaks when a handler unsubscribes itself mid-emit.

Prepare for it by writing implementations from scratch and then *attacking your
own code*. What happens on a second call before the timer fires? What happens
if the argument is `undefined`? The interviewer will ask exactly these, and the
difference between a candidate who has thought about them and one who has not
is visible in about fifteen seconds.

**The UI coding round** measures whether you can build a component someone else
would want to maintain. The task is usually small — a typeahead, a star rating,
an accordion, a data table with sorting. The grading is not. Interviewers look
for state that lives at the right level, events that are named for what
happened rather than what should follow, keyboard access that works, and a
component boundary that would survive a second use case.

This is where the [atomic design](../ui/atomic-design.html) vocabulary earns
its keep. If you can say "this is an [atom](../ui/atom.html), so it takes props
and emits events and never touches the store; the fetching belongs in a
container above it" — and then build exactly that — you have answered a
question the interviewer had not yet asked. Candidates who cannot articulate
the boundary usually end up putting a `fetch` inside a button, and then spend
the last ten minutes explaining why it is fine.

**The system design round** is the one people under-prepare, because it feels
like backend system design with the interesting parts removed. It is not. A
frontend design question is about the seams between the browser and everything
else: rendering strategy, data loading, caching, bundle budgets, and what
happens on a slow phone on a train. "Design a news feed" is really "tell me how
you would decide between [SSR](../server/ssr.html) and
[SSG](../server/ssg.html), where the state lives, how you paginate, and what
breaks at ten times the traffic."

**The behavioural round** is real and it is not a formality. The signal
interviewers want is evidence that you have owned something past the fun part —
shipped it, watched it break, and fixed it without blaming the last person who
touched it.

## A three-week shape that works

The mistake is to spend week one on JavaScript, week two on UI, week three on
design. Skills decay, and the last thing you practise is the only thing you are
sharp at on the day. Interleave instead.

Spend the first week building breadth: implement six or seven small utilities,
build two components end to end, and read one design walkthrough. Get every
round *started* even if none of them is good yet. The point is to find out
where you are weak while you still have two weeks to do something about it.

Week two is depth on your two weakest areas, and only those. If your UI round
is shaky, build five components and delete each one before rebuilding it from
memory the next day. Repetition beats variety here, because the thing you are
training is not knowledge, it is fluency: typing an accessible listbox without
stopping to remember which ARIA attributes go where.

Week three is simulation. Do complete rounds under time, out loud, with a
timer, ideally with another person. Talking while coding is a separate skill
from coding, and it is the one that is tested. Most candidates discover in
week three that they go silent the moment a problem gets hard — which is
precisely when the interviewer most needs to hear from them.

## The failure modes

**Silence under pressure.** An interviewer cannot give you credit for thinking
they cannot see. When you get stuck, say what you are considering and why you
have not picked it yet. "I could store the filter in the URL or in component
state — URL is better for sharing but I need to handle the empty case, let me
start with state and note it" is a stronger answer than the correct choice made
silently.

**Building for the demo.** Hard-coding the happy path to get something on
screen feels productive and reads as a warning sign. Handle the empty state
first; it takes thirty seconds and it tells the interviewer you have shipped
software before.

**Optimising before measuring.** Reaching for `useMemo`, virtualisation or a
web worker in the first five minutes suggests you have learned the vocabulary
of performance without the discipline. Say what you would measure and what
number would make you reach for the tool.

**Treating accessibility as a bonus round.** A button that is a `<div>` is a
correctness bug, not a polish item, and most interviewers now grade it that
way. Semantic elements cost nothing and save you the ARIA.

**Explaining a trade-off without picking a side.** "It depends" is only an
answer if you then say what it depends on and which way you would go. Take a
position; you can change it when the interviewer pushes.

## Practice

Start with these, in this order:

- [Where does an atom stop?](../practice/atom-boundaries.html) — the component
  boundary question, in four minutes rather than four hours.
- [Build a loading Button atom](../practice/loading-button-atom.html) — a UI
  round in miniature, with the width-collapse detail most people miss.
- [Memoize a derived selector](../practice/memoized-selector.html) — a
  JavaScript round that is really a question about when caching is worth it.
- [Design an embeddable widget](../practice/design-embeddable-widget.html) — a
  system design round with real constraints instead of a whiteboard cloud.

Then use a [study plan](../plans/) to keep the interleaving honest. The plans
declare their hours and the site checks the arithmetic, so a plan that says
three months cannot quietly be an afternoon.
