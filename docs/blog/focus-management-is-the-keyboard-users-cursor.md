---
title: "Focus management is the keyboard user's cursor"
layout: post
slug: focus-management-is-the-keyboard-users-cursor
date: 2026-09-08
author: The Elegant team
category: terminology
tags: [ui, accessibility, focus, keyboard]
description: For a keyboard or screen-reader user, focus is the cursor. A dialog that opens without moving focus, or a menu that traps it, is as broken as a mouse that stops moving.
cover: /assets/img/ui-system-diagram.png
reading_minutes: 3
related_practice: [accessible-combobox, tabs-molecule, form-field-molecule]
---

For someone using a mouse, the pointer is the cursor. For someone using a
keyboard or a screen reader, **focus** is the cursor — it is where they are on
the page and what their next keypress acts on. Most accessibility bugs in rich
components are really focus bugs: focus that never moved, focus that got lost, or
focus that got trapped. Manage it deliberately and half of "make it accessible"
is done.

## Move focus when the context changes

When a dialog opens, focus should move into it — usually to the first field or
the dialog itself — so the next Tab stays inside the dialog and the screen reader
announces it. When the dialog closes, focus should return to the element that
opened it, so the user is not dumped back at the top of the page. A menu that
opens should move focus to its first item. These moves are not automatic; you
call `element.focus()` at the right moment. Skip them and a keyboard user has no
idea the dialog appeared.

## Trap focus, but only on purpose

A modal dialog should *trap* focus: Tab from the last element wraps to the first,
and the user cannot Tab out to the page behind it. That is correct for a modal.
The bug is trapping focus when you did not mean to — a dropdown that won't let
Tab escape, or a widget that swallows every keypress. Trap deliberately in
modals; everywhere else, let focus flow.

## Roving tabindex for composite widgets

Some widgets should present as a single stop in the tab order even though they
contain many focusable children — a toolbar, a set of tabs, a menu, a grid. The
pattern is "roving tabindex": exactly one child has `tabindex="0"` (it is in the
tab order), every other child has `tabindex="-1"` (focusable by script but
skipped by Tab), and the arrow keys move focus among them, updating which one
holds the `0`. So Tab enters and leaves the widget as a unit, and the arrows
navigate within it — which is exactly what a keyboard user expects from a
toolbar. Getting this wrong in either direction is a common bug: make every item
`tabindex="0"` and the user has to Tab through fifty things; forget to move the
`0` as focus roves and Tab lands them back at the start. The tabs exercise
implements this pattern directly.

## The visible focus ring is not optional

Designers often ask to remove the focus outline because it "looks messy" on
mouse click. Removing it entirely blinds keyboard users to where they are. The
right answer is `:focus-visible`, which shows the ring for keyboard focus and
hides it for mouse clicks — the best of both. Never ship `outline: none` without
a replacement indicator.

The test is simple and worth running on every interactive component: put the
mouse away and drive it with Tab, Enter, Space, Escape, and the arrow keys. If
you get lost, so will your users. The combobox and tabs exercises are built
around exactly these focus moves.
