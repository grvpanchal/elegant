---
title: "Proxy it or fix CORS? Two answers to the same cross-origin wall"
layout: post
slug: proxy-or-fix-cors
date: 2026-08-15
author: The Elegant team
category: architecture
tags: [server, cors, proxy, http]
description: 'When your frontend cannot call an API because of a cross-origin error, you have two real fixes — proxy the request through your own origin, or set CORS headers on the API. Which one is right depends on who owns the API.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [proxy-and-cors, session-and-tokens]
---

The error is familiar: your app on `app.example.com` calls an API on
`api.other.com`, and the browser blocks the response with a CORS message. There
are exactly two legitimate fixes, and picking the right one comes down to a single
question — do you control the API? Everything else people try (disabling browser
security, sketchy public proxies) is a way to avoid answering it.

## Why the wall exists

The browser's same-origin policy stops a page on one origin from reading
responses from another, because otherwise any site you visit could quietly read
your logged-in bank's API using your cookies. CORS is the *controlled* exception:
the API can opt specific origins back in by sending `Access-Control-Allow-Origin`
headers. So the wall is not a bug to defeat; it is a security boundary, and the
two fixes are two honest ways to satisfy it.

## Fix one: set CORS headers (when you own the API)

If the API is yours, the correct fix is to make it send the right CORS headers.
Return `Access-Control-Allow-Origin` naming your app's origin (not a blanket `*`
if credentials are involved), and handle the preflight `OPTIONS` request that the
browser sends before non-simple requests, echoing the allowed methods and
headers. This tells the browser "this origin is allowed to read me," and the call
goes through. It is a few lines of server config and it is the *right* fix because
it addresses the actual thing the browser is checking.

## Fix two: proxy through your own origin (when you don't)

If the API is a third party you cannot change, you cannot add headers to it — so
you remove the cross-origin call instead. Your own server (or your dev server, or
an edge function) exposes a path like `/api/thing`, and when the browser hits it,
your server makes the request to `api.other.com` server-to-server and returns the
result. From the browser's point of view the call is same-origin, so CORS never
applies — server-to-server requests are not subject to it. As a bonus, the proxy
can attach secrets the browser should never hold, cache responses, and normalize
the third party's shape.

## Choosing, and what not to do

Own the API → set CORS headers. Don't own it, or need to hide a key → proxy. What
you must never do is "fix" it by launching the browser with security disabled (it
works only on your machine and teaches nothing) or routing through a random public
CORS proxy (you just handed your users' requests to a stranger). Both are the tell
that someone skipped the actual question. The proxy-and-CORS exercise makes you
choose between the two fixes for a concrete scenario, which is exactly the
judgement this comes down to.
