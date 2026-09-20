---
title: "The UI coding round rewards the parts that don't show in a screenshot"
layout: post
slug: the-ui-coding-round
date: 2026-07-19
author: The Elegant team
category: interview
tags: [interview, ui, accessibility, components]
description: 'Anyone can make a component look right in an interview. What separates a pass is the invisible half — keyboard operation, focus, correct roles, coherent state — done while the clock runs, not bolted on at the end.'
cover: /assets/img/ui-server-state.png
reading_minutes: 5
related_practice: [accessible-combobox, tabs-molecule, data-table-sort]
---

In a UI coding round you are asked to build a component — a dropdown, a tab set, an
autocomplete — under a clock. Almost everyone gets it to *look* right. What
separates a pass from a near-miss is the invisible half: does it work from the
keyboard, does focus go where it should, do the roles announce correctly, is the
state coherent when the user does something out of order. Those are the things that
do not show in a screenshot, and they are exactly what a good interviewer is
watching for — because they are what separates someone who *renders* UI from someone
who *builds* it. Doing the invisible half while the clock runs, not bolting it on at
the end, is the skill the round measures.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 190" role="img" aria-labelledby="uc-t uc-d" class="blog-figure__svg">
  <title id="uc-t">Above the waterline the component looks done; the score is below it</title>
  <desc id="uc-d">A waterline: above it the visible component (looks right). Below it the invisible half — keyboard, focus, roles, state — labelled as where the score actually is.</desc>
  <rect x="60" y="30" width="520" height="50" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="320" y="60" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">looks right (everyone gets here)</text>
  <line x1="30" y1="92" x2="610" y2="92" stroke="#155799" stroke-width="2" stroke-dasharray="6 4"/><text x="45" y="86" fill="#155799" font-size="9">waterline</text>
  <rect x="60" y="105" width="520" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5"/>
  <g fill="#c2571a" font-size="10" text-anchor="middle"><text x="150" y="132">keyboard</text><text x="270" y="132">focus</text><text x="390" y="132">roles / ARIA</text><text x="510" y="132">coherent state</text></g>
  <text x="320" y="155" text-anchor="middle" fill="#819198" font-size="9">the invisible half — where the pass/fail actually lives</text>
</svg>
<figcaption>The visible component is the price of entry. The score is in the submerged half — keyboard, focus, roles, state — done live, not appended.</figcaption>
</figure>

## Build the keyboard behaviour as you go

The single strongest move is to wire the keyboard *while* building, not after. A
dropdown that opens on click but not on Enter, or a list you cannot arrow through,
reads as unfinished to an interviewer even if it looks perfect. Handle the keys as
part of the component's core, out loud:

```jsx
// keyboard handled as first-class, not an afterthought — narrate this as you write it
function onKeyDown(e) {
  if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, last)); }
  if (e.key === "ArrowUp")   { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
  if (e.key === "Enter")     select(active);
  if (e.key === "Escape")    close();
}
```

Saying "let me wire arrow keys and Escape now" signals to the interviewer that you
know a widget is not done when it renders.

## Manage focus and roles deliberately

The second submerged skill is focus and semantics. When a listbox opens, focus (or
`aria-activedescendant`) should move into it; roles should describe the widget so a
screen reader can announce it. You do not need every ARIA attribute — you need the
few the widget's pattern requires, applied correctly:

```jsx
<input role="combobox" aria-expanded={open} aria-controls="lb" aria-activedescendant={activeId} />
<ul role="listbox" id="lb">
  {items.map((it, i) => (
    <li role="option" id={`opt-${i}`} aria-selected={i === active}>{it.label}</li>
  ))}
</ul>
```

An interviewer who sees `role="combobox"` and a moving `aria-activedescendant` knows
you have built this pattern before.

## Manage the clock, and say what you're deferring

The round is time-boxed, so part of the skill is sequencing: get a working,
*accessible* core first, then layer polish, and *say* what you are deferring
("I'll get selection and keyboard working, then add the async loading state if time
allows"). That verbalised triage is itself signal — it shows you know what matters
most and that accessibility is in the "must" bucket, not the "if time" bucket.
Interviewers forgive an unfinished feature far more readily than a component that
ignores the keyboard, because the former is a time constraint and the latter is a
values one. Build the invisible half first and narrate the trade-offs, and you turn
a "looks right" submission into a clear pass. The accessible-combobox exercise is
this exact round in practice — the widget whose whole difficulty is the submerged
half — and tabs-molecule and data-table-sort drill the same keyboard-and-state
discipline.
