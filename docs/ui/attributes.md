---
title: Attributes
layout: doc
slug: attributes
---

# Attributes

> - Additional configuration for HTML elements
> - Control element behavior and provide metadata
> - Bridge between HTML structure and browser/JavaScript behavior

## Key Insight

Attributes are the "settings panel" for HTML elements—they don't change what an element is (a button is still a button), but they configure how it behaves, looks, and interacts with JavaScript. Understanding the difference between HTML attributes (in markup) and DOM properties (in JavaScript) is crucial: `<input value="hello">` sets the attribute (initial value), but when users type, they're changing the property (current value). This distinction breaks countless beginners who wonder why `getAttribute('value')` doesn't return the current input text. Mastering attributes, data attributes, ARIA attributes, and the attribute/property relationship is essential for accessibility, data binding, and framework integration.

## Detailed Description

Elements in HTML have attributes; these are additional values that configure the elements or adjust their behavior in various ways to meet the criteria the users want. Attributes appear in the opening tag and consist of a name and (usually) a value.

Attributes serve multiple purposes: some control element behavior (disabled, required), others provide metadata (id, class), some enable accessibility (aria-label, role), and others store custom data (data-* attributes). The browser parses attributes into DOM properties, but attributes and properties are not always synchronized—this is a common source of bugs.

Key categories of attributes:
1. **Boolean attributes** - Present = true, absent = false (disabled, checked, required)
2. **Enumerated attributes** - Limited set of values (type, method, autocomplete)
3. **Global attributes** - Work on any element (id, class, style, data-*)
4. **Event handler attributes** - Inline event handlers (onclick, onchange) [discouraged]
5. **ARIA attributes** - Accessibility information (aria-label, aria-hidden, role)
6. **Data attributes** - Custom data storage (data-user-id, data-config)

## Code Examples

### Basic Example: Boolean and Standard Attributes

```html
<!-- Boolean Attributes -->
<input type="text" required>  <!-- required=true (attribute present) -->
<input type="checkbox" checked>  <!-- checked=true -->
<button disabled>Submit</button>  <!-- disabled=true -->
<input type="text" readonly value="Cannot edit">  <!-- readonly=true -->

<!-- Valid boolean attribute syntax -->
<input required>  <!-- Recommended: no value -->
<input required="">  <!-- Valid: empty string -->
<input required="required">  <!-- Valid but verbose -->

<!-- INVALID boolean syntax -->
<input required="false">  <!-- Still true! Attribute is present -->
<input required="0">  <!-- Still true! -->

<!-- Standard Attributes -->
<img src="photo.jpg" alt="Description" width="300" height="200">
<a href="https://example.com" target="_blank" rel="noopener">Link</a>
<input type="email" name="email" placeholder="Enter email" maxlength="50">

<!-- Global Attributes -->
<div id="unique-id" class="container active" title="Hover tooltip">
  <p lang="en" dir="ltr" tabindex="0">Text content</p>
</div>

<script>
  // Accessing attributes via JavaScript
  const input = document.querySelector('input[required]');
  
  // getAttribute/setAttribute (works with attributes)
  console.log(input.getAttribute('required'));  // "" (empty string)
  console.log(input.hasAttribute('required'));  // true
  input.removeAttribute('required');
  input.setAttribute('required', '');  // Set back
  
  // Property access (works with DOM properties)
  console.log(input.required);  // true (boolean)
  input.required = false;  // Remove via property
</script>
```

