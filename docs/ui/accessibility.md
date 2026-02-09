---
title: Accessibility
layout: doc
slug: accessibility
---

# Accessibility

> - Ensuring web content is usable by people with disabilities
> - Semantic HTML, ARIA attributes, and keyboard navigation
> - Screen reader compatibility and alternative content

## Key Insight

Accessibility (a11y) isn't an "add-on" feature—it's fundamental architecture. Using semantic HTML (`<button>` not `<div onclick>`) gives you keyboard navigation, focus management, and screen reader support for free. ARIA attributes don't add functionality; they add semantics for assistive technology when semantic HTML doesn't exist (`<div role="button">` tells screen readers it's a button, but you still need to add keyboard handlers). The four POUR principles guide everything: **P**erceivable (alternative text for images), **O**perable (keyboard navigation), **U**nderstandable (clear labels, error messages), **R**obust (works with assistive technology). Most accessibility bugs stem from three mistakes: non-semantic HTML (`<div>` instead of `<button>`), missing ARIA labels, and forgetting keyboard users exist.

## Detailed Description

Web accessibility means designing and developing websites, tools, and technologies so that people with disabilities can use them. This includes various types of disabilities: auditory, cognitive, neurological, physical, speech, and visual. Accessibility also benefits people without disabilities, such as mobile device users, older individuals, and those with temporary or situational limitations (broken arm, bright sunlight on screen).

**Why Accessibility Matters:**

1. **Legal compliance**: Many countries require accessibility (ADA in US, EAA in EU)
2. **Larger audience**: 15% of world population has some form of disability
3. **Better UX for everyone**: Captions help in noisy environments, high contrast helps in sunlight
4. **SEO benefits**: Semantic HTML and alt text improve search rankings
5. **Ethical responsibility**: The web should be accessible to all

**Core Principles (POUR):**

1. **Perceivable**: Information must be presentable to users in ways they can perceive
   - Alternative text for images
   - Captions for videos
   - Sufficient color contrast
   
2. **Operable**: UI components must be operable
   - Keyboard accessible
   - Enough time to read/use content
   - No content that causes seizures
   
3. **Understandable**: Information and UI operation must be understandable
   - Readable text
   - Predictable behavior
   - Input assistance (error messages, labels)
   
4. **Robust**: Content must work with current and future assistive technologies
   - Valid HTML
   - ARIA attributes
   - Progressive enhancement

**Key Technologies:**

- **Semantic HTML**: Use the right element for the job
- **ARIA (Accessible Rich Internet Applications)**: Adds semantics when HTML falls short
- **Keyboard Navigation**: Tab, Enter, Space, Arrow keys
- **Screen Readers**: NVDA, JAWS, VoiceOver, TalkBack
- **Color Contrast**: WCAG AA (4.5:1 normal text, 3:1 large text)

## References
- [1] https://www.w3.org/WAI/fundamentals/accessibility-intro/
## Code Examples

### Basic Example: Semantic HTML vs Non-Semantic HTML

```html
<!-- ❌ BAD: Non-semantic, inaccessible -->
<div class="button" onclick="submitForm()">Submit</div>
<div class="link" onclick="navigate()">Read more</div>
<div class="checkbox" onclick="toggle()">
  <span class="checkmark"></span>
  Accept terms
</div>

<script>
// Missing keyboard support, focus management, screen reader announcements
function submitForm() {
  console.log('Form submitted');
}
</script>

<!-- ✅ GOOD: Semantic HTML with built-in accessibility -->
<button type="submit" onclick="submitForm()">Submit</button>
<a href="/article">Read more</a>
<label>
  <input type="checkbox" name="terms">
  Accept terms
</label>

<!-- Automatic benefits:
  - Keyboard navigation (Tab to focus, Enter/Space to activate)
  - Focus visible by default
  - Screen readers announce role and state
  - Form submission works natively
-->

<!-- Form accessibility -->
<form>
  <!-- ❌ BAD: No label association -->
  <div>Email</div>
  <input type="email" name="email">
  
  <!-- ✅ GOOD: Explicit label -->
  <label for="email-input">Email</label>
  <input type="email" id="email-input" name="email" required>
  
  <!-- ✅ GOOD: Implicit label -->
  <label>
    Password
    <input type="password" name="password" required>
  </label>
  
  <!-- Helper text and errors -->
  <label for="username">Username</label>
  <input
    type="text"
    id="username"
    name="username"
    aria-describedby="username-help username-error"
    aria-invalid="false">
  <span id="username-help" class="help-text">
    Must be 3-20 characters
  </span>
  <span id="username-error" role="alert" aria-live="polite"></span>
  
  <button type="submit">Create Account</button>
</form>
```

### Practical Example: ARIA Patterns for Custom Components

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessible Custom Components</title>
  <style>
    /* Focus visible styles */
    *:focus {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
    
    /* Skip to main content link */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
    }
    
    .skip-link:focus {
      top: 0;
    }
    
    /* Visually hidden but accessible to screen readers */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  </style>
</head>
<body>
  <!-- Skip link for keyboard users -->
  <a href="#main-content" class="skip-link">Skip to main content</a>
  
  <nav aria-label="Main navigation">
    <!-- Dropdown menu -->
    <button
      id="menu-button"
      aria-expanded="false"
      aria-controls="menu-list"
      aria-haspopup="true">
      Menu
      <span aria-hidden="true">▼</span>
    </button>
    
    <ul id="menu-list" role="menu" hidden>
      <li role="none">
        <a href="/home" role="menuitem">Home</a>
      </li>
      <li role="none">
        <a href="/about" role="menuitem">About</a>
      </li>
    </ul>
  </nav>
  
  <main id="main-content">
    <!-- Accessible modal dialog -->
    <button id="open-dialog">Open Dialog</button>
    
    <div
      id="dialog"
      role="dialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
      aria-modal="true"
      hidden>
      <h2 id="dialog-title">Confirm Action</h2>
      <p id="dialog-desc">Are you sure you want to proceed?</p>
      
      <button id="confirm-btn">Confirm</button>
      <button id="cancel-btn">Cancel</button>
    </div>
    
    <!-- Accessible tabs -->
    <div class="tabs">
      <div role="tablist" aria-label="Content sections">
        <button
          role="tab"
          aria-selected="true"
          aria-controls="panel-1"
          id="tab-1"
          tabindex="0">
          Tab 1
        </button>
        <button
          role="tab"
          aria-selected="false"
          aria-controls="panel-2"
          id="tab-2"
          tabindex="-1">
          Tab 2
        </button>
      </div>
      
      <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
        Content for tab 1
      </div>
      <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
        Content for tab 2
      </div>
    </div>
    
    <!-- Live region for announcements -->
    <div aria-live="polite" aria-atomic="true" class="sr-only" id="announcements"></div>
  </main>
  
  <script>
    // Accessible dropdown menu
    const menuButton = document.getElementById('menu-button');
    const menuList = document.getElementById('menu-list');
    
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      menuList.hidden = expanded;
      
      if (!expanded) {
        menuList.querySelector('[role="menuitem"]').focus();
      }
    });
    
    // Close menu on Escape
    menuList.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menuButton.setAttribute('aria-expanded', 'false');
        menuList.hidden = true;
        menuButton.focus();
      }
    });
    
    // Accessible modal dialog
    const openDialog = document.getElementById('open-dialog');
    const dialog = document.getElementById('dialog');
    const confirmBtn = document.getElementById('confirm-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    let previousFocus;
    
    openDialog.addEventListener('click', () => {
      previousFocus = document.activeElement;  // Save focus
      dialog.hidden = false;
      confirmBtn.focus();  // Move focus to dialog
      
      // Trap focus inside dialog
      document.addEventListener('keydown', trapFocus);
    });
    
    function closeDialog() {
      dialog.hidden = true;
      previousFocus.focus();  // Restore focus
      document.removeEventListener('keydown', trapFocus);
    }
    
    confirmBtn.addEventListener('click', closeDialog);
    cancelBtn.addEventListener('click', closeDialog);
    
    function trapFocus(e) {
      if (e.key === 'Tab') {
        const focusableElements = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === 'Escape') {
        closeDialog();
      }
    }
    
    // Accessible tabs with arrow key navigation
    const tabs = document.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        activateTab(index);
      });
      
      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        
        if (e.key === 'ArrowRight') {
          newIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          newIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          newIndex = 0;
        } else if (e.key === 'End') {
          newIndex = tabs.length - 1;
        } else {
          return;
        }
        
        e.preventDefault();
        activateTab(newIndex);
        tabs[newIndex].focus();
      });
    });
    
    function activateTab(index) {
      tabs.forEach((t, i) => {
        t.setAttribute('aria-selected', i === index);
        t.tabIndex = i === index ? 0 : -1;
      });
      
      panels.forEach((p, i) => {
        p.hidden = i !== index;
      });
      
      // Announce to screen readers
      document.getElementById('announcements').textContent = `Switched to ${tabs[index].textContent}`;
    }
  </script>
