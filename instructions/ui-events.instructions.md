---
description: Guidance for Events - user interaction and browser notification handling
name: Events - UI
applyTo: |
  **/components/**/*.{jsx,tsx,vue,js,ts}
  **/ui/**/*.{jsx,tsx,vue,js,ts}
---

# Events Instructions

## What are Events?

Events are browser notifications that "something happened"—clicks, keypresses, scrolls, form submissions, and hundreds more. They transform static pages into interactive applications.

## Key Principles

1. **Event Propagation**: Events flow through DOM in three phases: Capturing (down) → Target → Bubbling (up). Use `stopPropagation()` carefully.

2. **Event Delegation**: Attach one listener to parent, handle events from children via `event.target`. More efficient than listeners on every child.

3. **preventDefault vs stopPropagation**: `preventDefault()` stops browser default (link navigation, form submit). `stopPropagation()` stops event from reaching other listeners.

## Best Practices

✅ **DO**:
- Use event delegation for dynamic/many elements
- Clean up listeners on component unmount
- Use `event.target` to identify source element
- Handle keyboard events for accessibility
- Use passive listeners for scroll/touch (`{ passive: true }`)

❌ **DON'T**:
- Add listeners to every list item (use delegation)
- Forget to remove listeners (memory leaks)
- Ignore keyboard users (click + Enter/Space)
- Block scroll with non-passive listeners
- Use inline `onclick` attributes (use addEventListener)

## Code Patterns

### Event Delegation

```javascript
// ❌ WRONG - Listener on every item
items.forEach(item => {
  item.addEventListener('click', handleClick);
});

// ✅ CORRECT - Event delegation
list.addEventListener('click', (event) => {
  const item = event.target.closest('.item');
  if (item) {
    handleClick(item.dataset.id);
  }
});
```

### Keyboard Accessibility

```javascript
// Handle both click and keyboard
button.addEventListener('click', handleAction);
button.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleAction();
  }
});
```

### React Event Handling

```jsx
const Button = ({ onClick }) => {
  const handleClick = (event) => {
    // React synthetic event
    console.log('Target:', event.target);
    console.log('Current target:', event.currentTarget);
    onClick?.();
  };
  
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClick?.();
    }
  };
  
  return (
    <button onClick={handleClick} onKeyDown={handleKeyDown}>
      Click or Press Enter
    </button>
  );
};
```

### Cleanup Pattern

```jsx
// React useEffect cleanup
useEffect(() => {
  const handleScroll = () => { /* ... */ };
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### Prevent Defaults

```javascript
// Prevent form submission reload
form.addEventListener('submit', (event) => {
  event.preventDefault();
  // Handle form data via JavaScript
});

// Prevent link navigation
link.addEventListener('click', (event) => {
  event.preventDefault();
  // Handle navigation via router
});
```

## Related Terminologies

- **DOM** (UI) - Events propagate through DOM tree
- **Component** (UI) - Components handle events
- **Props** (UI) - Event callbacks passed as props
- **Accessibility** (UI) - Keyboard events for a11y

## Quality Gates

- [ ] Event delegation used for lists
- [ ] Listeners cleaned up on unmount
- [ ] Keyboard events for accessibility
- [ ] preventDefault/stopPropagation used correctly
- [ ] Passive listeners for scroll/touch

**Source**: `/docs/ui/events.md`
