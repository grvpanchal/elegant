---
description: Guidance for Accessibility - inclusive UI design for all users
name: Accessibility - UI
applyTo: |
  **/components/**/*.{jsx,tsx,vue,js,ts}
  **/ui/**/*.{jsx,tsx,vue,js,ts}
---

# Accessibility Instructions

## What is Accessibility?

Accessibility (a11y) ensures web content is usable by people with disabilities—visual, auditory, motor, cognitive. It's fundamental architecture using semantic HTML, ARIA, and keyboard navigation.

## Key Principles

1. **Semantic HTML First**: Use `<button>` not `<div onclick>`. Semantic elements provide keyboard navigation, focus management, and screen reader support for free.

2. **ARIA Supplements, Doesn't Replace**: ARIA adds semantics when HTML falls short. `role="button"` tells screen readers it's a button, but you still need keyboard handlers.

3. **POUR Principles**: **P**erceivable (alt text), **O**perable (keyboard nav), **U**nderstandable (clear labels), **R**obust (works with assistive tech).

## Best Practices

✅ **DO**:
- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- Add alt text to images (empty `alt=""` for decorative)
- Ensure keyboard navigation (Tab, Enter, Space, Arrows)
- Maintain 4.5:1 contrast ratio for text
- Add visible focus indicators
- Use ARIA labels for icon-only buttons
- Test with screen reader (VoiceOver, NVDA)

❌ **DON'T**:
- Use `<div>` or `<span>` for interactive elements
- Remove focus outlines without replacement
- Rely on color alone to convey information
- Forget keyboard users exist
- Use ARIA when semantic HTML works
- Hide content with `display: none` if screen readers need it

## Code Patterns

### Semantic vs Non-Semantic

```html
<!-- ❌ WRONG - Non-semantic -->
<div class="button" onclick="submit()">Submit</div>
<div class="link" onclick="navigate()">Read more</div>

<!-- ✅ CORRECT - Semantic HTML -->
<button type="submit">Submit</button>
<a href="/article">Read more</a>
```

### ARIA for Custom Components

```jsx
// Icon-only button needs aria-label
<button aria-label="Close dialog" onClick={onClose}>
  <Icon name="close" aria-hidden="true" />
</button>

// Custom dropdown
<div 
  role="listbox"
  aria-label="Select country"
  aria-expanded={isOpen}
  aria-activedescendant={activeId}
>
  {options.map(opt => (
    <div
      key={opt.id}
      id={opt.id}
      role="option"
      aria-selected={opt.id === selectedId}
    >
      {opt.label}
    </div>
  ))}
</div>

// Live region for dynamic updates
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>
```

### Keyboard Navigation

```jsx
const Menu = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(i => Math.min(i + 1, items.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        items[activeIndex].onSelect();
        break;
    }
  };
  
  return (
    <ul role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <li
          key={item.id}
          role="menuitem"
          tabIndex={index === activeIndex ? 0 : -1}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
};
```

### Focus Management

```jsx
// Focus trap in modal
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();
  
  useEffect(() => {
    if (isOpen) {
      // Save previous focus
      const previousFocus = document.activeElement;
      // Focus modal
      modalRef.current?.focus();
      
      return () => {
        // Restore focus on close
        previousFocus?.focus();
      };
    }
  }, [isOpen]);
  
  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      {children}
    </div>
  );
};
```

## Related Terminologies

- **Attributes** (UI) - ARIA attributes enable a11y
- **Events** (UI) - Keyboard events for navigation
- **Component** (UI) - Components must be accessible
- **Semantic HTML** - Foundation of accessibility

## Quality Gates

- [ ] Semantic HTML used (not div soup)
- [ ] All images have appropriate alt text
- [ ] Keyboard navigable (Tab, Enter, Arrows)
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] Screen reader tested
- [ ] ARIA used only when needed

**Source**: `/docs/ui/accessibility.md`
