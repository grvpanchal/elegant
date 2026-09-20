---
title: Google frontend interview loop
layout: doc
slug: google-frontend-loop
description: The loop Google runs for frontend engineers — the phone screen, the coding round, the UI and system design rounds, and the behavioural round — and which questions in the bank map to each.
order: 20
---

# Google frontend interview loop

Google's frontend loop is five rounds, and the ordering matters. Each round
filters for a skill the previous one could not see, so grinding one topic until
it is perfect leaves the other four rounds unprepared. The rounds are: a phone
screen, a coding round, a UI design round, a system design round, and a
behavioural round. This guide names the loop Google actually runs and points
you at the questions in this bank that map to each round.

## Round one: the phone screen

A short call with an engineer, usually over a shared document rather than an
editor. The signal is whether you can reason about JavaScript's execution model
out loud — closures, timers, `this` binding and the microtask queue — and
whether you can narrate a small component decision without a screen.

Map these bank questions to it:

- [Create a debounce utility](../practice/debounce-utility.html) — the classic
  phone-screen utility, and the trailing-call edge is what they push on.
- [Deep clone a value](../practice/deep-clone.html) — including the cycle that
  makes the naive version hang forever.
- [Build an event emitter](../practice/event-emitter.html) — and survive a
  handler that unsubscribes itself mid-emit.
- [Event Propagation Phases](../practice/quiz-event-propagation.html) — the DOM
  model you are expected to narrate without a screen.

## Round two: the coding round

A live coding session. Google's coding round is not about memorising
`Array.prototype` — it is about building something small and correct under
time, with state living at the right level and edge cases handled before they
are asked about. Expect the interviewer to watch how you talk while you type.

Map these bank questions to it:

- [Build a Counter component](../practice/counter-component.html) — props,
  state, clamping and a disabled button, tested against a live DOM.
- [Memoize a derived selector](../practice/memoized-selector.html) — a
  JavaScript round that is really about when caching is worth it.
- [Create a Redux-like store](../practice/simple-store.html) — getState,
  dispatch and subscribe, the shape under every state library.

## Round three: the UI design round

A component round graded on maintainability, not just correctness. The task is
usually small — a typeahead, a data table, a tabs molecule — and the grading is
on keyboard access, events named for what happened rather than what should
follow, and a component boundary that would survive a second use case.

Map these bank questions to it:

- [Make a data table sortable](../practice/data-table-sort.html) — stable,
  announced, keyboard-operable sorting that does not re-sort 5,000 rows.
- [Build an accessible combobox](../practice/accessible-combobox.html) — the
  hard one, done without a mouse.
- [Build a tabs molecule the arrow keys drive](../practice/tabs-molecule.html) —
  roving tabindex and one tab stop.
- [Build a theme toggle with no flash](../practice/theme-toggle.html) — respect
  the system theme and never show the wrong colours before hydration.

## Round four: the system design round

Frontend design questions at Google are about the seams between the browser and
everything else: rendering strategy, data loading, caching, bundle budgets, and
what happens on a slow phone on a train. "Design a search experience" is really
"tell me how you would decide between SSR and SSG, where the state lives, how
you paginate, and what breaks at ten times the traffic."

Map these bank questions to it:

- [Design a search-as-you-type experience](../practice/design-search-experience.html) —
  debounce, cancellation, out-of-order responses and the URL.
- [Design a localized application](../practice/design-localized-app.html) —
  locale detection, URL shape, bundle splitting and the formatting bugs that
  only appear in someone else's language.
- [Pick a rendering strategy](../practice/render-strategy-choice.html) — four
  briefs, four rendering decisions, and the cost each one hides.
- [Ship a responsive image the browser can choose](../practice/responsive-image-set.html) —
  srcset, sizes and an aspect-ratio box so nothing shifts.

## Round five: the behavioural round

The signal Google wants is evidence that you have owned something past the fun
part — shipped it, watched it break, and fixed it without blaming the last
person who touched it. The frontend-specific version is the accessibility and
performance conversation: a candidate who can say "I shipped a component, then
an audit caught the keyboard gap, and here is the guardrail I added" is
answering a question the interviewer had not yet asked.

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
it is the one Google's loop actually tests.

## Where this comes from

This guide describes the **commonly reported** shape of Google's frontend
loop, assembled from public candidate write-ups. It is not sourced from
Google, not endorsed by them, and hiring processes change without notice —
treat the round names and counts as a rehearsal structure, not as a schedule
you have been given. What is reliable here is the *skills* each round is
reaching for; those are the same wherever you interview, and they are what the
linked questions practise.
