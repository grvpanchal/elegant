---
title: "SSG: render once at build time, cache it right"
layout: lesson
course: server-layer
slug: ssg
term: server/ssg
skill: server-ssg
practice: cache-headers-basics
description: "When pre-rendering at build time beats a server, how revalidation keeps it fresh, and the cache headers that make a static deploy safe to update."
insight: "SSG moves rendering to build time: every page becomes a file a CDN serves with no computation per request. It is the right default for content that is the same for everyone and changes on a schedule you control, and it is only as correct as the cache policy on the HTML that names your bundles."
---

## Build time, not request time

[SSG]({{ '/server/ssg.html' | relative_url }}) shifts *when* rendering happens:
not at request time (SSR) or in the browser (CSR), but once, during the build.
The generator fetches the data, renders every page to HTML and the output is
deployed to a CDN. You are reading an example — this site is Jekyll on GitHub
Pages, and the page in front of you was rendered when the site was built.

In Next.js, `getStaticProps` fetches build-time data and `getStaticPaths` lists
which dynamic routes such as `/products/[id]` exist; `fallback` decides what
happens for one that was not pre-rendered. Freshness is the catch: a page frozen
at build time is stale until something rebuilds it. Incremental Static
Regeneration's `revalidate` serves the cached HTML and regenerates the page in
the background once it is older than the threshold.

## The mistakes the doc names

- **SSG for user-specific content.** A static page is the same for everyone, so
  personalised data comes out stale or wrong.
- **Not handling build failures.** One failed fetch halts the deploy. Handle the
  error and let the build complete with a fallback.
- **Over-generating.** Pre-rendering thousands of rarely visited pages wastes
  build time; `fallback: 'blocking'` renders those on first request.

The skill's DON'T list adds two an agent reaches for: triggering a full rebuild
for every content change (use revalidation), and using SSG for real-time data.

## The cache policy is part of the strategy

The practice question asks for the four policies of a static deploy:

- **Hashed bundles** (`app.8f3c1a.js`): `public, max-age=31536000, immutable`.
  The filename changes whenever the content does, so there is nothing to
  revalidate.
- **The HTML**: `no-cache` — cache it, but check first, which costs a cheap
  304 — or a short `max-age` at the edge. It names the current bundle hashes.
- **Images**: a week with a content hash, or a shorter TTL with
  `stale-while-revalidate`.
- **API JSON**: it depends; anything personalised is `private, no-store`,
  because a shared cache keyed on URL hands one user another user's data.

The first two are a pair. A year-long cache on bundles is safe *only because*
the HTML that names them is fresh. Cache the HTML for a day and users get a page
pointing at bundles that no longer exist: a blank screen a refresh does not fix.

## Brief it, then review it

```text
Pre-render /docs/* at build time, with getStaticPaths for each page.
Revalidate every 300 seconds. If a content fetch fails during the build,
fall back instead of failing the deploy. Serve HTML with
Cache-Control: no-cache and hashed assets with max-age=31536000, immutable.
```

1. Every pre-rendered page is identical for every visitor.
2. A failing build-time fetch has a fallback.
3. Dynamic routes declare a `fallback` strategy.
4. Only content-hashed files are `immutable`; the HTML revalidates.