</body>
</html>
```

### Advanced Example: Accessible Data Table and Form Validation

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Accessible Table and Forms</title>
  <style>
    /* Error styling */
    .error {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    
    [aria-invalid="true"] {
      border-color: #d32f2f;
    }
    
    /* Table styling */
    table {
      border-collapse: collapse;
      width: 100%;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f0f0f0;
    }
    
    /* Sortable column indicator */
    th[aria-sort] {
      cursor: pointer;
      user-select: none;
    }
    
    th[aria-sort]::after {
      content: ' ⇅';
      color: #999;
    }
    
    th[aria-sort="ascending"]::after {
      content: ' ↑';
      color: #000;
    }
    
    th[aria-sort="descending"]::after {
      content: ' ↓';
      color: #000;
    }
  </style>
</head>
<body>
  <!-- Accessible form with validation -->
  <form id="registration-form" novalidate>
    <h2>Registration Form</h2>
    
    <!-- Required field with pattern validation -->
    <div>
      <label for="email">Email <span aria-label="required">*</span></label>
      <input
        type="email"
        id="email"
        name="email"
        required
        aria-required="true"
        aria-invalid="false"
        aria-describedby="email-error">
      <div id="email-error" role="alert" class="error"></div>
    </div>
    
    <!-- Password with requirements -->
    <div>
      <label for="password">
        Password <span aria-label="required">*</span>
      </label>
      <input
        type="password"
        id="password"
        name="password"
        required
        aria-required="true"
        aria-invalid="false"
        aria-describedby="password-help password-error"
        minlength="8">
      <div id="password-help" class="help-text">
        Must be at least 8 characters
      </div>
      <div id="password-error" role="alert" class="error"></div>
    </div>
    
    <!-- Fieldset for related inputs -->
    <fieldset>
      <legend>Contact Preference</legend>
      <label>
        <input type="radio" name="contact" value="email" required>
        Email
      </label>
      <label>
        <input type="radio" name="contact" value="phone">
        Phone
      </label>
    </fieldset>
    
    <button type="submit">Register</button>
    
    <!-- Form-level error summary -->
    <div id="error-summary" role="alert" aria-live="assertive" hidden>
      <h3>Please correct the following errors:</h3>
      <ul id="error-list"></ul>
    </div>
  </form>
  
  <!-- Accessible data table -->
  <table>
    <caption>User List (sortable)</caption>
    <thead>
      <tr>
        <th scope="col" aria-sort="none" data-column="name">
          Name
        </th>
        <th scope="col" aria-sort="none" data-column="email">
          Email
        </th>
        <th scope="col" aria-sort="none" data-column="role">
          Role
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Alice Johnson</th>
        <td>alice@example.com</td>
        <td>Admin</td>
      </tr>
      <tr>
        <th scope="row">Bob Smith</th>
        <td>bob@example.com</td>
        <td>User</td>
      </tr>
      <tr>
        <th scope="row">Carol White</th>
        <td>carol@example.com</td>
        <td>Editor</td>
      </tr>
    </tbody>
  </table>
  
  <script>
    // Form validation
    const form = document.getElementById('registration-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorSummary = document.getElementById('error-summary');
    const errorList = document.getElementById('error-list');
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const errors = [];
      
      // Validate email
      if (!emailInput.value) {
        errors.push({ field: emailInput, message: 'Email is required' });
      } else if (!emailInput.validity.valid) {
        errors.push({ field: emailInput, message: 'Email must be valid' });
      }
      
      // Validate password
      if (!passwordInput.value) {
        errors.push({ field: passwordInput, message: 'Password is required' });
      } else if (passwordInput.value.length < 8) {
        errors.push({ field: passwordInput, message: 'Password must be at least 8 characters' });
      }
      
      // Clear previous errors
      document.querySelectorAll('.error').forEach(el => el.textContent = '');
      document.querySelectorAll('[aria-invalid="true"]').forEach(el => {
        el.setAttribute('aria-invalid', 'false');
      });
      
      if (errors.length > 0) {
        // Show errors
        errorList.innerHTML = '';
        errors.forEach(({ field, message }) => {
          // Set field error
          const errorEl = document.getElementById(`${field.id}-error`);
          errorEl.textContent = message;
          field.setAttribute('aria-invalid', 'true');
          
          // Add to summary
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.href = `#${field.id}`;
          link.textContent = message;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            field.focus();
          });
          li.appendChild(link);
          errorList.appendChild(li);
        });
        
        errorSummary.hidden = false;
        errorSummary.focus();
      } else {
        errorSummary.hidden = true;
        console.log('Form submitted successfully');
      }
    });
    
    // Real-time validation on blur
    [emailInput, passwordInput].forEach(input => {
      input.addEventListener('blur', () => {
        const errorEl = document.getElementById(`${input.id}-error`);
        
        if (input.validity.valid) {
          input.setAttribute('aria-invalid', 'false');
          errorEl.textContent = '';
        }
      });
    });
    
    // Sortable table
    const headers = document.querySelectorAll('th[aria-sort]');
    
    headers.forEach(header => {
      header.addEventListener('click', () => {
        sortTable(header);
      });
      
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          sortTable(header);
        }
      });
    });
    
    function sortTable(header) {
      const currentSort = header.getAttribute('aria-sort');
      const newSort = currentSort === 'ascending' ? 'descending' : 'ascending';
      
      // Reset other headers
      headers.forEach(h => h.setAttribute('aria-sort', 'none'));
      header.setAttribute('aria-sort', newSort);
      
      // Sort logic would go here
      console.log(`Sorting ${header.dataset.column} ${newSort}`);
    }
  </script>
