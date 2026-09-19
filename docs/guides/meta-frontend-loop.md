---
title: Meta frontend interview loop
layout: doc
slug: meta-frontend-loop
description: The loop Meta runs for frontend engineers — the phone screen, the coding round, the system design round and the behavioural round — and which questions in the bank map to each.
order: 40
---

# Meta frontend interview loop

Meta's frontend loop is four rounds, and it is the most state-heavy of the big
company loops. Meta's products are large client-rendered applications, so the
questions lean hard on where a value lives, how the store is shaped, and how
the URL and the server stay in sync with the client. This guide names the loop
Meta actually runs and points you at the questions in this bank that map to
each round.

## Round one: the phone screen

A short call with an engineer, usually one or two JavaScript questions and one
component question done out loud. Meta's phone screen is a filter for "can this
person hold a technical conversation about the frontend at all" — the signal is
whether you can reason about the language's execution model while talking.

Map these bank questions to it:

- [Create a debounce utility](../practice/debounce-utility.html) — the classic
  phone-screen utility, and the trailing-call edge is what they push on.
- [Event Propagation Phases](../practice/quiz-event-propagation.html) — the DOM
  model you are expected to narrate without a screen.
- [Where does an atom stop?](../practice/atom-boundaries.html) — a component
  boundary question you can answer in four minutes out loud.

## Round two: the coding round

A live coding session. Meta's coding round is about building something small
and correct under time, with state living at the right level and edge cases
handled before they are asked about. Because Meta's products are state-heavy,
expect the coding round to reach into the store: reducers, middleware order,
and selectors.

Map these bank questions to it:

- [Implement a Redux-style reducer with immutability](../practice/counter-reducer.html) —
  build a reducer that handles state updates immutably for a simple counter.
- [Combine Reducers](../practice/combine-reducers.html) — combine multiple
  reducer functions into a single reducer.
- [Apply Middleware to a Store's Dispatch](../practice/apply-middleware.html) —
  composable store enhancers.
- [What order does middleware run in?](../practice/middleware-order.html) — the
  part of a Redux store that is a pipeline, not a switch.
- [Memoize a derived selector](../practice/memoized-selector.html) — a
  JavaScript round that is really about when caching is worth it.

## Round three: the system design round

Meta's frontend design questions are about the seams between the browser and
everything else: rendering strategy, data loading, caching, bundle budgets, and
what happens on a slow phone on a train. "Design a feed" is really "tell me how
you would decide between SSR and SSG, where the state lives, how you paginate,
and what breaks at ten times the traffic."

Map these bank questions to it:

- [Design an embeddable widget](../practice/design-embeddable-widget.html) —
  real constraints, a hostile environment, and a versioning decision you cannot
  take back.
- [Proxy it or fix CORS?](../practice/proxy-and-cors.html) — when a dev proxy
  is the right tool and when it hides a problem you will meet in production.
- [Round-trip filter state through the URL](../practice/query-string-state.html) —
  serialise a filter object to a query string and parse it back, so a filtered
  view is shareable and the back button works.
- [Design a search-as-you-type experience](../practice/design-search-experience.html) —
  debounce, cancellation, out-of-order responses and the URL.

## Round four: the behavioural round

Real, and not a formality. Meta wants evidence that you have owned something
past the fun part — shipped it, watched it break, and fixed it without blaming
the last person who touched it. The frontend-specific version is the
accessibility and performance conversation: a candidate who can say "I shipped
a component, then an audit caught the keyboard gap, and here is the guardrail I
added so it does not regress" is answering a question the interviewer had not
yet asked.

Map these bank questions to it:

- [Gate a pull request on accessibility](../practice/harness-a11y-gate.html) —
  turn an accessibility audit into a check that runs on every change.
- [Guardrail a store's shape](../practice/harness-state-shape.html) — encode
  "this store is well shaped" as a script, then discover which of your rules an
  agent can satisfy without doing what you meant.

## The shape that works

Interleave rather than grind. Week one, build breadth: one utility, one
component, one design walkthrough from each round above. Week two, depth on
your two weakest rounds. Week three, simulate: complete rounds under time, out
loud, with a timer. And because Meta's loop is state-heavy, spend the extra
evening on the store questions — they are the ones that separate a candidate
who has shipped a large application from one who has only built a page.

## Where this comes from

This guide describes the **commonly reported** shape of Meta's frontend
loop, assembled from public candidate write-ups. It is not sourced from
Meta, not endorsed by them, and hiring processes change without notice —
treat the round names and counts as a rehearsal structure, not as a schedule
you have been given. What is reliable here is the *skills* each round is
reaching for; those are the same wherever you interview, and they are what the
linked questions practise.
