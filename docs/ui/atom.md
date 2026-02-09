---
title: Atom
layout: doc
slug: atom
---

# Atom

> - A single purpose component
> - Deliver display or interactiveness with single action

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

<details>
<summary><strong>Question 1:</strong> What is the primary characteristic that defines a component as an "atom" in Atomic Design?</summary>

**Answer:** Single responsibility and simplicity. An atom should perform one specific function (e.g., display a button, show an icon, capture text input) and cannot be broken down into smaller functional components. It's the smallest building block in your UI hierarchy.

**Why it matters:** Understanding this principle prevents over-engineering simple components and ensures your atoms remain reusable across different contexts.
</details>

<details>
<summary><strong>Question 2:</strong> True or False: An atom component should contain API calls and business logic to make it self-sufficient.</summary>

**Answer:** **False.** Atoms should be purely presentational components that receive data via props and communicate user interactions through callback functions. Business logic, API calls, and state management belong in [containers](../server/container.html), molecules, or higher-level components.

**Why it matters:** Keeping atoms pure makes them easier to test, reuse in different contexts, and maintain over time. A button that makes API calls can only be used in one specific scenario, but a pure button atom can be used anywhere.
</details>

<details>
<summary><strong>Question 3:</strong> Which of these is a well-designed atom? (A) A LoginForm with email input, password input, and submit button (B) A TextInput that accepts value and onChange props (C) A UserProfile displaying avatar, name, and bio</summary>

**Answer:** **(B) A TextInput that accepts value and onChange props** is a well-designed atom.

**Explanation:**
- **(A)** is a molecule or organism—it combines multiple atoms (inputs and button) with specific business logic
- **(B)** is a proper atom—single purpose (text input), simple interface, highly reusable
- **(C)** is a molecule or organism—combines multiple display elements with specific data structure

**Why it matters:** Correctly identifying atomic components helps you build a scalable component hierarchy. Over-categorizing simple components as molecules/organisms or under-categorizing complex components as atoms leads to architectural confusion.
</details>

<details>
<summary><strong>Question 4:</strong> What's the benefit of creating separate atom components instead of using native HTML elements directly?</summary>

**Answer:** Atom components provide:
1. **Consistency:** Centralized styling and behavior (all buttons look and act the same)
2. **Design System Integration:** Automatically apply design tokens (colors, spacing, typography)
3. **Accessibility:** Baked-in ARIA attributes and keyboard support
4. **Flexibility:** Easy to update all instances by modifying one component
5. **Framework Abstraction:** Can swap underlying implementation without changing usage

**Example:** Changing all button hover colors requires editing one file instead of searching through hundreds of components.

**Why it matters:** This abstraction is core to the Universal Frontend Architecture—it creates a layer between design decisions and implementation, making large-scale changes manageable.
</details>

<details>
<summary><strong>Question 5:</strong> How should an atom handle different visual variants (e.g., primary button, secondary button, danger button)?</summary>

**Answer:** Use props to control variants, not separate components:

```jsx
// ✅ GOOD: Single component with variant prop
const Button = ({ variant = 'primary', label, onClick }) => (
  <button className={`btn btn--${variant}`} onClick={onClick}>
    {label}
  </button>
);

// Usage
<Button variant="primary" label="Save" />
<Button variant="secondary" label="Cancel" />
<Button variant="danger" label="Delete" />
```

Avoid creating `PrimaryButton`, `SecondaryButton`, `DangerButton` as separate atoms unless the behavior differs significantly (not just styling).

**Why it matters:** This keeps your component library manageable, reduces duplication, and makes it easier to add new variants without creating new files. The variant prop pattern scales from 2 variants to 20.
</details>

## References

- https://atomicdesign.bradfrost.com/chapter-2/#atoms

```jsx
// Input.js

import React from "react";
import "./Input.css";

const Input = ({ 
  value, 
  onChange, 
  placeholder = "",
  type = "text",
  error = false,
  errorMessage = "",
  disabled = false,
  ariaLabel
}) => {
  // Single responsibility: render an input with consistent styling and behavior
  return (
    <div className="input-wrapper">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-invalid={error}
        className={`input ${error ? 'input--error' : ''} ${disabled ? 'input--disabled' : ''}`}
      />
      {error && errorMessage && (
        <span className="input__error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
```

