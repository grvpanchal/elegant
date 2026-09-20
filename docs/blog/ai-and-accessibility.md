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
reading_minutes: 5
related_practice: [harness-a11y-gate, accessible-combobox, form-field-molecule]
---

Ask a model for a "clickable card" or a "dropdown" and it will give you markup that
renders and looks right — and, very often, a `<div>` with an `onClick`, no keyboard
support, no role, no accessible name. This is not the model being careless; it is the
model doing exactly what its training rewards, which is producing output that *looks*
correct. Accessibility lives in the half that does not show in a screenshot — roles,
names, keyboard operation, focus — so it is precisely what an "looks right" optimiser
drops. AI is a force multiplier for markup and, left unchecked, a force multiplier for
inaccessible markup.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="aa-t aa-d" class="blog-figure__svg">
  <title id="aa-t">A model optimises for the visible layer and drops the accessibility layer</title>
  <desc id="aa-d">Two stacked layers of a component. The visible layer (looks right) is what the model produces; the accessibility layer (roles, names, keyboard) is dropped unless required.</desc>
  <rect x="120" y="30" width="400" height="46" rx="8" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="320" y="58" text-anchor="middle" fill="#157878" font-size="10" font-weight="700">visible layer — the model nails this</text>
  <rect x="120" y="90" width="400" height="60" rx="8" fill="#fff4ec" stroke="#fe854c" stroke-width="2.5" stroke-dasharray="5 4"/><text x="320" y="114" text-anchor="middle" fill="#c2571a" font-size="10" font-weight="700">accessibility layer — dropped unless required</text><text x="320" y="134" text-anchor="middle" fill="#819198" font-size="9">role · accessible name · keyboard · focus</text>
</svg>
<figcaption>The model reliably ships the top layer because it shows. The bottom layer is invisible to "looks right," so it is exactly what goes missing.</figcaption>
</figure>

## The characteristic failure: a div that looks like a button

The most common AI accessibility failure is the fake interactive element. It renders,
it styles, it clicks with a mouse — and it is invisible to a screen reader and dead to
the keyboard:

```jsx
// what a model reaches for — renders and "works" with a mouse, broken for everyone else
<div className="button" onClick={submit}>Save</div>
// no role, not focusable, no Enter/Space, announces nothing
```

The fix is the native element, which the model *can* produce when the prompt or the
check demands it:

```jsx
<button onClick={submit}>Save</button>   // role, focus, keyboard, announcement — all free
```

## Make accessibility a requirement it cannot skip

Because the model optimises for what is asked and checked, the leverage is to *ask*
and *check* for accessibility explicitly. Put it in the prompt as a hard constraint,
and — more durably — put it behind a gate that fails the build, so a dropped role or a
missing label does not merge no matter how fast the code was generated:

```js
// a11y gate: the check the model's "looks right" optimiser can't talk its way past
import { axe } from "vitest-axe";
test("Card has no a11y violations", async () => {
  const { container } = render(<Card onClick={fn} />);
  expect(await axe(container)).toHaveNoViolations();   // fails on the div-button
});
```

The gate catches the mechanical faults; a keyboard-and-focus review catches the rest.

## The volume makes the gate non-optional

The reason this matters more with AI is throughput. A team writing markup by hand
erodes accessibility slowly enough that periodic audits keep up. A model generating
components faster than review can read them turns "we'll fix a11y later" into a
backlog that grows at generation speed — and accessibility retrofitted is far more
expensive than accessibility built in. So the move is the same as everywhere else in
an AI workflow: make the invisible requirement *visible to a machine*. Demand roles,
names, and keyboard support in the prompt, and enforce them with an accessibility gate
that runs on every diff. That combination lets you keep the model's speed on markup
without shipping the inaccessible markup it produces by default. The harness-a11y-gate
exercise builds exactly that gate, and accessible-combobox is the widget where the
dropped half is the whole difficulty.
