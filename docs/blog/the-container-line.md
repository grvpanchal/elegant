---
title: "The container line: draw it, and defend it with a check"
layout: post
slug: the-container-line
date: 2026-07-26
author: The Elegant team
category: architecture
tags: [architecture, state, ui, guardrails]
description: 'Somewhere in your tree is a line above which components may touch the store and below which they may not. Naming that line — and enforcing it with a check — is what keeps your UI layer portable and testable.'
cover: /assets/img/ui-server-state.png
reading_minutes: 6
related_practice: [presentational-vs-container, harness-state-shape]
---

Somewhere in every component tree there is a line. Above it, components may touch
the store, dispatch actions, and fetch data. Below it, components may only receive
props and emit events. That is the **container line**, and most architectural
health comes down to one question: is the line drawn clearly, and is it defended?
Teams that keep the line sharp end up with a portable UI layer and a testable state
layer. Teams that let it blur — a `useSelector` here, a `fetch` in an organism
there — end up with components that only work in one place and cannot be tested
without standing up the whole app.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 210" role="img" aria-labelledby="cl-t cl-d" class="blog-figure__svg">
  <title id="cl-t">The container line divides store-aware components from pure presentational ones</title>
  <desc id="cl-d">A horizontal line splits the tree. Above it: page and container components that may read the store. Below it: organisms, molecules and atoms that only take props.</desc>
  <line x1="30" y1="100" x2="610" y2="100" stroke="#fe854c" stroke-width="3" stroke-dasharray="8 5"/>
  <text x="45" y="92" fill="#c2571a" font-size="11" font-weight="700">the container line</text>
  <text x="560" y="55" text-anchor="end" fill="#157878" font-size="10">may touch the store ↑</text>
  <g fill="#e8f0f8" stroke="#157878" stroke-width="2" font-size="9" text-anchor="middle">
    <rect x="120" y="35" width="110" height="40" rx="6"/><text x="175" y="59" fill="#157878">page</text>
    <rect x="280" y="35" width="120" height="40" rx="6"/><text x="340" y="59" fill="#157878">container</text>
  </g>
  <text x="560" y="130" text-anchor="end" fill="#155799" font-size="10">props only ↓</text>
  <g fill="#f3f6fa" stroke="#155799" stroke-width="2" font-size="9" text-anchor="middle">
    <rect x="120" y="120" width="110" height="34" rx="5"/><text x="175" y="141" fill="#155799">organism</text>
    <rect x="250" y="120" width="110" height="34" rx="5"/><text x="305" y="141" fill="#155799">molecule</text>
    <rect x="380" y="120" width="90" height="34" rx="5"/><text x="425" y="141" fill="#155799">atom</text>
  </g>
  <path d="M340 76 L305 118" stroke="#819198" stroke-width="2" marker-end="url(#cl-a)"/><text x="360" y="100" fill="#819198" font-size="9">props</text>
  <defs><marker id="cl-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#819198"/></marker></defs>
</svg>
<figcaption>Everything above the line may know about the store; everything below receives props. The line is the seam where state becomes UI.</figcaption>
</figure>

## Naming the line makes reviews decidable

The line's value is that it turns a vague preference ("keep components clean") into
a yes/no test any reviewer can apply: *is this component above or below the line,
and does its code match?* An organism with a `useSelector` is a line violation, no
debate required:

```jsx
// BELOW the line — an organism must not read the store
function CommentList() {
  const comments = useSelector((s) => s.comments.all);   // ⚠ crosses the line
  return <ul>{comments.map((c) => <Comment key={c.id} {...c} />)}</ul>;
}

// CORRECT — a container above the line reads; the organism takes props
function CommentListContainer() {
  const comments = useSelector((s) => s.comments.all);
  return <CommentList comments={comments} />;              // ✓ line respected
}
```

## Defend it with a check, not vigilance

A line defended only by review erodes, because review is intermittent and an AI
generates line-crossing code faster than anyone reads it. So encode the line as a
lint rule: nothing under your presentational directories may import the state
layer.

```js
// eslint: below-the-line directories may not import state
{
  files: ["src/ui/**/*.{js,jsx}"],           // organisms, molecules, atoms
  rules: {
    "no-restricted-imports": ["error", {
      patterns: ["**/store", "**/state/*", "react-redux"],
    }],
  },
}
```

Now a `useSelector` in an atom fails the build with a message pointing at the line,
and the discipline holds without anyone having to remember it.

## The line is where two skills meet

The container line is not a third concept alongside presentational/container and
"organisms don't fetch" — it is the *same* boundary named as a location. "Split by
render-vs-decide" tells you which components go where; "organisms don't fetch"
tells you the fetch stays above; the container line is the drawable, checkable
place all of that happens. Draw it explicitly (a directory convention, a naming
rule), keep the store-aware code strictly above it, and enforce it with a check so
volume cannot wear it down. Do that and your UI layer is a library you can lift
into another app, and your state layer is a thing you can test without rendering a
pixel. The presentational-vs-container exercise and the harness-state-shape check
are the two halves of drawing and defending exactly this line.