```css
/* Input.css */
.input {
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #2196f3;
}

.input--error {
  border-color: #f44336;
}

.input__error-message {
  display: block;
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
```

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

**Why it matters:** Complex atoms become difficult to reuse, test, and maintain. Keep business logic in [containers](/docs/server/container.html) or parent components.

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

<details>
<summary><strong>Question 1:</strong> What is the primary characteristic that defines a component as an "atom" in Atomic Design?</summary>

**Answer:** Single responsibility and simplicity. An atom should perform one specific function (e.g., display a button, show an icon, capture text input) and cannot be broken down into smaller functional components. It's the smallest building block in your UI hierarchy.

**Why it matters:** Understanding this principle prevents over-engineering simple components and ensures your atoms remain reusable across different contexts.
</details>

<details>
<summary><strong>Question 2:</strong> True or False: An atom component should contain API calls and business logic to make it self-sufficient.</summary>

**Answer:** **False.** Atoms should be purely presentational components that receive data via props and communicate user interactions through callback functions. Business logic, API calls, and state management belong in [containers](/docs/server/container.html), molecules, or higher-level components.

**Why it matters:** Keeping atoms pure makes them easier to test, reuse in different contexts, and maintain over time. A button that makes API calls can only be used in one specific scenario, but a pure button atom can be used anywhere.
</details>

<details>
<summary><strong>Question 3:</strong> Which of these is a well-designed atom? (A) A LoginForm with email input, password input, and submit button (B) A TextInput that accepts value and onChange props (C) A UserProfile displaying avatar, name, and bio</summary>

**Answer:** **(B) A TextInput that accepts value and onChange props** is a well-designed atom.

**Explanation:**
- **(A)** is a molecule or organism—it combines multiple atoms (inputs and button) with specific business logic
- **(B)** is a proper atom—single purpose (text input), simple interface, highly reusable
- **(C)** is a molecule or organism—combines multiple display elements with specific data structure

**Why it matters:** Correctly identifying atomic components helps you build a scalable component hierarchy. Over-categorizing simple components as molecules/organisms or under-categorizing complex components as atoms leads to architectural confusion.
</details>

<details>
<summary><strong>Question 4:</strong> What's the benefit of creating separate atom components instead of using native HTML elements directly?</summary>

**Answer:** Atom components provide:
1. **Consistency:** Centralized styling and behavior (all buttons look and act the same)
2. **Design System Integration:** Automatically apply design tokens (colors, spacing, typography)
3. **Accessibility:** Baked-in ARIA attributes and keyboard support
4. **Flexibility:** Easy to update all instances by modifying one component
5. **Framework Abstraction:** Can swap underlying implementation without changing usage

**Example:** Changing all button hover colors requires editing one file instead of searching through hundreds of components.

**Why it matters:** This abstraction is core to the Universal Frontend Architecture—it creates a layer between design decisions and implementation, making large-scale changes manageable.
</details>

<details>
<summary><strong>Question 5:</strong> How should an atom handle different visual variants (e.g., primary button, secondary button, danger button)?</summary>

**Answer:** Use props to control variants, not separate components:

```jsx
// ✅ GOOD: Single component with variant prop
const Button = ({ variant = 'primary', label, onClick }) => (
  <button className={`btn btn--${variant}`} onClick={onClick}>
    {label}
  </button>
);

// Usage
<Button variant="primary" label="Save" />
<Button variant="secondary" label="Cancel" />
<Button variant="danger" label="Delete" />
```

Avoid creating `PrimaryButton`, `SecondaryButton`, `DangerButton` as separate atoms unless the behavior differs significantly (not just styling).

**Why it matters:** This keeps your component library manageable, reduces duplication, and makes it easier to add new variants without creating new files. The variant prop pattern scales from 2 variants to 20.
</details>

## References

- https://atomicdesign.bradfrost.com/chapter-2/#atoms
