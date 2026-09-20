---
title: "Feature flags decouple deploying code from releasing a feature"
slug: feature-flags-decouple-deploy-from-release
layout: post
date: 2026-06-26
author: The Elegant team
category: architecture
tags: [architecture, deployment, feature-flags, workflow]
description: 'A feature flag lets you merge and deploy unfinished or unreleased code that stays dark until you flip it on. That separation — deploy is not release — is what makes trunk-based development and safe rollouts possible.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [render-strategy-choice]
---

"Deploy" and "release" get used as synonyms, and separating them is one of the highest-
leverage moves in a frontend team's workflow. **Deploying** is shipping code to
production. **Releasing** is turning a feature on for users. A **feature flag** is the
switch that decouples them: you can merge and deploy unfinished code that stays *dark*
— present but off — until you flip the flag. Once deploy no longer means release, a
cascade of good things becomes possible: developers merge small increments to main
without waiting for a whole feature, releases become a config change instead of a
deploy, and a bad rollout is a flag flip away from being undone.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="ff-t ff-d" class="blog-figure__svg">
  <title id="ff-t">Code deploys dark behind a flag; releasing is flipping the flag on later</title>
  <desc id="ff-d">A timeline: merge and deploy the code with the flag off (dark in production), then independently flip the flag to release to users, and flip it back to roll back without a deploy.</desc>
  <rect x="30" y="70" width="110" height="40" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="85" y="88" text-anchor="middle" fill="#155799" font-size="9">deploy code</text><text x="85" y="102" text-anchor="middle" fill="#819198" font-size="8">flag OFF — dark</text>
  <path d="M140 90 L210 90" stroke="#819198" stroke-width="2" marker-end="url(#ff-a)"/><text x="175" y="82" fill="#819198" font-size="8">later</text>
  <rect x="210" y="70" width="120" height="40" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="270" y="88" text-anchor="middle" fill="#157878" font-size="9">flip flag ON</text><text x="270" y="102" text-anchor="middle" fill="#819198" font-size="8">= release, no deploy</text>
  <path d="M330 90 L400 90" stroke="#819198" stroke-width="2" marker-end="url(#ff-a)"/>
  <rect x="400" y="70" width="120" height="40" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/><text x="460" y="88" text-anchor="middle" fill="#c2571a" font-size="9">problem? flip OFF</text><text x="460" y="102" text-anchor="middle" fill="#819198" font-size="8">instant rollback</text>
  <defs><marker id="ff-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Deploy the code dark, release by flipping the flag on when ready, and roll back by flipping it off — no redeploy in the loop at any step.</figcaption>
</figure>

## The flag is a runtime switch, not a build-time one

A feature flag is checked at runtime, so the same deployed build behaves differently
depending on the flag's value — which is what lets you change behaviour without
shipping new code:

```jsx
// the code is deployed either way; the flag decides what users actually get
function Checkout() {
  return useFlag("new-checkout")           // read at runtime, from a config service
    ? <NewCheckout />                      // dark until the flag is flipped on
    : <LegacyCheckout />;
}
```

Merge `NewCheckout` half-finished behind `new-checkout: false`, and it sits safely in
production, invisible, until it is ready — no long-lived branch, no big-bang merge.

## Flags enable gradual, reversible rollouts

Because the flag is config, releasing can be *gradual* and *targeted*: on for
internal users first, then 1% of traffic, then 50%, then everyone — watching metrics
at each step and flipping back instantly if something breaks:

```js
// release to a slice, not the world — and reverse it in seconds if metrics dip
function useFlag(name, userId) {
  const rule = config[name];                    // { enabled: true, rollout: 0.1 }
  return rule.enabled && hash(userId) % 100 < rule.rollout * 100;  // 10% of users
}
```

A rollback that used to mean an emergency deploy is now a toggle, which is a
categorically faster and safer incident response.

## The discipline: flags are debt, so retire them

The catch is that flags accumulate. Every one is a branch in your code and a
combination to reason about; leave them forever and you get an untestable thicket of
`if (flagA && !flagB)`. So treat flags as temporary by default — a release flag exists
to ship a feature, and once the feature is fully rolled out and stable, the flag and
the dead branch get *deleted*. (Long-lived flags for genuine configuration —
kill-switches, plan tiers — are a separate, deliberate category.) Managed well, feature
flags turn deploy and release into two independent, low-risk actions: merge small and
often, release when ready, roll back in seconds, and clean up the switch afterward. The
render-strategy-choice exercise touches the same "decide behaviour at the boundary"
thinking a flag formalises — choosing what users get, separately from what you shipped.