### Practical Example: Data Attributes and Custom Metadata

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Data Attributes Example</title>
</head>
<body>
  <!-- Data attributes for custom data storage -->
  <div id="product-card"
       data-product-id="12345"
       data-product-name="Laptop"
       data-price="999.99"
       data-in-stock="true"
       data-category="electronics">
    <h3>Laptop</h3>
    <p class="price">$999.99</p>
    <button class="add-to-cart">Add to Cart</button>
  </div>
  
  <ul id="user-list">
    <li data-user-id="1" data-role="admin" data-active="true">
      Alice
      <button class="edit-user">Edit</button>
    </li>
    <li data-user-id="2" data-role="user" data-active="false">
      Bob
      <button class="edit-user">Edit</button>
    </li>
  </ul>
  
  <script>
    // Accessing data attributes
    const productCard = document.getElementById('product-card');
    
    // Method 1: dataset API (recommended)
    console.log(productCard.dataset.productId);    // "12345"
    console.log(productCard.dataset.productName);  // "Laptop"
    console.log(productCard.dataset.price);        // "999.99"
    console.log(productCard.dataset.inStock);      // "true" (string!)
    
    // Setting data attributes
    productCard.dataset.onSale = 'true';
    productCard.dataset.discountPercent = '10';
    // Creates: data-on-sale="true" data-discount-percent="10"
    
    // Method 2: getAttribute (works too)
    console.log(productCard.getAttribute('data-product-id'));  // "12345"
    
    // Event delegation with data attributes
    const userList = document.getElementById('user-list');
    
    userList.addEventListener('click', (e) => {
      if (e.target.matches('.edit-user')) {
        const listItem = e.target.closest('li');
        const userId = listItem.dataset.userId;
        const role = listItem.dataset.role;
        const active = listItem.dataset.active === 'true';  // Parse string
        
        console.log(`Editing user ${userId} (${role}, active: ${active})`);
      }
    });
    
    // Add to cart with data attributes
    document.querySelector('.add-to-cart').addEventListener('click', () => {
      const product = {
        id: productCard.dataset.productId,
        name: productCard.dataset.productName,
        price: parseFloat(productCard.dataset.price),
        inStock: productCard.dataset.inStock === 'true'
      };
      
      console.log('Adding to cart:', product);
    });
  </script>
</body>
</html>
```

### Advanced Example: ARIA Attributes and Accessibility

```html
<!-- ARIA Attributes for Accessibility -->
<nav role="navigation" aria-label="Main navigation">
  <button
    aria-expanded="false"
    aria-controls="mobile-menu"
    aria-label="Toggle navigation menu"
    id="menu-toggle">
    <span aria-hidden="true">☰</span>
  </button>
  
  <ul id="mobile-menu" aria-labelledby="menu-toggle" hidden>
    <li><a href="/home">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<!-- Form with ARIA live regions -->
<form>
  <label for="username">
    Username
    <span aria-live="polite" aria-atomic="true" id="username-error"></span>
  </label>
  <input
    type="text"
    id="username"
    aria-required="true"
    aria-invalid="false"
    aria-describedby="username-help">
  <p id="username-help" class="help-text">
    Must be 3-20 characters
  </p>
  
  <button type="submit" aria-busy="false">Submit</button>
</form>

<!-- Tab panel with ARIA -->
<div role="tablist" aria-label="Content tabs">
  <button
    role="tab"
    aria-selected="true"
    aria-controls="panel-1"
    id="tab-1">
    Tab 1
  </button>
  <button
    role="tab"
    aria-selected="false"
    aria-controls="panel-2"
    id="tab-2">
    Tab 2
  </button>
</div>

<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  Content for tab 1
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
  Content for tab 2
</div>

<script>
  // Managing ARIA attributes dynamically
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    menuToggle.setAttribute('aria-expanded', !expanded);
    mobileMenu.hidden = expanded;
  });
  
  // Form validation with ARIA
  const usernameInput = document.getElementById('username');
  const usernameError = document.getElementById('username-error');
  
  usernameInput.addEventListener('blur', () => {
    const value = usernameInput.value;
    
    if (value.length < 3 || value.length > 20) {
      usernameInput.setAttribute('aria-invalid', 'true');
      usernameError.textContent = 'Username must be 3-20 characters';
    } else {
      usernameInput.setAttribute('aria-invalid', 'false');
      usernameError.textContent = '';
    }
  });
  
  // Tab switching with ARIA
  document.querySelectorAll('[role="tab"]').forEach(tab => {
    tab.addEventListener('click', () => {
      // Deselect all tabs
      document.querySelectorAll('[role="tab"]').forEach(t => {
        t.setAttribute('aria-selected', 'false');
      });
      
      // Select clicked tab
      tab.setAttribute('aria-selected', 'true');
      
      // Show corresponding panel
      document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
        panel.hidden = true;
      });
      
      const panelId = tab.getAttribute('aria-controls');
      document.getElementById(panelId).hidden = false;
    });
  });
</script>
```

## Common Mistakes

### 1. Confusing Attributes with Properties
**Mistake:** Expecting attribute changes to always sync with properties.

```html
<input type="text" value="initial">

<script>
// ❌ Misunderstanding attribute/property relationship
const input = document.querySelector('input');

// User types "hello" in the input
console.log(input.value);  // "hello" (property - current value)
console.log(input.getAttribute('value'));  // "initial" (attribute - HTML value)

