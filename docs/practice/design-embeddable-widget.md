---
title: Design an embeddable widget
layout: question
slug: design-embeddable-widget
format: system-design
difficulty: hard
layer: server
topics: [widget, mfe, app-shell, protocol, session]
skill: server-widget
minutes: 45
summary: A review widget third parties paste into their own pages — isolation, versioning, auth and a sub-50KB budget.
---

You ship a reviews widget. Customers paste one `<script>` tag into their own
site and a rating summary renders inline. You control neither their CSS, their
CSP, nor their framework.

Design it. Be explicit about isolation, versioning, authentication, the loading
path and what you measure.

**Constraints**

- Under 50 KB gzipped on the critical path.
- Must not block the host page's first paint.
- Host pages range from static HTML to React apps that re-render the container.
- Some hosts set `Content-Security-Policy: script-src 'self' https://cdn.you.com`.

## Solution

### The shape

A two-stage load. The pasted tag is a tiny, forever-cached **loader**
(~2 KB): it reads its own `data-*` configuration, injects a placeholder with
reserved height, and requests the versioned **bundle** from your CDN. The
bundle renders into a shadow root and talks to your API.

```
host page
  └─ <script async src="https://cdn.you.com/w/v1/loader.js" data-site="acme" data-product="sku-9">
        ├─ reserves layout box (no CLS)
        ├─ resolves channel -> https://cdn.you.com/w/1.14.2/widget.js   (immutable, 1y cache)
        └─ widget.js
              ├─ attachShadow({mode: 'open'})    ← style isolation
              ├─ GET /api/v1/summary?site=acme&product=sku-9   (public, cacheable)
              └─ POST /api/v1/reviews             (needs a user identity)
```

### Isolation

Shadow DOM is the default: host CSS cannot reach in, your CSS cannot leak out,
and you stay in the host's DOM so layout and accessibility work normally. An
iframe isolates more completely but costs you auto-height (you need a
`postMessage` resize protocol), inherits none of the host's fonts, and is the
wrong default for something that must look inline.

Use an iframe only for the **write** path — the review composer — because that
form handles the user's session and an iframe gives you a real origin boundary
around it.

### Versioning

Two artefacts, two cache policies. `loader.js` lives at a stable URL with a
short `max-age` (5 minutes) and resolves a channel (`v1` → `1.14.2`). The
bundle lives at an immutable versioned URL cached for a year. Customers pin
`v1`; you ship patches without asking anyone to edit their HTML, and a bad
release rolls back by repointing the channel, not by purging caches.

Never let the pasted tag point straight at the bundle: that is the decision you
cannot take back.

### Authentication

Read is anonymous and cacheable at the edge. Write needs identity, and you
cannot rely on third-party cookies. Offer both:

- **Hosted identity** — the composer iframe on `you.com` carries its own
  first-party session; the host never sees the token.
- **Delegated identity** — the host signs a short-lived JWT with a shared
  secret server-side and passes it to the loader; you verify the signature and
  the audience. This is what enterprise customers want because the reviewer is
  already logged into *their* site.

Both paths rate-limit per site key, and the site key is public by design —
treat it as an identifier, never as a secret.

### Loading path and CSP

`async` on the tag, `preconnect` to the API origin in the loader, and the
placeholder sized from a `data-height` hint so nothing shifts. Inline styles
are out: a host with `script-src 'self' https://cdn.you.com` will often also
set `style-src 'self'`, so ship a stylesheet inside the shadow root via
`adoptedStyleSheets` rather than injecting a `<style>` element with a nonce you
do not have.

Publish the exact CSP directives a customer needs. It is documentation, but it
is the difference between a ten-minute integration and a support ticket.

### What you measure

| Signal | Why | Budget |
|---|---|---|
| loader → first paint of the widget | the number the customer feels | p75 < 800 ms |
| bundle transfer size | the promise you made | < 50 KB gz |
| CLS attributable to the container | the reason hosts rip widgets out | < 0.01 |
| API 5xx rate per site key | blast radius of your own outage | < 0.1% |
| version skew (share of traffic on stale `v1`) | tells you if rollback works | > 95% current within 24 h |

## Trade-offs

**Shadow DOM vs iframe** — isolation against integration. Shadow DOM inherits
nothing and blocks nothing; an iframe protects the host from your JavaScript
entirely but makes height, fonts and focus management your problem.

**Channel indirection vs direct pinning** — the loader hop costs one extra
round trip on a cold cache and buys you the ability to ship at all. If you skip
it, every fix requires every customer to edit HTML they pasted once and forgot.

**Delegated JWT vs hosted iframe** — delegated identity is a better experience
and a larger attack surface; you are now trusting the host's server not to mint
tokens for users who never consented. Scope the token to one product and one
action, and keep its lifetime in minutes.

The failure mode that actually kills widgets is none of the above: it is a host
React app unmounting and remounting your container on every render. Guard the
mount with a marker attribute and make initialisation idempotent, or you will
attach three shadow roots and fire three analytics events per page view.

## Related

- Reading: [Widget](../server/widget.html) · [MFE](../server/mfe.html) · [App shell](../server/app-shell.html)
- Agent Skill: `server-widget`