</body>
</html>
```

## Common Mistakes

### 1. Using `<div>` or `<span>` Instead of Semantic Elements
**Mistake:** Creating fake buttons/links with divs.

```html
<!-- ❌ BAD: No keyboard support, focus, or screen reader semantics -->
<div class="button" onclick="submit()">Submit</div>
<span class="link" onclick="navigate()">Read more</span>

<!-- User can't Tab to these, Enter doesn't work, screen reader says "Submit clickable" not "Submit button" -->

<!-- ✅ GOOD: Use semantic HTML -->
<button onclick="submit()">Submit</button>
<a href="/article">Read more</a>

<!-- If you MUST use div (rare), add all accessibility manually -->
<div
  role="button"
  tabindex="0"
  onclick="submit()"
  onkeydown="if(event.key==='Enter'||event.key===' ')submit()">
  Submit
</div>
```

**Why it matters:** Semantic HTML provides keyboard navigation, focus management, and screen reader support automatically.

### 2. Missing Alternative Text for Images
**Mistake:** No alt text or meaningless alt text.

```html
<!-- ❌ BAD: Screen reader says "image" (no context) -->
<img src="chart.png">

<!-- ❌ BAD: Meaningless alt text -->
<img src="chart.png" alt="image">
<img src="chart.png" alt="chart.png">

