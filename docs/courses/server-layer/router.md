---
title: "Router: the URL is state too"
layout: lesson
course: server-layer
slug: router
term: server/router
skill: server-router
practice: query-string-state
description: "Route tables, dynamic segments, catch-alls and the share of state that belongs in the address bar, briefed so an agent's links still work."
insight: "A client-side router intercepts navigation, updates the URL with the History API and swaps the matched component without a reload, so the store survives the trip. That makes the URL part of your state: anything a user would bookmark, share or reach with the back button belongs in it, not in component state."
---

## What a router actually does

The [Router doc]({{ '/server/router.html' | relative_url }}) breaks it into five
steps: intercept the link click (`event.preventDefault()`), update the address
bar with `history.pushState()`, match the new URL against a route table
(`/users/:id` matches `/users/123`), unmount the old component and mount the
new one, and leave the store, context and global JavaScript state intact. The
back and forward buttons keep working through `popstate`.

The Angular template's whole route table,
`templates/chota-angular-ngrx/src/app/app.routes.ts`, is two entries:

```ts
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: '**', redirectTo: '' },
];
```

The second line is the catch-all whose absence the doc lists as a common
mistake: without it, an unknown URL renders a blank page. Notice also what the
route points at — a page in `src/pages`, which composes containers. The router
decides *which* page; it never reaches into the store itself.

## The mistakes that ship

- **A bare `<a href>` for internal navigation** instead of `Link`,
  `routerLink` or `<router-link>`. Every click becomes a full reload, the white
  flash returns and the store is rebuilt from nothing.
- **Partial matching** — React Router v5's forgotten `exact` rendered two routes
  at once.
- **No 404 route.**

The skill adds the three a reviewer most often misses: no focus management or
route-change announcement for screen-reader users, no scroll restoration, and
no loading state while a lazily loaded route chunk downloads.

## Filters belong in the URL

The doc's promise of "shareable URLs for specific app states" is the line that
matters for product work. A filtered list whose filters live in component state
cannot be linked, refreshed or reached with the back button. The practice
question moves them: `toQuery` and `fromQuery` round-trip a search term,
categories, sort and page. Keys come out in a fixed order so the same filters
always produce the same, cacheable string; values equal to their default are
omitted so a clean view has a clean URL; `page` comes back as a number.
`URLSearchParams` does the encoding that a hand-built string gets wrong the
first time a search term contains `&` or a space.

## Brief it, then review it

```text
Add /products with its filters in the query string (q, categories,
sort, page). Parse them with fromQuery on load and on popstate; write
them with toQuery through the router, never location.href. Omit
defaults. Add a catch-all route that renders NotFound.
```

1. Internal links use the router's link component, never a bare `<a>`.
2. The route table ends in a catch-all.
3. Focus moves to the new view's heading after navigation.
4. Refresh and the back button reproduce the exact filtered view.
