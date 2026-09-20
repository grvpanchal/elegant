---
title: "Accessibility is not a checklist you run at the end"
slug: accessibility-is-not-a-checklist
layout: post
date: 2026-06-20
author: The Elegant team
category: terminology
tags: [ui, accessibility, quality, process]
description: 'Automated checkers catch maybe half of accessibility issues, and only the mechanical half. The rest — does the keyboard flow make sense, does the screen reader tell a coherent story — needs building in, not auditing on.'
cover: /assets/img/ui-system-diagram.png
reading_minutes: 4
related_practice: [harness-a11y-gate, accessible-combobox, form-field-molecule]
---

The comforting story about accessibility is that you build the app, run an automated
checker at the end, fix what it flags, and ship an accessible product. The checker is
real and worth running — but it catches only about half of the issues, and only the
mechanical half. The other half is about whether the experience actually *works*
non-visually, which no scanner can judge, and which you cannot bolt on at the end.
Accessibility is a way of building, not an audit you run.

## What automation catches, and what it can't

Automated tools reliably catch the mechanical failures: missing alt text, missing
form labels, insufficient color contrast, invalid ARIA, missing document language.
These are genuinely valuable to catch, and a check that fails the build on them
should absolutely exist. But a tool cannot tell you whether the keyboard focus order
makes sense, whether a screen reader announces a coherent story, whether your custom
dropdown is actually operable, or whether an interaction is understandable without
sight. Those require judgement about the *experience*, and a page can pass every
automated check and still be unusable non-visually.

## The half machines miss is the experience

Consider a custom combobox that has every ARIA attribute a scanner wants — and still
cannot be operated with the arrow keys, or announces its options in a confusing
order, or loses focus when it closes. The scanner sees correct attributes and passes
it; a real screen-reader user hits a wall. This is the gap: the mechanical presence
of the right attributes is necessary but not sufficient, and only interacting with
the component the way a disabled user would — keyboard only, screen reader on —
reveals whether it actually works. That test is manual, and it is the half that
matters most for complex components.

## Build it in, test it continuously

Because the experiential half cannot be automated and the mechanical half is cheap to
automate, the right process is: automate the mechanical checks so they run on every
diff (missing labels, contrast, alt text — a floor that never regresses), and build
the experiential accessibility in as you go, testing with a keyboard and a screen
reader during development rather than at the end. "Build the feature, then make it
accessible" fails because the accessibility is architectural — focus management,
semantic structure, keyboard interaction — and retrofitting it means rework. Doing it
as you build costs almost nothing; adding it later costs a rewrite.

## Make the floor a guardrail, keep the judgement human

The synthesis mirrors everything else on this site: encode the mechanizable part as a
guardrail (a check that fails on missing names, bad contrast, non-semantic
interactive elements) so the floor holds automatically on every diff including
AI-authored ones, and reserve human effort for the experiential judgement machines
cannot make. That way the cheap half is never neglected and the expensive half gets
the attention it needs. The a11y-gate exercise builds exactly that automated floor,
and the combobox and form-field exercises are where the experiential half — keyboard
operation, coherent announcement — is the actual challenge.
