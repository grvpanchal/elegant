---
title: Element
layout: doc
slug: element
---

# Element

> - A single purpose entity of HTML
> - A building block of page
> - Element is essentially an instance of the [DOM](./dom.html) representation of the [component](./component.html)

## Key Insight

Understanding the distinction between elements, components, and DOM nodes is crucial: a **component** is a blueprint (function or class), an **element** is a lightweight object describing what should appear on screen (`{ type: 'button', props: {...} }`), and a **DOM node** is the actual browser object that gets rendered. Elements are the bridge between your declarative component code and the imperative DOM operations that browsers understand—React creates elements from components, then efficiently translates those elements into real DOM updates.

## Detailed Description

In modern frontend frameworks, particularly React, the term "element" has specific meaning that differs from the traditional DOM element. A React element is a plain JavaScript object that describes a component instance or DOM node and its desired properties. When you write JSX like `<Button label="Click" />`, you're not directly creating a DOM button—you're creating a React element object that React's reconciliation algorithm will later use to update the actual DOM.

This abstraction layer is fundamental to React's Virtual DOM architecture. Instead of directly manipulating expensive DOM operations, React creates a lightweight tree of element objects, compares it to the previous tree (diffing), and calculates the minimal set of real DOM updates needed. Elements are cheap to create, immutable, and can be created thousands of times without performance concerns, while DOM nodes are expensive and stateful.

The anatomy of a React element is simple:

The anatomy of a React element is simple:

```javascript
// React element structure
{
  type: 'button',  // or component reference (Button)
  props: {         // properties and children
    className: 'btn',
    onClick: handleClick,
    children: 'Click me'
  },
  key: null,       // for list reconciliation
  ref: null        // for DOM access
}
```

In the context of **Web Components** and **Custom Elements**, elements have additional lifecycle states and metadata. The Web Components standard defines specific states and properties that control how elements are registered, initialized, and upgraded. Understanding these states is crucial when building or debugging custom elements in framework-agnostic applications.

Elements also serve as the return value of component render functions. When you write `return <div>Hello</div>` in a React component, you're returning an element that describes what the UI should look like. This declarative approach—describing *what* you want rather than *how* to achieve it—is what makes modern component frameworks powerful and maintainable.

In the Universal Frontend Architecture, understanding elements helps you reason about component composition, performance optimization (React.memo checks if element props changed), and advanced patterns like render props or higher-order components that manipulate element trees programmatically.

### Custom Element States

Elements have an associated `namespace`, `namespace prefix`, `local name`, `custom element state`, `custom element definition`, `is value`. When an element is created, all of these values are initialized.

An element's custom element state is one of `"undefined"`, `"failed"`, `"uncustomized"`, `"precustomized"`, or `"custom"`. An element whose custom element state is `"uncustomized"` or `"custom"` is said to be defined. An element whose custom element state is "custom" is said to be custom.

The standard element lifecycle defines the following states for each custom element:

- **Undefined**: A custom element that has not been customized yet, either due to the user agent not supporting it or because the necessary registration code has not yet been executed.

- **Failed**: An element whose definition attempted to be registered, but the registration process failed. An example of this case is when the custom element's name is already taken. In this state, the element will remain as `HTMLUnknownElement` until it has been properly defined.

- **Uncustomized**: A custom element that has a valid custom element name but has not been defined yet.

- **Custom**: A custom element that has a valid custom element name and has been successfully defined and registered.

## Code Examples

### Basic Example: React.createElement vs JSX

Understanding how JSX compiles to React.createElement calls:

```jsx
// JSX syntax (what you write)
const element = <h1 className="greeting">Hello, world!</h1>;

// Compiles to React.createElement
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
);

// Resulting element object
{
  type: 'h1',
  props: { className: 'greeting', children: 'Hello, world!' }
}
```

### Practical Example: Custom Element States