<!-- ❌ BAD: Redundant "image of" or "picture of" -->
<img src="chart.png" alt="Image of sales chart">

<!-- ✅ GOOD: Descriptive alt text -->
<img src="chart.png" alt="Sales increased 25% in Q4 2024">

<!-- ✅ GOOD: Decorative images (screen reader skips) -->
<img src="decoration.png" alt="" role="presentation">

<!-- ✅ GOOD: Complex images with longdesc -->
<img src="complex-chart.png" alt="Detailed sales data" aria-describedby="chart-desc">
<div id="chart-desc" class="sr-only">
  Sales data showing 25% increase in Q4, with largest growth in Europe region...
</div>
```

**Why it matters:** Screen reader users rely on alt text to understand images.

### 3. Missing ARIA Labels on Custom Components
**Mistake:** Interactive elements without accessible names.

```html
<!-- ❌ BAD: Screen reader says "button" (no label) -->
<button onclick="closeDialog()">
  <svg>...</svg>  <!-- Only an icon, no text -->
</button>

<!-- ✅ GOOD: aria-label for icon buttons -->
<button onclick="closeDialog()" aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- ✅ GOOD: Visually hidden text -->
<button onclick="closeDialog()">
  <span class="sr-only">Close dialog</span>
  <svg aria-hidden="true">...</svg>
</button>

<!-- ❌ BAD: No label for custom select -->
<div role="combobox" aria-expanded="false">
  <div class="selected-option">Choose...</div>
</div>

<!-- ✅ GOOD: Label association -->
<label id="country-label">Country</label>
<div
  role="combobox"
  aria-labelledby="country-label"
  aria-expanded="false">
  <div class="selected-option">Choose...</div>
