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
reading_minutes: 4
related_practice: [deep-clone, counter-reducer, accessible-combobox]
---

There are two ways to test a component, and they age in opposite directions. One
asserts on *implementation* — internal state, private methods, which functions were
called. The other asserts on *behaviour* — what the user sees and can do. The
behaviour tests survive refactors and fail only when something real breaks; the
implementation tests break on every refactor even when nothing user-facing changed,
and a suite that cries wolf on every refactor gets ignored or deleted. The
distinction decides whether your tests are an asset or a liability.

## Implementation tests couple to the how

An implementation test says "after clicking, `this.state.isSubmitting` became true"
or "the `handleSubmit` method was called." It is coupled to *how* the component
works, not *what* it does. So when you refactor — rename the state field, extract a
hook, restructure the internals — the behaviour is identical but the test fails,
because it was watching the internals you just changed. Now every refactor comes with
a pile of red tests that you have to update by hand, testing nothing new, and the
team learns that refactoring "breaks the tests" — which trains them not to refactor,
or not to trust the tests.

## Behaviour tests couple to the what

A behaviour test says "after clicking submit, the success message appears" or "typing
in the field and pressing Enter adds an item to the list." It asserts on what a user
would observe, through the interface a user uses — querying by role and accessible
name, clicking, typing, reading output. Refactor the internals however you like: as
long as the behaviour is unchanged, the test passes, because it never looked at the
internals. And when it *does* fail, it is because the behaviour actually broke, which
is exactly when you want a test to fail. The test is now a specification of what the
component does, not a snapshot of how it currently does it.

## Query the way a user does

For components, the practical rule is to interact through the accessibility tree, not
through test IDs or CSS classes or component internals. Find the button by its
accessible name, not `.submit-btn`; assert the error is visible, not that
`state.error` is set. This has a bonus: if your test cannot find the button by its
name, a screen reader cannot either, so behaviour-focused tests double as a light
accessibility check. Testing the way a user experiences the component keeps the test
honest about what actually matters.

## Pure logic is the easy case

For pure functions — a reducer, a deep clone, a utility — "behaviour" and "output"
are the same thing, so testing them is straightforward: given input, assert output,
no implementation coupling possible. This is another reason to push logic into pure
functions: they are trivially testable by behaviour because they have no hidden
internals to couple to. The trap is only in stateful, effectful components, where it
is tempting to reach for the internal state. Resist it: assert what the user sees.
The counter-reducer and deep-clone exercises are the pure, output-tested kind, and
the combobox exercise is where behaviour-focused, accessibility-tree testing is the
only sane way to verify a stateful component.
