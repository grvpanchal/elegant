---
title: "Server state is not client state, and treating them the same hurts"
layout: post
slug: server-state-is-not-client-state
date: 2026-08-27
author: The Elegant team
category: terminology
tags: [state, architecture, caching, async]
description: The data you fetch from a server and the state your UI owns are different animals with different rules. Cramming server data into your Redux store as if you owned it is the source of most stale-data bugs.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [offline-first-list, normalize-entities, retry-with-backoff]
---

There are two kinds of state in a frontend app and they obey different rules.
**Client state** is state your UI *owns* — a modal's open flag, a form draft, the
selected tab. It is synchronous, it is the source of truth, and only your app can
change it. **Server state** is data that lives on a server and you merely *hold a
copy of* — the user record, the product list, the order history. It is
asynchronous, it can be changed by other users while you hold it, and it can go
stale the moment you fetch it. The most common state-management mess comes from
treating the second like the first: dumping fetched data into your Redux store as
if you owned it, and then hand-rolling caching, refetching, and staleness — badly.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="ss2-t ss2-d" class="blog-figure__svg">
  <title id="ss2-t">Client state is owned and synchronous; server state is a cached copy that can go stale</title>
  <desc id="ss2-d">Left: client state owned by the UI, the source of truth. Right: server state whose truth lives on the server; the client holds a copy that another user can invalidate.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">client state</text>
  <rect x="60" y="45" width="170" height="60" rx="8" fill="#e8eefb" stroke="#155799" stroke-width="2.5"/><text x="145" y="72" text-anchor="middle" fill="#155799" font-size="10">modal, tab, draft</text><text x="145" y="90" text-anchor="middle" fill="#819198" font-size="9">owned · sync · truth</text>
  <line x1="330" y1="18" x2="330" y2="185" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">server state</text>
  <rect x="380" y="45" width="150" height="50" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="455" y="66" text-anchor="middle" fill="#157878" font-size="10">server (truth)</text><text x="455" y="83" text-anchor="middle" fill="#819198" font-size="9">others can change it</text>
  <path d="M455 95 L455 125" stroke="#819198" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#ss2-a)"/><text x="500" y="115" fill="#819198" font-size="8">copy</text>
  <rect x="380" y="127" width="150" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="455" y="145" text-anchor="middle" fill="#c2571a" font-size="9">client cache</text><text x="455" y="160" text-anchor="middle" fill="#819198" font-size="8">can be stale</text>
  <defs><marker id="ss2-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Client state is the truth and you own it. Server state's truth lives elsewhere; what you hold is a copy with a shelf life, and naming it a cache is what keeps the bugs out.</figcaption>
</figure>

## The bug: editing the cache as if it were the truth

When you treat fetched data as owned client state, you store it, then let the app
mutate that stored copy directly, and you have quietly created a second source of
truth that drifts from the server the moment anyone else changes the record:

```js
// TRAP: server data stored and edited as if the client owned it
case "USER_NAME_CHANGED":
  return { ...state, user: { ...state.user, name: action.name } };
// nothing here knows the server is the real owner — this copy can now lie
```

It looks fine until another tab, another user, or a failed save makes your stored
copy disagree with reality, and now you are writing reconciliation code you never
planned for.

## The fix: name it a cache, and give it cache rules

The honest model is that server data in your store is a **cache**, and a cache has
questions client state never does: how fresh is it, when do I refetch, what happens
on error, how do I dedupe two components asking for the same thing. Encode that
explicitly — the request lifecycle plus a fetched-at stamp — rather than pretending
it is owned:

```js
// server state modelled as what it is: a cache with status and freshness
const initial = { status: "idle", data: null, error: null, fetchedAt: 0 };
// REQUEST → loading; SUCCESS → { data, fetchedAt: now }; FAIL → error
// and a selector can decide "stale?" from fetchedAt, then trigger a refetch
```

## Often the right tool is not your store at all

Because server state's needs are so consistent — cache, revalidate, dedupe,
refetch, retry — there are libraries built for exactly it (React Query, SWR, RTK
Query), and reaching for one usually removes more code than it adds:

```js
// the cache concerns handled for you; you just declare the fetch and its key
const { data, isLoading, error } = useQuery(["user", id], () => fetchUser(id), {
  staleTime: 30_000,   // trust the cache for 30s, then revalidate in the background
});
```

The rule of thumb is a clean split: keep **client state** (owned, synchronous,
UI-only) in your store or component state, and treat **server state** as a cache,
ideally with a query library that already solved caching correctly. Most "why is
this data stale / duplicated / flickering" bugs trace back to one confusion —
storing a borrowed copy as if it were owned truth. Name it a cache and its rules
follow. The offline-first-list and retry-with-backoff exercises live entirely in
server-state territory, which is where the difference between "owned" and "cached"
stops being philosophy and starts preventing bugs.
