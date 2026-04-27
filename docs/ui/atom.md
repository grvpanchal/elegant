---
title: Atom
layout: doc
slug: atom
---

# Atom

> - A single purpose component
> - Deliver display or interactiveness with single action
> - Foundation of reusable UI systems

## Key Insight

Atoms are the fundamental building blocks of your UI system—think of them as LEGO bricks that do one thing exceptionally well. By keeping atoms focused on a single responsibility (displaying text, capturing input, showing an icon), you create highly reusable components that compose effortlessly into complex interfaces while maintaining consistency across your entire application.

## Detailed Description

In the context of [Atomic Design](atomic-design.html), atoms represent the smallest functional units of your user interface. Just as chemical atoms combine to form molecules, UI atoms combine to create more complex components. An atom should encapsulate a single piece of functionality or presentation—a button, an input field, a label, or an icon—nothing more.

The power of atoms lies in their simplicity and reusability. When you build an atom, you're establishing a contract: this component does one thing, accepts specific props, and behaves predictably. This predictability is crucial for the Universal Frontend Architecture approach, where components must work seamlessly across different frameworks and contexts. A well-designed atom can be used hundreds of times throughout your application without modification.

Atoms serve as the foundation for your design system, enforcing visual and functional consistency. When your Button atom defines padding, font size, and hover states, every button across your application inherits these properties automatically. This centralization eliminates the "slightly different button" problem that plagues many codebases and makes design updates as simple as modifying a single file.

From a performance perspective, atoms are inherently optimizable. Because they're small and focused, they're easy to memoize, lazy-load, and tree-shake. Framework-specific optimizations like React.memo or Vue's functional components work best with simple, pure components—exactly what atoms should be.

In the Universal Frontend Architecture, atoms bridge the gap between design and implementation. They translate design tokens (colors, spacing, typography) into interactive components, creating a shared vocabulary between designers and developers. This alignment accelerates development and ensures design fidelity across all user touchpoints.

## Code Examples

### Basic Example: Button Atom across frameworks

Here's the same single-purpose Button atom pulled directly from each `chota-*` template. The shape is intentionally identical across all four: one prop-driven button that swaps to a `Loader` while `isLoading` is true, and emits a click otherwise. Compare how each framework expresses the same pattern.

{::nomarkdown}<div class="code-tabs">{:/}

React
```jsx
// templates/chota-react-redux/src/ui/atoms/Button/Button.component.jsx
import Loader from "../Loader/Loader.component";
import './Button.style.css';

export default function Button(props) {
  const transformedProps = { ...props };
  delete transformedProps.isLoading;
  if (props.isLoading) {
    return (
      <button {...transformedProps} className={`${props.className} loading-button`}>
        <Loader width="2px" size="1.2rem" color="#fff" />
      </button>
    );
  }
  return <button {...transformedProps}>{props.children}</button>;
}
```

Angular
{% raw %}
```ts
// templates/chota-angular-ngrx/src/ui/atoms/Button/Button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import LoaderComponent from '../Loader/Loader.component';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './Button.component.html',
  styleUrls: ['./Button.style.css'],
})
export default class ButtonComponent {
  @Input() isLoading = false;
  @Input() classes?: string;
  @Input() type = '';

  get computedClasses() {
    return this.isLoading ? `${this.classes} loading-button` : this.classes;
  }

  @Output() onClick = new EventEmitter<Event>();
}

// Button.component.html
@if (isLoading) {
  <button [class]="computedClasses" [disabled]="isLoading">
    <app-loader width="2px" size="1.2rem" color="#fff"></app-loader>
  </button>
} @else {
  <button [type]="type || 'button'" (click)="onClick.emit($event)" [class]="computedClasses">
    <ng-content></ng-content>
  </button>
}
```
{% endraw %}

