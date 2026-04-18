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

### Basic Example: Simple Button Atom

A fundamental button atom demonstrating single-purpose design:

```jsx
// Button.js

import React from "react";

const Button = ({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default Button;
```

In this example, the Button component is a basic building block (atom) that takes two props:

- `onClick`: a function to be called when the button is clicked.
- `label`: the text content of the button.

This simple Button component can be reused throughout the application wherever a button is needed. When combining multiple atoms like this, we can start building more complex components (molecules, organisms, etc.) by composing them together.

Here's an example of how we might use this Button component in a parent component:

```jsx
// App.js

import React from "react";
import Button from "./Button";

const App = () => {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div>
      <h1>My App</h1>
      <Button onClick={handleClick} label="Click me" />
    </div>
  );
};

export default App;
```

In this example, the `App` component uses the `Button` atom by passing in an `onClick` function and a `label`. This follows the Atomic Design principles of building up more complex components by combining simpler ones.

### Advanced Example: Icon Atom with Dynamic SVG Loading

A production-ready icon atom demonstrating flexibility and optimization:

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
   options="A|It manages its own global state;B|It has a single responsibility and cannot be broken down into smaller functional components;C|It always wraps at least three child elements;D|It fetches its own data from an API"
   correct="B"
   explanation="Atoms are the smallest functional units of a UI — a button, an input, an icon. Keeping the responsibility single-purpose is what makes them reusable across contexts." %}

{% include quiz.html id="atom-2"
   question="Should an atom component contain API calls and business logic to make it self-sufficient?"
   options="A|Yes — self-sufficient atoms are easier to drop into any page;B|No — atoms should be purely presentational and receive data via props"
   correct="B"
   explanation="Business logic, API calls, and state management belong in containers or higher-level components. A button that makes an API call can only be used in one specific scenario; a pure atom can be used anywhere." %}

{% include quiz.html id="atom-3"
   question="Which of these is a well-designed atom?"
   options="A|A LoginForm with email input, password input, and a submit button;B|A TextInput that accepts `value` and `onChange` props;C|A UserProfile that displays avatar, name, and bio"
   correct="B"
   explanation="A is a molecule/organism (combines multiple atoms + business logic). C is a molecule (several display elements bound to a specific data shape). B — a single-purpose text input with a simple interface — is the atom." %}

{% include quiz.html id="atom-4"
   question="What's the main benefit of wrapping a native HTML element in an atom component instead of using it directly?"
   options="A|It hides implementation details so callers can't misuse it;B|It centralises styling, accessibility, and design-token usage so every instance stays consistent;C|It makes the bundle smaller;D|It is required by React 19"
   correct="B"
   explanation="Atom components give you one place to set padding, colors, ARIA attributes, and hover states so that every button/input/icon in the app inherits them automatically — the 'slightly different button everywhere' problem goes away." %}

{% include quiz.html id="atom-5"
   question="How should an atom handle visual variants like `primary`, `secondary`, `danger`?"
   options="A|Create separate `PrimaryButton`, `SecondaryButton`, `DangerButton` components;B|Expose a `variant` prop on a single atom and switch classNames/styles based on it;C|Duplicate the atom per theme and import the right one per route"
   correct="B"
   explanation="A single atom with a `variant` prop scales from 2 variants to 20 without proliferating files. Only split into separate components when the *behavior* (not just styling) differs significantly." %}

## References

- [Atoms — Atomic Design (Brad Frost)](https://atomicdesign.bradfrost.com/chapter-2/#atoms)
