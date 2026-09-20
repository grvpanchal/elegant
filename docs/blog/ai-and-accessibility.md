---
title: "AI writes markup fast, and accessibility is exactly what it drops"
layout: post
slug: ai-and-accessibility
date: 2026-08-05
author: The Elegant team
category: ai-and-frontend
tags: [ai, accessibility, quality, guardrails]
description: 'A model will happily generate a div that looks like a button, because it renders and looks right. Accessibility lives in the parts that do not show — roles, names, keyboard behaviour — which is precisely what optimizing for "looks right" skips.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-a11y-gate, accessible-combobox, form-field-molecule]
---

Accessibility is the part of frontend work that does not show up in a screenshot,
and a model optimizing to produce something that looks right is therefore
structurally likely to skip it. It will give you a `div` with an `onClick` that
looks like a button, an icon with no label, a custom dropdown you cannot operate
with a keyboard — all of which render perfectly and are all broken for a
screen-reader or keyboard user. Understanding *why* AI drops accessibility tells
you where to catch it.

## The model optimizes for the visible

When you ask for a button, the model produces something that looks and clicks like
a button. Whether it is a native `<button>` (focusable, keyboard-operable,
announced as a button) or a styled `<div>` (none of those) makes no visible
difference, so the model treats them as interchangeable — and often picks the div
because it saw more of them in training. The accessible name, the role, the
keyboard handlers, the focus management: these are invisible in the demo, so they
are exactly the details that get omitted when the objective is "make it look
right." It is not that the model is bad at accessibility; it is that accessibility
is orthogonal to the thing it was optimizing.

## Ask for the invisible explicitly

You get much better output by naming the invisible requirements in the prompt:
"use a native button," "the icon button needs an `aria-label`," "the combobox must
be operable with the arrow keys and announce its selected option," "manage focus
when the dialog opens and restore it on close." When you make the accessibility
part of the contract, the model includes it, because now it is part of "looks
right" as you have defined it. Leave it unsaid and it reverts to the visible-only
default.

## But do not trust the prompt to be enough

Even with a good prompt, the model is inconsistent about accessibility across a
session and across generations — it will get it right in one component and drop it
in the next. So prompting is necessary but not sufficient; you need a check that
does not depend on remembering to ask. A guardrail that renders each interactive
component and asserts against the accessibility tree — every control has a role
and a name, every image has alt text or is explicitly decorative, focus is managed
— catches what the model omits regardless of how you prompted. This is the same
argument as everywhere else: encode the rule so it holds automatically.

## Accessibility is a machine-checkable floor

The encouraging part is that a large share of accessibility *is* mechanical and
therefore automatable: missing accessible names, missing alt text, poor contrast,
non-semantic interactive elements, unmanaged focus. None of these needs human
judgement to detect — they need a check. That check becomes a floor under every
diff, human or AI, so the baseline never regresses even as generation speeds up.
The a11y-gate exercise builds exactly that floor, and the combobox and form-field
exercises are the components where getting the invisible parts right is the whole
challenge.