// Attribute doesn't update with user input!
input.value = 'new value';  // Changes property
console.log(input.getAttribute('value'));  // Still "initial"

// ✅ Correct understanding
console.log('Current value (property):', input.value);
console.log('Initial value (attribute):', input.getAttribute('value'));

// Set both if needed
input.value = 'new value';  // Update property (what user sees)
input.setAttribute('value', 'new value');  // Update attribute (HTML)
</script>
```

**Why it matters:** Attributes are initial values; properties are current values. They diverge for certain attributes like `value`, `checked`.

### 2. Treating Boolean Attributes as Strings
**Mistake:** Setting boolean attributes to "false" thinking it disables them.

```html
<!-- ❌ BAD: All these are TRUE -->
<input required="false">  <!-- Attribute present = true! -->
<input disabled="no">  <!-- Still disabled! -->
<button disabled="0">Submit</button>  <!-- Still disabled! -->

<script>
// ❌ BAD: Setting string "false"
button.setAttribute('disabled', 'false');  // Still disabled!

// ✅ GOOD: Remove attribute to set false
button.removeAttribute('disabled');  // Now enabled

// Or use property (better)
button.disabled = false;  // Removes attribute
button.disabled = true;   // Adds attribute
</script>
```

**Why it matters:** Boolean attributes are true if present, regardless of value. Remove attribute or use property = false.

### 3. Not Hyphenating data Attribute Names
**Mistake:** Using camelCase in HTML instead of kebab-case.

```html
<!-- ❌ BAD: Won't work as expected -->
<div data-userId="123"></div>

<script>
const div = document.querySelector('div');

// Doesn't work - attribute name is case-insensitive in HTML
console.log(div.dataset.userId);  // undefined!

// HTML normalized it to lowercase
console.log(div.getAttribute('data-userid'));  // "123"
console.log(div.dataset.userid);  // "123"
</script>

<!-- ✅ GOOD: Use kebab-case in HTML -->
<div data-user-id="123"></div>

<script>
// dataset converts to camelCase
console.log(div.dataset.userId);  // "123" ✓
</script>
```

**Why it matters:** HTML attributes are case-insensitive. Use kebab-case in HTML, access as camelCase via dataset.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between attributes and properties?</summary>

**Answer:** **Attributes are in HTML; properties are in JavaScript DOM objects:**

```html
<input type="text" value="initial" class="input-field">

<script>
const input = document.querySelector('input');

// ATTRIBUTES (in HTML, via getAttribute/setAttribute)
console.log(input.getAttribute('value'));  // "initial"
console.log(input.getAttribute('class'));  // "input-field"
console.log(input.getAttribute('type'));   // "text"

// PROPERTIES (in JavaScript DOM object)
console.log(input.value);      // "initial" (initially)
console.log(input.className);  // "input-field" (note: className not class)
console.log(input.type);       // "text"

// User types "hello"
// Property changes, attribute doesn't
console.log(input.value);               // "hello" (property updated)
console.log(input.getAttribute('value'));  // "initial" (attribute unchanged)

// Some properties sync both ways
input.className = 'new-class';
console.log(input.getAttribute('class'));  // "new-class" (synced)

// Some are one-way (property → attribute)
input.id = 'my-input';
console.log(input.getAttribute('id'));  // "my-input" (synced)

// Some don't sync (value, checked)
input.value = 'changed';
console.log(input.getAttribute('value'));  // Still "initial"
</script>
```

**Key differences:**
- **Attributes**: HTML strings, case-insensitive, initial values
- **Properties**: JavaScript values (any type), case-sensitive, current values

**Why it matters:** Frameworks use properties for data binding. Understanding attribute/property relationship prevents bugs.
</details>

<details>
<summary><strong>Question 2:</strong> How do boolean attributes work?</summary>

**Answer:** **Presence = true, absence = false. Value doesn't matter:**

```html
<!-- All these are TRUE (disabled) -->
<button disabled>Button 1</button>
<button disabled="">Button 2</button>
<button disabled="disabled">Button 3</button>
<button disabled="false">Button 4</button>  <!-- Still true! -->
<button disabled="no">Button 5</button>     <!-- Still true! -->

<!-- Only this is FALSE (enabled) -->
<button>Button 6</button>  <!-- No disabled attribute -->

<script>
const button = document.querySelector('button');

// Check boolean attribute
if (button.hasAttribute('disabled')) {
  console.log('Disabled!');
}

