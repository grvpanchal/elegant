---
title: "The backend-for-frontend: an API shaped for the screen, not the database"
layout: post
slug: the-bff-pattern
date: 2026-07-12
author: The Elegant team
category: architecture
tags: [server, bff, api, architecture]
description: 'A backend-for-frontend is a thin server layer that exists to serve one frontend — aggregating calls, reshaping data, and holding secrets — so the client gets exactly what the screen needs in one request.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 4
related_practice: [proxy-and-cors, session-and-tokens]
---

A backend-for-frontend (BFF) is a thin server layer whose only job is to serve one
frontend well. Instead of the browser calling five microservices and stitching the
results together, it calls one BFF endpoint that does the aggregating and returns
exactly what the screen needs. It sits between your UI and your backend services,
and it exists because a general-purpose API and a specific screen's needs rarely
match.

## The mismatch it fixes

Backend services are usually designed around domains — a user service, an orders
service, a catalog service — not around screens. But a screen often needs a bit of
each: the profile page wants the user, their recent orders, and their loyalty
status, which live in three services. Without a BFF, the browser makes three
round-trips, over mobile latency, and assembles the result — slow and chatty. The
BFF makes those calls server-to-server (fast, on the same network) and returns one
tailored payload, so the client makes one request and gets a shape that matches the
screen. It turns a chatty client into a single call.

## It is the natural home for secrets and cross-origin work

Because the BFF is a server you control, it is where things that must not live in
the browser belong: API keys for third-party services, server-only credentials, the
logic to exchange and refresh auth tokens. It is also the clean answer to CORS —
the browser calls your BFF same-origin, and the BFF calls the third-party APIs
server-to-server where CORS does not apply. So the proxy pattern and the BFF are
close cousins; a BFF is a proxy that also aggregates, reshapes, and holds secrets,
rather than just forwarding.

## One BFF per frontend, not one shared API

The "for frontend" is load-bearing: the pattern is one BFF per client type, because
a web app and a mobile app need different shapes (mobile wants smaller payloads,
fewer round-trips, different fields). A single "shared" BFF that tries to serve both
drifts back into a general-purpose API with all the mismatch you were trying to
escape. Each BFF is owned by the team that owns its frontend, so it evolves with the
screens it serves rather than being a contested shared resource. That ownership is
part of the point — the frontend team can reshape their BFF without filing a ticket
against a platform team.

## Keep it thin — it is glue, not a place for business logic

The discipline that keeps a BFF healthy is resisting the urge to put real business
logic in it. It should aggregate, reshape, and adapt — not own domain rules, which
belong in the backend services where they can be shared and tested properly. A BFF
that accumulates business logic becomes a second backend, with duplication and
drift between it and the services. Keep it a thin, screen-shaped adapter, and it
stays cheap to change as the UI changes. The proxy-and-CORS exercise is the BFF's
simplest form (make a cross-origin call same-origin), and the sessions-and-tokens
exercise is the auth work a BFF is the right place to handle.
