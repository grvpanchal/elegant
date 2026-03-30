---
description: Guidance for Components - self-contained UI units with HTML, CSS, JS
name: Component - UI
applyTo: |
  **/components/**/*.{jsx,tsx,vue,js,ts}
  **/ui/**/*.{jsx,tsx,vue,js,ts}
---

# Component Instructions

## What is a Component?

Components are self-contained, reusable UI units that encapsulate structure (HTML), styling (CSS), and behavior (JavaScript). They're the fundamental building blocks of modern web applications.

## Key Principles

1. **Encapsulation**: Each component manages its own presentation, styling, and interactions. External code interacts only through props/events.

2. **Framework Agnostic Patterns**: Core component patterns (props in, events out, composition) work across React, Vue, Angular, Web Components.

3. **Single Responsibility**: Each component handles one piece of functionality. If it does too much, split it into smaller components.

## Best Practices

✅ **DO**:
- Keep components focused on one purpose
- Accept configuration via props/attributes
- Emit events for parent communication
- Colocate styles with component (CSS modules, scoped styles)
- Write self-documenting prop interfaces
- Make components testable in isolation

❌ **DON'T**:
- Create god components that do everything
- Reach outside component boundary for data
- Use global styles that leak
- Tightly couple to specific parent components
- Ignore accessibility requirements

## Code Patterns

### Recommended

```jsx
// ToggleSwitch.jsx - Self-contained component
import './ToggleSwitch.css';

const ToggleSwitch = ({ 
  value, 
  onChange, 
  label,
  disabled = false 
}) => {
  const handleToggle = () => {
    if (!disabled) onChange(!value);
  };

  return (
    <label className="toggle-switch">
      <span className="toggle-switch__label">{label}</span>
      <button
        role="switch"
        aria-checked={value}
        onClick={handleToggle}
        disabled={disabled}
        className={`toggle-switch__track ${value ? 'is-on' : ''}`}
      >
        <span className="toggle-switch__thumb" />
      </button>
    </label>
  );
};
```

### Web Component Pattern

```javascript
// custom-button.js - Native Web Component
class CustomButton extends HTMLElement {
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
  
  attributeChangedCallback() {
    this.render();
  }
  
  render() {
    const label = this.getAttribute('label') || 'Click';
    this.shadowRoot.innerHTML = `
      <style>
        button { padding: 8px 16px; }
      </style>
      <button>${label}</button>
    `;
  }
}

customElements.define('custom-button', CustomButton);
```

## Related Terminologies

- **Atom/Molecule/Organism** (UI) - Component hierarchy levels
- **Props** (UI) - How components receive data
- **Events** (UI) - How components communicate up
- **Element** (UI) - DOM representation of components

## Quality Gates

- [ ] Single responsibility maintained
- [ ] Props interface clearly defined
- [ ] Events used for parent communication
- [ ] Styles scoped to component
- [ ] Accessible (keyboard, screen reader)
- [ ] Testable in isolation

**Source**: `/docs/ui/component.md`
