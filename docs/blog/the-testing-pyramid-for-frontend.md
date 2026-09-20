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
reading_minutes: 4
related_practice: [deep-clone, accessible-combobox, debounce-utility]
---

The testing pyramid says: many fast unit tests at the base, fewer integration
tests in the middle, a handful of slow end-to-end tests at the top. The shape is
right, but the frontend adds a twist the classic version misses — the highest-
value tests here are component tests that render UI and interact with it as a user
would. Getting the mix and the *style* right is what makes a suite that catches
real bugs without breaking on every refactor.

## The base: pure logic, tested directly

At the base sit the pure functions — reducers, selectors, utilities like debounce
and deep-clone, formatters. These are the cheapest and most valuable unit tests,
because pure functions take plain inputs and return plain outputs, so testing them
is fast, deterministic, and mock-free. This is exactly why keeping reducers pure
and pushing logic out of components pays off: the more of your behaviour lives in
pure functions, the more of it you can test at the cheap, reliable base of the
pyramid. If your logic is trapped inside components, you have pushed testing up the
pyramid where it is slower and more brittle.

## The middle: components, tested like a user

The frontend's signature layer is component tests: render a component, interact
with it through the accessibility tree (find by role and label, click, type), and
assert on what the user would see. The critical discipline is to test *behaviour*,
not *implementation* — assert "after clicking submit, the error message appears,"
not "the `isSubmitting` state became true." Implementation-detail tests break every
time you refactor even though nothing user-facing changed, which trains the team to
ignore or delete them. Behaviour tests survive refactors and fail only when the
user experience actually breaks, which is the entire point of a test.

## The top: a few real end-to-end flows

At the top, a small number of end-to-end tests drive a real browser through your
critical paths — sign in, add to cart, check out. They are slow and can be flaky,
so you want few of them, covering only the flows where a break would be a
catastrophe. Their value is that they exercise the whole stack together, catching
the integration failures that isolated tests miss. The mistake is inverting the
pyramid — mostly end-to-end tests — which gives you a slow, flaky suite everyone
learns to distrust.

## Query the way users do

A thread runs through all three layers: interact with your UI the way a user
does. Query by role and accessible name, not by test IDs or CSS classes, because
that both mirrors real usage and doubles as an accessibility check — if your test
cannot find the button by its name, a screen reader cannot either. This is why a
component that is easy to test well is usually also accessible: both depend on the
element being findable and operable through the accessibility tree. The combobox
exercise is a masterclass in behaviour-focused component testing, while the
deep-clone and debounce exercises are the pure-logic base where testing is cheapest
and most certain.
