---
title: The state management playbook
layout: doc
slug: state-management
description: How to decide where a piece of state lives, why server state is not client state, and how the same architecture looks in Redux, NgRx and Pinia.
order: 30
---

# The state management playbook

Most state management problems are not library problems. They are placement
problems: a value ended up somewhere that cannot see everything it needs, or
somewhere that too much of the application can reach. Once a value is in the
wrong place, every library makes the symptom worse in its own idiom.

So the useful skill is not knowing Redux Toolkit's API. It is being able to
answer, for any value in your app, the question *where does this belong* — and
to defend the answer.

## Four questions that place any value

**Who reads it?** If the answer is one component and its children, it is
component state and it should stay there. The reflex to lift everything into a
global store is the single most common cause of applications that are slow for
no visible reason: every consumer re-renders on every change to anything.

**Who writes it, and when?** A value written by exactly one interaction is
simpler than one written from three places. If you find three writers, look for
a missing concept — usually they are all trying to express one thing.

**Does it survive a reload?** State that must survive belongs in the URL, in
storage, or on the server. The URL is under-used and it is almost always the
right home for filters, sort order, pagination and the open tab, because it
makes the view shareable and the back button work for free.

**Is it yours or the server's?** This is the question that changes the most and
gets asked the least.

## Server state is not client state

A list of orders fetched from an API is a *cache*. It has a loading status, an
error, a time it was fetched, a staleness policy and a revalidation strategy.
"Which row is selected" has none of those. Putting both in the same
[store](../state/store.html) with the same tools means hand-writing the cache
semantics yourself, in every feature, slightly differently.

The Redux-family answer is the request / success / fail
[action](../state/actions.html) triple with the fetch living in middleware —
a thunk, a saga, an NgRx effect. That is a fine pattern and it is what the
`chota-*` templates implement, precisely because it makes the cache semantics
explicit rather than implicit. What matters is that you *have* the pattern and
apply it uniformly: one shape for "in flight", one for "failed", one for
"loaded and stale".

The mistake to avoid is a `isLoading` boolean per feature, invented fresh each
time. Three booleans in, you will have a state where `isLoading` and `error`
are both true and nobody knows what the screen should say.

## Shape the state for writing, select it for reading

Store data the way it arrives and the way it is written — normalised, keyed by
id, one source of truth per entity. Then use
[selectors](../state/selectors.html) to build the shape each screen actually
wants.

This separation is what keeps a store from rotting. When components read the
store directly, every component becomes coupled to the storage shape, and you
cannot change the shape without touching all of them. When they read through
selectors, the shape is an implementation detail behind a function you can
change in one place.

Memoise selectors that derive expensive shapes, and be honest about what that
buys: it is not raw speed, it is *reference stability*. A selector that returns
a fresh array on every call defeats every downstream `memo`, which is why an
app can get slower after someone adds memoisation in the wrong layer.

## Side effects need a home with a name

Every application has work that is neither a pure reducer nor a render:
fetching, debouncing, retrying, sequencing two requests, cancelling the first
when the second arrives. Give it one home.

Thunks are the smallest thing that works and stay readable while effects are
independent. Sagas and effects earn their complexity when effects need to
coordinate — cancel-on-navigate, take-latest on a search box, a retry policy
with backoff. The tell that you have outgrown thunks is a thunk that sets a
flag so another thunk knows not to run.

Whatever you pick, the rule is the same: reducers stay pure, components stay
ignorant of transport, and every effect has an explicit failure branch. The
try/catch inside a saga that dispatches the `_FAIL` action is not boilerplate;
it is the only reason your UI knows the difference between "still loading" and
"gave up".

## The same architecture in four idioms

The `chota-*` templates exist to make one point: the placement decisions above
are identical across frameworks, and only the spelling changes.

Redux (classic) writes action type constants, a switch reducer and a thunk.
Redux Toolkit collapses the same thing into a slice with `createSlice` and
`createAsyncThunk`, and the request/success/fail triple becomes
`pending`/`fulfilled`/`rejected` — the same three states with better names.
NgRx keeps the triple explicit and moves effects into injectable classes, which
suits Angular's DI and makes testing effects pleasant. Pinia drops the reducer
ceremony entirely: a store is state, getters and actions, and the async call
sits in an action.

Pinia's ergonomics are the best of the four and its discipline is the weakest,
because nothing stops you mutating state from anywhere. That is the actual
trade — not "which is better" but "how much structure does this team need to
not regret it in a year".

## When a global store is the wrong answer

Not every app needs one. A page with server-rendered data, a few forms and no
cross-cutting client state does not benefit from a store; it benefits from the
URL, a data-fetching library and component state. Adding a store to that app
buys you indirection and a new place for bugs to hide.

The signal that you *do* need one is cross-cutting reads: three unrelated parts
of the screen needing the same value, or a value that must survive navigation
between routes. Until then, resist.

## Practice

- [Memoize a derived selector](../practice/memoized-selector.html) — build the
  reference-stability mechanism by hand, and watch the recomputation count.
- Read [Store](../state/store.html), [Actions](../state/actions.html) and
  [Reducer](../state/reducer.html) in that order if the vocabulary is new.
- Then compare `templates/chota-react-rtk` and `templates/chota-vue-pinia` on
  the same feature. The diff is the argument.
