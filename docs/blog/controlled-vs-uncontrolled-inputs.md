---
title: "Controlled vs uncontrolled inputs: who owns the value?"
layout: post
slug: controlled-vs-uncontrolled-inputs
date: 2026-09-06
author: The Elegant team
category: terminology
tags: [ui, forms, state, components]
description: The whole controlled-versus-uncontrolled question comes down to one thing — does your component's state own the input's value, or does the DOM? Pick per field, not per app.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 3
related_practice: [form-field-molecule, query-string-state]
---

Form inputs confuse people because there are two valid ways to run them, and
mixing them causes the classic warnings and lost keystrokes. The question is
simple: **who is the source of truth for the value?** If your component's state
is, the input is *controlled*. If the DOM is, it is *uncontrolled*. Everything
else follows.

## Controlled: state owns the value

A controlled input sets its `value` from state and updates that state on every
change: `value={query}` plus `onChange`. The DOM never holds a value your state
does not know about. This is what you want when you need to react to input as it
happens — live validation, a search box that filters as you type, a field whose
value is mirrored somewhere else, or a form you want to reset programmatically.
The cost is a render per keystroke, which is almost always fine, and the benefit
is that the value is always in one place you control.

## Uncontrolled: the DOM owns the value

An uncontrolled input keeps its own value in the DOM and you read it only when
you need it — on submit, via a ref or `FormData`. No per-keystroke state, no
re-render on every character. This suits large forms where you only care about
the final values, file inputs (which cannot be controlled), and integrating with
non-framework code. The cost is that the value lives outside your state until you
go and fetch it, so live behaviour is harder.

## Performance is the usual reason to reach for uncontrolled

On a small form, controlled inputs are the right default — the per-keystroke
render is invisible and the always-in-state value is convenient. The calculus
changes on a large or deeply nested form, where every keystroke re-rendering a
big subtree becomes noticeable, especially on lower-end devices. That is the
honest case for uncontrolled inputs (or a form library that keeps values in a ref
and only subscribes the fields that need to react): you trade live convenience
for far fewer renders. The middle path many teams settle on is to keep most
fields uncontrolled and read them with `FormData` on submit, promoting only the
handful that need live validation or cross-field behaviour to controlled. Decide
this per field, measured against whether you need to react mid-entry — not as a
blanket rule for the whole app, and not by defaulting everything to controlled
because it is what the tutorial showed.

## Don't mix them on one field

The bug that generates framework warnings is switching a single field between the
two — starting `value` as `undefined` (uncontrolled) and later setting it to a
string (controlled), or setting `value` without an `onChange`. Pick one mode per
field and keep it. A controlled field always has both `value` and a change
handler; an uncontrolled one has neither (use `defaultValue` for its initial
state).

The decision is per field, driven by whether you need to *react* to the value
mid-entry. Need live behaviour → controlled. Only need it at submit → uncontrolled
is lighter. The accessible form field exercise builds a controlled field with its
label and error wired correctly, which is the common case.