Vue
```vue
<!-- templates/chota-vue-pinia/src/ui/atoms/Button/Button.component.vue -->
<template>
  <button v-if="isLoading" :disabled="disabled" @click="$emit('onClick')" :class="getButtonClass()">
    <Loader width="2px" size="1.2rem" color="#fff" />
  </button>
  <button v-else :disabled="disabled" :type="type" @click="$emit('onClick')" :class="getButtonClass()">
    <slot />
  </button>
</template>

<script>
import { defineComponent } from 'vue'
import Loader from '../Loader/Loader.component.vue';

export default defineComponent({
  components: { Loader },
  props: ['isLoading', 'class', 'disabled', 'onClick', 'label', 'type'],
  methods: {
    getButtonClass() {
      return `${this.class} loading-button`;
    },
  },
})
</script>

<style scoped src="./Button.style.css"></style>
```

Web Components
```js
// templates/chota-wc-saga/src/ui/atoms/Button/Button.component.js
import { html } from "lit";
import style from './Button.style';
import "../Loader/app-loader";
import useComputedStyles from "../../../utils/theme/hooks/useComputedStyles";
import emit from "../../../utils/events/emit";

export default function Button(props) {
  useComputedStyles(this, [style]);
  if (props.isLoading) {
    return html`
      <button type="button" class=${`${props.classes} loading-button`}>
        <app-loader .width=${'2px'} .size=${'1.2rem'} .color=${'#fff'}>Loading...</app-loader>
      </button>
    `;
  }
  return html`
    <button type="button"
      class="${props.classes}"
      @click="${() => emit(this, "onClick", props)}">
      <slot></slot>
    </button>
  `;
}
```

{::nomarkdown}</div>{:/}

A few things worth comparing across the tabs:

- **Children projection.** React uses `{props.children}`, Angular uses `<ng-content>`, Vue and Web Components both use `<slot>` — three spellings of the same idea across four frameworks.
- **Event shape.** React passes `onClick` through as a plain prop. Angular exposes an `@Output() EventEmitter`. Vue emits `'onClick'` via `$emit`. The Lit-based WC uses a tiny `emit(this, "onClick", props)` helper wrapping `CustomEvent`.
- **Styling.** Every template co-locates `Button.style.css` next to the component; Angular and Vue scope it, React imports it side-effect style, WC injects via `useComputedStyles`.

### Advanced Example: Icon Atom with a Path Lookup Table

A small icon atom showing how a single component can render any one of N variants from a static lookup, while keeping the prop surface tiny:

```jsx
// Icon.js

import React from "react";

const ICON_PATHS = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  close: "M6 18L18 6M6 6l12 12",
  check: "M5 13l4 4L19 7"
};

const Icon = ({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  ariaLabel
}) => {
  const pathData = ICON_PATHS[name];

  if (!pathData) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      role="img"
      aria-label={ariaLabel || `${name} icon`}
    >
      <path d={pathData} />
    </svg>
  );
};

export default Icon;
```

Usage demonstrating composition:

```jsx
// SearchButton.js (Molecule composed of atoms)

import React from "react";
import Button from "./Button";
import Icon from "./Icon";

const SearchButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} label="">
      <Icon name="search" size={20} ariaLabel="Search" />
      <span>Search</span>
    </Button>
  );
};
```

## Common Mistakes

### 1. Making Atoms Too Complex
**Mistake:** Adding business logic, API calls, or state management to atom components.

```jsx
// ❌ BAD: Atom with too much responsibility
const Button = ({ userId }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await fetch(`/api/users/${userId}/activate`);
    setLoading(false);
  };

  return <button onClick={handleClick}>{loading ? 'Loading...' : 'Activate'}</button>;
};
```

```jsx
// ✅ GOOD: Atom focused on presentation
const Button = ({ onClick, label, loading = false, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled || loading}>
      {loading ? 'Loading...' : label}
    </button>
  );
};
```

**Why it matters:** Complex atoms become difficult to reuse, test, and maintain. Keep business logic in [containers](../server/container.html) or parent components.

### 2. Inconsistent Prop Interfaces
**Mistake:** Using different prop names or patterns for similar atoms.

```jsx
// ❌ BAD: Inconsistent naming
const Button = ({ clickHandler, text }) => { /* ... */ };
const Input = ({ onChange, value }) => { /* ... */ };
const Checkbox = ({ onUpdate, checked }) => { /* ... */ };
```

