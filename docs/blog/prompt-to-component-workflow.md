---
title: "Prompt to component: the quality is bounded by the boundary you hand over"
slug: prompt-to-component-workflow
date: 2026-08-08
layout: post
author: The Elegant team
category: ai-and-frontend
tags: [ai, components, workflow, architecture]
description: 'Asking a model for a component produces good code or a mess depending almost entirely on how sharply you scoped the request. The skill is not prompting tricks — it is drawing the box before you ask.'
cover: /assets/img/ai-sdlc-flow.png
reading_minutes: 5
related_practice: [harness-atom-guardrail, loading-button-atom, form-field-molecule]
---

Ask a model for a component and you get either clean, well-placed code or a
sprawling mess — and which one you get is decided almost entirely *before* you hit
enter, by how sharply you scoped the request. The quality of the output is bounded by
the quality of the boundary you hand over. This is why "prompt engineering" for
components is not a bag of magic phrases; it is the ordinary engineering skill of
**drawing the box first**: what layer this component lives in, what it may and may not
do, what it takes and returns. Draw the box well and the model fills it well. Leave it
vague and the model invents a boundary, usually the wrong one.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 180" role="img" aria-labelledby="pc2-t pc2-d" class="blog-figure__svg">
  <title id="pc2-t">A vague prompt yields a sprawling component; a scoped prompt yields a clean atom</title>
  <desc id="pc2-d">Left: a vague prompt produces a component that fetches, holds state and styles — a mess. Right: a scoped prompt with a boundary produces a clean, prop-driven atom.</desc>
  <text x="150" y="24" text-anchor="middle" fill="#c2571a" font-size="11" font-weight="700">vague prompt</text>
  <rect x="60" y="42" width="180" height="30" rx="5" fill="#f3f6fa" stroke="#819198"/><text x="150" y="61" text-anchor="middle" fill="#819198" font-size="9">"make a user card"</text>
  <path d="M150 72 L150 92" stroke="#c2571a" stroke-width="2" marker-end="url(#pc2-a)"/>
  <rect x="70" y="94" width="160" height="55" rx="6" fill="#fff4ec" stroke="#fe854c" stroke-width="2"/><text x="150" y="115" text-anchor="middle" fill="#c2571a" font-size="9">fetches + state +</text><text x="150" y="130" text-anchor="middle" fill="#c2571a" font-size="9">styles — a mess</text>
  <line x1="330" y1="18" x2="330" y2="165" stroke="#dce6f0"/>
  <text x="480" y="24" text-anchor="middle" fill="#157878" font-size="11" font-weight="700">scoped prompt</text>
  <rect x="380" y="42" width="200" height="30" rx="5" fill="#e8f0f8" stroke="#157878" stroke-width="2.5"/><text x="480" y="61" text-anchor="middle" fill="#157878" font-size="8">atom · props only · no fetch</text>
  <path d="M480 72 L480 92" stroke="#157878" stroke-width="2" marker-end="url(#pc2-a)"/>
  <rect x="400" y="94" width="160" height="55" rx="6" fill="#e8f0f8" stroke="#157878" stroke-width="2"/><text x="480" y="115" text-anchor="middle" fill="#157878" font-size="9">clean, prop-driven</text><text x="480" y="130" text-anchor="middle" fill="#157878" font-size="9">atom</text>
  <defs><marker id="pc2-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Same model, same task. The boundary you specify — layer, allowed dependencies, props — is what determines whether you get a clean atom or a tangle.</figcaption>
</figure>

## A vague prompt makes the model invent the boundary

"Make a user card component" leaves every architectural decision to the model, and it
will decide — usually by taking the shortest path, which means fetching inside the
component, holding its own state, and hard-coding styles. The result runs, and it is
in the wrong layer, coupled to an endpoint, and un-reusable. The prompt did not fail;
it never specified the thing that mattered.

## A scoped prompt hands over the box

Compare a prompt that draws the boundary explicitly — the layer, the contract, the
prohibitions. The model now has the constraints it needs to produce the right shape:

```text
Write a UserCard as a PRESENTATIONAL atom in src/ui/atoms/.
Props: { name: string, email: string, avatarUrl: string, onMessage: () => void }.
It renders only. It must NOT fetch, must NOT import the store, must NOT hold state.
Use the design tokens (var(--space-md), var(--color-brand)), not raw values.
Return only the component file.
```

Every clause removes a way the model could have gone wrong. The output is a clean,
prop-driven atom because you specified an atom, its contract, and what it may not
touch.

## Verify against the boundary, don't trust the prose

The prompt draws the box; a check *enforces* it, because a model will occasionally
cross a line you drew. After generation, verify against the same boundary you
specified — ideally with a guardrail, so it is not on your memory:

```js
// the same boundary the prompt stated, now enforced as a check
test("UserCard is a pure atom", () => {
  const src = read("src/ui/atoms/UserCard.jsx");
  expect(src).not.toMatch(/useSelector|fetch\(|useState/);   // no store, fetch, or state
  expect(src).not.toMatch(/#[0-9a-f]{3,6}/i);                // tokens, not raw colours
});
```

The workflow, then, is: draw the box (layer, contract, prohibitions), ask the model
to fill it, and verify it stayed inside — with the boundary encoded once as a prompt
*and* a check. The leverage is not in clever phrasing; it is that you did the
architectural thinking up front, which is exactly the part the model cannot do for
you. The harness-atom-guardrail exercise builds the check that backs this workflow,
and loading-button-atom and form-field-molecule are good "draw the box, fill it,
verify it" reps.