</div>
```

**Why it matters:** Screen readers can't announce unlabeled interactive elements meaningfully.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between semantic HTML and ARIA?</summary>

**Answer:** **Semantic HTML adds functionality; ARIA only adds semantics for assistive technology.**

```html
<!-- Semantic HTML -->
<button onclick="handleClick()">Click me</button>
<!-- Automatically gets:
  - Keyboard navigation (Tab, Enter, Space)
  - Focus visible
  - Screen reader announces "Click me, button"
  - Native button behavior
-->

<!-- ARIA on div (you must add everything manually) -->
<div
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="if(event.key==='Enter'||event.key===' ')handleClick()">
  Click me
</div>
<!-- ARIA role="button" tells screen reader it's a button,
     but YOU must add keyboard handlers, focus, etc. -->
```

**When to use ARIA:**
- Custom widgets without semantic HTML equivalent (tabs, accordions, tree views)
- Enhanced semantics (`aria-current="page"`, `aria-expanded`, `aria-invalid`)
- Live regions (`aria-live="polite"` for announcements)

**First rule of ARIA: Don't use ARIA**
- Use semantic HTML when possible
- ARIA doesn't change behavior, only semantics
- Incorrect ARIA is worse than no ARIA

**Why it matters:** ARIA is a last resort. Semantic HTML is simpler and more robust.
</details>

<details>
<summary><strong>Question 2:</strong> How do you make a custom dropdown accessible?</summary>

**Answer:** **Use roles, keyboard navigation, focus management, and ARIA states.**

```html
<label id="fruit-label">Choose a fruit</label>

<div class="dropdown">
  <!-- Button to open dropdown -->
  <button
    id="fruit-button"
    aria-labelledby="fruit-label"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="fruit-list">
    Select fruit
    <span aria-hidden="true">▼</span>
  </button>
  
  <!-- Listbox (hidden by default) -->
  <ul
    id="fruit-list"
    role="listbox"
    aria-labelledby="fruit-label"
    tabindex="-1"
    hidden>
    <li role="option" data-value="apple">Apple</li>
    <li role="option" data-value="banana">Banana</li>
    <li role="option" data-value="orange">Orange</li>
  </ul>
</div>

<script>
const button = document.getElementById('fruit-button');
const listbox = document.getElementById('fruit-list');
const options = listbox.querySelectorAll('[role="option"]');
let selectedIndex = -1;

// Open/close on click
button.addEventListener('click', () => {
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', !expanded);
  listbox.hidden = expanded;
  
  if (!expanded) {
    listbox.focus();  // Move focus to listbox
  }
});

// Keyboard navigation in listbox
listbox.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, options.length - 1);
    focusOption(selectedIndex);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    focusOption(selectedIndex);
  } else if (e.key === 'Enter') {
    selectOption(selectedIndex);
  } else if (e.key === 'Escape') {
    closeDropdown();
  }
});

function focusOption(index) {
  options.forEach((opt, i) => {
    opt.setAttribute('aria-selected', i === index);
  });
  options[index].scrollIntoView({ block: 'nearest' });
}

function selectOption(index) {
  button.textContent = options[index].textContent;
  closeDropdown();
}

function closeDropdown() {
  button.setAttribute('aria-expanded', 'false');
  listbox.hidden = true;
  button.focus();  // Return focus to button
}
</script>
```

**Why it matters:** Custom dropdowns without proper accessibility are unusable to keyboard and screen reader users.
</details>

<details>
<summary><strong>Question 3:</strong> How do you trap focus in a modal dialog?</summary>

**Answer:** **Save previous focus, move focus into modal, trap Tab key, restore focus on close.**

```javascript
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  const previousFocus = document.activeElement;  // Save current focus
  
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  
  // Get focusable elements in modal
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // Move focus to first element in modal
  firstElement.focus();
  
  // Trap focus
  function trapFocus(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {  // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();  // Wrap to last element
        }
      } else {  // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();  // Wrap to first element
        }
      }
    } else if (e.key === 'Escape') {
      closeModal();
    }
  }
  
  modal.addEventListener('keydown', trapFocus);
  
  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.removeEventListener('keydown', trapFocus);
    previousFocus.focus();  // Restore focus to trigger element
  }
  
  // Close button
  modal.querySelector('.close-button').addEventListener('click', closeModal);
}
```

**Why it matters:** Without focus trap, Tab moves focus behind modal, confusing users and breaking keyboard navigation.
</details>

<details>
<summary><strong>Question 4:</strong> What are ARIA live regions and when should you use them?</summary>

**Answer:** **ARIA live regions announce dynamic content changes to screen readers.**

```html
<!-- Polite announcements (wait for user to pause) -->
<div aria-live="polite" aria-atomic="true" class="sr-only" id="status">
  <!-- Screen reader announces when content changes -->
