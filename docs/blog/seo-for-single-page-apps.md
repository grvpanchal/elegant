---
title: "SEO for single-page apps: help the crawler see what the user sees"
layout: post
slug: seo-for-single-page-apps
date: 2026-07-15
author: The Elegant team
category: architecture
tags: [server, seo, rendering, ssr]
description: 'A client-rendered app ships an empty div and fills it with JavaScript. Some crawlers run that JavaScript, many do not or do it late. If organic traffic matters, you have to get real content into the HTML the crawler first sees.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [render-strategy-choice, cache-headers-basics]
---

A client-rendered single-page app sends the crawler the same thing it sends the
user on the first request: an empty `<div id="root">` and a bundle. The user's
browser runs the JavaScript and sees content; the crawler may or may not, and even
when it does, it often does so on a delay and with a budget. If organic search
traffic matters to your app, closing that gap is not optional, and the fix is to
get real content into the HTML the crawler first receives.

## What crawlers actually do with JavaScript

The modern search crawler can execute JavaScript, but with caveats that matter.
Rendering is deferred to a second pass that can lag the initial crawl by anywhere
from moments to much longer, so freshly published content may be indexed late or
based on the empty shell. There is a rendering budget, so heavy or slow pages may
be under-rendered. And many other crawlers and scrapers — social preview bots, some
search engines, link-unfurlers — do not run JavaScript at all, so they see the
empty shell and your links get no title, description, or image. Betting your SEO on
"the crawler will run my JavaScript" is betting on the best case.

## Render the content on the server for pages that need to rank

The robust fix is to put real content in the initial HTML for pages that need to be
found: server-side rendering or static generation for your public, indexable
pages. The crawler (and the social scraper, and the user on a slow connection) then
sees populated markup immediately, no JavaScript execution required. You do not have
to server-render the whole app — render the marketing pages, articles, and product
pages that need organic traffic, and leave the logged-in application client-rendered
where SEO is irrelevant. Choosing per route is the pattern.

## The metadata a crawler and a social card need

Content is necessary but not sufficient; crawlers and social platforms read
specific tags. Each indexable page needs a unique, descriptive `<title>` and meta
description, canonical URLs to avoid duplicate-content splits, structured data
(schema.org) where it applies, and Open Graph / Twitter Card tags so shared links
render a proper preview. In a SPA these must be set per route and be present in the
server-rendered HTML — setting them with client JavaScript after load is exactly
what the non-JS scrapers miss. A sitemap and sane `robots` rules round it out.

## Do not forget the fundamentals SEO shares with performance

Much of technical SEO is just performance and accessibility wearing a different
hat: fast Core Web Vitals help rankings, semantic HTML helps crawlers understand
structure, and a fast, stable page keeps users from bouncing (which feeds back into
rankings). So the work you do for LCP, for the critical rendering path, and for
semantic markup pays off twice. The render-strategy exercise is exactly the
"which pages need server rendering for SEO" decision, and the caching exercise keeps
those server-rendered pages fast enough to rank.
