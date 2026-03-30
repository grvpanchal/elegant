---
description: Guidance for Elements - DOM nodes and framework element objects
name: Element - UI
applyTo: |
  **/components/**/*.{jsx,tsx,vue,js,ts}
  **/ui/**/*.{jsx,tsx,vue,js,ts}
---

# Element Instructions

## What is an Element?

Elements are lightweight objects describing what should appear on screen. In React, an element is `{ type: 'button', props: {...} }`—the bridge between declarative component code and imperative DOM operations.

## Key Principles

1. **Component vs Element vs DOM Node**: Component = blueprint (function/class), Element = description object, DOM Node = actual browser object. React creates elements, then updates DOM.

2. **Elements are Cheap**: Creating element objects is fast and doesn't touch the DOM. Create thousands without performance concern—actual DOM updates are batched and optimized.

3. **Immutable Description**: Elements describe what UI should look like at a point in time. They're immutable—to update UI, create new elements.

## Best Practices

✅ **DO**:
- Understand JSX compiles to `createElement()` calls
- Return elements from component render functions
- Use element composition for flexible APIs
- Understand element tree = virtual DOM

❌ **DON'T**:
- Confuse elements with DOM nodes
- Mutate element objects after creation
- Manually create elements when JSX works
- Forget that elements are just objects

## Code Patterns

### Understanding Elements

```jsx
// JSX creates element objects
const element = <button className="btn">Click</button>;

// Compiles to:
const element = React.createElement(
  'button',
  { className: 'btn' },
  'Click'
);

// Resulting object:
{
  type: 'button',
  props: {
    className: 'btn',
    children: 'Click'
  },
  key: null,
  ref: null
}

// Component elements
const element = <MyButton label="Click" />;

// Compiles to:
{
  type: MyButton,  // Component reference
  props: { label: 'Click' }
}
```

### Custom Elements (Web Components)

```javascript
// Custom element definition
class MyButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    this.render();
  }
  
  static get observedAttributes() {
    return ['label', 'disabled'];
  }
  
  attributeChangedCallback(name, oldVal, newVal) {
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <button>${this.getAttribute('label') || 'Click'}</button>
    `;
  }
}

customElements.define('my-button', MyButton);

// Usage
<my-button label="Submit"></my-button>
```

### Element States (Custom Elements)

```javascript
// Custom element lifecycle states:
// - undefined: Not registered yet
// - failed: Registration failed
// - uncustomized: Valid name, not defined yet
// - custom: Successfully defined and registered

// Check if element is defined
customElements.whenDefined('my-button').then(() => {
  console.log('my-button is now defined');
});
```

## Related Terminologies

- **Component** (UI) - Blueprints that create elements
- **DOM** (UI) - Elements become DOM nodes
- **Props** (UI) - Element configuration
- **Attributes** (UI) - HTML attributes on elements

## Quality Gates

- [ ] Understand element vs component vs DOM node
- [ ] JSX usage over manual createElement
- [ ] Elements treated as immutable
- [ ] Custom elements properly registered

**Source**: `/docs/ui/element.md`
