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
reading_minutes: 5
related_practice: [session-and-tokens, proxy-and-cors]
---

Authentication has two dominant models, and the whole comparison comes down to one
question: **where does the source of truth about the logged-in user live?** With a
**session**, it lives on the server — the server stores the session record and
hands the browser only an opaque id (a key that means nothing on its own). With a
**token** (typically a JWT), it lives in the token itself — a signed claim the
browser holds, that the server can verify without looking anything up. That single
difference — stateful server vs stateless self-contained claim — drives everything
else: how you revoke access, how you scale, and where the thing must be stored to
stay safe.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 200" role="img" aria-labelledby="st-t st-d" class="blog-figure__svg">
  <title id="st-t">A session stores state on the server; a token carries a signed claim in the client</title>
  <desc id="st-d">Session: browser holds an opaque id, server holds the record and looks it up each request. Token: browser holds a signed JWT, server verifies the signature with no lookup.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#155799" font-size="11" font-weight="700">session</text>
  <rect x="40" y="45" width="90" height="34" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="85" y="67" text-anchor="middle" fill="#155799" font-size="9">browser: id</text>
  <path d="M130 62 L200 62" stroke="#819198" stroke-width="2" marker-end="url(#st-a)"/><text x="165" y="54" fill="#819198" font-size="8">sends id</text>
  <rect x="200" y="45" width="110" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="255" y="67" text-anchor="middle" fill="#157878" font-size="9">server looks up</text>
  <rect x="215" y="95" width="80" height="26" rx="5" fill="#e8f0f8" stroke="#157878"/><text x="255" y="113" text-anchor="middle" fill="#157878" font-size="8">session store</text>
  <path d="M255 79 L255 93" stroke="#819198" stroke-width="2" marker-end="url(#st-a)"/>
  <line x1="340" y1="18" x2="340" y2="185" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">token</text>
  <rect x="380" y="45" width="120" height="34" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="440" y="67" text-anchor="middle" fill="#c2571a" font-size="9">browser: signed JWT</text>
  <path d="M500 62 L560 62" stroke="#819198" stroke-width="2" marker-end="url(#st-a)"/>
  <rect x="440" y="95" width="150" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="515" y="117" text-anchor="middle" fill="#157878" font-size="9">verify signature — no lookup</text>
  <path d="M470 79 L500 93" stroke="#819198" stroke-width="2" marker-end="url(#st-a)"/>
  <defs><marker id="st-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Session: the client holds a meaningless id and the server holds the truth. Token: the client holds the truth as a signed claim the server only needs to verify.</figcaption>
</figure>

## Sessions: stateful, and easy to revoke

The server creates a record, stores it (in memory, Redis, a DB), and sends the
browser an opaque id in an `HttpOnly` cookie. Every request, the server looks the id
up to learn who you are:

```js
// login: create server-side state, hand the browser only an opaque id
const sessionId = crypto.randomUUID();
await store.set(sessionId, { userId: user.id, createdAt: Date.now() });
res.cookie("sid", sessionId, { httpOnly: true, secure: true, sameSite: "lax" });
```

Because the truth is server-side, **revocation is trivial**: delete the record and
the next request fails instantly. The cost is that the server must store and look
up state on every request, which is the thing you have to scale.

## Tokens: stateless, and self-verifying

The server signs a token containing the claims (`sub`, `exp`, roles) and hands it
over. It stores nothing; on each request it *verifies the signature* and reads the
claims directly — no lookup:

```js
// login: sign a self-contained claim; the server keeps no record of it
const token = jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: "15m" });

// each request: verify and trust, with no database round-trip
const claims = jwt.verify(req.headers.authorization.slice(7), SECRET);
```

This scales beautifully — any server with the key can verify, no shared session
store — but the flip side is the hard part: **you cannot easily revoke a token**
before it expires, because nothing was stored to delete. A stolen token is valid
until `exp`.

## The trade-offs, and where each fits

The revocation/scaling tension defines the choice. Sessions give instant logout,
easy "log out everywhere," and server-side control, at the cost of stateful
lookups — ideal for classic web apps and anything needing strict control. Tokens
give stateless horizontal scaling and clean service-to-service auth, at the cost of
weak revocation — which teams patch with *short* token lifetimes plus a longer
refresh token, so a compromised access token dies in minutes. Storage matters
either way: keep the credential in an `HttpOnly` cookie so JavaScript (and thus XSS)
cannot read it — putting a JWT in `localStorage` is the common mistake that turns
any script injection into account theft. And decoding is not verifying: a JWT
payload is just base64, so a claim is only trustworthy after the signature checks
out. The session-and-tokens exercise builds both flows so the revocation-vs-scaling
trade stops being abstract.