// Or use property (returns actual boolean)
if (button.disabled) {
  console.log('Disabled!');
}

// Setting boolean attributes

// ❌ WRONG
button.setAttribute('disabled', 'false');  // Still true! Attribute present
button.setAttribute('disabled', false);    // Still true! Converts to string "false"

// ✅ RIGHT
button.removeAttribute('disabled');  // Now false (absent)
button.setAttribute('disabled', '');  // Now true (present)

// Or use property (recommended)
button.disabled = true;   // Adds attribute
button.disabled = false;  // Removes attribute

console.log(button.hasAttribute('disabled'));  // false
console.log(button.disabled);  // false
</script>
```

**Common boolean attributes:**
- `checked`, `disabled`, `readonly`, `required`
- `selected`, `hidden`, `multiple`
- `autofocus`, `autoplay`, `loop`, `muted`

**Why it matters:** Setting boolean attribute to "false" string doesn't disable it. Use property or removeAttribute.
</details>

<details>
<summary><strong>Question 3:</strong> What are data attributes and when should you use them?</summary>

**Answer:** **data-* attributes store custom data on elements without polluting namespace:**

```html
<!-- Store custom data -->
<article
  data-post-id="12345"
  data-author="Alice"
  data-published="2024-01-10"
  data-tags="javascript,html,css"
  data-likes="42">
  <h2>Article Title</h2>
</article>

<script>
const article = document.querySelector('article');

// Access via dataset (camelCase)
console.log(article.dataset.postId);     // "12345"
console.log(article.dataset.author);     // "Alice"
console.log(article.dataset.published);  // "2024-01-10"
console.log(article.dataset.tags);       // "javascript,html,css"
console.log(article.dataset.likes);      // "42" (string!)

// Set data attributes
article.dataset.likes = '43';
article.dataset.viewCount = '100';
// Creates: data-likes="43" data-view-count="100"

// Parse data as needed
const likes = parseInt(article.dataset.likes);
const tags = article.dataset.tags.split(',');
const publishedDate = new Date(article.dataset.published);

// Delete data attribute
delete article.dataset.likes;
// Or
article.removeAttribute('data-likes');
</script>
```

**When to use data attributes:**

**✅ Good use cases:**
```javascript
// 1. Store IDs for event delegation
<button class="delete" data-item-id="123">Delete</button>

// 2. Configuration for JavaScript
<div data-carousel data-auto-play="true" data-interval="3000"></div>

// 3. State management
<div data-state="loading" data-progress="50"></div>

// 4. Metadata for analytics
<button data-track="click" data-category="cta" data-label="signup">Sign Up</button>
```

**❌ Avoid:**
```javascript
// Don't store large objects (use JavaScript variables)
data-config='{"users":[...1000 items...]}'

// Don't store sensitive data (visible in HTML)
data-password="secret123"
data-api-key="abc123xyz"

// Don't use instead of semantic HTML
<div data-link="/about">About</div>  // Use <a href="/about">
```

**Why it matters:** data-* attributes provide clean way to attach custom data without conflicts or invalid HTML.
</details>

<details>
<summary><strong>Question 4:</strong> What are ARIA attributes and why are they important?</summary>

**Answer:** **ARIA (Accessible Rich Internet Applications) attributes improve accessibility for screen readers:**

```html
<!-- Button that toggles menu -->
<button
  id="menu-btn"
  aria-expanded="false"
  aria-controls="menu"
  aria-label="Open navigation menu">
  ☰
</button>

<nav id="menu" aria-labelledby="menu-btn" hidden>
  <!-- Menu items -->
</nav>

<script>
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
  
  // Toggle state
  menuBtn.setAttribute('aria-expanded', !expanded);
  menu.hidden = expanded;
  
  // Screen reader announces: "Open navigation menu, button, collapsed/expanded"
});
</script>

<!-- Form with validation -->
<label for="email">Email</label>
<input
  type="email"
  id="email"
  aria-required="true"
  aria-invalid="false"
  aria-describedby="email-error">
<span id="email-error" role="alert" aria-live="assertive"></span>

<!-- Custom dropdown -->
<div role="combobox" aria-expanded="false" aria-haspopup="listbox">
  <input type="text" aria-autocomplete="list">
  <ul role="listbox" hidden>
    <li role="option">Option 1</li>
    <li role="option" aria-selected="true">Option 2</li>
  </ul>
</div>

<!-- Loading state -->
<div aria-busy="true" aria-live="polite">
  Loading content...
