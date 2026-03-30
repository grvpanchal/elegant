---
title: DOM
layout: doc
slug: dom
---

# DOM

> - Tree structure representing HTML document
> - Browser API for manipulating page structure
> - Live representation updated by JavaScript

## Key Insight

The DOM is the "living blueprint" of your webpage—it's not the HTML file you wrote, but the browser's in-memory tree structure built from that HTML, and it changes in real-time as JavaScript manipulates it. When you `document.querySelector('.button')` and change its text, you're modifying the DOM (which updates the screen), not the original HTML file. Understanding this distinction is crucial: HTML is the source code, the DOM is the running program. That's why "View Source" shows your original HTML, but "Inspect Element" shows the current DOM (which might be completely different after React/Vue/Angular has manipulated it).

## Detailed Description

Document Object Model (DOM) is a set of APIs for controlling HTML and styling information that makes heavy use of the Document object. The document currently loaded in each one of your browser tabs is represented by a document object model. This is a "tree structure" representation created by the browser that enables the HTML structure to be easily accessed by programming languages.

The browser parses HTML into a tree of objects called nodes. Every HTML tag becomes an element node, text becomes a text node, and the document itself is the root node. This tree structure mirrors the nesting of HTML tags, creating parent-child relationships that JavaScript can traverse and manipulate.

Key aspects of the DOM:
1. **Tree structure** - Hierarchical representation of document elements
2. **Live updates** - Changes to DOM immediately reflect on screen
3. **Language-agnostic** - Defined as API, accessible from JavaScript, Python, etc.
4. **Event-driven** - Supports event listeners for user interaction
5. **Browser-managed** - Browser keeps DOM and screen in sync

## Code Examples

### Basic Example: DOM Traversal and Manipulation

```html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>DOM Manipulation Example</title>
  </head>
  <body>
    <section id="main">
      <h1>Welcome</h1>
      <p class="intro">This is an introduction.</p>
      <ul id="list">
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </section>
    
    <script>
      // Selecting elements
      const heading = document.querySelector('h1');
      const intro = document.querySelector('.intro');
      const list = document.getElementById('list');
      
      // Reading content
      console.log(heading.textContent);  // "Welcome"
      console.log(intro.innerHTML);  // "This is an introduction."
      
      // Modifying content
      heading.textContent = 'Hello, World!';
      intro.innerHTML = '<strong>Updated</strong> introduction.';
      
      // Creating and appending elements
      const newItem = document.createElement('li');
      newItem.textContent = 'Item 3';
      list.appendChild(newItem);
      
      // Modifying styles
      heading.style.color = 'blue';
      heading.style.fontSize = '2rem';
      
      // Modifying attributes
      intro.setAttribute('data-status', 'updated');
      
      // Removing elements
      const firstItem = list.querySelector('li');
      firstItem.remove();
    </script>
  </body>
</html>
```

### Practical Example: Dynamic Content and Event Handling

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Todo List - DOM Example</title>
  <style>
    .completed { text-decoration: line-through; color: gray; }
    .todo-item { cursor: pointer; margin: 0.5rem 0; }
  </style>
</head>
<body>
  <div id="app">
    <h1>Todo List</h1>
    <input type="text" id="todoInput" placeholder="Add new todo...">
    <button id="addBtn">Add</button>
    <ul id="todoList"></ul>
  </div>
  
  <script>
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    
    // Add todo function
    function addTodo() {
      const text = todoInput.value.trim();
      if (!text) return;
      
      // Create elements
      const li = document.createElement('li');
      li.className = 'todo-item';
      
      const span = document.createElement('span');
      span.textContent = text;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.style.marginLeft = '1rem';
      
      // Assemble DOM structure
      li.appendChild(span);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
      
      // Clear input
      todoInput.value = '';
      
      // Add event listeners
      span.addEventListener('click', () => {
        li.classList.toggle('completed');
      });
      
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();  // Prevent span click
        li.remove();
      });
    }
    
    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTodo();
    });
  </script>
</body>
</html>
```

### Advanced Example: DOM Performance and Fragment

```javascript
// Performance optimization with DocumentFragment
function renderLargeList(items) {
  const list = document.getElementById('large-list');
  
  // ❌ BAD: Causes reflow for each append
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li);  // Reflow!
  });
  
  // ✅ GOOD: Single reflow with DocumentFragment
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.name;
    fragment.appendChild(li);  // In memory, no reflow
  });
  
  list.appendChild(fragment);  // Single reflow
}

