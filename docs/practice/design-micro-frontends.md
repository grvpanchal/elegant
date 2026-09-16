---
title: Split a monolith into micro-frontends
layout: question
slug: design-micro-frontends
format: system-design
difficulty: hard
layer: server
topics: [mfe, app-shell, protocol, container, router]
skill: server-mfe
minutes: 50
summary: Four teams, one URL, and the shared state, routing and version skew that decide whether this helps or hurts.
---

One React application is maintained by four teams. Releases are coupled: every
change waits for a weekly train, and one team's bug blocks everyone.

Design a split into micro-frontends. Be explicit about the boundary, routing,
shared state, styling, dependency duplication and what you would measure to
know whether it worked.

## Solution

### Draw the boundary along the product, not the stack

The split that works follows business capability: Catalogue, Checkout, Account,
Support. Each owns its routes, its data and its deploys end to end. The split
that fails follows layers — a "components team" and a "data team" — because
every feature then crosses every boundary and you have added coordination cost
without removing any coupling.

The test is a sentence: *can this team ship a user-visible change without
asking another team?* If not, the boundary is in the wrong place, and no amount
of tooling will fix it.

### Composition: runtime, and where

| Strategy | Good for | Costs |
|---|---|---|
| Build-time (npm packages) | shared design system | coupled releases — the thing you are trying to escape |
| Server-side includes / edge | content-heavy, SEO-critical | needs an edge layer; harder local dev |
| Runtime via Module Federation | app surfaces behind login | version skew is now yours to manage |
| iframes | hard isolation, third-party code | routing, sizing, focus and auth all become protocols |

For four internal teams on one app surface, runtime composition behind an
[app shell](../server/app-shell.html) is the usual answer. The shell owns the
frame, the router, auth and the design tokens; each remote owns a route subtree.

### Routing is the contract

The shell holds the top-level route table and hands each remote a path prefix.
Remotes route *inside* their prefix and never touch `history` directly —
navigation goes through a shell-provided function. Two remotes both pushing
history entries is how you get a back button that skips screens.

Cross-remote navigation is a URL, never an import. The moment Checkout imports a
component from Catalogue to render a link, they share a release again.

### Shared state: as little as possible, and explicitly

Three categories, three answers:

- **Session and identity** — the shell resolves it once and passes it down as
  props or context. Never four independent token refreshes.
- **Cross-remote events** ("item added to basket") — a small published event
  contract on a shared bus, versioned like an API. Remotes emit and subscribe;
  they do not reach into each other's [stores](../state/store.html).
- **Everything else** — private. A shared global store across remotes recreates
  the monolith with worse ergonomics and no type safety at the boundary.

### The hard parts

**Version skew.** With independent deploys, a user's tab can hold Catalogue from
10:00 and Checkout from 14:00. The shared contracts — event names, the session
shape, design tokens — must be additive-only, exactly like a public API. Plan
for a tab open across a deploy: detect a shell version change and prompt a
reload rather than letting half-loaded chunks 404.

**Duplicate dependencies.** Four remotes each shipping React is four copies over
the wire. Module Federation's shared scope with a singleton React fixes the size
and imposes a version constraint every team must move together on — which is a
small, explicit coupling in exchange for a real one.

**Styling.** Shared tokens, scoped styles. A global stylesheet from one remote
restyling another's buttons is the failure that erodes trust in the whole
approach fastest. CSS layers or a scoping convention, enforced by a check, not
by a wiki page.

### What you measure

| Signal | Why |
|---|---|
| Deploys per team per week | the entire reason for the split |
| Lead time from merge to production | ditto, and it should drop |
| Shared-bundle size, and duplication across remotes | the tax you are paying |
| p75 first paint on a cross-remote navigation | the users' share of the tax |
| Incidents caused by version skew | whether the contracts are actually additive |

If deploy frequency has not gone up after a quarter, the boundary is wrong and
you have taken the cost without the benefit.

## Trade-offs

Micro-frontends buy independent deployment and pay in operational complexity:
more pipelines, more observability surface, a harder local dev story, and a
class of bug — version skew — that simply does not exist in a monolith.

They are worth it when the bottleneck is *coordination*. Four teams waiting on a
release train is a coordination bottleneck. Two teams who merge cleanly and ship
daily are not, and for them this trade is a pure loss.

The decision people regret is splitting a monolith that was merely messy.
Modular boundaries inside one deployable get you most of the ownership benefits
with none of the runtime cost, and they are reversible.

## Related

- Reading: [MFE](../server/mfe.html) · [App shell](../server/app-shell.html) · [Protocol](../server/protocol.html) · [Container](../server/container.html)
- Playbook: [Frontend system design](../playbooks/system-design.html)
- Agent Skill: `server-mfe`
