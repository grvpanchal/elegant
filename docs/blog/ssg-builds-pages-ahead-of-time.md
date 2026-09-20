---
title: "Static site generation: render once, serve a million times"
layout: post
slug: ssg-builds-pages-ahead-of-time
date: 2026-08-20
author: The Elegant team
category: architecture
tags: [server, ssg, performance, caching]
description: 'Static generation renders your pages at build time, not per request, so the server just hands out files. It is the fastest and cheapest option for content that does not change per user — until the content changes often.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 6
related_practice: [render-strategy-choice, cache-headers-basics]
---

Static site generation renders your pages **once, at build time**, and produces
plain HTML files. At request time the server does no rendering at all — it hands
out a file, the same file, to everyone. That makes SSG the fastest and cheapest
way to serve a page: a static file can sit on a CDN at the edge, respond in
single-digit milliseconds, and cost almost nothing to scale, because serving the
millionth copy is identical to serving the first. The catch is in the word
"once": the content is frozen at build time, so SSG fits content that is the same
for every user and does not change between deploys — and stops fitting the moment
either of those is false.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="ssg-t ssg-d" class="blog-figure__svg">
  <title id="ssg-t">SSG renders at build time; requests are served as static files from a CDN</title>
  <desc id="ssg-d">At build time the generator turns content and templates into HTML files. At request time many users get the prebuilt files from a CDN edge with no server rendering.</desc>
  <text x="140" y="28" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">build time (once)</text>
  <rect x="40" y="45" width="80" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="80" y="67" text-anchor="middle" fill="#155799" font-size="10">content</text>
  <path d="M120 62 L160 62" stroke="#819198" stroke-width="2" marker-end="url(#ssg-a)"/>
  <rect x="160" y="45" width="90" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="205" y="67" text-anchor="middle" fill="#157878" font-size="10">generate</text>
  <path d="M250 62 L290 62" stroke="#819198" stroke-width="2" marker-end="url(#ssg-a)"/>
  <rect x="290" y="45" width="90" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="335" y="67" text-anchor="middle" fill="#c2571a" font-size="10">HTML files</text>
  <line x1="30" y1="105" x2="610" y2="105" stroke="#dce6f0"/>
  <text x="320" y="130" text-anchor="middle" fill="#155799" font-size="12" font-weight="700">request time (a million times)</text>
  <rect x="270" y="145" width="100" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="320" y="167" text-anchor="middle" fill="#c2571a" font-size="10">CDN edge</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#ssg-a)"><path d="M270 162 L200 150"/><path d="M270 170 L200 175"/><path d="M370 162 L440 150"/><path d="M370 170 L440 175"/></g>
  <g fill="#f3f6fa" stroke="#155799" font-size="9" text-anchor="middle"><rect x="130" y="140" width="65" height="20" rx="4"/><text x="162" y="154" fill="#155799">user</text><rect x="130" y="168" width="65" height="20" rx="4"/><text x="162" y="182" fill="#155799">user</text><rect x="445" y="140" width="65" height="20" rx="4"/><text x="477" y="154" fill="#155799">user</text><rect x="445" y="168" width="65" height="20" rx="4"/><text x="477" y="182" fill="#155799">user</text></g>
  <defs><marker id="ssg-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>All the rendering happens once, before anyone visits. Every request after that is a static-file hand-off from the edge.</figcaption>
</figure>

## Build the routes ahead of time

An SSG framework asks you, at build time, which pages exist and what data each
needs. It calls a data function per route, renders the page, and writes the file:

```js
// build time: enumerate pages and fetch their data ONCE, then render each to HTML
export async function getStaticPaths() {
  const posts = await db.allPosts();
  return posts.map((p) => ({ params: { slug: p.slug } }));
}
export async function getStaticProps({ params }) {
  return { props: { post: await db.getPost(params.slug) } };  // baked into the file
}
```

The database is queried during the build, not during a request. By the time a
user arrives, the answer is already sitting in a file on the CDN.

## The freshness problem, and ISR

The obvious question is: what happens when the content changes? The blunt answer
is you rebuild. For a blog that publishes daily that is fine; for a product
catalogue that changes hourly it is not. The middle path is **incremental static
regeneration** — serve the static file, but re-render it in the background after a
set interval so it stays reasonably fresh without a full rebuild:

```js
export async function getStaticProps() {
  return {
    props: { data: await fetchData() },
    revalidate: 60,   // serve the cached file; rebuild this page at most once a minute
  };
}
```

## Pick SSG when the page is the same for everyone

The decision reduces to two questions. Is the page **the same for every user**?
Personalised, authenticated content cannot be prebuilt into one shared file. And
does it change **rarely relative to how often it is read**? A page read a million
times and edited weekly is the perfect SSG candidate; a page read once and
personalised per request is the worst. When both answers are "yes," SSG gives you
the best first paint, the lowest cost, and the simplest operational story — no
render servers to scale, just files. When they are "no," reach for SSR or a client
fetch. The render-strategy-choice exercise is built around exactly this triage,
because choosing the strategy is the real work; the frameworks make any of them
easy once you have chosen.
