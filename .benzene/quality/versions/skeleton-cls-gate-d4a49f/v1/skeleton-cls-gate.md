---
title: A skeleton that borrows its row's own CSS class is the only version that keeps CLS at zero
date: 2026-10-15
description: Reusing the real row's class in a skeleton keeps layout shift at zero after a CSS edit; a PerformanceObserver script proves it instead of an eyeball check.
tags: [skeleton, rwd]
canonical_url: https://elegantfrontend.training/blog/skeleton-cls-gate.html
ai_assistance: assisted
related_practice: [skeleton-list]
syndication:
  - {channel: devto, canonical_url: https://elegantfrontend.training/blog/skeleton-cls-gate.html}
  - {channel: hashnode, canonical_url: https://elegantfrontend.training/blog/skeleton-cls-gate.html}
  - {channel: medium, canonical_url: https://elegantfrontend.training/blog/skeleton-cls-gate.html}
---

This article was written with AI assistance and reviewed by a human editor before
publication, as is standard for the Elegant blog. The claim below was checked
against the `ui-skeleton` Agent Skill and the `skeleton-list` practice question
in this repository, not invented.

Most teams ship a skeleton, watch it visually line up with the real content once,
and never check it again. That is how a skeleton quietly breaks: someone edits
the row's padding six weeks later, the skeleton's hand-tuned height does not
move with it, and the page starts jumping again on every load. The fix is not
"be more careful" — it is to stop hand-tuning the height at all.

## The failure mode the skill names but doesn't gate

The `ui-skeleton` skill's first principle is **Match Final Layout**: "Skeleton
shapes must mirror the actual content structure." That's correct, but it
describes an outcome, not a mechanism that keeps holding once the code changes.
A skeleton built from independent CSS (`.skeleton--title { height: 20px }`)
matches the real title today and silently stops matching it the day someone
changes the title's `line-height` or the card's padding. Nothing fails loudly.
The only signal is a user noticing the page jump, if they notice at all.

The `skeleton-list` practice question gets this half right already: its
solution has the skeleton row reuse the real row's own CSS class, so the
skeleton's height is inherited, not guessed —

```jsx
// UserCardSkeleton.jsx — reuses .user-card, not a hand-tuned height
export default function UserCardSkeleton() {
  return (
    <li className="user-card user-card--skeleton" aria-hidden="true">
      <span className="skeleton skeleton--avatar" />
      <span className="skeleton skeleton--line skeleton--name" />
      <span className="skeleton skeleton--line skeleton--email" />
    </li>
  );
}
```

Because `.user-card` is the same class the real `<li>` uses, a change to the
row's padding or line-height changes both the skeleton and the content at
once. There is no second number to forget to update. That is the one term
this article goes further on: the skill tells you to match the layout, this
shows you the one line of code that keeps it matched without maintenance.

## Turning "no layout shift" into a number, not a glance

Code review catches wrong heights the day they're introduced, if the reviewer
happens to load the page with the network throttled and watch closely. It does
not catch a regression introduced three sprints later by someone touching CSS
with no idea a skeleton depends on it. The browser already measures this for
you: the `layout-shift` entry fed to `PerformanceObserver` reports exactly how
much of the viewport moved, as a `value` between 0 and 1, every time something
shifts without a user gesture behind it.

```js
// cls-gate.js — fails loudly if the loading-to-loaded transition shifts anything
function measureLoadTransitionCLS(triggerLoad) {
  return new Promise((resolve) => {
    let total = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) total += entry.value;
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });

    triggerLoad().then(() => {
      // one frame to let the final layout-shift entries land
      requestAnimationFrame(() => {
        observer.disconnect();
        resolve(total);
      });
    });
  });
}

// In a test: expect(await measureLoadTransitionCLS(loadUsers)).toBe(0);
```

Twelve lines turn "I eyeballed it and it looked fine" into an assertion that
fails the build the moment a shared class drifts from the skeleton. That is
the harness pattern this blog keeps coming back to: don't review for a
property, assert it.

## Why the shared-class version is the only one that survives

The practice question's second approach — rendering the real `UserCard` with
empty strings and a `loading` prop — also gets the height right, because it
*is* the row. But it pays for that correctness with a permanent branch inside
a component whose whole job was to stay simple, and it breaks the moment the
row does anything conditional on the data it no longer has (an avatar
fallback, a formatted date). The shared-class skeleton gets the same
correctness — same markup skeleton, same CSS, same box — without adding a
branch to the component that matters. It is more code, in a second file, but
none of it is a second set of numbers that can go stale.

The diagram below is the whole argument in two timelines. The spinner occupies
a different box than the content it stands in for, so swapping them always
moves something below. The shared-class skeleton occupies the content's own
box, so swapping changes nothing beneath it.

```html
<svg viewBox="0 0 420 200" role="img" aria-labelledby="cls-fig-title" xmlns="http://www.w3.org/2000/svg">
  <title id="cls-fig-title">Two loading transitions: a spinner box of different height shifts the content below it; a shared-class skeleton box of the same height does not.</title>
  <rect width="420" height="200" fill="#fff7f2" />

  <text x="16" y="24" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13" fill="#202028">Spinner — different box, content jumps</text>
  <circle cx="60" cy="60" r="18" fill="none" stroke="#202028" stroke-width="4" />
  <path d="M60 42 A18 18 0 0 1 78 60" fill="none" stroke="#fe854c" stroke-width="4" stroke-linecap="round" />
  <rect x="120" y="48" width="120" height="24" rx="3" fill="#155799" />
  <path d="M250 60 L300 60" stroke="#fe854c" stroke-width="3" marker-end="url(#arrow)" />
  <rect x="310" y="40" width="96" height="40" rx="3" fill="#155799" />
  <text x="310" y="36" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="11" fill="#fe854c">shifted</text>

  <text x="16" y="120" font-family="Open Sans, Helvetica, Arial, sans-serif" font-size="13" fill="#202028">Shared-class skeleton — same box, nothing moves</text>
  <rect x="120" y="140" width="120" height="40" rx="3" fill="#f3f6fa" stroke="#155799" stroke-width="2" />
  <rect x="250" y="155" width="60" height="10" fill="#f3f6fa" stroke="#155799" stroke-width="1" />
  <rect x="310" y="140" width="96" height="40" rx="3" fill="#155799" />

  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0 0 L8 4 L0 8 Z" fill="#fe854c" />
    </marker>
  </defs>
</svg>
```

## Try it

The `skeleton-list` practice question walks through both versions of this
skeleton against a live list and real tests — run it, then add a
`layout-shift` assertion of your own on top of the starter's checks:
[Replace a spinner with a skeleton](https://elegantfrontend.training/practice/skeleton-list.html).