// DOM traversal patterns
function findElements() {
  const parent = document.querySelector('.container');
  
  // Children vs childNodes
  console.log(parent.children);  // HTMLCollection (element nodes only)
  console.log(parent.childNodes);  // NodeList (all nodes including text)
  
  // Siblings
  const first = parent.firstElementChild;
  const next = first.nextElementSibling;
  const prev = next.previousElementSibling;
  
  // Parent traversal
  const grandparent = first.parentElement.parentElement;
  
  // Closest (search up the tree)
  const card = first.closest('.card');
  
  // Query within element
  const buttons = parent.querySelectorAll('button');
}

// Observing DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList') {
      console.log('Child nodes changed:', mutation.addedNodes, mutation.removedNodes);
    } else if (mutation.type === 'attributes') {
      console.log('Attribute changed:', mutation.attributeName);
    }
  });
});

const targetNode = document.getElementById('observed');
observer.observe(targetNode, {
  childList: true,
  attributes: true,
  subtree: true  // Observe descendants too
});

// Virtual scrolling for large lists
class VirtualList {
  constructor(container, items, rowHeight) {
    this.container = container;
    this.items = items;
    this.rowHeight = rowHeight;
    
    this.visibleStart = 0;
    this.visibleEnd = 0;
    
    this.render();
    this.container.addEventListener('scroll', () => this.render());
  }
  
  render() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    // Calculate visible range
    this.visibleStart = Math.floor(scrollTop / this.rowHeight);
    this.visibleEnd = Math.ceil((scrollTop + containerHeight) / this.rowHeight);
    
    // Clear and render only visible items
    this.container.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    for (let i = this.visibleStart; i < this.visibleEnd; i++) {
      if (this.items[i]) {
        const div = document.createElement('div');
        div.style.height = `${this.rowHeight}px`;
        div.textContent = this.items[i];
        fragment.appendChild(div);
      }
    }
    
    this.container.appendChild(fragment);
  }
}
```

## Common Mistakes

### 1. Modifying DOM Inside Loops Without Batching
**Mistake:** Causing multiple reflows by manipulating DOM in loop.

```javascript
// ❌ BAD: Reflow on every iteration
const list = document.getElementById('list');
items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item.name;
  list.appendChild(li);  // Reflow! (100 items = 100 reflows)
});
// Causes layout thrashing, very slow
```

```javascript
// ✅ GOOD: Batch with DocumentFragment
const list = document.getElementById('list');
const fragment = document.createDocumentFragment();

items.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item.name;
  fragment.appendChild(li);  // In memory
});

list.appendChild(fragment);  // Single reflow
```

**Why it matters:** Each DOM append triggers reflow (recalculating layout). Batching reduces 1000 reflows to 1, improving performance 100x.

### 2. Using innerHTML for User-Generated Content
**Mistake:** Security vulnerability (XSS) when using innerHTML with untrusted data.

```javascript
// ❌ BAD: XSS vulnerability
const userInput = getUserInput();  // "<img src=x onerror=alert('XSS')>"
const div = document.getElementById('content');
div.innerHTML = userInput;  // Executes malicious script!
```

```javascript
// ✅ GOOD: Use textContent or createElement
const userInput = getUserInput();
const div = document.getElementById('content');
div.textContent = userInput;  // Safe - renders as text, not HTML

// Or for complex content
const p = document.createElement('p');
p.textContent = userInput;
div.appendChild(p);
```

**Why it matters:** innerHTML executes scripts in untrusted content, enabling XSS attacks. textContent treats content as plain text, preventing script execution.

### 3. Not Removing Event Listeners
**Mistake:** Memory leaks from orphaned event listeners.

```javascript
// ❌ BAD: Event listener not removed
function attachHandler() {
  const button = document.getElementById('btn');
  
  button.addEventListener('click', () => {
    console.log('Clicked');
  });
  
  button.remove();  // Button removed but listener still in memory!
}
// Repeated calls leak memory
```

```javascript
// ✅ GOOD: Remove listener before removing element
function attachHandler() {
  const button = document.getElementById('btn');
  
  function handleClick() {
    console.log('Clicked');
  }
  
  button.addEventListener('click', handleClick);
  
  // Later, when removing
  button.removeEventListener('click', handleClick);
  button.remove();
}

// Or use AbortController (modern approach)
const controller = new AbortController();

button.addEventListener('click', handleClick, {
  signal: controller.signal
});

// Clean up
controller.abort();  // Removes all listeners with this signal
button.remove();
```

**Why it matters:** Orphaned listeners prevent garbage collection, causing memory leaks in SPAs.

## Quick Quiz

<details>
<summary><strong>Question 1:</strong> What's the difference between textContent and innerHTML?</summary>

**Answer:** **textContent returns/sets plain text; innerHTML returns/sets HTML markup:**

```html
<div id="example">
  <p>Hello <strong>world</strong></p>
</div>
```

```javascript
const div = document.getElementById('example');

