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

{% include quiz.html id="element-1"
   question="What is the difference between a React element and a DOM element?"
   options="A|They are the same thing;B|A React element is a plain JS object describing what should be rendered (type, props, children) — it is immutable; a DOM element is the actual browser node in the document. React reconciles elements into DOM nodes;C|A React element is slower than a DOM element;D|React elements live on the server"
   correct="B"
   explanation="`React.createElement(...)` returns a description. React's reconciler then diffs and applies changes to real DOM nodes. The element itself is throwaway and cheap to recreate." %}

{% include quiz.html id="element-2"
   question="Can you mutate a React element after creating it?"
   options="A|Yes, you mutate its props directly;B|No — React elements are immutable. To &quot;change&quot; one you re-render, producing a new element, and the reconciler figures out the minimum DOM update"
   correct="B"
   explanation="Immutability is what enables efficient diffing. If you tried to mutate props, React wouldn't know what changed and couldn't apply the right updates." %}

{% include quiz.html id="element-3"
   question="Which is NOT a custom element state in Web Components?"
   options="A|undefined (not yet defined);B|failed (upgrade threw);C|constructed (element upgraded);D|purged (destroyed) — there is no such state"
   correct="D"
   explanation="Standard states are undefined, failed, uncustomized, custom (sometimes called &quot;constructed&quot;). &quot;Purged&quot; is not in the spec — removal happens via disconnectedCallback." %}

{% include quiz.html id="element-4"
   question="How does the Virtual DOM use elements to improve performance?"
   options="A|It skips the DOM entirely;B|It keeps a lightweight in-memory tree of elements, diffs the previous and next trees on update, and applies only the minimum set of real DOM mutations — amortising the cost of changes;C|It renders everything in a Web Worker;D|It disables reflow"
   correct="B"
   explanation="Real DOM mutations are expensive. By diffing cheap JS object trees first and batching writes, React (and similar libraries) avoid re-laying out the whole page on every state change." %}

{% include quiz.html id="element-5"
   question="When is it appropriate to use a ref to access a DOM element in React?"
   options="A|Whenever you would write jQuery;B|Only for imperative operations that React can't express declaratively: focus/selection, measuring layout, integrating 3rd-party non-React libraries, and media playback control;C|For any state a component owns;D|Never — refs are deprecated"
   correct="B"
   explanation="Refs are an escape hatch. Reach for them when you genuinely need the underlying DOM node; don't use them to bypass state." %}

## References

- https://dom.spec.whatwg.org/#concept-element
- https://react.dev/reference/react/createElement
