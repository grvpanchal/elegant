---
title: Component
layout: doc
slug: component
---
# Component

> - An interactive unit of element comprising of HTML, CSS and JS
> - JS framework element to deliver reactivity with HTML, JS and CSS
> - Encapsulates structure, styling, and behavior into reusable units

## Key Insight

Components are the fundamental building blocks of modern web applications—self-contained, reusable pieces of UI that encapsulate structure (HTML), styling (CSS), and behavior (JavaScript) into a single cohesive unit. By thinking in components rather than pages, you create modular, testable, and maintainable code that scales from simple buttons to complex enterprise applications.

## Detailed Description

In modern frontend development, components represent a paradigm shift from traditional page-based thinking to a modular, composition-based architecture. A component is more than just a reusable code snippet—it's an independent unit that manages its own presentation logic, styling, and user interactions while providing a clean interface to the outside world through props or attributes.

The Universal Frontend Architecture embraces components as framework-agnostic building blocks. Whether you're working with React, Vue, Angular, or Web Components, the fundamental principles remain the same: encapsulation, reusability, and single responsibility. This consistency allows teams to adopt patterns and practices that transcend specific technologies, making knowledge transferable and architecture decisions more strategic.

Component-based architecture enables true separation of concerns at the UI level. Each component handles a specific piece of functionality—a navigation bar, a form input, a data table—and can be developed, tested, and optimized independently. This isolation dramatically improves developer productivity, as changes to one component don't cascade unexpectedly through your application. It also enables parallel development, where different team members can work on different components simultaneously.

From a performance perspective, components align perfectly with modern optimization techniques. Code-splitting can happen naturally at component boundaries, lazy-loading becomes straightforward, and framework-specific optimizations like React's reconciliation algorithm or Vue's reactivity system work most efficiently with well-designed components. The component tree structure also makes it easy to identify performance bottlenecks and apply targeted optimizations.

In the context of the [Atomic Design](atomic-design.html) system, components exist at multiple levels of abstraction—from simple [atoms](atom.html) like buttons and inputs to complex [organisms](organism.html) like entire form sections or data dashboards. This hierarchical organization makes it intuitive to navigate large codebases and understand the relationships between different UI pieces.

## Code Examples

### Basic Example: Native Web Component

A fundamental custom element demonstrating core component principles:

Web Components consist of three main technologies: Custom Elements, Shadow DOM, and HTML Templates.

Here's a simple example of a Web Component using Custom Elements:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Custom Button Component</title>
  </head>
  <body>
    <!-- Define the custom button component -->
    <script>
      class CustomButton extends HTMLElement {
        constructor() {
          super();

          // Create a shadow root
          this.attachShadow({ mode: "open" });

          // Define the button element
          const button = document.createElement("button");
          button.textContent = "Click me!";
          button.addEventListener("click", () => alert("Button clicked!"));

          // Append the button to the shadow DOM
          this.shadowRoot.appendChild(button);
        }
      }

      // Register the custom element
      customElements.define("custom-button", CustomButton);
    </script>

    <!-- Use the custom button component -->
    <custom-button></custom-button>
  </body>
</html>
```

- The `CustomButton` class extends `HTMLElement` to create a custom element.
- The `constructor` method is used to define the behavior of the custom element.
- `this.attachShadow({ mode: 'open' })` creates a shadow DOM for encapsulating the component's styles and functionality.
- A button element is created and added to the shadow DOM.
- The custom element is registered using `customElements.define('custom-button', CustomButton)`.

In the HTML body, `<custom-button></custom-button>` is used to insert an instance of the custom button component.

### Practical Example: React Component with State and Props

A real-world component demonstrating state management and component composition:

```jsx
// ToggleSwitch.js

import React, { useState } from "react";
import "./ToggleSwitch.css";

/**
 * ToggleSwitch Component
 * Encapsulates structure, behavior, and styling for a toggle switch
 * 
 * @param {boolean} initialValue - Starting state of the toggle
 * @param {function} onChange - Callback when toggle state changes
 * @param {string} label - Accessible label for the toggle
 * @param {boolean} disabled - Whether the toggle is disabled
 */
