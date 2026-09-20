---
title: "CORS is the browser's rule, not the server's"
layout: post
slug: cors-is-the-browsers-rule-not-the-servers
date: 2026-08-14
author: The Elegant team
category: terminology
tags: [server, cors, security, http]
description: 'The single fact that makes CORS make sense: it is enforced by the browser, not the server. The request often reaches the server and runs — the browser just refuses to let your JavaScript read the response.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [proxy-and-cors, session-and-tokens]
---

CORS confuses people because they picture the server rejecting their request. It
usually doesn't. The one fact that makes everything click: **CORS is enforced by
the browser.** The request frequently reaches the server and executes; the browser
then refuses to hand the response to your JavaScript because the server did not
say your origin was allowed to read it. Once you internalize that, the error
messages and the preflight dance stop being mysterious.

## The browser is the enforcer

`curl` and your backend can call any API freely — no CORS, ever — because CORS is
not a property of the network or the server. It is a rule the *browser* applies to
protect the user, specifically to stop `evil.com` from using your logged-in
session to read `yourbank.com`'s API behind your back. So when you see a CORS
error, the server was often perfectly willing; the browser intercepted the
response and blocked your script from seeing it. This is why the same request
works from Postman and fails from the page: only the browser enforces the rule.

## Simple requests and the preflight

For "simple" requests (a plain GET, or a form-style POST), the browser sends the
request, gets the response, and *then* checks for `Access-Control-Allow-Origin`
before releasing it to your code. For anything else — a JSON POST, a custom
header, a PUT or DELETE — the browser first sends a **preflight** `OPTIONS`
request asking "am I allowed to do this?" and only sends the real request if the
server's preflight response approves the method and headers. A missing or wrong
preflight response is the most common CORS failure, and it is entirely on the
server to answer it correctly.

## Credentials raise the bar

If your request sends cookies or auth headers (`credentials: 'include'`), the
rules tighten: the server must send `Access-Control-Allow-Credentials: true` *and*
name an explicit origin in `Access-Control-Allow-Origin` — a wildcard `*` is
forbidden with credentials, because "any site may read this with the user's
cookies" is exactly the attack the policy exists to prevent. Getting a credentialed
cross-origin call working means being specific about which origin you trust, which
is the safe default anyway.

## What this means for you

Because the browser is the enforcer, your two fixes are "make the server tell the
browser my origin is allowed" (set CORS headers, if you own it) or "make the call
same-origin so the rule never applies" (proxy through your server, if you don't).
Disabling the browser's check is not a fix — it only works on your machine and
removes the protection for real users. Understanding that CORS guards the *user's*
data, enforced by *their* browser, is what turns it from an annoying error into a
boundary you can reason about. The proxy-and-CORS exercise puts that reasoning to
work.
