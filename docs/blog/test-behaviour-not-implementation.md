---
title: "Test behaviour, not implementation, or your tests become the bug"
slug: test-behaviour-not-implementation
layout: post
date: 2026-06-19
author: The Elegant team
category: terminology
tags: [testing, quality, refactoring, frontend]
description: 'A test that asserts on internal state breaks every time you refactor, even when nothing user-facing changed. A test that asserts on behaviour survives refactors and fails only when something real breaks. The distinction decides whether your suite helps or hurts.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 5
related_practice: [deep-clone, counter-reducer, accessible-combobox]
---

There are two ways to test the same component, and they age in opposite directions. A
test that asserts on **implementation** — internal state, private methods, which
hooks fired — breaks every time you refactor, even when the user-facing behaviour is
identical. A test that asserts on **behaviour** — what the user sees and can do —
survives refactors and fails only when something *actually* breaks. The distinction
decides whether your test suite is an asset that lets you refactor fearlessly or a
liability that punishes every internal change. A brittle suite that cries wolf on
every rename does not protect you; it trains you to ignore it, which is worse than no
suite at all.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="tb-t tb-d" class="blog-figure__svg">
  <title id="tb-t">Implementation tests break on refactor; behaviour tests break only on real regressions</title>
  <desc id="tb-d">A refactor that keeps behaviour the same: the implementation test turns red (false alarm), the behaviour test stays green. A real regression: both go red.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#606c71" font-size="10" font-weight="700">refactor (same behaviour)</text>
  <rect x="40" y="40" width="220" height="30" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="150" y="59" text-anchor="middle" fill="#c2571a" font-size="9">impl test → RED (false alarm)</text>
  <rect x="40" y="78" width="220" height="30" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="150" y="97" text-anchor="middle" fill="#157878" font-size="9">behaviour test → GREEN ✓</text>
  <line x1="330" y1="18" x2="330" y2="160" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#606c71" font-size="10" font-weight="700">real regression</text>
  <rect x="370" y="40" width="220" height="30" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="480" y="59" text-anchor="middle" fill="#c2571a" font-size="9">impl test → RED</text>
  <rect x="370" y="78" width="220" height="30" rx="5" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="480" y="97" text-anchor="middle" fill="#c2571a" font-size="9">behaviour test → RED ✓</text>
  <text x="320" y="140" text-anchor="middle" fill="#819198" font-size="9">the behaviour test is red only when it should be</text>
</svg>
<figcaption>Only the behaviour test has the property you want: green through refactors, red on real regressions. The implementation test's extra red is pure noise.</figcaption>
</figure>

## The brittle version tests the wrong thing

An implementation test reaches into the component's guts — its state variable names,
its internal methods. Rename the state, split the component, or swap `useState` for
`useReducer`, and it fails though the user sees no difference:

```jsx
// BRITTLE: asserts on internal state — a refactor renames `count` and this breaks
const { result } = renderHook(() => useCounter());
expect(result.current.internalCount).toBe(0);   // couples the test to the implementation
```

Every false red erodes trust, and a suite you do not trust is a suite you route around.

## The durable version tests what the user does

A behaviour test drives the component the way a user would — find the element by its
visible role or text, interact, assert on what shows — and never mentions an internal:

```jsx
// DURABLE: interacts like a user; survives any refactor that keeps behaviour intact
render(<Counter />);
await userEvent.click(screen.getByRole("button", { name: /increment/i }));
expect(screen.getByText("1")).toBeInTheDocument();   // asserts what the user sees
```

Rewrite `Counter` however you like — hooks, class, reducer — and this test stays green
as long as clicking increment still shows 1. It goes red exactly when the *behaviour*
regresses, which is the only time you want to be interrupted.

## Query the way a user perceives the app

The practical rule that keeps you honest: query by what a *user* perceives — role,
label, visible text — not by test ids, class names, or component internals. That is why
testing-library's `getByRole`/`getByText` are designed the way they are: they nudge you
toward behaviour and away from implementation, and as a bonus, `getByRole` fails if the
element is not accessible, so a behaviour test quietly checks accessibility too. There
is one honest exception — a pure function has no "implementation vs behaviour"
distinction, so testing a reducer's return value directly is behaviour testing. But for
components, assert on the rendered result and the user interaction, never the internal
state, and your suite becomes the thing that *enables* refactoring rather than
resisting it. The counter-reducer exercise is the pure-function case, and
accessible-combobox is where behaviour-first querying and accessibility checking turn
out to be the same act.