</div>

<!-- Assertive announcements (interrupt immediately) -->
<div aria-live="assertive" aria-atomic="true" class="sr-only" id="alert">
  <!-- For urgent messages -->
</div>

<script>
// Use case 1: Form validation errors
function showError(message) {
  const alert = document.getElementById('alert');
  alert.textContent = message;
  // Screen reader announces immediately: "Error: Email is required"
}

// Use case 2: Search results loading
function updateSearchStatus(count) {
  const status = document.getElementById('status');
  status.textContent = `Found ${count} results`;
  // Screen reader announces when user pauses: "Found 42 results"
}

// Use case 3: Adding items to cart
function addToCart(productName) {
  const status = document.getElementById('status');
  status.textContent = `${productName} added to cart`;
  // Announces: "Laptop added to cart"
}

// Use case 4: Loading states
async function loadData() {
  const status = document.getElementById('status');
  status.textContent = 'Loading...';
  
  const data = await fetch('/api/data');
  status.textContent = 'Data loaded successfully';
}
</script>

<!-- aria-atomic="true" vs "false" -->
<div aria-live="polite" aria-atomic="true">
  <span>Items:</span> <span id="count">5</span>
  <!-- aria-atomic="true": Announces entire region ("Items: 5") -->
</div>

<div aria-live="polite" aria-atomic="false">
  <span>Items:</span> <span id="count">5</span>
  <!-- aria-atomic="false": Announces only changed node ("5") -->
</div>

<!-- role="alert" (shorthand for aria-live="assertive") -->
<div role="alert">
  Form submitted successfully!
  <!-- Auto-announces immediately -->
</div>

<!-- role="status" (shorthand for aria-live="polite") -->
<div role="status">
  5 items in cart
  <!-- Announces when user pauses -->
</div>
```

**When to use:**
- Form validation errors (assertive)
- Loading states (polite)
- Search result counts (polite)
- Success messages (polite/assertive depending on urgency)

**Why it matters:** Without live regions, screen reader users miss dynamic content updates.
</details>

<details>
<summary><strong>Question 5:</strong> How do you ensure sufficient color contrast?</summary>

**Answer:** **Follow WCAG AA contrast ratios: 4.5:1 for normal text, 3:1 for large text.**

```css
/* ❌ BAD: Insufficient contrast */
.bad-contrast {
  color: #888;  /* Light gray text */
  background: #fff;  /* White background */
  /* Contrast: 2.85:1 (fails WCAG AA) */
}

/* ✅ GOOD: Sufficient contrast */
.good-contrast {
  color: #333;  /* Dark gray text */
  background: #fff;  /* White background */
  /* Contrast: 12.63:1 (passes WCAG AAA) */
}

/* Large text (18pt+ or 14pt+ bold) needs only 3:1 */
.large-text {
  font-size: 24px;
  color: #767676;  /* Medium gray */
  background: #fff;
  /* Contrast: 4.54:1 (passes WCAG AA for large text) */
}

/* Button states must also have sufficient contrast */
.button {
  color: #fff;
  background: #0066cc;  /* Blue background */
  /* Contrast: 8.59:1 (passes) */
}

.button:hover {
  background: #0052a3;  /* Darker blue */
  /* Must still maintain 4.5:1 */
}

.button:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  /* Focus indicator must have 3:1 contrast with background */
}

/* ❌ BAD: Relying only on color */
.error {
  color: red;  /* Color-blind users can't distinguish */
}

/* ✅ GOOD: Color + icon/text */
.error {
  color: #d32f2f;
  /* Also add icon or text label */
}

.error::before {
  content: '⚠ ';
  /* Icon provides additional cue */
}

/* Check contrast with browser DevTools or online tools:
   - Chrome DevTools (Inspect > Accessibility pane)
   - WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
   - Stark plugin for Figma/Sketch
*/
```

**WCAG Levels:**
- **AA (minimum)**: 4.5:1 normal text, 3:1 large text (18pt+ or 14pt+ bold)
- **AAA (enhanced)**: 7:1 normal text, 4.5:1 large text

**Why it matters:** Low contrast makes text unreadable for users with low vision or color blindness.
</details>

## References

- [1] https://www.w3.org/WAI/fundamentals/accessibility-intro/
