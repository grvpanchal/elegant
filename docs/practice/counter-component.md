---
title: Build a Counter component
layout: question
slug: counter-component
format: coding
difficulty: easy
layer: ui
topics: [component, props, events]
skill: ui-component
minutes: 25
summary: The first question that renders a real component in the browser — props, state, clamping and a disabled button, tested against a live DOM.
---

Every other coding question on this site tests a plain function. This one
renders a component and asserts on the DOM it produced.

Build `Counter`:

- Props `{ start = 0, step = 1, min = -Infinity, max = Infinity }`.
- Renders `.counter__dec`, an `<output class="counter__value">`, and
  `.counter__inc`.
- `+` and `-` move the value by `step`, clamped to `min` and `max`.
- A button that could not move without passing the limit is `disabled`.
- Two Counters on one page keep separate state.

The workspace gives you a component runtime. Import what you need:

{% raw %}
```js
import { html, useState } from "@runtime";

export default function Counter({ start = 0 }) {
  const [count, setCount] = useState(start);
  return html`<output class="counter__value">${count}</output>`;
}
```
{% endraw %}

`html` is a tagged template, not JSX — same shape, nothing to transpile, which
is what lets this run on a static site with no build step. Interpolate with
`${...}`, close components with `<//>` or `<${Name} ... />`.

`@runtime` is a bare specifier resolved by an import map on this page. Your code
runs from a `blob:` URL, and `blob:` is not a hierarchical scheme — so a path
like `/assets/vendor/runtime.mjs` has no base to resolve against and throws.
Bare specifiers go through the document's import map instead, which is why the
import looks like a package name on a site with no package manager.

{% include code-playground.html %}

## Solution

### Approach 1: clamp on write

Hold the number in state and clamp inside the updater, so the invariant lives
in one place:

{% raw %}
```js
const [count, setCount] = useState(start);
const clamp = (n) => Math.min(max, Math.max(min, n));
// ...
onClick=${() => setCount((c) => clamp(c + step))}
```
{% endraw %}

The functional updater matters. `setCount(clamp(count + step))` reads `count`
from the closure of the render that created the handler, so two clicks in the
same tick both compute from the same stale value and the second is lost. Every
component framework has this trap and the fix is the same everywhere.

### Approach 2: derive the disabled state rather than store it

{% raw %}
```js
disabled=${count + step > max}
```
{% endraw %}

A second piece of state (`const [canIncrease, setCanIncrease] = useState(true)`)
has to be kept in step with the first, and it will drift — someone adds a reset
path and updates one of them. Deriving it at render time cannot drift, and
costs one comparison.

## Trade-offs

**Clamping on write vs rejecting the click.** Clamping means a click near the
limit still moves, just less far. Rejecting means it does nothing. Clamping is
friendlier for a slider-like control; rejecting is clearer for a quantity
picker where 9 → 10 when the max is 10 would surprise. Either is defensible and
the tests here take clamping, because it pairs with the disabled state to make
the limit visible before it is reached.

**`<output>` vs `<span>`.** `<output>` is in the live region family, so a
screen reader announces the new number without any ARIA. A `<span>` is silent,
and the usual fix — adding `aria-live` — is one more attribute doing what the
right element does for free.

**Disabling vs hiding.** A disabled button keeps the layout stable and tells
the user the limit exists. Hiding it makes the row jump and leaves them
guessing why the control vanished.

## Related

- Reading: [Component](../ui/component.html) · [Props](../ui/props.html) · [Events](../ui/events.html)
- Agent Skill: `ui-component`
