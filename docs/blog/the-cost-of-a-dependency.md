---
title: "Every dependency is a loan, and the interest is paid in bytes and risk"
slug: the-cost-of-a-dependency
layout: post
date: 2026-06-25
author: The Elegant team
category: architecture
tags: [architecture, performance, dependencies, bundling]
description: 'Adding a package feels free — one install command. The real cost shows up later in bundle size, security surface, maintenance, and the day it breaks. Weigh it before you borrow, not after.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [harness-bundle-budget, debounce-utility, deep-clone]
---

Adding a dependency feels free — one `npm install` and the problem is solved. But a
dependency is a **loan**, and the principal (the feature you got) is the small part.
The interest is paid later and forever: bytes shipped to every user, a larger security
surface, a maintenance burden when it needs upgrading, and the day it breaks, is
abandoned, or ships a change you did not want. None of that shows at install time,
which is exactly why the decision gets made carelessly. Borrowing is often the right
call — you should not reimplement a date library — but it is a call, and it should be
made by weighing the interest before you sign, not discovering it after.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="dp-t dp-d" class="blog-figure__svg">
  <title id="dp-t">The visible install cost versus the ongoing interest of a dependency</title>
  <desc id="dp-d">A small labelled "install: free" box, and a much larger stacked set of ongoing costs: bundle bytes, security surface, maintenance, breakage risk, transitive deps.</desc>
  <rect x="40" y="80" width="120" height="30" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="100" y="99" text-anchor="middle" fill="#157878" font-size="9">install: "free"</text>
  <path d="M160 95 L210 95" stroke="#819198" stroke-width="2" marker-end="url(#dp-a)"/><text x="185" y="87" fill="#819198" font-size="8">then…</text>
  <g fill="#fff4ec" stroke="#fe854c" stroke-width="2" font-size="9" text-anchor="middle">
    <rect x="215" y="30" width="180" height="24" rx="4"/><text x="305" y="46" fill="#c2571a">bundle bytes (every user)</text>
    <rect x="215" y="60" width="180" height="24" rx="4"/><text x="305" y="76" fill="#c2571a">security surface + CVEs</text>
    <rect x="215" y="90" width="180" height="24" rx="4"/><text x="305" y="106" fill="#c2571a">upgrade / maintenance</text>
    <rect x="215" y="120" width="180" height="24" rx="4"/><text x="305" y="136" fill="#c2571a">breakage / abandonment</text>
  </g>
  <rect x="420" y="60" width="180" height="60" rx="6" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="510" y="86" text-anchor="middle" fill="#155799" font-size="9">+ its transitive deps</text><text x="510" y="102" text-anchor="middle" fill="#819198" font-size="8">each with the same costs</text>
  <path d="M395 100 L418 95" stroke="#819198" stroke-width="1.5" marker-end="url(#dp-a)"/>
  <defs><marker id="dp-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Install is the visible, one-time cost. The interest — bytes, CVEs, upgrades, breakage, and every transitive dependency's version of the same — is ongoing.</figcaption>
</figure>

## The interest is mostly invisible at install

Weigh what a package actually costs before adding it. **Bytes**: it ships to every
user, on every load, forever — a 40KB library for a 10-line need is a bad trade.
**Security**: every dependency (and every dependency *of* that dependency) is attack
surface and a future CVE to patch. **Maintenance**: it must be upgraded, and majors
break. **Breakage**: it can be abandoned or hijacked. Before installing, do the
napkin check:

```bash
# what am I really borrowing?
npx bundlephobia left-pad     # bytes added, min+gzip, to every user
npm view some-lib dependencies # its transitive tree — each one is more of the same
# then ask: is the feature worth THAT, or can I write the 10 lines?
```

## Sometimes the ten lines are the cheaper loan

A lot of tiny dependencies exist to save code you could write and own in minutes —
and owning it removes all the interest. A debounce is the canonical example: a
one-line reason to reach for a utility library, and a five-line reason not to:

```js
// this is the whole "dependency" — writing it costs less than auditing a package for it
function debounce(fn, wait) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
```

The rule is not "never depend" — it is "don't borrow what is cheaper to own." For
`debounce`, `deepClone` of simple data, or a small formatter, the code you write has
no bytes-tax, no CVE, and no upgrade day.

## Borrow deliberately, and put a budget on it

For the genuinely hard, well-solved problems — dates, virtualization, a rich editor,
crypto — do borrow, because reimplementing them badly is far more expensive than the
interest. The discipline is to make it a *decision*: prefer a dependency that is
small, focused, actively maintained, and tree-shakeable over a kitchen-sink library
where you use 5%. Then enforce the aggregate with a **bundle budget** that fails the
build when the total crosses a line, so "one more package" cannot quietly balloon the
app one careless install at a time:

```bash
$ node harness/bundle-budget.js
  FAIL  entry chunk 268kb > 250kb budget  (moment 19kb, lodash 24kb — both replaceable)
```

That number turns "every dependency is a loan" from a proverb into a check. Borrow on
purpose, own what is cheap to own, and keep a budget on the total — the
harness-bundle-budget exercise builds exactly that gate, and debounce-utility and
deep-clone are the "own it instead" cases in miniature.
