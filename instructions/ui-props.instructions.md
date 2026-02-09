---
description: Guidance for Props - component input interface and data contracts
name: Props - UI
applyTo: |
  **/components/**/*.{jsx,tsx,vue,js,ts}
  **/ui/**/*.{jsx,tsx,vue,js,ts}
---

# Props Instructions

## What are Props?

Props (properties) are the contract between a component and its users—data passed from parent to child that defines component behavior, appearance, and content. Props flow down, events flow up.

## Key Principles

1. **Immutability**: Props are read-only within the receiving component. Never modify props directly—call callbacks to trigger parent updates.

2. **Unidirectional Flow**: Data flows down via props, changes flow up via event callbacks. This creates predictable, debuggable data flow.

3. **Clear Interfaces**: Props define the component API. Document types, defaults, and required props clearly—treat props like function signatures.

## Best Practices

✅ **DO**:
- Define prop types (TypeScript, PropTypes)
- Provide sensible default values
- Use descriptive prop names (`isDisabled` not `d`)
- Pass callbacks for child-to-parent communication
- Destructure props for clarity
- Keep prop count manageable (<10 props)

❌ **DON'T**:
- Mutate props inside components
- Pass entire objects when only fields are needed
- Create props that duplicate each other
- Use generic names (`data`, `info`, `stuff`)
- Deeply nest required props (flatten interface)

## Code Patterns

### Recommended

```jsx
// Button.jsx - Clear prop interface
interface ButtonProps {
  /** Button text content */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

const Button = ({ 
  label, 
  onClick, 
  variant = 'primary',  // Default value
  disabled = false,
  loading = false 
}: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`btn btn--${variant}`}
  >
    {loading ? 'Loading...' : label}
  </button>
);
```

### Callback Props Pattern

```jsx
// Parent passes callback, child calls it
const Parent = () => {
  const [count, setCount] = useState(0);
  
  return (
    <Counter 
      value={count} 
      onIncrement={() => setCount(c => c + 1)}  // Callback prop
    />
  );
};

const Counter = ({ value, onIncrement }) => (
  <div>
    <span>{value}</span>
    <button onClick={onIncrement}>+</button>  {/* Calls parent callback */}
  </div>
);
```

### Avoid

```jsx
// ❌ WRONG - Mutating props
const BadComponent = (props) => {
  props.items.push(newItem);  // Never mutate!
  return <List items={props.items} />;
};

// ✅ CORRECT - Call callback to update
const GoodComponent = ({ items, onAddItem }) => {
  const handleAdd = () => onAddItem(newItem);
  return <List items={items} onAdd={handleAdd} />;
};
```

## Related Terminologies

- **Component** (UI) - Props define component interface
- **Events** (UI) - Callback props enable upward communication
- **State** (State) - Props often come from state
- **Attributes** (UI) - HTML attributes vs JS props distinction

## Quality Gates

- [ ] Props typed (TypeScript/PropTypes)
- [ ] Required vs optional clearly defined
- [ ] Default values for optional props
- [ ] Props never mutated
- [ ] Callbacks for child-to-parent communication
- [ ] Prop count reasonable (<10)

**Source**: `/docs/ui/props.md`