const ToggleSwitch = ({ 
  initialValue = false, 
  onChange, 
  label,
  disabled = false 
}) => {
  // Component manages its own internal state
  const [isOn, setIsOn] = useState(initialValue);

  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !isOn;
    setIsOn(newValue);
    
    // Communicate state change to parent
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="toggle-switch">
      <label className="toggle-switch__label">
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          disabled={disabled}
          className="toggle-switch__input"
          aria-label={label}
        />
        <span className="toggle-switch__slider" />
        <span className="toggle-switch__text">{label}</span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
```

```css
/* ToggleSwitch.css - Component-scoped styling */
.toggle-switch {
  display: inline-block;
}

.toggle-switch__label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.toggle-switch__input {
  position: absolute;
  opacity: 0;
}

.toggle-switch__slider {
  position: relative;
  width: 50px;
  height: 24px;
  background-color: #ccc;
  border-radius: 24px;
  transition: background-color 0.3s;
}

.toggle-switch__slider::before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-switch__input:checked + .toggle-switch__slider {
  background-color: #2196f3;
}

.toggle-switch__input:checked + .toggle-switch__slider::before {
  transform: translateX(26px);
}

.toggle-switch__input:disabled + .toggle-switch__slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-switch__text {
  margin-left: 10px;
}
```

Usage:

```jsx
// App.js

import React, { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

const App = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <div>
      <h1>Settings</h1>
      <ToggleSwitch
        initialValue={notificationsEnabled}
        onChange={setNotificationsEnabled}
        label="Enable Notifications"
      />
      <p>Notifications are {notificationsEnabled ? "ON" : "OFF"}</p>
    </div>
  );
};
```

### Advanced Example: Vue Component with Slots and Computed Properties

A sophisticated component demonstrating advanced patterns:

```vue
<!-- Card.vue -->
<template>
  <article 
    :class="cardClasses"
    :aria-label="ariaLabel"
    @click="handleClick"
  >
    <!-- Named slot for header content -->
    <header v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </header>

    <!-- Default slot for main content -->
    <div class="card__body">
      <slot></slot>
    </div>

    <!-- Named slot for footer/actions -->
    <footer v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </footer>

    <!-- Loading overlay -->
    <div v-if="loading" class="card__loading">
      <span class="spinner" aria-live="polite">Loading...</span>
    </div>
  </article>
</template>

<script>
export default {
  name: 'Card',
  
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'elevated', 'outlined'].includes(value)
    },
    clickable: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    ariaLabel: {
      type: String,
      default: null
    }
  },

  emits: ['click'],

  computed: {
    // Computed property for dynamic class binding
    cardClasses() {
      return [
        'card',
        `card--${this.variant}`,
        {
          'card--clickable': this.clickable,
          'card--loading': this.loading
        }
      ];
    }
  },

  methods: {
    handleClick(event) {
      if (this.clickable && !this.loading) {
        this.$emit('click', event);
      }
    }
  }
};
</script>

<style scoped>
/* Component-scoped styles */
.card {
  position: relative;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
}

.card--elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card--outlined {
  border: 1px solid #e0e0e0;
}

.card--clickable {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card__header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.card__footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.card__loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}
</style>
```

Usage:

```vue
<!-- ProductCard.vue -->
<template>
  <Card variant="elevated" clickable @click="handleProductClick">
    <template #header>
      <h3>{{ product.name }}</h3>
      <span class="price">${{ product.price }}</span>
    </template>

    <p>{{ product.description }}</p>
    <img :src="product.image" :alt="product.name" />

    <template #footer>
      <button @click.stop="addToCart">Add to Cart</button>
    </template>
  </Card>
</template>
```

## Common Mistakes

### 1. Creating "God Components"
**Mistake:** Building components that do too much, violating single responsibility principle.

```jsx
// ❌ BAD: Component handling too many concerns
const UserDashboard = () => {
  // Handles authentication, data fetching, rendering, routing...
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({});
  
  useEffect(() => {
    // Fetch user, posts, settings, handle auth...
    // 200+ lines of logic
  }, []);

  return (
    <div>
      {/* 500+ lines of JSX */}
    </div>
  );
};
```

```jsx
// ✅ GOOD: Broken into focused components
const UserDashboard = () => {
  return (
    <DashboardLayout>
      <UserProfile />
      <UserPosts />
      <UserSettings />
    </DashboardLayout>
  );
};
```

**Why it matters:** Large components become unmaintainable, difficult to test, and impossible to reuse. Break them into smaller, focused components following the [Atomic Design](atomic-design.html) hierarchy.

### 2. Props Drilling Through Multiple Levels
**Mistake:** Passing props through many component layers unnecessarily.

```jsx
// ❌ BAD: Prop drilling
<App>
  <Layout user={user} theme={theme}>
    <Sidebar user={user} theme={theme}>
      <Menu user={user} theme={theme}>
        <MenuItem user={user} theme={theme} />
      </Menu>
    </Sidebar>
  </Layout>
