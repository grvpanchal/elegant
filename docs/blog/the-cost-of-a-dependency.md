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
reading_minutes: 4
related_practice: [harness-bundle-budget, debounce-utility, deep-clone]
---

Installing a package is one command, so it feels free — and that is exactly why
dependency bloat sneaks up on teams. The cost is real but deferred: it shows up in
your bundle size, your security surface, your maintenance burden, and the day the
package breaks or is abandoned. A dependency is a loan against future simplicity, and
the interest compounds. Weighing it before you borrow, not after, is a real
engineering skill.

## The bundle cost is paid by every user

A dependency you ship to the browser is downloaded, parsed, and executed by every
user on every visit (until cached), so a heavyweight library for a lightweight need
is a tax on your whole audience. Pulling in a 60KB date library to format one date, or
a huge utility bundle for one function you could write in five lines, is a bad trade
you make invisibly. Check the cost before adding — bundle-size tools and the size
badges on package pages exist for this — and prefer smaller, tree-shakeable
alternatives or a few lines of your own. The user pays the bytes; you should know
what you are charging them.

## The maintenance and security cost is paid by you

Every dependency is code you did not write but are now responsible for shipping. It
can have security vulnerabilities you must patch, breaking changes you must migrate,
and a maintainer who may abandon it, leaving you on an unmaintained package or facing
a painful replacement. Transitive dependencies multiply this — the one package you
added pulled in forty you did not choose, each its own small risk. The supply-chain
incidents that make the news are this cost coming due. More dependencies is a larger
surface for all of it.

## The small-utility trap

The most common bad borrow is the tiny utility. A debounce, a deep clone, a
`groupBy`, a `range` — these are a few lines you understand completely, and pulling a
dependency for them adds install weight, a version to track, and a supply-chain node,
to save five minutes of typing. Writing them yourself is often the *cheaper* option
over the life of the project, and it is why interviews ask you to implement a debounce
or a deep clone: knowing you *can* is what lets you judge when a dependency is worth
it versus when it is borrowing against your future for a rounding error of effort.

## When a dependency is clearly worth it

None of this is "never use dependencies" — that way lies reinventing React, or a date
library, or a crypto implementation you will get subtly and dangerously wrong. The
judgement is proportion: borrow for genuinely hard, well-solved, high-stakes problems
(rendering, routing, dates, security, accessibility primitives), and write the small,
well-understood things yourself. Ask "what does this cost in bytes, risk, and
maintenance, and is the problem hard enough to justify it?" A bundle budget makes the
byte half of that question a hard, enforced limit rather than a good intention — the
bundle-budget exercise builds exactly that guardrail, and the debounce and deep-clone
exercises are the utilities you should be able to write rather than borrow.