// textContent - plain text only
console.log(div.textContent);
// Output: "Hello world" (no HTML tags)

div.textContent = 'New <strong>text</strong>';
// Result: "New <strong>text</strong>" (rendered as literal text, not bold)

// innerHTML - HTML markup
console.log(div.innerHTML);
// Output: "<p>Hello <strong>world</strong></p>"

div.innerHTML = 'New <strong>text</strong>';
// Result: "New text" (with "text" actually bolded)
```

**Security implications:**
```javascript
const userInput = "<img src=x onerror=alert('XSS')>";

// ❌ UNSAFE
div.innerHTML = userInput;  // Executes script!

// ✅ SAFE
div.textContent = userInput;  // Displays as text: "<img src=x onerror=alert('XSS')>"
```

**Performance:**
```javascript
// innerHTML parses HTML (slower)
div.innerHTML = '<p>Text</p>';  // Parse HTML, create elements

// textContent is faster
div.textContent = 'Text';  // Just set text
```

**Why it matters:** Use textContent for user input (security) and simple text (performance). Use innerHTML only for trusted HTML.
</details>

<details>
<summary><strong>Question 2:</strong> What causes DOM reflows and how do you minimize them?</summary>

**Answer:** **Reflows recalculate layout when DOM structure or styles change; minimize by batching changes:**

**What causes reflows:**
```javascript
// Each line causes reflow
element.style.width = '100px';  // Reflow 1
element.style.height = '200px';  // Reflow 2
element.classList.add('large');  // Reflow 3
```

**Batching with cssText:**
```javascript
// ✅ Single reflow
element.style.cssText = 'width: 100px; height: 200px;';
element.classList.add('large');
```

**Using DocumentFragment:**
```javascript
// ❌ BAD: Multiple reflows
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  document.body.appendChild(div);  // Reflow every iteration
}

// ✅ GOOD: Single reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);  // No reflow (in memory)
}
document.body.appendChild(fragment);  // One reflow
```

**Hiding element during modification:**
```javascript
// ✅ Hide, modify, show
element.style.display = 'none';  // Reflow 1
// ... many modifications ...
element.style.width = '100px';
element.style.height = '200px';
element.classList.add('active');
element.style.display = 'block';  // Reflow 2
// Total: 2 reflows instead of many
```

**Reading after writing (layout thrashing):**
```javascript
// ❌ BAD: Forces layout between writes
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = '100px';  // Write
  console.log(elements[i].offsetWidth);  // Read - forces layout!
}

// ✅ GOOD: Batch reads, then writes
const widths = [];

// Read phase
for (let i = 0; i < elements.length; i++) {
  widths[i] = elements[i].offsetWidth;
}

// Write phase
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = widths[i] * 2 + 'px';
}
```

**Why it matters:** Reflows are expensive (10-100ms). Minimizing reflows keeps animations smooth and UI responsive.
</details>

<details>
<summary><strong>Question 3:</strong> What's the difference between querySelector and getElementById?</summary>

**Answer:** **getElementById is faster but limited; querySelector is flexible:**

**getElementById:**
```javascript
// Fast, hash table lookup
const el = document.getElementById('myId');  // Returns element or null

// ✅ Pros: Fastest selector
// ❌ Cons: Only works with IDs, no CSS selector support
```

**querySelector:**
```javascript
// Flexible, uses CSS selectors
const el = document.querySelector('#myId');  // Same as getElementById
const btn = document.querySelector('.btn.primary');  // Class combo
const firstP = document.querySelector('div > p:first-child');  // Complex selector

// ✅ Pros: Any CSS selector
// ❌ Cons: Slower (must parse selector)
```

**Performance comparison:**
```javascript
// Benchmark (1000 iterations)
console.time('getElementById');
for (let i = 0; i < 1000; i++) {
  document.getElementById('test');
}
console.timeEnd('getElementById');  // ~0.5ms

console.time('querySelector');
for (let i = 0; i < 1000; i++) {
  document.querySelector('#test');
}
console.timeEnd('querySelector');  // ~2ms
```

**querySelectorAll vs getElementsByClassName:**
```javascript
// getElementsByClassName - live HTMLCollection
const buttons = document.getElementsByClassName('btn');  // Live!
console.log(buttons.length);  // 5

const newBtn = document.createElement('button');
newBtn.className = 'btn';
document.body.appendChild(newBtn);

console.log(buttons.length);  // 6 (auto-updated!)

// querySelectorAll - static NodeList
const buttons2 = document.querySelectorAll('.btn');  // Static snapshot
console.log(buttons2.length);  // 6

const another = document.createElement('button');
another.className = 'btn';
document.body.appendChild(another);

