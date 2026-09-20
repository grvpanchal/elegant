---
title: "Sessions vs tokens: where does the user's identity actually live?"
layout: post
slug: sessions-vs-tokens
date: 2026-08-13
author: The Elegant team
category: terminology
tags: [server, authentication, security, sessions]
description: 'A session keeps the source of truth on the server and hands the browser a key. A token hands the browser a signed claim and keeps nothing. That one difference drives revocation, scaling, and where you must store the thing.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [session-and-tokens, proxy-and-cors]
---

After a user logs in, something has to remember they are logged in. The two
models — server sessions and tokens — answer the question "where does the truth
about this login live?" differently, and almost every practical difference
(revocation, scaling, storage, security) follows from that one answer.

## Sessions: truth on the server

With a session, the server creates a record ("session abc123 belongs to user 42,
valid until…") and stores it — in memory, Redis, a database. It hands the browser
only an opaque session ID, usually in an `HttpOnly` cookie. On each request the
browser sends the ID, the server looks it up, and finds the user. The truth lives
on the server; the cookie is just a key to it. This makes revocation trivial —
delete the record and the session is dead instantly — and keeps sensitive data off
the client entirely.

## Tokens: truth in a signed claim

With a token (typically a JWT), the server signs a statement — "user 42, expires
at…" — and hands the whole thing to the client. The server stores nothing; on each
request it verifies the signature and trusts the claim inside. This is stateless,
which is its headline advantage: any server instance can verify the token without
a shared session store, so it scales horizontally with no sticky sessions and
suits APIs and microservices. The cost is the mirror image of sessions: because
the server keeps no record, you cannot easily revoke a token before it expires —
it is valid until its expiry no matter what.

## The revocation and expiry trade-off

That revocation gap is the crux. A stolen session ID dies the moment you delete
the record; a stolen token stays valid until it expires, because nothing
server-side is tracking it. The common mitigation is short-lived access tokens
plus a longer refresh token, so the blast radius of a leak is minutes, and a
revocation list for the refresh tokens. If instant revocation is a hard
requirement (banking, admin tools), sessions' server-side truth is the simpler
guarantee. If horizontal statelessness matters more (a large API fleet), tokens
earn their keep — with the expiry discipline to bound the risk.

## Where you store it matters more than which you pick

Whichever you choose, storage decides your security. The safe home for a session
cookie or a token is an `HttpOnly`, `Secure`, `SameSite` cookie, which JavaScript
cannot read — so an XSS bug cannot steal it. Storing a token in `localStorage`,
which people do because it is easy, hands it to any script that runs on your page,
turning any XSS into full account takeover. And critically, a token you *decoded*
is not a token you *verified*: reading the claims client-side proves nothing until
the signature is checked against the issuer's keys. The session-and-tokens
exercise is built around exactly this "where does it live, and did you verify it"
question.
