---
title: "The testing pyramid, adjusted for the frontend"
layout: post
slug: the-testing-pyramid-for-frontend
date: 2026-07-24
author: The Elegant team
category: architecture
tags: [testing, quality, architecture, frontend]
description: 'The classic pyramid — many unit tests, some integration, few end-to-end — needs a frontend twist. The most valuable tests here are the ones that render a component and interact with it the way a user does. Test behaviour, not implementation.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [deep-clone, accessible-combobox, debounce-utility]
---

The classic testing pyramid says: many fast unit tests at the base, fewer integration
tests in the middle, and a handful of slow end-to-end tests at the top. It is good
advice, and it needs a frontend adjustment. On the frontend, the highest-value tests
are not pure unit tests of isolated functions — they are **component tests** that
render a component and interact with it the way a user does. The middle of the pyramid
is where the frontend's value concentrates, because most frontend bugs are not "this
function returned the wrong number" but "clicking this did not do what it should."
The shape is still a pyramid; the fat part just sits a little higher.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="tp-t tp-d" class="blog-figure__svg">
  <title id="tp-t">The frontend pyramid: a broad component-test middle over a unit base</title>
  <desc id="tp-d">A pyramid: base of unit tests (pure logic, fast, many), a wide middle of component tests (render + interact, the most valuable), and a narrow top of end-to-end tests (few, slow, critical flows).</desc>
  <polygon points="320,25 250,80 390,80" fill="#f3f6fa" stroke="#c2571a" stroke-width="2"/><text x="320" y="62" text-anchor="middle" fill="#c2571a" font-size="9">E2E (few)</text>
  <polygon points="250,82 390,82 470,145 170,145" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="320" y="110" text-anchor="middle" fill="#157878" font-size="10" font-weight="700">component (most value)</text><text x="320" y="126" text-anchor="middle" fill="#819198" font-size="8">render + interact like a user</text>
  <polygon points="170,147 470,147 540,175 100,175" fill="#f3f6fa" stroke="#155799" stroke-width="2"/><text x="320" y="168" text-anchor="middle" fill="#155799" font-size="9">unit (pure logic, many, fast)</text>
</svg>
<figcaption>Same pyramid, frontend weighting: a broad, valuable band of component tests sits over the fast unit base, with a thin cap of end-to-end tests for critical flows.</figcaption>
</figure>

## Base: unit tests for pure logic

The base is still fast unit tests, but on the frontend they cover the genuinely pure
parts — reducers, selectors, formatters, utilities. These need no DOM, run in
milliseconds, and give precise failure locations, so cover every edge case here:

```js
// unit: pure logic, no DOM, exhaustive edge cases — cheap and precise
expect(formatMoney(0)).toBe("$0.00");
expect(formatMoney(1234.5)).toBe("$1,234.50");
expect(formatMoney(-5)).toBe("-$5.00");   // the edge cases live at the fast base
```

## Middle: component tests are the frontend's sweet spot

The band that carries the most value renders a component and drives it like a user —
this is where "does the feature work" is actually answered, and it catches the bugs
unit tests structurally cannot (wiring, rendering, interaction):

```jsx
// component: the highest-value frontend test — render, interact, assert on output
render(<SearchBox onSearch={onSearch} />);
await userEvent.type(screen.getByRole("searchbox"), "cats");
await waitFor(() => expect(onSearch).toHaveBeenCalledWith("cats"));  // the real behaviour
```

Because these assert on behaviour (role, visible text) rather than internals, they
survive refactors and fail only on real regressions — which is exactly why they earn
the widest band.

## Top: a thin cap of end-to-end tests

End-to-end tests drive a real browser through a whole flow, and they are precious in
both senses: extremely valuable for critical paths and expensive to run and maintain
(slow, flaky-prone). So keep them few and reserved for the flows where a break is
unacceptable — sign-up, checkout, the money path — not for coverage of every screen:

```js
// E2E: a few critical flows only — real browser, real cost, reserved for what must not break
test("user can complete checkout", async ({ page }) => {
  await page.goto("/cart");
  await page.getByRole("button", { name: "Checkout" }).click();
  await expect(page.getByText("Order confirmed")).toBeVisible();
});
```

The adjusted pyramid, then: a fast unit base for pure logic, a *wide* component-test
middle where most frontend value and most frontend bugs live, and a thin E2E cap for
the handful of flows that must never break. Weight your effort toward the middle —
that is the frontend-specific move — and keep every level testing behaviour rather than
implementation so the suite stays green through refactors. The deep-clone and
debounce-utility exercises are unit-level, and accessible-combobox is a component-level
test where rendering and interacting is the only way to know it works.
