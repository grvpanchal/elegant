---
title: "State machines turn impossible UI states into unreachable ones"
slug: state-machines-for-ui
layout: post
date: 2026-06-22
author: The Elegant team
category: terminology
tags: [ui, state, patterns, reliability]
description: 'A pile of booleans can represent nonsense — loading and error true at once. A state machine names the legal states and the transitions between them, so the impossible combinations simply cannot occur.'
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [tabs-molecule, toast-notifications, offline-first-list]
---

Model a piece of UI with a handful of booleans — `isLoading`, `isError`,
`isSuccess`, `isEmpty` — and you have quietly created a space of `2^4 = 16` possible
combinations, most of which are nonsense. `isLoading && isError` is meaningless;
`isSuccess && isEmpty && isError` is a contradiction. Your code then sprouts
defensive conditionals to paper over states that should never have been
representable in the first place. A **state machine** fixes this at the root:
instead of independent flags, you have one `status` that can be exactly one of a
named set of states, with explicit rules for which transitions are legal. The
impossible combinations do not need guarding — they cannot be expressed.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="sm-t sm-d" class="blog-figure__svg">
  <title id="sm-t">A single status enum with legal transitions replaces a set of independent booleans</title>
  <desc id="sm-d">Four named states — idle, loading, success, error — with arrows for the only legal transitions between them. A dot travels the happy path from idle through loading to success.</desc>
  <g font-size="12" font-weight="700" text-anchor="middle">
    <rect x="30" y="90" width="100" height="46" rx="9" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="80" y="118" fill="#155799">idle</text>
    <rect x="210" y="90" width="110" height="46" rx="9" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="265" y="118" fill="#c2571a">loading</text>
    <rect x="420" y="30" width="140" height="46" rx="9" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="490" y="58" fill="#157878">success</text>
    <rect x="420" y="150" width="140" height="46" rx="9" fill="#f3f6fa" stroke="#c2571a" stroke-width="2"/><text x="490" y="178" fill="#c2571a">error</text>
  </g>
  <g stroke="#819198" stroke-width="2" fill="none" marker-end="url(#sm-a)">
    <path d="M130 113 L206 113"/><path d="M320 105 L416 65"/><path d="M320 122 L416 165"/><path d="M420 172 C 360 200, 300 160, 300 138"/>
  </g>
  <text x="165" y="104" fill="#606c71" font-size="10">FETCH</text><text x="360" y="78" fill="#157878" font-size="10">OK</text><text x="360" y="160" fill="#c2571a" font-size="10">FAIL</text>
  <defs><marker id="sm-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
  <circle r="7" fill="#157878"><animateMotion dur="4s" repeatCount="indefinite" keyPoints="0;0.4;0.8;0.8" keyTimes="0;0.4;0.8;1" calcMode="linear" path="M80 113 L265 113 L490 53 L490 53"/></circle>
</svg>
<figcaption>One status, four legal states, four legal transitions. "loading and error at once" is not on the diagram, so it cannot happen.</figcaption>
</figure>

## Replace the boolean soup with one status

The refactor is to collapse the flags into a single enum and store the associated
data alongside it. Four states, and each carries only what it needs:

```js
// not: { isLoading, isError, isSuccess, data, error }  ← 16 combos, most invalid
// but: one status, and data/error that only exist in the right state
const initial = { status: "idle", data: null, error: null };
```

Now `status` is the truth, and a component reads it as a single switch — there is
no "what if loading AND error" branch, because the value cannot hold both:

```jsx
switch (status) {
  case "idle":    return <Prompt />;
  case "loading": return <Spinner />;
  case "success": return <List items={data} />;
  case "error":   return <Error message={error} onRetry={retry} />;
}
```

## Make the transitions explicit and total

The second half of a machine is naming the *legal* transitions — which events move
which state to which. A transition function that only knows the allowed moves makes
an illegal one a no-op instead of a corrupt state:

```js
function transition(state, event) {
  switch (state.status) {
    case "idle":    return event === "FETCH" ? { ...state, status: "loading" } : state;
    case "loading":
      if (event === "OK")   return { ...state, status: "success" };
      if (event === "FAIL") return { ...state, status: "error" };
      return state;                    // any other event: ignored, not a crash
    // success / error transition back to loading on a retry event
    default: return state;
  }
}
```

An `OK` arriving while `idle` does nothing, because there is no such edge on the
diagram — the race that would corrupt a boolean model simply has nowhere to land.

## Where machines earn their keep

Not every widget needs a formal machine, but the pattern pays off exactly where
booleans multiply and race: async data (the request lifecycle), multi-step flows
(a checkout, a wizard), anything with modes (a media player: idle/playing/paused/
buffering), and toggles that must coordinate. For the simplest cases a hand-rolled
`status` enum and a `switch` is plenty; for genuinely complex charts of states,
nested and parallel, a library like XState gives you the same guarantees with
tooling and visualisation. Either way the win is the same: you enumerate the states
that *should* exist, and everything else becomes unrepresentable rather than merely
discouraged. The toast-notifications and tabs-molecule exercises are small machines
in disguise — a set of modes and the legal moves between them — and building them
this way is the fastest cure for boolean soup.
