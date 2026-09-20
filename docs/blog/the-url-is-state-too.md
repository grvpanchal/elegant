---
title: "The URL is state too — and often the right place for it"
layout: post
slug: the-url-is-state-too
date: 2026-08-22
author: The Elegant team
category: terminology
tags: [state, routing, url, ux]
description: Filters, tabs, search queries and pagination all belong in the URL more often than in a store. If a user would want to bookmark, share, or reload into a view, that view's state should live in the address bar.
cover: /assets/img/state-system-diagram.png
reading_minutes: 5
related_practice: [query-string-state, design-search-experience]
---

The address bar is a state container, and it is one developers routinely ignore.
Filters, the active tab, a search query, the current page of results, a sort order
— teams stash all of these in a component's `useState` or a Redux slice, and in
doing so throw away three things the URL gives for free: the state survives a
reload, it can be bookmarked, and it can be shared. The test is simple: **if a user
would reasonably want to bookmark, share, or reload back into this exact view, that
view's state belongs in the URL.** Put it in local state instead and you have built
a view no one can link to and everyone loses on refresh.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="us-t us-d" class="blog-figure__svg">
  <title id="us-t">Local state is lost on reload and share; URL state survives both</title>
  <desc id="us-d">Left: filters in local state, a reload or a shared link loses them. Right: the same filters in the query string, so reload and share reproduce the exact view.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">local state</text>
  <rect x="50" y="42" width="200" height="30" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="150" y="61" text-anchor="middle" fill="#c2571a" font-size="9">filter=shoes, page=3 (in memory)</text>
  <path d="M150 72 L150 100" stroke="#c2571a" stroke-width="2" marker-end="url(#us-a)"/><text x="200" y="90" fill="#c2571a" font-size="8">reload / share</text>
  <rect x="70" y="102" width="160" height="30" rx="5" fill="#f3f6fa" stroke="#819198"/><text x="150" y="121" text-anchor="middle" fill="#819198" font-size="9">back to defaults — lost</text>
  <line x1="330" y1="18" x2="330" y2="175" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">URL state</text>
  <rect x="380" y="42" width="220" height="30" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="490" y="61" text-anchor="middle" fill="#157878" font-size="8">?filter=shoes&amp;page=3</text>
  <path d="M490 72 L490 100" stroke="#157878" stroke-width="2" marker-end="url(#us-a)"/><text x="540" y="90" fill="#157878" font-size="8">reload / share</text>
  <rect x="400" y="102" width="180" height="30" rx="5" fill="#e8f0f8" stroke="#157878"/><text x="490" y="121" text-anchor="middle" fill="#157878" font-size="9">exact same view — restored</text>
  <defs><marker id="us-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>The same filter state in memory evaporates on reload or when shared; in the query string it reproduces the exact view for the next load and the next person.</figcaption>
</figure>

## Read and write the query string as the source of truth

The pattern is to treat the URL's search params as the state for these values —
read from them to render, write to them to change — so there is no second copy to
keep in sync:

```jsx
import { useSearchParams } from "react-router-dom";

function ProductList() {
  const [params, setParams] = useSearchParams();
  const filter = params.get("filter") ?? "all";     // state READ from the URL
  const page = Number(params.get("page") ?? 1);

  const setFilter = (value) =>
    setParams((p) => { p.set("filter", value); p.set("page", "1"); return p; });  // WRITE to the URL

  return <>{/* render from `filter`/`page`; changing them updates the address bar */}</>;
}
```

Now a reload re-reads the same params, and copying the URL to a colleague reproduces
the exact filtered, paginated view.

## Push vs replace: mind the history

One nuance separates a good URL-state implementation from an annoying one: whether a
change adds a history entry (`push`) or overwrites the current one (`replace`).
Navigations the user should be able to *go back* through — opening a product, moving
to page 2 — should push. High-frequency changes — typing in a search box, dragging a
slider — should replace, or the back button becomes useless, undoing one keystroke at
a time:

```js
// a search-as-you-type field: replace, so Back doesn't step through every letter
setParams(next, { replace: true });
```

## What belongs in the URL, and what does not

The line is about *shareability and durability*, not about being global. Put in the
URL anything that defines a view worth returning to: filters, sort, tab, search
query, pagination, a selected item's id. Keep *out* of the URL things that are
transient or private: a dropdown's open state, an unsaved form draft, ephemeral
hover state, and anything sensitive (a URL leaks into history, logs, and referrers).
The happy consequence of getting this right is that a lot of "state management"
simply disappears — you were about to build a filter store, and the address bar was
the store all along. The query-string-state exercise builds exactly this
read/write-the-URL loop, and design-search-experience is where push-vs-replace and
shareable results make or break the feature.