</div>
```

**Common ARIA attributes:**

**States and Properties:**
- `aria-expanded` - Element is expanded/collapsed
- `aria-selected` - Element is selected
- `aria-checked` - Checkbox/radio state
- `aria-disabled` - Element is disabled
- `aria-invalid` - Input has validation error
- `aria-busy` - Element is loading

**Relationships:**
- `aria-labelledby` - Labeled by another element
- `aria-describedby` - Described by another element
- `aria-controls` - Controls another element
- `aria-owns` - Owns child elements

**Live Regions:**
- `aria-live="polite|assertive"` - Announces changes
- `aria-atomic="true|false"` - Announce entire region or changes

**Why it matters:** ARIA makes interactive JavaScript widgets accessible. Without ARIA, screen readers can't understand custom controls.
</details>

<details>
<summary><strong>Question 5:</strong> How do you avoid XSS vulnerabilities with attributes?</summary>

**Answer:** **Sanitize user input; avoid innerHTML and eval-like attributes:**

```javascript
// ❌ DANGEROUS: XSS vulnerability
const userInput = getUserInput();  // "<img src=x onerror=alert('XSS')>"

element.innerHTML = `<div class="${userInput}"></div>`;
// Executes script!

element.setAttribute('onclick', userInput);
// Executes script!

// ✅ SAFE: Escape or use textContent
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const safe = escapeHTML(userInput);
element.innerHTML = `<div class="${safe}"></div>`;
// Renders: <div class="&lt;img src=x onerror=alert('XSS')&gt;"></div>

// Or use textContent (safest)
element.textContent = userInput;

// Or create elements
const div = document.createElement('div');
div.className = userInput;  // Safe - treats as text
element.appendChild(div);

// Safe attribute setting
element.setAttribute('data-user-name', userInput);  // Safe
element.dataset.userName = userInput;  // Safe

// ❌ NEVER use user input in these attributes
element.setAttribute('onclick', userInput);  // Executes code!
element.setAttribute('href', userInput);     // javascript: URLs execute
element.setAttribute('src', userInput);      // Can load malicious scripts

// ✅ Validate and sanitize URLs
function isSafeURL(url) {
  const allowed = ['http:', 'https:', 'mailto:'];
  try {
    const parsed = new URL(url, window.location.href);
    return allowed.includes(parsed.protocol);
  } catch {
    return false;
  }
}

if (isSafeURL(userInput)) {
  link.href = userInput;
}
```

**Why it matters:** Unsanitized attributes enable XSS attacks. Always escape user input or use safe DOM methods.
</details>

## Boolean Attributes

Boolean Attributes (e.g. `required`, `readonly`, `disabled`). If a boolean attribute is present, its value is true, and if it's absent, its value is false. HTML defines restrictions on the allowed values of boolean attributes: If the attribute is present, its value must either be the empty string (equivalently, the attribute may have an unassigned value), or a value that is an ASCII case-insensitive match for the attribute's canonical name, with no leading or trailing whitespace.

To be clear, the values `"true"` and `"false"` are not allowed on boolean attributes. To represent a false value, the attribute has to be omitted altogether. This restriction clears up some common misunderstandings: With `checked="false"` for example, the element's `checked` attribute would be interpreted as `true` because the attribute is present.

The following examples are valid ways to mark up a boolean attribute:

```html
<div itemscope>This is valid HTML but invalid XML.</div>
<div itemscope="itemscope">This is also valid HTML but invalid XML.</div>
<div itemscope="">This is valid HTML and also valid XML.</div>
<div itemscope="itemscope">
  This is also valid HTML and XML, but perhaps a bit verbose.
</div>
```

## Event Handler Attributes

> `WARNING:` The use of event handler content attributes is discouraged. The mix of HTML and JavaScript often produces unmaintainable code, and the execution of event handler attributes may also be blocked by content security policies.

All event handler attributes accept a string. The string will be used to synthesize a JavaScript function like `function name(/*args*/) {body}`, where name is the attribute's `name`, and `body` is the attribute's value. The handler receives the same parameters as its JavaScript event handler counterpart — most handlers receive only one `event` parameter, while `onerror` receives five: `event`, `source`, `lineno`, `colno`, `error`. This means you can, in general, use the `event` variable within the attribute.

```html
<div onclick="console.log(event)">Click me!</div>
<!-- The synthesized handler has a name; you can reference itself -->
<div onclick="console.log(onclick)">Click me!</div>
```

## References

- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
