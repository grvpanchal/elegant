---
title: "The request/success/fail triple is the shape of every fetch"
layout: post
slug: the-request-success-fail-triple
date: 2026-08-28
author: The Elegant team
category: terminology
tags: [state, async, patterns, redux]
description: 'Every asynchronous call has three outcomes worth modelling — it started, it worked, it failed — and a single isLoading boolean cannot represent them. Model the triple as a state machine and your spinners, errors, and race conditions all fall into place.'
cover: /assets/img/state-system-diagram.png
reading_minutes: 6
related_practice: [action-creators, retry-with-backoff, normalize-entities]
---

The most reliable pattern in async state management is also the most boring: for
every request, model three outcomes — `REQUEST`, `SUCCESS`, and `FAIL`. Teams that
skip it and reach for a lone `isLoading` boolean end up with spinners that never
stop, errors that never clear, and race conditions they cannot explain. The triple
is not ceremony. It is the minimum needed to represent what actually happens when
you talk to a server, and once you draw it as a state machine the whole thing
becomes obvious.

## Three outcomes, not two

A fetch is not "loading or not." Before it starts you are **idle**. When it starts
you are **loading**. Then you are either **success** (with data) or **error** (with
a message). A single `isLoading` flag collapses four states into two and loses
information: it cannot tell "haven't asked yet" from "asked and got nothing," and
it has nowhere to put the error. Drawn out, the legal states and the transitions
between them form a small machine — and transitions that are not on the machine
(a `SUCCESS` arriving while `idle`) simply cannot corrupt your state:

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 660 260" role="img" aria-labelledby="rsf-t rsf-d" class="blog-figure__svg">
  <title id="rsf-t">The request lifecycle as a state machine</title>
  <desc id="rsf-d">idle transitions to loading on REQUEST; loading transitions to success on SUCCESS or error on FAIL; success and error return to loading on a new REQUEST or retry.</desc>
  <defs>
    <marker id="rsf-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="#819198"/>
    </marker>
  </defs>
  <!-- transitions -->
  <line x1="150" y1="130" x2="250" y2="130" stroke="#819198" stroke-width="2" marker-end="url(#rsf-arrow)"/>
  <text x="160" y="120" fill="#606c71" font-size="12" font-weight="700">REQUEST</text>
  <line x1="360" y1="105" x2="470" y2="60" stroke="#819198" stroke-width="2" marker-end="url(#rsf-arrow)"/>
  <text x="372" y="78" fill="#157878" font-size="12" font-weight="700">SUCCESS</text>
  <line x1="360" y1="155" x2="470" y2="200" stroke="#819198" stroke-width="2" marker-end="url(#rsf-arrow)"/>
  <text x="378" y="196" fill="#c2571a" font-size="12" font-weight="700">FAIL</text>
  <path d="M520 90 C 600 120, 600 140, 520 175" fill="none" stroke="#dce6f0" stroke-width="2" marker-end="url(#rsf-arrow)"/>
  <text x="556" y="135" fill="#819198" font-size="11">retry</text>
  <!-- states -->
  <g font-size="14" font-weight="700" text-anchor="middle">
    <rect x="40" y="105" width="110" height="50" rx="9" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="95" y="135" fill="#155799">idle</text>
    <rect x="250" y="105" width="110" height="50" rx="9" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="305" y="135" fill="#c2571a">loading</text>
    <rect x="470" y="35" width="150" height="50" rx="9" fill="#f3f6fa" stroke="#157878" stroke-width="2"/><text x="545" y="65" fill="#157878">success (data)</text>
    <rect x="470" y="175" width="150" height="50" rx="9" fill="#f3f6fa" stroke="#c2571a" stroke-width="2"/><text x="545" y="205" fill="#c2571a">error (message)</text>
  </g>
  <!-- animated marker cycling through the states -->
  <circle r="8" fill="#157878" opacity="0.9">
    <animateMotion dur="5s" repeatCount="indefinite"
      keyPoints="0;0.28;0.6;1" keyTimes="0;0.35;0.7;1" calcMode="linear"
      path="M95 130 L305 130 L545 60 L305 130"/>
  </circle>
</svg>
<figcaption>The request lifecycle: idle → loading → success/error, and back to loading on retry. The dot rides the happy path; FAIL branches down.</figcaption>
</figure>

## Model the state, then the reducer writes itself

Store a `status` enum plus `data` and `error`. Each of the three actions is a pure
transition — and note that `REQUEST` clears the previous error, so a stale message
never lingers under a fresh spinner:

```js
const initial = { status: "idle", data: null, error: null };

function resource(state = initial, action) {
  switch (action.type) {
    case "REQUEST":  return { ...state, status: "loading", error: null };
    case "SUCCESS":  return { status: "success", data: action.data, error: null };
    case "FAIL":     return { ...state, status: "error", error: action.error };
    default:         return state;
  }
}
```

Components then read `status` and render the matching state — they never juggle
flags:

```jsx
function UserList({ status, data, error }) {
  if (status === "loading") return <Spinner />;
  if (status === "error")   return <Error message={error} onRetry={reload} />;
  if (status === "success") return <List items={data} />;
  return <Idle />;                     // haven't asked yet — distinct from "empty"
}
```

## Dispatch the triple around the fetch

The three actions bracket the async call. Because reducers must stay pure, the
`await` lives in a thunk (or saga), not in the reducer:

```js
const load = (url) => async (dispatch) => {
  dispatch({ type: "REQUEST" });
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    dispatch({ type: "SUCCESS", data: await res.json() });
  } catch (err) {
    dispatch({ type: "FAIL", error: err.message });
  }
};
```

## The triple gives races a place to live

Model the request as a first-class thing and the classic race — the user searches
"cat", then "cats", and the slower "cat" response lands last and overwrites the
newer results — becomes representable. Tag each request and let `SUCCESS` ignore a
result that is not the latest:

```js
let latest = 0;
const search = (q) => async (dispatch) => {
  const id = ++latest;                       // this request's ticket
  dispatch({ type: "REQUEST" });
  const data = await fetchResults(q);
  if (id !== latest) return;                 // a newer search started — drop this
  dispatch({ type: "SUCCESS", data });
};
```

A lone boolean has no way to express "this response is stale"; the triple does,
because the request was a real, identifiable event rather than a flag flip.

Every data-fetching library you might adopt implements exactly this triple under
the hood, exposing `isLoading`, `data`, and `error` because those are the three
outcomes that matter. Whether you hand-roll it or adopt a library, model the
request as three outcomes, not one flag — the state machine above is the whole
idea. The action-creators exercise builds the triple's actions, and
retry-with-backoff layers a real failure policy onto the `error` state.