```html
<!DOCTYPE html>
<script>
  window.customElements.define("sw-rey", class extends HTMLElement {})
  window.customElements.define("sw-finn", class extends HTMLElement {}, { extends: "p" })
  window.customElements.define("sw-kylo", class extends HTMLElement {
    constructor() {
      // super() intentionally omitted - causes failure
    }
  })
</script>

<!-- "undefined" (not defined, not custom) -->
<sw-han></sw-han>
<p is="sw-luke"></p>

<!-- "failed" (definition failed) -->
<sw-kylo></sw-kylo>

<!-- "uncustomized" (standard HTML) -->
<p></p>

<!-- "custom" (successfully defined) -->
<sw-rey></sw-rey>
<p is="sw-finn"></p>
```

### Advanced Example: Programmatic Element Creation

```jsx
// Cloning elements with modified props
const Parent = () => {
  const child = <Button variant="primary">Click</Button>;
  
  const modified = React.cloneElement(child, {
    onClick: () => console.log('Clicked')
  });
  
  return modified;
};
```

## Common Mistakes

### 1. Confusing Elements with DOM Nodes
```jsx
// ❌ BAD
const element = <button>Click</button>;
element.focus(); // ERROR: element is just an object

// ✅ GOOD: Use refs for DOM access
const Button = () => {
  const ref = useRef(null);
  useEffect(() => ref.current.focus(), []);
  return <button ref={ref}>Click</button>;
};
```

### 2. Modifying Elements After Creation
```jsx
// ❌ BAD: Elements are immutable
const el = <h1>Hello</h1>;
el.props.children = 'Bye'; // Won't work

// ✅ GOOD: Create new element
const newEl = <h1>Bye</h1>;
```

### 3. Using Custom Elements Before Definition
```html
<!-- ❌ BAD -->
<script>
  document.querySelector('my-el').doSomething(); // Undefined!
</script>
<my-el></my-el>

<!-- ✅ GOOD -->
<script>
  customElements.whenDefined('my-el').then(() => {
    document.querySelector('my-el').doSomething();
  });
</script>
```

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between a React element and a DOM element?</summary>

**Answer:** React elements are plain JavaScript objects describing UI (`{ type: 'div', props: {...} }`), while DOM elements are actual browser objects (HTMLDivElement). React elements are cheap to create and immutable; DOM elements are expensive and mutable. React creates element trees, diffs them, then minimally updates the real DOM.
</details>

<details>
<summary><strong>Question 2:</strong> Can you modify a React element after creating it?</summary>

**Answer:** No, elements are immutable. Once created, you cannot change their type or props. Instead, create a new element or use `React.cloneElement()` to create a modified copy. This immutability enables React's efficient diffing algorithm and predictable behavior.
</details>

<details>
<summary><strong>Question 3:</strong> What are the five custom element states in Web Components?</summary>

**Answer:** 
1. **undefined** - not defined yet
2. **failed** - definition failed (e.g., missing super())
3. **uncustomized** - standard HTML element
4. **precustomized** - created before definition loaded
5. **custom** - successfully defined and registered

Use `customElements.whenDefined()` to handle async loading.
</details>

<details>
<summary><strong>Question 4:</strong> How does React's Virtual DOM use elements for performance?</summary>

**Answer:** React creates lightweight element objects instead of expensive DOM operations. When state changes, React creates a new element tree, compares it to the previous one (diffing), and calculates minimal DOM updates needed. Creating thousands of JavaScript objects (elements) is fast; React only touches the real DOM when necessary, making updates efficient.
</details>

<details>
<summary><strong>Question 5:</strong> When should you use refs to access DOM elements?</summary>

**Answer:** Use refs for imperative operations that React elements can't handle: focus management, measuring dimensions, triggering animations, integrating third-party libraries, or direct DOM manipulation. For data that affects rendering, use state/props instead. Rule: if it affects what's rendered → state; if it's a side effect → refs.
</details>

## References

- https://dom.spec.whatwg.org/#concept-element
- https://react.dev/reference/react/createElement