</App>
```

```jsx
// ✅ GOOD: Use Context, Container pattern, or state management
const ThemeContext = React.createContext();
const UserContext = React.createContext();

<ThemeContext.Provider value={theme}>
  <UserContext.Provider value={user}>
    <App>
      <Layout>
        <Sidebar>
          <Menu>
            <MenuItem />
          </Menu>
        </Sidebar>
      </Layout>
    </App>
  </UserContext.Provider>
</ThemeContext.Provider>
```

**Why it matters:** Prop drilling makes components tightly coupled and reduces reusability. Use Context API, the [Container](../server/container.html) pattern, or state management libraries for widely-used data.

### 3. Mixing Presentational and Business Logic
**Mistake:** Combining UI rendering with data fetching, calculations, or business rules.

```jsx
// ❌ BAD: Mixed concerns
const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        // Business logic for filtering, sorting, pricing
        const processed = data
          .filter(p => p.inStock)
          .map(p => ({ ...p, displayPrice: calculatePrice(p) }))
          .sort((a, b) => a.priority - b.priority);
        setProducts(processed);
      });
  }, []);

  return <div>{/* render products */}</div>;
};
```

```jsx
// ✅ GOOD: Separated concerns
// Container handles data and logic
const ProductListContainer = () => {
  const products = useProducts(); // Custom hook or state management
  return <ProductList products={products} />;
};

// Component handles presentation only
const ProductList = ({ products }) => {
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

**Why it matters:** Separation enables component reuse with different data sources, easier testing with mock data, and clearer code organization. See [Container pattern](../server/container.html) for more details.

## Quick Quiz

{% include quiz.html id="component-1"
   question="What are the three core technologies that make up a Web Component?"
   options="A|HTML, CSS, JavaScript;;B|React, Vue, Angular;;C|Custom Elements, Shadow DOM, HTML Templates;;D|JSX, Virtual DOM, Fiber"
   correct="C"
   explanation="Custom Elements let you define new HTML tags, Shadow DOM encapsulates styling and markup, and <template>/<slot> provide reusable markup fragments. Together they are the framework-agnostic component model baked into the browser." %}

{% include quiz.html id="component-2"
   question="What is the primary difference between a presentational component and a container component?"
   options="A|Presentational components render UI from props (no data fetching or global state); container components own data fetching, selectors, and dispatch — they pass that data down to presentational components;;B|Presentational components own application state, containers only render UI;;C|There is no real difference;;D|Presentational is React-only; containers are Angular-only"
   correct="A"
   explanation="The split keeps UI reusable and testable. Presentational components are pure-ish (props -> UI). Containers are the glue between state management and the UI layer." %}

{% include quiz.html id="component-3"
   question="Should components always manage their own state internally rather than receiving it via props?"
   options="A|No — components should receive what they display via props; local state is reserved for truly component-internal concerns (menu open/closed, input focus) while shared or persistent state lives in a store or parent;;B|Yes — self-contained components are easier to reason about"
   correct="A"
   explanation="Over-locating state inside components leads to duplication, poor reuse, and hard-to-test components. Lift state up or use a store for anything that multiple components need." %}

{% include quiz.html id="component-4"
   question="What's the main benefit of component-scoped CSS (CSS Modules, styled-components, Vue scoped styles)?"
   options="A|It enables server-side rendering;;B|Class names are automatically localised so styles from one component can't accidentally bleed into another — you stop fighting with global CSS specificity;;C|It makes the bundle smaller;;D|It replaces accessibility"
   correct="B"
   explanation="Scoped CSS eliminates the &quot;why is my .button style getting overridden by that other .button&quot; class of bug and lets components be drop-in reusable across pages and apps." %}

{% include quiz.html id="component-5"
   question="When should you split a component into smaller components?"
   options="A|Never — always keep components big;;B|When a part of it is reused elsewhere, when responsibilities diverge (render vs fetch), when a piece is testable in isolation, or when naming the sub-part suddenly makes the parent clearer;;C|When it exceeds 500 lines, as a hard rule;;D|Only when a designer asks you to"
   correct="B"
   explanation="Extraction should be driven by reuse, single-responsibility, or clarity gains — not by a line-count rule. Splitting that doesn't meet one of those bars just adds indirection." %}

## References

- https://react.dev/learn/your-first-component
- https://medium.com/@adityaa803/components-in-javascript-1f5c66042fa5
- https://developer.mozilla.org/en-US/docs/Web/API/Web_components
