---
title: "Micro-frontends solve an org problem, not a tech one"
layout: post
slug: micro-frontends-split-by-team
date: 2026-07-13
author: The Elegant team
category: architecture
tags: [server, micro-frontends, architecture, scaling]
description: 'Splitting a frontend into independently deployable pieces is worth it when teams are stepping on each other, and a costly mistake when they are not. The boundary should follow the org chart, not the tech.'
cover: /assets/img/diagrams/server-system-diagram.png
reading_minutes: 6
related_practice: [design-micro-frontends]
---

Micro-frontends — splitting one app into independently built and deployed pieces —
are usually adopted for the wrong reason. Teams reach for them because the codebase is
big, or because the architecture feels elegant. But the problem they actually solve is
**organisational**: multiple teams contending over one deploy pipeline, blocking each
other's releases, and coupling their schedules. If you have that pain, micro-frontends
are worth their considerable cost. If you do not — if one team owns the whole app —
they add distributed-systems complexity to solve a coordination problem you don't
have. The boundary should follow the **org chart**, not the tech.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="mf-t mf-d" class="blog-figure__svg">
  <title id="mf-t">Split the app along team boundaries so each team ships independently</title>
  <desc id="mf-d">A shell app composing three micro-frontends — search, cart, account — each owned and deployed by a different team on its own pipeline.</desc>
  <rect x="220" y="25" width="200" height="34" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="320" y="47" text-anchor="middle" fill="#157878" font-size="10">shell (composes them)</text>
  <g stroke="#819198" stroke-width="2" marker-end="url(#mf-a)"><path d="M280 59 L150 95"/><path d="M320 59 L320 95"/><path d="M360 59 L490 95"/></g>
  <g font-size="9" text-anchor="middle">
    <rect x="70" y="98" width="160" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="150" y="122" fill="#c2571a" font-weight="700">Search MFE</text><text x="150" y="140" fill="#819198">team A · own deploy</text>
    <rect x="245" y="98" width="150" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="320" y="122" fill="#c2571a" font-weight="700">Cart MFE</text><text x="320" y="140" fill="#819198">team B · own deploy</text>
    <rect x="410" y="98" width="160" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="490" y="122" fill="#c2571a" font-weight="700">Account MFE</text><text x="490" y="140" fill="#819198">team C · own deploy</text>
  </g>
  <defs><marker id="mf-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>The split lines up with the org chart: each team owns a micro-frontend and its pipeline, so they ship without waiting on each other — the actual point.</figcaption>
</figure>

## The problem is coordination, not code size

A single team with a big codebase does not have the micro-frontend problem — they have
a modularity problem, solvable with good folder structure and boundaries inside one
app. The micro-frontend problem appears when *independent teams* share one deployable:
team A's release is blocked by team B's failing test, a shared component change needs
three teams to agree, and the deploy queue is a bottleneck. Micro-frontends buy
**independent deployability** — each team ships its slice on its own schedule:

```js
// the shell composes independently-deployed pieces at runtime (module federation)
const CartApp = React.lazy(() => import("cart_mfe/App"));   // team B deploys this on its own
// team A's shell doesn't rebuild when team B ships — that decoupling IS the product
```

## The costs are real and distributed

That independence is not free — you take on a distributed system. Shared dependencies
must be aligned or duplicated (three copies of React is a real failure mode); a
consistent look requires shared design tokens across separately-built apps;
cross-MFE communication needs a contract (custom events, a shared store shape);
performance suffers if each MFE ships its own framework copy; and debugging spans
repos and deploys. These are the same costs as backend microservices, and they are
paid whether or not you needed the split:

```js
// the shell must dedupe shared deps or every MFE ships its own React
shared: { react: { singleton: true, requiredVersion: "^19.0.0" } }
```

## Split along teams, and only when the pain is real

The decision rule is organisational. Adopt micro-frontends when **multiple teams are
genuinely contending** over one frontend deploy and that contention is slowing
releases — and draw the boundaries along team ownership (Search team owns the Search
MFE), so each split maps to a team that can own it end to end. Do *not* adopt them for
a single team, for a modestly-sized app, or because the architecture sounds impressive
— there you get the distributed-systems tax with none of the coordination benefit, and
plain modular structure inside one app is the better answer. Like backend
microservices, micro-frontends are an answer to Conway's Law, not to line count: match
the architecture to the org, split only when teams are stepping on each other, and put
the boundaries where the ownership is. The design-micro-frontends exercise is a full
rehearsal of exactly that trade-off — when the split is worth it, and where the seams
belong.
