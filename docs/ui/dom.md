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

{% include quiz.html id="dom-1"
   question="What is the key difference between textContent and innerHTML when updating a DOM element?"
   options="A|They are identical;;B|textContent sets plain text and is safe for untrusted input; innerHTML parses the value as HTML, so passing untrusted input can lead to XSS and also triggers more expensive parsing/reflow;;C|innerHTML is faster for all content;;D|textContent runs JavaScript embedded in strings"
   correct="B"
   explanation="Use textContent for text. Only use innerHTML when you genuinely need to insert markup, and never with unsanitised user input — that's the classic XSS vector." %}

{% include quiz.html id="dom-2"
   question="Which of these actions does NOT cause a DOM reflow?"
   options="A|Reading element.offsetWidth;;B|Changing an element's width in px;;C|Toggling `display: none`;;D|Changing only the color property"
   correct="D"
   explanation="Reflow is triggered by layout-affecting changes (size, position, display) and by layout-reading properties (offset*, getBoundingClientRect). Pure paint changes like color just repaint, not reflow." %}

{% include quiz.html id="dom-3"
   question="What's the practical difference between document.querySelector('#id') and document.getElementById('id')?"
   options="A|getElementById is faster and returns only an Element or null; querySelector accepts any CSS selector (more flexible, slightly slower) and returns the first match or null;;B|They are identical;;C|getElementById can match by class too;;D|querySelector only works inside React"
   correct="A"
   explanation="Use getElementById when you already have the id — it's direct lookup. querySelector is the Swiss-army version when you need a broader selector." %}

{% include quiz.html id="dom-4"
   question="How does event delegation reduce the number of event listeners you need?"
   options="A|It attaches one listener on a common ancestor and uses event.target to identify which descendant actually triggered the event, so dynamically added children are handled automatically;;B|It silently dedupes listeners on the same element;;C|It disables bubbling;;D|It is a React-only concept"
   correct="A"
   explanation="Especially useful for long or dynamic lists — one listener on the <ul> beats a listener per <li>, and new items don't need to be wired up." %}

{% include quiz.html id="dom-5"
   question="What is a DocumentFragment good for?"
   options="A|Only for SVG;;B|Batching DOM nodes off-DOM and appending them in a single operation, so you pay the reflow/paint cost once instead of once per node;;C|Replacing the whole document;;D|Loading HTML from a URL"
   correct="B"
   explanation="Build your subtree in a DocumentFragment, then appendChild it. The fragment itself isn't rendered; the child nodes get moved into the document in a single operation." %}

## References
- [MDN: Manipulating Documents](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents)
- [MDN: Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
