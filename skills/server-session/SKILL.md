---
name: server-session
description: Session management — cookie sessions vs token sessions, `httpOnly`/`Secure`/`SameSite` cookie attributes, server-side session stores, access-token-in-memory with refresh-token rotation, idle (sliding) vs absolute timeouts, session fixation and rotation on login, server-side logout invalidation, and cross-tab sync via BroadcastChannel. Use when deciding where session state lives, hardening cookie flags, implementing timeouts, or fixing logout that doesn't actually log out.
when_to_use: Choosing between a server-side cookie session and a stateless token session; setting or reviewing cookie attributes; implementing idle vs absolute timeout and inactivity warnings; rotating the session identifier on login to prevent fixation; making logout revoke server-side; keeping login/logout state consistent across tabs; deciding what may live in localStorage vs sessionStorage vs memory.
paths:
  - "**/session/**/*.{js,ts}"
  - "**/*session*.{js,ts,jsx,tsx}"
  - "**/*token*.{js,ts}"
---

# Session

## What is a Session?

HTTP forgets you the moment a response is sent. A session is the continuity layered on top of that: something the server remembers (a session record keyed by an opaque cookie) or something the client carries and the server verifies (a signed token). Sessions must hold three separable things — *who you are* (auth), *what you're doing* (cart, drafts), and *what you prefer* (theme, language) — and each deserves a different storage lifetime and a different level of protection.

## Key Principles

1. **Server-Side Truth for Anything Revocable**: An opaque session id backed by a server store (Redis/Postgres) can be invalidated instantly. A self-contained JWT cannot — it is valid until it expires. If "log this user out everywhere, now" is a requirement, you need server-side state.

2. **Secrets Belong in `httpOnly` Cookies**: An injected script can read every byte of `localStorage`; it cannot read an `httpOnly` cookie. Session ids and refresh tokens go in cookies; short-lived access tokens go in memory; only non-sensitive UI state goes in web storage.

3. **Rotate on Privilege Change**: Issue a brand-new session identifier at login (and at step-up auth). Reusing a pre-login identifier is session fixation — an attacker who planted the id inherits the authenticated session.

4. **Two Clocks, Not One**: A sliding/idle timeout limits exposure on unattended machines; an absolute timeout caps the lifetime of even a busy session. Real systems run both.

5. **Logout Is a Server Operation**: Clearing client state is cosmetic. Real logout deletes the session record (or revokes the refresh-token family) and clears the cookie.

## Best Practices

✅ **DO**:
- Set `httpOnly`, `Secure`, `SameSite=Lax|Strict`, a narrow `Path`, and an explicit `Max-Age` on session cookies
- Store session state server-side (Redis/DB) when you need revocation, or rotate refresh tokens if you don't
- Regenerate the session id on login, and on any privilege elevation
- Combine an idle timeout (e.g. 30 min) with an absolute cap (e.g. 12 h / 30 days)
- Pair `SameSite=Lax` cookies with a CSRF token on state-changing requests
- Broadcast login/logout to other tabs (`BroadcastChannel`, `storage` event fallback)

❌ **DON'T**:
- Put access or refresh tokens in `localStorage`
- Accept a session id supplied by the client as-is after login
- Let logout stop at `accessToken = null` — revoke it on the server
- Fire one refresh request per in-flight 401 (dedupe with a cached promise)
- Trust a client-reported "last activity" timestamp for timeout enforcement
- Encode secrets or PII into a JWT payload — it is signed, not encrypted

## Code Patterns

### Cookie Session (server-side store)

```javascript
// Opaque id in the cookie; all real state in the store — revocable at any time.
app.post("/api/login", async (req, res) => {
  const user = await verifyCredentials(req.body);

  await store.destroy(req.cookies.sid);          // kill any pre-login session (fixation)
  const sid = crypto.randomUUID();               // fresh, unguessable identifier
  await store.set(sid, { userId: user.id, createdAt: Date.now(), lastSeen: Date.now() });

  res.cookie("sid", sid, {
    httpOnly: true,      // unreadable from JavaScript
    secure: true,        // HTTPS only
    sameSite: "lax",     // CSRF mitigation; pair with a CSRF token for forms
    path: "/",
    maxAge: 12 * 60 * 60 * 1000,
  });
  res.json({ ok: true });
});
```

