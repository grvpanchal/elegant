---
title: Amazon frontend interview loop
layout: doc
slug: amazon-frontend-loop
description: The loop Amazon runs for frontend engineers — the phone screen, the coding round, the system design round and the leadership-principles behavioural round — and which questions in the bank map to each.
order: 30
---

# Amazon frontend interview loop

Amazon's frontend loop is four rounds, and the one candidates misread is the
last. The coding and design rounds are real, but the behavioural round — the
one built on the Leadership Principles — carries as much weight as any of them,
and it is the round where otherwise strong candidates fail by treating it as a
formality. This guide names the loop Amazon actually runs and points you at the
questions in this bank that map to each round.

## Round one: the phone screen

A short call with an engineer, usually one or two JavaScript questions and one
component question done out loud. Amazon's phone screen is a filter for "can
this person hold a technical conversation about the frontend at all" — the
signal is whether you can reason about the language's execution model while
talking, not whether you memorised the answer.

Map these bank questions to it:

- [Create a debounce utility](../practice/debounce-utility.html) — the classic
  phone-screen utility, and the trailing-call edge is what they push on.
- [Event Propagation Phases](../practice/quiz-event-propagation.html) — the DOM
  model you are expected to narrate without a screen.
- [Where does an atom stop?](../practice/atom-boundaries.html) — a component
  boundary question you can answer in four minutes out loud.

## Round two: the coding round

A live coding session. Amazon's coding round is about building something small
and correct under time, with state living at the right level and edge cases
handled before they are asked about. Expect the interviewer to watch how you
talk while you type, and to push on the failure branch of whatever you build.

Map these bank questions to it:

- [Build a Counter component](../practice/counter-component.html) — props,
  state, clamping and a disabled button, tested against a live DOM.
- [Build an event emitter](../practice/event-emitter.html) — and survive a
  handler that unsubscribes itself mid-emit.
- [Retry a request with backoff](../practice/retry-with-backoff.html) — retry
  only what is worth retrying, back off exponentially, add jitter, and stop
  when the caller walks away.
- [Normalise a nested API response](../practice/normalize-entities.html) —
  flatten a deeply nested payload into entity tables keyed by id.

## Round three: the system design round

Amazon's frontend design questions are about the seams between the browser and
everything else: rendering strategy, data loading, caching, bundle budgets, and
what happens on a slow phone on a train. "Design a task list" is really "tell
me how you would decide between SSR and SSG, where the state lives, how you
paginate, and what breaks at ten times the traffic."

Map these bank questions to it:

- [Design an offline-first task list](../practice/offline-first-list.html) —
  writes that happen without a network, a sync that resolves conflicts, and a
  UI that never lies about what is saved.
- [Split a monolith into micro-frontends](../practice/design-micro-frontends.html) —
  four teams, one URL, and the shared state, routing and version skew that
  decide whether this helps or hurts.
- [Design an embeddable widget](../practice/design-embeddable-widget.html) —
  real constraints, a hostile environment, and a versioning decision you cannot
  take back.
- [Build an infinite-scroll list](../practice/infinite-scroll-list.html) — a
  sentinel, an IntersectionObserver, and all the ways an infinite list traps
  the people using it.

## Round four: the behavioural round

This is the Leadership Principles round, and it is not a formality. Amazon
wants evidence that you have owned something past the fun part — shipped it,
watched it break, and fixed it without blaming the last person who touched it.
The frontend-specific version is the accessibility and performance
conversation: a candidate who can say "I shipped a component, then an audit
caught the keyboard gap, and here is the guardrail I added so it does not
regress" is answering a question the interviewer had not yet asked.

Map these bank questions to it:

- [Gate a pull request on accessibility](../practice/harness-a11y-gate.html) —
  turn an accessibility audit into a check that runs on every change.
- [Guardrail a performance budget](../practice/harness-bundle-budget.html) — a
  size budget that fails a change and survives the week someone needs to exceed
  it.
- [Where does the session actually live?](../practice/session-and-tokens.html) —
  the security conversation that separates a candidate who has shipped from one
  who has only read about it.

## The shape that works

Interleave rather than grind. Week one, build breadth: one utility, one
component, one design walkthrough from each round above. Week two, depth on
your two weakest rounds. Week three, simulate: complete rounds under time, out
loud, with a timer. And do not skip the behavioural round — at Amazon it is
worth as much as the coding round, and it is the one you can actually prepare
for with the guardrail questions above.

## Where this comes from

This guide describes the **commonly reported** shape of Amazon's frontend
loop, assembled from public candidate write-ups. It is not sourced from
Amazon, not endorsed by them, and hiring processes change without notice —
treat the round names and counts as a rehearsal structure, not as a schedule
you have been given. What is reliable here is the *skills* each round is
reaching for; those are the same wherever you interview, and they are what the
linked questions practise.
