---
title: Session
layout: doc
slug: session
---

# Session

- Sessions identify authenticated users and maintain their state while they interact with an application
- Three key session layers exist: Application session, Auth0 session, and IdP session
- Tokens differ from sessions - they are signed information for secure authentication and authorization exchange

## Implementation Approaches

- Regular web apps can track sessions via server-side cookies and refresh tokens
- SPAs use Auth0 SDKs with rotating refresh tokens and silent authentication for session management

## Multi-Domain Challenges & Solutions

- Multi-domain SPAs face challenges with third-party cookies and ITP in browsers like Safari and Chrome
- Two main solution patterns exist: Push (using WebSockets or iFrame postMessage) and Poll (against Auth0 or client-side endpoints)
- Push-based approaches can better handle rate limiting and third-party cookie restrictions while providing improved user experience

## References
- https://auth0.com/blog/application-session-management-best-practices/