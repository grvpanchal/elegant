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
reading_minutes: 5
related_practice: [proxy-and-cors, session-and-tokens]
---

The one fact that turns CORS from baffling to obvious: **it is enforced by the
browser, not the server.** When your JavaScript on `app.example.com` fetches from
`api.other.com` and gets a CORS error, it is tempting to think the request was
blocked. Usually it was not — for a simple request the browser *sent* it, the
server *received and ran* it, and a response came back. The browser then checked
whether that response carries a header permitting your origin to read it, found it
missing, and refused to hand the response to your code. The data existed; the
browser withheld it from your script. That is CORS: a client-side gate on *reading
cross-origin responses*, not a lock on the server's door.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="cr2-t cr2-d" class="blog-figure__svg">
  <title id="cr2-t">The request reaches the server and runs; the browser blocks the response from the script</title>
  <desc id="cr2-d">JS on app.example.com sends a request to api.other.com, which runs and responds. The browser inspects the response's Access-Control-Allow-Origin header and, if it does not match, blocks the script from reading it.</desc>
  <rect x="30" y="75" width="120" height="50" rx="8" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="90" y="97" text-anchor="middle" fill="#155799" font-size="9">JS on</text><text x="90" y="112" text-anchor="middle" fill="#155799" font-size="9">app.example.com</text>
  <path d="M150 90 L300 90" stroke="#819198" stroke-width="2" marker-end="url(#cr2-a)"/><text x="225" y="82" text-anchor="middle" fill="#819198" font-size="9">request sent + runs</text>
  <rect x="300" y="75" width="120" height="50" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="360" y="97" text-anchor="middle" fill="#157878" font-size="9">api.other.com</text><text x="360" y="112" text-anchor="middle" fill="#157878" font-size="9">responds 200</text>
  <path d="M300 112 L150 112" stroke="#157878" stroke-width="2" marker-end="url(#cr2-a)"/><text x="225" y="128" text-anchor="middle" fill="#157878" font-size="9">response comes back</text>
  <rect x="180" y="150" width="230" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="295" y="171" text-anchor="middle" fill="#c2571a" font-size="9">browser checks Allow-Origin → blocks read</text>
  <path d="M120 125 L250 148" stroke="#c2571a" stroke-width="2" stroke-dasharray="3 3" marker-end="url(#cr2-x)"/>
  <defs><marker id="cr2-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker><marker id="cr2-x" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#c2571a"/></marker></defs>
</svg>
<figcaption>The request runs and the server responds; the browser then inspects the response's headers and, absent permission for your origin, refuses to give it to your script.</figcaption>
</figure>

## The server grants permission with a header

The only thing the server controls is whether it *permits* your origin to read the
response, which it declares in the `Access-Control-Allow-Origin` header. Without
it, the browser blocks the read; with it matching your origin, the browser lets the
data through:

```http
GET /data HTTP/1.1
Origin: https://app.example.com

HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com   ← the browser now allows the read
Content-Type: application/json
```

Note where the header lives: on the *response*, from the *API server*. Your
frontend cannot add it — which is exactly why "just fix CORS in my React code" is
not a thing.

## The preflight: an OPTIONS you did not write

For anything beyond a "simple" request — a custom header, a `PUT`/`DELETE`, a JSON
content type — the browser sends a **preflight** `OPTIONS` request first, asking
permission *before* the real one. The server must answer the preflight with the
methods and headers it allows, or the real request never leaves:

```http
OPTIONS /data HTTP/1.1
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, PUT, DELETE
Access-Control-Allow-Headers: content-type
```

This is why a request "fails before it is sent" — you are seeing a preflight the
server did not satisfy, and the browser correctly declining to make the real call.

## Why the rule exists, and what it does not protect

CORS exists because browsers automatically attach the user's cookies to requests,
so without a rule, any site you visit could quietly call your bank's API *as you*
and read the response. The same-origin policy blocks that read by default; CORS is
the mechanism a server uses to *relax* it for origins it trusts. Two things follow.
First, CORS protects the *user's browser data from other sites*, not the API from
attackers — a script, a mobile app, or `curl` faces no CORS at all, so it is never
a substitute for real auth. Second, because only the API server can grant access,
your two real fixes when you do not control that server are to proxy the call
through your own origin or to get the API to send the headers. Knowing CORS is a
browser read-gate, not a server lock, is what makes those fixes obvious instead of
mysterious. The proxy-and-cors exercise walks through exactly that decision.
