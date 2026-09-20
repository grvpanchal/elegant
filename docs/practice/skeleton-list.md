---
title: Replace a spinner with a skeleton
layout: question
slug: skeleton-list
format: ui-coding
difficulty: easy
layer: ui
topics: [skeleton, rwd, organism]
skill: ui-skeleton
minutes: 25
frameworks: [react, angular]
summary: Build a loading placeholder that reserves the exact space the real rows will take, so nothing shifts when data arrives.
---

A list of user cards currently shows a centred spinner while loading. When the
data arrives the spinner disappears, the rows appear, and everything below the
list jumps down the page.

Replace the spinner with a skeleton:

- Render the same number of placeholder rows as the page size (6).
- Each placeholder occupies the exact height of a real row.
- The skeleton is hidden from screen readers; the region announces "loading".
- The shimmer respects `prefers-reduced-motion`.

Starter files are in `practice/workspace/skeleton-list/<framework>/`.

## Solution

### Approach 1: a dedicated skeleton component mirroring the row

```jsx
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

with the list rendering `Array.from({ length: 6 })` of them inside a region
that carries `aria-busy="true"` and an `aria-live="polite"` status.

The skeleton reuses the row's own class, so the height comes from the same CSS
that sizes the real row. That is the whole trick: a skeleton with hand-tuned
heights drifts the first time someone changes the row's padding.

### Approach 2: the real row rendered with placeholder data

Render `UserCard` with empty strings and a `loading` prop that swaps text nodes
for shimmer blocks. The height is guaranteed correct because it *is* the row.

It costs you a branch inside a component that should be simple, and it breaks
the moment the row does anything conditional on its data. Worth it when rows
have wildly variable height; overkill for a fixed card.

## Trade-offs

The measurable argument for skeletons over spinners is layout stability, not
perceived speed — the jump is a Cumulative Layout Shift you can see in the
numbers, and a spinner guarantees one because it occupies a different box from
the content it stands in for.

Reduced motion is not decoration. A shimmer is a repeating animation in the
user's peripheral vision, and for some people that is a migraine trigger. Gate
it behind `@media (prefers-reduced-motion: no-preference)` and fall back to a
flat grey block.

Hiding the skeleton with `aria-hidden` and announcing the state once through a
live region is the right split: without it, a screen reader reads six empty
list items and the user has no idea why.

## Related

- Reading: [Skeleton](../ui/skeleton.html) · [Organism](../ui/organism.html) · [RWD](../ui/rwd.html)
- Agent Skill: `ui-skeleton`
