---
description: Guidance for Attributes - HTML element configuration and metadata
name: Attributes - UI
applyTo: |
  **/components/**/*.{jsx,tsx,vue,js,ts,html}
  **/ui/**/*.{jsx,tsx,vue,js,ts,html}
---

# Attributes Instructions

## What are Attributes?

Attributes are the "settings panel" for HTML elements—additional values that configure element behavior, provide metadata, or enable accessibility. They appear in opening tags as name-value pairs.

## Key Principles

1. **Attributes vs Properties**: HTML attributes (in markup) initialize DOM properties (in JS). `<input value="hello">` sets initial value, but `input.value` reflects current value after user types.

2. **Boolean Attributes**: Presence = true, absence = false. `<button disabled>` is disabled; `disabled="false"` is still disabled (attribute exists!).

3. **Data Attributes**: Use `data-*` for custom metadata that JavaScript can access. `data-user-id="123"` stores ID without non-standard attributes.

## Best Practices

✅ **DO**:
- Use semantic attributes (required, disabled, readonly)
- Add ARIA attributes for accessibility (aria-label, role)
- Use data attributes for custom metadata
- Understand attribute/property distinction
- Use `hasAttribute()` for boolean attributes

❌ **DON'T**:
- Use `disabled="false"` (boolean attributes don't work that way)
- Create non-standard attributes (use data-* instead)
- Forget ARIA labels on interactive elements
- Rely on attributes for frequently-changing values (use properties)

## Code Patterns

### Recommended

```html
<!-- Boolean attributes - presence means true -->
<input type="text" required>
<button disabled>Submit</button>
<input type="checkbox" checked>

<!-- Data attributes for custom data -->
<button 
  data-action="delete" 
  data-item-id="123"
  data-confirm="Are you sure?"
>
  Delete
</button>

<!-- ARIA for accessibility -->
<button 
  aria-label="Close dialog"
  aria-expanded="false"
>
  <span aria-hidden="true">×</span>
</button>
```

```javascript
// Accessing attributes in JavaScript
const btn = document.querySelector('[data-action="delete"]');

// Data attributes via dataset
const itemId = btn.dataset.itemId;  // "123"
const action = btn.dataset.action;  // "delete"

// Boolean attribute check
const input = document.querySelector('input');
console.log(input.hasAttribute('required'));  // true
console.log(input.required);  // true (property)
```

### Avoid

```html
<!-- ❌ WRONG - Boolean attribute with "false" value -->
<button disabled="false">Submit</button>  <!-- Still disabled! -->

<!-- ✅ CORRECT - Remove attribute entirely -->
<button>Submit</button>  <!-- Enabled -->
```

```jsx
// In React/JSX
// ❌ WRONG
<button disabled="false">Submit</button>  // Still disabled in HTML!

// ✅ CORRECT
<button disabled={false}>Submit</button>  // React handles this
<button>Submit</button>  // Or just omit
```

## Related Terminologies

- **Props** (UI) - Framework abstraction over attributes
- **Element** (UI) - Attributes configure elements
- **Accessibility** (UI) - ARIA attributes enable a11y
- **DOM** (UI) - Attributes become DOM properties

## Quality Gates

- [ ] Boolean attributes used correctly
- [ ] Custom data uses data-* attributes
- [ ] ARIA attributes for accessibility
- [ ] Attribute vs property distinction understood
- [ ] No non-standard attributes

**Source**: `/docs/ui/attributes.md`
