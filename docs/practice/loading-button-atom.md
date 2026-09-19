---
title: Build a loading Button atom
layout: question
slug: loading-button-atom
format: ui-coding
difficulty: easy
layer: ui
topics: [atom, props, events, component]
skill: ui-atom
minutes: 30
frameworks: [react, vue]
summary: One prop-driven Button atom that swaps to a spinner while loading, implemented the same way in two frameworks.
---

Build a `Button` atom that behaves identically in React and Vue:

- Renders its children as the label.
- When `isLoading` is true, renders a `Loader` instead of the label, keeps the
  button's width, and sets `aria-busy="true"`.
- While loading the button is disabled and emits no click.
- Every other prop or attribute passes through to the underlying `<button>`.

Starter files live in `practice/workspace/loading-button-atom/<framework>/`.

## Solution

### Approach 1: prop passthrough with an early return

Strip the props the atom owns, spread the rest, and branch once.

```jsx
// react
import Loader from "../Loader/Loader.component";
import "./Button.style.css";

export default function Button({ isLoading = false, children, ...rest }) {
  if (isLoading) {
    return (
      <button {...rest} disabled aria-busy="true" className={`${rest.className ?? ""} loading-button`}>
        <Loader width="2px" size="1.2rem" color="#fff" />
      </button>
    );
  }
  return <button {...rest}>{children}</button>;
}
```

```vue
<!-- vue -->
<script setup>
defineProps({ isLoading: { type: Boolean, default: false } });
</script>

<template>
  <button v-bind="$attrs" :disabled="isLoading" :aria-busy="isLoading ? 'true' : null"
          :class="{ 'loading-button': isLoading }">
    <Loader v-if="isLoading" width="2px" size="1.2rem" color="#fff" />
    <slot v-else />
  </button>
</template>
```

The early return reads well but duplicates the `<button>` element, so an
attribute added to one branch and not the other is a real and common bug.

### Approach 2: one element, conditional content

Keep a single `<button>` and vary only its children and two attributes. This is
what the Vue version above already does, and the React equivalent is:

```jsx
export default function Button({ isLoading = false, children, className = "", ...rest }) {
  return (
    <button
      {...rest}
      disabled={isLoading || rest.disabled}
      aria-busy={isLoading || undefined}
      className={isLoading ? `${className} loading-button` : className}
    >
      {isLoading ? <Loader width="2px" size="1.2rem" color="#fff" /> : children}
    </button>
  );
}
```

One element means one place to add an attribute, and the DOM node survives the
state change so focus is not lost mid-submit — which is exactly the moment a
form button toggles.

## Trade-offs

Approach 1 is easier to read when the two states diverge a lot (different tag,
different handlers). Approach 2 is safer when they diverge a little, which is
the common case, and it preserves focus and element identity.

Width preservation is the detail most submissions miss: swapping a 9-character
label for a 1.2rem spinner collapses the button and shifts the layout around
it. Either set `min-width` from the label in CSS or keep the label in the DOM
with `visibility: hidden` behind the spinner.

## Related

- Reading: [Atom](../ui/atom.html) · [Props](../ui/props.html) · [Events](../ui/events.html)
- Templates: `templates/chota-react-redux`, `templates/chota-vue-pinia`
- Agent Skill: `ui-atom`