console.log(buttons2.length);  // Still 6 (not updated)
```

**When to use each:**
- **getElementById**: Fastest, use for known IDs
- **querySelector**: Flexible, use for complex selectors
- **getElementsByClassName**: Live collection needed
- **querySelectorAll**: Static snapshot preferred

**Why it matters:** getElementById is 4x faster for IDs. querySelector enables complex selectors. Choose based on need.
</details>

<details>
<summary><strong>Question 4:</strong> How does event delegation work with the DOM?</summary>

**Answer:** **Event delegation attaches one listener to parent instead of many to children:**

**Without delegation (inefficient):**
```javascript
// ❌ BAD: Listener on every item
const items = document.querySelectorAll('.item');

items.forEach(item => {
  item.addEventListener('click', handleClick);  // 100 items = 100 listeners
});

// Adding new items requires adding listeners
const newItem = document.createElement('div');
newItem.className = 'item';
newItem.addEventListener('click', handleClick);  // Must remember!
list.appendChild(newItem);
```

**With delegation (efficient):**
```javascript
// ✅ GOOD: One listener on parent
const list = document.getElementById('list');

list.addEventListener('click', (e) => {
  // Check if clicked element matches
  if (e.target.matches('.item')) {
    handleClick(e.target);
  }
});

// New items automatically work
const newItem = document.createElement('div');
newItem.className = 'item';
list.appendChild(newItem);  // No listener needed!
```

**Event bubbling enables delegation:**
```html
<ul id="list">
  <li class="item">
    <span>Text</span>
    <button>Delete</button>
  </li>
</ul>
```

```javascript
const list = document.getElementById('list');

list.addEventListener('click', (e) => {
  // Click bubbles from span → li → ul
  
  // Handle delete button
  if (e.target.matches('button')) {
    e.target.closest('.item').remove();
  }
  
  // Handle item click (but not button)
  if (e.target.closest('.item') && !e.target.matches('button')) {
    console.log('Item clicked:', e.target.closest('.item'));
  }
});
```

**Benefits:**
```javascript
// Memory efficiency
// 1000 items with individual listeners: 1000 event objects in memory
// 1000 items with delegation: 1 event object

// Dynamic content
function addTodos(todos) {
  const fragment = document.createDocumentFragment();
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.textContent = todo.text;
    // No event listener needed!
    fragment.appendChild(li);
  });
  
  todoList.appendChild(fragment);
  // All items handled by parent listener
}
```

**Why it matters:** Delegation reduces memory usage (1 listener vs 1000), simplifies dynamic content, and improves performance.
</details>

<details>
<summary><strong>Question 5:</strong> What's a DocumentFragment and when should you use it?</summary>

**Answer:** **DocumentFragment is lightweight container for building DOM off-screen before inserting:**

**Without DocumentFragment:**
```javascript
// ❌ BAD: Multiple reflows
const list = document.getElementById('list');

for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li);  // Reflow! × 100
}
// Slow, causes 100 reflows
```

**With DocumentFragment:**
```javascript
// ✅ GOOD: Single reflow
const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);  // In memory, no reflow
}

list.appendChild(fragment);  // One reflow
// Fast, only 1 reflow
```

**Key characteristics:**
```javascript
const fragment = document.createDocumentFragment();

console.log(fragment.nodeType);  // 11 (DOCUMENT_FRAGMENT_NODE)
console.log(fragment.parentNode);  // null (not in DOM)

// Can use like regular parent node
const div = document.createElement('div');
fragment.appendChild(div);
fragment.querySelector('div');  // Works!

// When appended, fragment disappears (children remain)
const container = document.getElementById('container');
container.appendChild(fragment);

console.log(fragment.children.length);  // 0 (children moved to container)
console.log(container.children.length);  // 1 (div is now here)
```

**Complex example:**
```javascript
function renderTable(data) {
  const tbody = document.getElementById('tbody');
  const fragment = document.createDocumentFragment();
  
  data.forEach(row => {
    const tr = document.createElement('tr');
    
    Object.values(row).forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    
    fragment.appendChild(tr);
  });
  
  tbody.innerHTML = '';  // Clear existing
  tbody.appendChild(fragment);  // Single reflow for entire table
}

renderTable([
  { name: 'Alice', age: 25, city: 'NYC' },
  { name: 'Bob', age: 30, city: 'LA' },
  // ... 1000 rows
]);
```

**When to use:**
- Building multiple DOM nodes before insertion
- Rendering lists from data
- Template instantiation
- Any batch DOM creation

**When NOT to use:**
- Single element creation (just use createElement)
- Modifying existing DOM (use existing parent)

**Why it matters:** DocumentFragment enables efficient batch DOM updates, reducing reflows from hundreds to one.
</details>

## References
- [MDN: Manipulating Documents](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents)
- [MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
