---
title: Design the caching layer for a static app
layout: question
slug: cache-headers-basics
format: system-design
difficulty: easy
layer: server
topics: [protocol, api, index-file, app-shell]
skill: server-protocol
minutes: 20
summary: Decide the cache policy for each artefact a single-page app ships, and say what breaks when you get one wrong.
---

Your app deploys four kinds of artefact: the HTML shell, hashed JavaScript and
CSS bundles, images, and JSON API responses. A CDN sits in front of everything.

Give each one a cache policy and defend it. Then say what the user sees when
each policy is wrong.

## Solution

### The four policies

**Hashed bundles** (`app.8f3c1a.js`) — `Cache-Control: public, max-age=31536000,
immutable`. The filename changes whenever the content changes, so the URL is a
permanently stable identity and there is nothing to revalidate. `immutable` tells the
browser not to send a conditional request even on a hard refresh.

**The HTML shell** — `Cache-Control: no-cache` (revalidate every time), or a
short `max-age` of a minute or two at the edge. The shell is the file that
names the current bundle hashes, so it is the one thing that must never be
stale for long. `no-cache` is not "do not cache"; it means "cache it, but check
before using it", which gives you a cheap 304 on most loads.

**Images** — `public, max-age=604800` with a content hash in the path if you
control the pipeline, or a shorter TTL with `stale-while-revalidate` if you do
not. Images are large and rarely urgent, so serving a slightly old one is
almost always better than blocking on a revalidation.

**API JSON** — it depends on the resource, and saying so is the answer. Public,
non-personalised data gets a short `max-age` plus `stale-while-revalidate`.
Anything personalised gets `private, no-store` or an `ETag` with
`Cache-Control: private, no-cache`, because a shared cache that keys on URL
alone will hand one user another user's data.

### The failure modes, in order of how much they hurt

| Wrong policy | What the user sees |
|---|---|
| HTML cached long | A shell pointing at bundle hashes that no longer exist — a blank page that a refresh does not fix, for as long as the TTL runs |
| Bundles not cached | Every visit re-downloads the whole app |
| Personalised JSON in a shared cache | Another user's data. The worst failure on this list and the easiest to ship |
| Images `no-store` | A slow gallery and a large bill |

The first row is why `immutable` on bundles and short TTL on HTML are a pair,
not two independent choices: the long cache on bundles is only safe *because*
the shell that names them is fresh.

## Trade-offs

A short HTML TTL costs a revalidation round trip per navigation and buys the
ability to deploy at all. Pushing it to zero (`no-store`) costs you the 304 and
buys almost nothing.

`stale-while-revalidate` is the highest-value directive on this list and the
least used: it lets the CDN serve the cached copy instantly while fetching a
fresh one in the background, which turns a traffic spike into one origin
request instead of thousands. The price is that some users see data up to one
TTL old, so it belongs on a news feed and not on an account balance.

Versioning by query string (`app.js?v=3`) instead of by filename still works in
browsers but is defeated by some intermediary caches, and it gives you no way
to keep the old version addressable during a rollback.

## Related

- Reading: [Protocol](../server/protocol.html) · [Index file](../server/index-file.html) · [API](../server/api.html)
- Playbook: [Frontend system design](../playbooks/system-design.html)
- Agent Skill: `server-protocol`
