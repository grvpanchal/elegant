---
title: "Design your loading and empty states before your happy path"
slug: optimistic-ui-and-loading-states
layout: post
date: 2026-07-05
author: The Elegant team
category: terminology
tags: [ui, ux, states, loading]
description: 'Every data-driven component has at least four states — loading, empty, error, and loaded — and the ones that are not the happy path are where real apps feel broken. Design all four, not just the screenshot.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [toast-notifications, offline-first-list, skeleton-list]
---

Every component that fetches data has at least four states, not one. There is
**loading** (the request is in flight), **empty** (it succeeded but there is
nothing to show), **error** (it failed), and **loaded** (the happy path everyone
designs). The mock in Figma shows the loaded state; the other three are where real
apps feel broken — a spinner that never resolves, a blank screen that looks like a
bug when the list is simply empty, a silent failure that leaves the user staring at
nothing. Designing all four *up front* is the difference between an app that feels
finished and one that feels finished only when the network is fast and the data is
present.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="ol-t ol-d" class="blog-figure__svg">
  <title id="ol-t">The four states of a data component: loading, empty, error, loaded</title>
  <desc id="ol-d">Four panels side by side — a skeleton for loading, a friendly message for empty, a retry prompt for error, and the real content for loaded — showing all four must be designed.</desc>
  <g font-size="10" text-anchor="middle">
    <rect x="20" y="45" width="140" height="90" rx="8" fill="#f3f6fa" stroke="#fe854c" stroke-width="2"/><text x="90" y="38" fill="#c2571a" font-weight="700">loading</text><rect x="35" y="60" width="110" height="10" rx="3" fill="#e6edf5"/><rect x="35" y="78" width="80" height="10" rx="3" fill="#eef2f7"/>
    <rect x="175" y="45" width="140" height="90" rx="8" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="245" y="38" fill="#155799" font-weight="700">empty</text><text x="245" y="95" fill="#819198">No results yet</text>
    <rect x="330" y="45" width="140" height="90" rx="8" fill="#f3f6fa" stroke="#c2571a" stroke-width="2"/><text x="400" y="38" fill="#c2571a" font-weight="700">error</text><text x="400" y="90" fill="#819198">Failed —</text><text x="400" y="104" fill="#157878">Retry</text>
    <rect x="485" y="45" width="140" height="90" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="555" y="38" fill="#157878" font-weight="700">loaded</text><rect x="500" y="60" width="110" height="14" rx="3" fill="#cfe0f0"/><rect x="500" y="80" width="110" height="14" rx="3" fill="#cfe0f0"/>
  </g>
  <text x="320" y="165" text-anchor="middle" fill="#819198" font-size="9">design all four — the middle two are where apps feel broken</text>
</svg>
<figcaption>The mock is the rightmost panel. The three to its left — loading, empty, error — are the states that decide whether the app feels solid or fragile.</figcaption>
</figure>

## Model the four states, then render each

The cleanest way to guarantee you handle all four is to make status a single value
(the request lifecycle from another post) and branch on it exhaustively, so the
compiler and your own eyes catch a missing case:

```jsx
function Results({ status, items }) {
  switch (status) {
    case "loading": return <SkeletonList />;                 // structure, not a bare spinner
    case "error":   return <ErrorState onRetry={reload} />;  // a way OUT of the failure
    case "success":
      return items.length
        ? <List items={items} />
        : <EmptyState message="No results — try a broader search" />;  // empty ≠ error
    default: return null;
  }
}
```

The `items.length` check is the state people forget: a successful, empty response is
*not* an error and *not* a bug — it needs its own friendly, actionable message.

## Each non-happy state has a job

These states are not just "not the content" — each one has work to do. **Loading**
should preserve layout (a skeleton, so nothing jumps when data lands) and only
appear after a beat, so a fast response does not flash a spinner. **Empty** should
explain *why* it is empty and offer the next step ("No orders yet — place your
first"). **Error** must give a way forward — a retry button, a support link — never
a dead end:

```jsx
function EmptyState({ message, action }) {
  return (
    <div className="empty">
      <p>{message}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
```

## Designing them first changes the component

The practical reason to design the four states *before* the happy path is that it
changes the component's API. If you only think about "loaded," you write a component
that takes `items` and breaks when `items` is undefined during loading. If you
design all four first, you naturally give it `status`, an error, and an empty
message — and it is robust from the start rather than patched later under a bug
report. This is also where the request/success/fail triple and the four-state UI
meet: the triple produces the states, and this design work spends them. Handle all
four deliberately and your app stops having a "works on my fast connection with
seeded data" quality. The skeleton-list and toast-notifications exercises build the
loading and error states specifically, because those are the two most often skipped
until a user hits them.
