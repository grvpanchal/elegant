---
title: "Prompt to component: the quality is bounded by the boundary you hand over"
layout: post
slug: prompt-to-component-workflow
date: 2026-08-08
author: The Elegant team
category: ai-and-frontend
tags: [ai, components, workflow, architecture]
description: 'Asking a model for a component produces good code or a mess depending almost entirely on how sharply you scoped the request. The skill is not prompting tricks — it is drawing the box before you ask.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 4
related_practice: [harness-atom-guardrail, loading-button-atom, form-field-molecule]
---

The difference between an AI that writes a clean component and one that writes a
tangled feature is not the model or the phrasing — it is how sharply you scoped
the request before asking. "Add filtering" gets you an organism that fetches its
own data and holds its own state. "Write a presentational filter bar that takes
`options` and `value` props and emits a `change` event" gets you an atom you can
drop anywhere. Same model, opposite results, because the boundary was different.

## Scope the box, then ask

A good component prompt names the layer, the contract, and the constraints. The
layer: is this an atom, a molecule, a container? The contract: which props does it
take, which events does it emit, and — critically — what does it *not* do (it does
not fetch, it does not touch the store). The constraints: the accessibility
requirements, the states it must handle. When you hand the model that box, it
fills it well. When you hand it a vague verb, it invents a boundary, and the
boundary it invents is almost always "do everything here," because that is the
path of least resistance to working code.

## Keep data out of the component you are generating

The most common way AI-generated components go wrong is fetching. Ask for a
"product list" and the model will reach for `useEffect` and a fetch inside the
component, because that produces a working demo. Explicitly say "presentational —
takes `products` as a prop, no fetching" and it stays clean, and you write the
container yourself (or ask for it separately, scoped as a container). This keeps
the UI seam testable with plain props and portable across frameworks — the whole
point of the separation the model does not know you care about.

## Iterate on the contract, not the output

When the first result is wrong, resist the urge to describe the specific visual
fix ("move that div"). Instead correct the *contract*: "this should be
uncontrolled," "the accessible name comes from `aria-label`, add that prop," "this
prop should be required." Fixing the contract fixes the class of problem and
teaches the model your boundary for the rest of the session, where fixing the
output fixes one instance and leaves the next one wrong. You are shaping the box,
not sanding the object.

## Then verify against a real standard

Finally, do not trust the component because it renders. Run it against the
standard you actually hold — the accessibility checks, the "no store import"
rule, the prop-types. A guardrail that fails when an atom has no accessible name
catches exactly what the model omits without being asked, on every generation,
without you having to remember. The atom-guardrail exercise builds that check, and
the loading-button and form-field exercises are the kind of tightly-scoped
component the prompt-to-component workflow produces cleanly when you draw the box
first.
