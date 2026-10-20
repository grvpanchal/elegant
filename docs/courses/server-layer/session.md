---
title: "Session: where tokens live, and what logout means"
layout: lesson
course: server-layer
slug: session
term: server/session
skill: server-session
practice: session-and-tokens
description: "Cookies, memory and web storage each have one job in a session: learn the split, the refresh race between tabs, and why logout is a server operation."
insight: "HTTP forgets you after every request; a session is the layered pretence that it does not. Secrets go in httpOnly cookies, short-lived access tokens stay in memory, only non-sensitive UI state goes in web storage, and anything you must be able to revoke needs server-side truth."
---

## Three layers, three lifetimes

The [Session doc]({{ '/server/session.html' | relative_url }}) separates three
sessions that expire independently. The **application session** is UI state —
preferences, a cart, form drafts — in `localStorage`, `sessionStorage` or
IndexedDB. The **authentication session** is your auth provider's: a refresh
token in an `httpOnly` cookie and a short-lived access token (around fifteen
minutes) held in memory. The **identity-provider session** is Google's or
Okta's single sign-on, controlled by the IdP and not by your code. That
independence is where "I was just logged into Gmail, why did your app log me
out?" comes from.

The rule the doc calls load-bearing: an injected `<script>` can read everything
in `localStorage`, but it cannot read an `httpOnly` cookie.

## The plausible answer is the insecure one

An agent asked to keep a user signed in after a reload reaches for
`localStorage`, because it works. The practice quiz names the risk: any script
on your origin can read it, so one compromised dependency or one XSS and the
token leaves with the attacker. Moving to an `httpOnly` cookie does not finish
the job either — the browser now attaches the cookie automatically, which is
what makes CSRF possible, so pair `SameSite=Lax` or `Strict` with a CSRF token
on state-changing requests.

The skill's other rules are the ones a confident agent skips:

- **Regenerate the session id at login** and on privilege change. Reusing the
  pre-login id is session fixation.
- **Two clocks**: an idle timeout and an absolute cap, both enforced on the
  server. Never trust a client-reported "last activity".
- **Logout is a server operation.** `accessToken = null` is cosmetic; revoke the
  session or refresh-token family and clear the cookie.
- **A JWT is signed, not encrypted.** No secrets or personal data in its payload,
  and it cannot be revoked before it expires.

## The refresh race

Two tabs hit expiry at the same moment and both refresh. With refresh-token
rotation, the second presents a token the server has already retired — the
signal of theft — and the user is logged out. The fix is one refresh at a time:
concurrent 401s await the same in-flight promise, and tabs coordinate through a
shared worker or the `storage` event.

```js
let refreshing = null;
function refreshOnce(refreshUrl) {
  refreshing ??= fetch(refreshUrl, { method: "POST", credentials: "include" })
    .finally(() => { refreshing = null; });
  return refreshing;
}
```

## Review checklist for agent session code

1. No token or session secret is written to `localStorage` or `sessionStorage`.
2. Session cookies set `httpOnly`, `Secure`, `SameSite` and an explicit
   `Max-Age`.
3. The session id changes at login.
4. Logout calls the server, then clears state in every tab
   (`BroadcastChannel`, with the `storage` event as fallback).
5. Concurrent 401s share a single refresh.
