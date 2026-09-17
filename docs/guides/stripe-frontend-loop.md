---
title: Stripe frontend interview loop
layout: doc
slug: stripe-frontend-loop
description: The loop Stripe runs for frontend engineers — the phone screen, the coding round, the system design round and the behavioural round — and which questions in the bank map to each.
order: 10
---

# Stripe frontend interview loop

Stripe's frontend loop is four rounds, and each one is measuring a different
thing. The mistake candidates make is treating it as one long coding test and
grinding problems until something sticks. It is not. The rounds are ordered so
that each one filters for a skill the previous one could not see, and being
strong at one of them tells an interviewer almost nothing about the others.

This guide names the loop Stripe actually runs and points you at the questions
in this bank that map to each round, so you practise the round rather than the
topic.

## Round one: the phone screen

A short call, usually with an engineer, that is really a filter for "can this
person hold a technical conversation about the frontend at all". Expect a
couple of JavaScript questions and one component question, done out loud with
no editor. The signal is not whether you get the answer right; it is whether
you can reason about the language's execution model while talking.

Map these bank questions to it:

- [Event Propagation Phases](../practice/quiz-event-propagation.html) — the
  DOM model you are expected to narrate without a screen.
- [Create a debounce utility](../practice/debounce-utility.html) — the classic
  phone-screen utility, and the trailing-call edge is what they push on.
- [Where does an atom stop?](../practice/atom-boundaries.html) — a component
  boundary question you can answer in four minutes out loud.

## Round two: the coding round

A live coding session in a shared editor. Stripe's coding round is not about
memorising `Array.prototype` — it is about building something small and
correct under time, with the interviewer watching how you talk while you type.
The grading is on state living at the right level, events named for what
happened rather than what should follow, and edge cases handled before they are
asked about.

Map these bank questions to it:

- [Build a Counter component](../practice/counter-component.html) — props,
  state, clamping and a disabled button, tested against a live DOM.
- [Build an event emitter](../practice/event-emitter.html) — and survive a
  handler that unsubscribes itself mid-emit.
- [Deep clone a value](../practice/deep-clone.html) — including the cycle that
  makes the naive version hang forever.
- [Memoize a derived selector](../practice/memoized-selector.html) — a
  JavaScript round that is really about when caching is worth it.

## Round three: the system design round

The round people under-prepare, because it feels like backend system design
with the interesting parts removed. It is not. Stripe's frontend design
questions are about the seams between the browser and everything else:
rendering strategy, data loading, caching, bundle budgets, and what happens on
a slow phone on a train. "Design a dashboard" is really "tell me how you would
decide between SSR and SSG, where the state lives, how you paginate, and what
breaks at ten times the traffic."

Map these bank questions to it:

- [Design an embeddable widget](../practice/design-embeddable-widget.html) —
  real constraints, a hostile environment, and a versioning decision you cannot
  take back.
- [Design a search-as-you-type experience](../practice/design-search-experience.html) —
  debounce, cancellation, out-of-order responses and the URL.
- [Design the caching layer for a static app](../practice/cache-headers-basics.html) —
  the cache policy per artefact, and what breaks when you get one wrong.
- [Pick a rendering strategy](../practice/render-strategy-choice.html) — four
  briefs, four rendering decisions, and the cost each one hides.

## Round four: the behavioural round

Real, and not a formality. The signal Stripe wants is evidence that you have
owned something past the fun part — shipped it, watched it break, and fixed it
without blaming the last person who touched it. The frontend-specific version
of this is the accessibility and performance conversation: a candidate who can
say "I shipped a component, then an audit caught the keyboard gap, and here is
the guardrail I added so it does not regress" is answering a question the
interviewer had not yet asked.

Map these bank questions to it:

- [Gate a pull request on accessibility](../practice/harness-a11y-gate.html) —
  turn an accessibility audit into a check that runs on every change.
- [Guardrail a performance budget](../practice/harness-bundle-budget.html) — a
  size budget that fails a change and survives the week someone needs to exceed
  it.

## The shape that works

Interleave rather than grind. Week one, build breadth: one utility, one
component, one design walkthrough from each round above. Week two, depth on
your two weakest rounds. Week three, simulate: complete rounds under time, out
loud, with a timer. Talking while coding is a separate skill from coding, and
it is the one Stripe's loop actually tests.

## Where this comes from

This guide describes the **commonly reported** shape of Stripe's frontend
loop, assembled from public candidate write-ups. It is not sourced from
Stripe, not endorsed by them, and hiring processes change without notice —
treat the round names and counts as a rehearsal structure, not as a schedule
you have been given. What is reliable here is the *skills* each round is
reaching for; those are the same wherever you interview, and they are what the
linked questions practise.