### Token Session (access in memory, refresh in a cookie)

```javascript
class AuthSession {
  #accessToken = null;      // memory only — dies on reload, re-hydrated from the cookie
  #refreshing = null;       // dedupes concurrent refreshes

  async refresh() {
    this.#refreshing ??= fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
      .then((r) => { if (!r.ok) throw new Error("refresh failed"); return r.json(); })
      .then(({ accessToken }) => (this.#accessToken = accessToken))
      .finally(() => { this.#refreshing = null; });
    return this.#refreshing;
  }

  async token() {
    return this.#accessToken ?? this.refresh().catch(() => null);
  }
}
```

The server rotates the refresh token on every use and tracks the token *family*; a replayed old token means theft, so revoke the whole family.

### Idle vs Absolute Timeout (enforced server-side)

```javascript
const IDLE = 30 * 60 * 1000;
const ABSOLUTE = 12 * 60 * 60 * 1000;

export async function requireSession(req, res, next) {
  const s = await store.get(req.cookies.sid);
  const now = Date.now();
  if (!s || now - s.lastSeen > IDLE || now - s.createdAt > ABSOLUTE) {
    await store.destroy(req.cookies.sid);
    res.clearCookie("sid");
    return res.status(401).json({ error: "session_expired" });
  }
  s.lastSeen = now;                 // sliding window advances on real requests
  await store.set(req.cookies.sid, s);
  req.user = s.userId;
  next();
}
```

The client may *warn* before expiry, but the clock that matters is the server's.

### Logout and Cross-Tab Sync

```javascript
const channel = new BroadcastChannel("auth");
channel.onmessage = (e) => { if (e.data === "LOGOUT") location.assign("/login"); };

export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); // revokes + clears cookie
  } finally {
    channel.postMessage("LOGOUT");   // other tabs drop their in-memory token
    location.assign("/login");
  }
}
```

### In the elegant templates

**The templates have no server session at all — no auth, no cookies, no session store.** They are client-side SPAs (Vite, no server runtime), and `src/utils/api.js` in `chota-react-saga` is a mock API backed by `localStorage` under a single key:

```javascript
const TODO = "todo";
if (!localStorage.getItem(TODO)) localStorage.setItem(TODO, "[]");
// fetchApi("/todos", { method: "GET" }) → resolves from localStorage after a 500ms wait
```

That is deliberately *application* state, not a session: it is not sensitive, it needs no revocation, and `localStorage` is the right home for it. Read it the same way you'd read any persisted preference — the templates already keep UI config (`state.config`: `name`, `lang`, `theme`) in the store, which is the natural place to rehydrate from storage.

When you replace the mock with a real backend, do it at this seam and keep the architecture intact: session/token handling lives in `src/utils/api.js` and the sagas that call it, containers (`src/containers/*Container.jsx`) map session state into `data` + `events`, and `src/ui/**` stays purely presentational — no component should read a token or a cookie. For the login/logout flows, refresh interceptors, and route guards themselves, see the **server-authentication** skill; this skill covers where the session *lives* and when it *dies*.

## Related Terminologies

- **Authentication** (Server) - Login flows, refresh interceptors, and route guards
- **API** (Server) - Where credentials are attached and 401s are retried
- **Protocol** (Server) - `Set-Cookie` attributes, `Authorization` header semantics
- **State** (State) - Non-sensitive session-derived data belongs in the store
- **Proxy** (Server) - A BFF can hold the session and keep tokens off the client
- **Container** (Server) - Maps session state into presentational props

## Quality Gates

- [ ] Session cookies set `httpOnly`, `Secure`, `SameSite`, and an explicit expiry
- [ ] No token or session secret is written to `localStorage`/`sessionStorage`
- [ ] Session identifier is regenerated on login and privilege change
- [ ] Both idle and absolute timeouts are enforced server-side
- [ ] Logout revokes the session/refresh-token server-side and clears the cookie
- [ ] Concurrent 401s share a single refresh, and logout propagates across tabs

**Source**: `/docs/server/session.md`
