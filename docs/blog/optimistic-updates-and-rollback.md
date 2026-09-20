---
title: "Optimistic updates: show it now, reconcile later"
layout: post
slug: optimistic-updates-and-rollback
date: 2026-08-26
author: The Elegant team
category: terminology
tags: [state, ux, async, patterns]
description: An optimistic update applies the change to the UI before the server confirms it, then rolls back if the server disagrees. It makes an app feel instant — and it is only safe if you plan the rollback.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [offline-first-list, retry-with-backoff]
---

An optimistic update shows the result of an action *immediately*, before the server
has confirmed it — you assume success, update the UI now, and reconcile when the
response arrives. Like a "❤" that fills the instant you tap it. It makes an app feel
instant instead of laggy, because the user is not waiting on a round-trip to see
their own action land. But the word "optimistic" is doing real work: you are betting
the request will succeed, and a bet needs a plan for losing. The whole discipline is
in the **rollback** — capturing enough state to undo the change cleanly when the
server disagrees. Skip that and an optimistic UI is just a UI that lies.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="ou-t ou-d" class="blog-figure__svg">
  <title id="ou-t">Apply the change immediately, send the request, then confirm or roll back</title>
  <desc id="ou-d">A user action updates the UI instantly and fires a request. On success the optimistic state is confirmed; on failure it rolls back to the snapshot taken before the change.</desc>
  <rect x="20" y="80" width="90" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="65" y="104" text-anchor="middle" fill="#155799" font-size="9">user acts</text>
  <path d="M110 100 L170 100" stroke="#819198" stroke-width="2" marker-end="url(#ou-a)"/>
  <rect x="170" y="80" width="120" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="230" y="98" text-anchor="middle" fill="#c2571a" font-size="9">UI updates NOW</text><text x="230" y="112" text-anchor="middle" fill="#819198" font-size="8">+ snapshot taken</text>
  <path d="M290 100 L350 100" stroke="#819198" stroke-width="2" marker-end="url(#ou-a)"/><text x="320" y="92" fill="#819198" font-size="8">request</text>
  <rect x="350" y="45" width="130" height="30" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="415" y="64" text-anchor="middle" fill="#157878" font-size="9">success → confirm</text>
  <rect x="350" y="120" width="130" height="30" rx="6" fill="#f3f6fa" stroke="#c2571a" stroke-width="2"/><text x="415" y="139" text-anchor="middle" fill="#c2571a" font-size="9">fail → roll back</text>
  <path d="M290 90 L348 62" stroke="#157878" stroke-width="1.5" marker-end="url(#ou-a)"/><path d="M290 112 L348 132" stroke="#c2571a" stroke-width="1.5" marker-end="url(#ou-a)"/>
  <path d="M415 150 C 415 185, 230 185, 230 122" fill="none" stroke="#c2571a" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#ou-a)"/><text x="320" y="182" text-anchor="middle" fill="#c2571a" font-size="8">restore snapshot</text>
  <defs><marker id="ou-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Update immediately and snapshot the old value; on success confirm, on failure restore the snapshot. The rollback is the part that makes it safe.</figcaption>
</figure>

## Snapshot, apply, then confirm or revert

The pattern has three moves and the first is the one people skip: capture the
current value *before* you change it, so you have something to restore. Then apply
optimistically, fire the request, and branch on the outcome:

```js
async function toggleLike(id) {
  const previous = store.getState().posts.byId[id].liked;   // 1. snapshot
  dispatch({ type: "LIKE_TOGGLED", id });                    // 2. apply NOW (instant UI)
  try {
    await api.setLike(id, !previous);                        // 3a. server confirms → keep it
  } catch (err) {
    dispatch({ type: "LIKE_TOGGLED", id });                  // 3b. failed → revert to snapshot
    toast("Couldn't update — try again");
  }
}
```

For a toggle the revert is symmetric (toggle back); for an add/remove or an edit you
restore the captured `previous` value explicitly.

## The server's response is the source of truth

Optimism is a *guess* about the server's answer, so when the real answer arrives it
wins. Often the server returns the authoritative record — a real id for the item you
optimistically added, a server-computed field — and you reconcile your placeholder
with it:

```js
// added a comment with a temp id; replace it with the server's real record
const temp = { id: `temp-${Date.now()}`, text, pending: true };
dispatch({ type: "COMMENT_ADDED", comment: temp });
const saved = await api.postComment(text);
dispatch({ type: "COMMENT_CONFIRMED", tempId: temp.id, comment: saved });  // real id, no dupe
```

The `pending` flag lets you style the in-flight item subtly (dimmed, no delete
button) so the user senses it is not yet final without being blocked.

## Use it where success is likely and reversible

Optimistic updates fit actions that **usually succeed** and are **cheap to undo** —
likes, toggles, reordering, adding a to-do, marking read. They are a poor fit for
actions that frequently fail or whose reversal is confusing or impossible — a
payment, an irreversible delete, anything with strong consistency needs — where the
honest UX is a pending state and a confirmed result. The failure path must be
*visible*: a silent rollback that flips the UI back with no explanation is worse
than a spinner, because the user thinks their action worked. So always pair the
revert with a message. Done well, optimistic UI is the single biggest perceived-speed
win available for write actions; done without a rollback plan, it is a bug generator.
The offline-first-list exercise builds exactly this snapshot-apply-reconcile loop,
where optimism is not a luxury but the only way the UI can respond at all.
