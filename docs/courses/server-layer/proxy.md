---
title: "Proxy: one origin, and why CORS stops"
layout: lesson
course: server-layer
slug: proxy
term: server/proxy
skill: server-proxy
practice: proxy-and-cors
description: "What a dev proxy and a production reverse proxy actually do, why CORS is granted by the server and never by the request, and what to check in an agent's fix."
insight: "A proxy makes the browser talk to one origin: it forwards /api/* to the backend server-to-server, where CORS does not apply. The dev-server proxy is a local convenience that vanishes in the production build, so production needs a reverse proxy, or an API that explicitly grants your origin."
---

## Same origin, by construction

Browsers enforce the same-origin policy, where an origin is protocol, domain
and port together. An app on `localhost:3000` calling an API on
`localhost:5000` is cross-origin — only the port differs, and that is enough.
With a [proxy]({{ '/server/proxy.html' | relative_url }}),
`fetch('/api/users')` goes to `localhost:3000`, the dev server forwards it to
`:5000` and hands back the response. The browser never applies CORS, because
nothing cross-origin happened in the browser.

The doc separates the two kinds. A **forward** proxy hides the client — a
corporate proxy, a VPN. A **reverse** proxy hides the server — Nginx,
Cloudflare. Frontend dev proxies are the reverse kind, and in production a
reverse proxy also terminates SSL, balances load, caches and absorbs attacks.

## The fix that is not a fix

"Every frontend team hits this in week one and half of them ship the
workaround," the practice quiz begins. Shown a missing
`Access-Control-Allow-Origin` error, an agent will try the request side: add a
header to `fetch()`, switch to `XMLHttpRequest`, suggest a browser flag. None of
it can work. CORS is enforced by the browser and granted by the server, so the
fix is on the API, which must allow your origin, or a same-origin proxy.

Two details decide whether the real fix holds:

- A JSON body with an `Authorization` header makes the request non-simple, so
  the browser sends an `OPTIONS` **preflight** first. The server must answer it
  with the allowed origin, methods and headers.
- Cookies on a cross-origin call need `credentials: 'include'`,
  `Access-Control-Allow-Credentials: true`, an **explicit** origin — the
  wildcard is rejected with credentials — and `SameSite=None; Secure` on the
  cookie. A same-origin proxy turns those four coordinated settings into none.

## Mistakes that reach production

The doc's sharpest one: **the proxy in a production build**. A dev proxy exists
only inside the dev server. The production build is static files, so `npm start`
works and the deployed app returns 404 on every `/api` call. The others: no
`changeOrigin`, so a backend that validates `Host` sees `localhost:3000` and
answers 400 or 403; and unhandled proxy errors such as `ERR_CONNECTION_REFUSED`
with no context. The skill adds: never hardcode backend URLs in frontend code,
proxy WebSocket connections too, and set timeouts for slow endpoints.

## Review checklist for an agent's CORS fix

1. Frontend code calls relative URLs such as `/api/users`, never
   `http://localhost:5000`.
2. The change is on the API or a proxy, never a header added to the request.
3. Production has a reverse-proxy rule matching the dev proxy, or the API
   grants the deployed origin by name.
4. Credentialed cross-origin calls name an explicit origin, never `*`.
5. WebSocket proxying and timeouts are configured where the app needs them.
