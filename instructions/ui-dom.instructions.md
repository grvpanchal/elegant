---
description: Guidance for DOM - Document Object Model manipulation and understanding
name: DOM - UI
applyTo: |
  **/components/**/*.{jsx,tsx,vue,js,ts}
  **/ui/**/*.{jsx,tsx,vue,js,ts}
---

# DOM Instructions

## What is the DOM?

The DOM (Document Object Model) is the browser's in-memory tree structure representing your webpage. It's not the HTML file—it's the live, manipulable representation that JavaScript modifies and the browser renders.

## Key Principles

1. **HTML vs DOM**: HTML is source code; DOM is the running program. "View Source" shows HTML, "Inspect Element" shows current DOM (which frameworks like React heavily modify).

2. **Live Updates**: DOM changes immediately reflect on screen. Modify `element.textContent` and users see the change instantly.

3. **Tree Structure**: DOM mirrors HTML nesting—elements have parents, children, siblings. Traversal follows this tree.

## Best Practices

✅ **DO**:
- Use `querySelector`/`querySelectorAll` for selection
- Prefer `textContent` over `innerHTML` for text (security)
- Batch DOM operations to minimize reflows
- Use document fragments for multiple insertions
- Let frameworks handle DOM when using React/Vue/Angular

❌ **DON'T**:
- Directly manipulate DOM when using frameworks (breaks reconciliation)
- Use `innerHTML` with user input (XSS vulnerability)
- Read layout properties in loops (causes reflows)
- Forget that DOM operations are expensive
- Mix framework virtual DOM with direct DOM manipulation

## Code Patterns

### Recommended

```javascript
// Selection
const element = document.querySelector('.my-class');
const elements = document.querySelectorAll('.item');
const byId = document.getElementById('unique-id');

// Reading
const text = element.textContent;
const html = element.innerHTML;
const attr = element.getAttribute('data-id');

// Modifying
element.textContent = 'New text';
element.classList.add('active');
element.setAttribute('data-loaded', 'true');

// Creating elements
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello';
newDiv.className = 'card';
parent.appendChild(newDiv);

// Efficient batch insertion
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item.name;
  fragment.appendChild(li);
});
list.appendChild(fragment);  // Single DOM update
```

### Framework Integration

```jsx
// React: Use refs for DOM access, not direct manipulation
const MyComponent = () => {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();  // Safe DOM access via ref
  };
  
  return <input ref={inputRef} />;
};

// ❌ WRONG in React
document.querySelector('.my-input').value = 'text';  // Breaks React!

// ✅ CORRECT in React
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />
```

## Related Terminologies

- **Element** (UI) - Framework elements become DOM nodes
- **Component** (UI) - Components render to DOM
- **Events** (UI) - DOM events trigger handlers
- **Attributes** (UI) - Attributes configure DOM elements

## Quality Gates

- [ ] Let frameworks manage DOM when using them
- [ ] Use refs for necessary direct DOM access
- [ ] Batch operations for performance
- [ ] Avoid innerHTML with untrusted content
- [ ] Understand virtual DOM vs real DOM

**Source**: `/docs/ui/dom.md`