```jsx
// ✅ GOOD: Consistent prop patterns
const Button = ({ onClick, label, ...props }) => { /* ... */ };
const Input = ({ onChange, value, ...props }) => { /* ... */ };
const Checkbox = ({ onChange, checked, ...props }) => { /* ... */ };
```

**Why it matters:** Consistent interfaces reduce cognitive load and make atoms predictable across your codebase.

### 3. Ignoring Accessibility
**Mistake:** Building atoms without ARIA labels, keyboard support, or semantic HTML.

```jsx
// ❌ BAD: Not accessible
const IconButton = ({ onClick, icon }) => (
  <div onClick={onClick}>
    <Icon name={icon} />
  </div>
);
```

```jsx
// ✅ GOOD: Accessible implementation
const IconButton = ({ onClick, icon, ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    type="button"
  >
    <Icon name={icon} aria-hidden="true" />
  </button>
);
```

**Why it matters:** Atoms are used throughout your application. Accessibility issues in atoms multiply across every instance.

## Quick Quiz

{% include quiz.html id="atom-1"
   question="What is the primary characteristic that defines a component as an 'atom' in Atomic Design?"
   options="A|It manages its own global state;;B|It always wraps at least three child elements;;C|It has a single responsibility and cannot be broken down into smaller functional components;;D|It fetches its own data from an API"
   correct="C"
   explanation="Atoms are the smallest functional units of a UI — a button, an input, an icon. Keeping the responsibility single-purpose is what makes them reusable across contexts." %}

{% include quiz.html id="atom-2"
   question="Should an atom component contain API calls and business logic to make it self-sufficient?"
   options="A|Yes — self-sufficient atoms are easier to drop into any page;;B|No — atoms should be purely presentational and receive data via props"
   correct="B"
   explanation="Business logic, API calls, and state management belong in containers or higher-level components. A button that makes an API call can only be used in one specific scenario; a pure atom can be used anywhere." %}

{% include quiz.html id="atom-3"
   question="Which of these is a well-designed atom?"
   options="A|A LoginForm with email input, password input, and a submit button;;B|A TextInput that accepts `value` and `onChange` props;;C|A UserProfile that displays avatar, name, and bio"
   correct="B"
   explanation="A is a molecule/organism (combines multiple atoms + business logic). C is a molecule (several display elements bound to a specific data shape). B — a single-purpose text input with a simple interface — is the atom." %}

{% include quiz.html id="atom-4"
   question="What's the main benefit of wrapping a native HTML element in an atom component instead of using it directly?"
   options="A|It is required by React 19;;B|It hides implementation details so callers can't misuse it;;C|It centralises styling, accessibility, and design-token usage so every instance stays consistent;;D|It makes the bundle smaller"
   correct="C"
   explanation="Atom components give you one place to set padding, colors, ARIA attributes, and hover states so that every button/input/icon in the app inherits them automatically — the 'slightly different button everywhere' problem goes away." %}

{% include quiz.html id="atom-5"
   question="How should an atom handle visual variants like `primary`, `secondary`, `danger`?"
   options="A|Duplicate the atom per theme and import the right one per route;;B|Expose a `variant` prop on a single atom and switch classNames/styles based on it;;C|Create separate `PrimaryButton`, `SecondaryButton`, `DangerButton` components"
   correct="B"
   explanation="A single atom with a `variant` prop scales from 2 variants to 20 without proliferating files. Only split into separate components when the *behavior* (not just styling) differs significantly." %}

## References

- [Atoms — Atomic Design (Brad Frost)](https://atomicdesign.bradfrost.com/chapter-2/#atoms)
- [Atomic Design overview](atomic-design.html) — where atoms sit relative to molecules, organisms, and templates
- [Molecule](molecule.html) — the next composition layer up, where atoms start combining
- [Container](../server/container.html) — where the business logic and data-fetching that atoms must *not* contain actually lives
- [React.memo](https://react.dev/reference/react/memo) and [Vue functional components](https://vuejs.org/guide/extras/render-function.html#functional-components) — framework-level optimizations that pair naturally with pure atoms
