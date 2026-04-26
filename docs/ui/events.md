---
title: Events
layout: doc
slug: events
---

# Events

> - Browser notifications of user interactions and state changes
> - Foundation of interactive web applications  
> - Event-driven programming model

## Key Insight

Events are the browser's way of saying "something happened" — not just clicks, but scrolls, hovers, form submissions, page loads, network responses, animations completing, and hundreds of other moments your code can react to. The event system transforms the browser from a static document viewer into an interactive application platform. Understanding event propagation (bubbling/capturing), delegation, and preventDefault is what separates developers who can "make buttons work" from those who can build sophisticated, performant UIs with proper keyboard navigation, form validation, and infinite scroll.

## Detailed Description

Events are fired to notify code of "interesting changes" that may affect code execution. These can arise from user interactions such as using a mouse or resizing a window, changes in the state of the underlying environment (e.g. low battery or media events from the operating system), and other causes.

The browser's event system is based on the observer pattern: you register listeners for specific event types, and when those events occur, your callback functions execute. Events follow a propagation path through the DOM tree, enabling powerful patterns like event delegation. The Event object passed to handlers contains rich information about what happened (which key, mouse position, target element, etc.).

Key characteristics of events:
1. **Event types** - Click, keydown, submit, load, scroll, etc. (100+ types)
2. **Event propagation** - Events flow through DOM (capturing → target → bubbling)
3. **Event object** - Contains information about the event (target, type, timestamp)
4. **Default behaviors** - Many events have browser default actions (links navigate, forms submit)
5. **Custom events** - You can create and dispatch your own events

## Code Examples

### Basic Example: Click + form events across frameworks

A click event is one idea with four spellings. Here is the same "dispatch an `onClick` when the user presses the Button atom" wiring taken straight from each `chota-*` template.

{::nomarkdown}<div class="code-tabs">{:/}

React
```jsx
// templates/chota-react-redux/src/ui/atoms/Button/Button.component.jsx
// React passes handlers as props. camelCase `onClick` is the React-specific
// synthetic event; native DOM behaviour still bubbles underneath.
export default function Button(props) {
  const transformedProps = { ...props };
  delete transformedProps.isLoading;
  if (props.isLoading) { /* loading state */ }
  return <button {...transformedProps}>{props.children}</button>;
}

// Usage:
<Button onClick={(e) => handleClick(e)}>Save</Button>
```

Angular
```ts
// templates/chota-angular-ngrx/src/ui/atoms/Button/Button.component.ts
// @Output + EventEmitter is Angular's way of exposing "custom events"
// to the parent. The template binds (click) to call emit.
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({ selector: 'app-button', /* ... */ })
export default class ButtonComponent {
  @Input() isLoading = false;
  @Output() onClick = new EventEmitter<Event>();
}
```

```html
<!-- Button.component.html -->
<button [type]="type || 'button'"
        (click)="onClick.emit($event)"
        [class]="computedClasses">
  <ng-content></ng-content>
</button>

<!-- Parent usage -->
<app-button (onClick)="handleClick($event)">Save</app-button>
```

Vue
```vue
<!-- templates/chota-vue-pinia/src/ui/atoms/Button/Button.component.vue -->
<template>
  <button :disabled="disabled" :type="type"
          @click="$emit('onClick')"
          :class="getButtonClass()">
    <slot />
  </button>
</template>

<!-- Parent usage -->
<!-- <Button @onClick="handleClick">Save</Button> -->
```

Web Components
```js
// templates/chota-wc-saga/src/ui/atoms/Button/Button.component.js
// The WC templates use a tiny emit() helper that dispatches a CustomEvent.
// Parents listen with addEventListener or Lit's @onClick= directive.
import { html } from "lit";
import emit from "../../../utils/events/emit";

export default function Button(props) {
  return html`
    <button type="button"
      class="${props.classes}"
      @click="${() => emit(this, "onClick", props)}">
      <slot></slot>
    </button>
  `;
}

// utils/events/emit.js (simplified):
// export default function emit(host, name, detail) {
//   host.dispatchEvent(new CustomEvent(name, {
//     detail, bubbles: true, composed: true,
//   }));
// }

// Parent usage:
// <app-button @onClick=${(e) => handleClick(e.detail)}>Save</app-button>
```

{::nomarkdown}</div>{:/}

The conceptual model is the same in every tab: the button's native `click` listener calls something that re-broadcasts to the parent under a framework-specific conduit. React uses the synthetic event system + prop functions. Angular wraps RxJS around `EventEmitter`. Vue uses a named `$emit`. Web Components use the browser's own `CustomEvent` bus. Parents subscribe in their respective idioms (`onClick={...}` / `(onClick)="..."` / `@onClick="..."` / `@onClick=${...}`) — but every one of those resolves to the same DOM click bubble under the hood.

### Practical Example: Event Propagation and Delegation

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Event Propagation Example</title>
  <style>
    .outer { padding: 20px; background: lightblue; }
    .middle { padding: 20px; background: lightgreen; margin: 10px; }
    .inner { padding: 20px; background: lightcoral; margin: 10px; }
  </style>
</head>
<body>
  <div class="outer" id="outer">
    Outer
    <div class="middle" id="middle">
      Middle
      <div class="inner" id="inner">
        Inner (Click me!)
      </div>
    </div>
  </div>
  
  <script>
    const outer = document.getElementById('outer');
    const middle = document.getElementById('middle');
    const inner = document.getElementById('inner');
    
    // Event bubbling (default)
    outer.addEventListener('click', (e) => {
      console.log('Outer clicked (bubbling)');
    });
    
    middle.addEventListener('click', (e) => {
      console.log('Middle clicked (bubbling)');
      // Stop propagation to prevent outer from receiving event
      // e.stopPropagation();
    });
    
    inner.addEventListener('click', (e) => {
      console.log('Inner clicked (bubbling)');
      console.log('Event target:', e.target);
      console.log('Current target:', e.currentTarget);
    });
    
    // Event capturing (runs before bubbling)
    outer.addEventListener('click', (e) => {
      console.log('Outer clicked (capturing)');
    }, true);  // Third parameter = useCapture
    
    // Click on inner element outputs:
    // Outer clicked (capturing)  ← Capturing phase (top to bottom)
    // Inner clicked (bubbling)    ← Target phase
    // Middle clicked (bubbling)   ← Bubbling phase (bottom to top)
    // Outer clicked (bubbling)
  </script>
  
  <!-- Event Delegation Example -->
  <ul id="todoList">
    <li data-id="1">Task 1 <button class="delete">Delete</button></li>
    <li data-id="2">Task 2 <button class="delete">Delete</button></li>
    <li data-id="3">Task 3 <button class="delete">Delete</button></li>
  </ul>
  
  <script>
    // Event delegation - one listener for all buttons
    const todoList = document.getElementById('todoList');
    
    todoList.addEventListener('click', (event) => {
      // Check if delete button was clicked
      if (event.target.matches('button.delete')) {
        const listItem = event.target.closest('li');
        const taskId = listItem.dataset.id;
        
        console.log(`Deleting task ${taskId}`);
        listItem.remove();
      }
    });
    
    // Adding new items dynamically (no need to add listeners)
    const newTask = document.createElement('li');
    newTask.dataset.id = '4';
    newTask.innerHTML = 'Task 4 <button class="delete">Delete</button>';
    todoList.appendChild(newTask);
    // Delete button automatically works via delegation!
  </script>
</body>
</html>
```

### Advanced Example: Custom Events and Event Patterns

```javascript
// Custom events
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    
    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
  }
  
  emit(eventName, data) {
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach(callback => {
      callback(data);
    });
  }
}

// Usage
const eventBus = new EventBus();

eventBus.on('userLoggedIn', (user) => {
  console.log('User logged in:', user.name);
});

eventBus.on('userLoggedIn', (user) => {
  console.log('Welcome notification sent to', user.email);
});

eventBus.emit('userLoggedIn', { name: 'Alice', email: 'alice@example.com' });

// Native CustomEvent
const button = document.getElementById('customButton');

// Dispatch custom event
const customEvent = new CustomEvent('myCustomEvent', {
  detail: { message: 'Hello from custom event!', timestamp: Date.now() },
  bubbles: true,
  cancelable: true
});

button.dispatchEvent(customEvent);

// Listen for custom event
button.addEventListener('myCustomEvent', (event) => {
  console.log('Custom event received:', event.detail);
});

// Debouncing events
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage: Debounce scroll event
const handleScroll = debounce(() => {
  console.log('Scrolled!', window.scrollY);
}, 300);

window.addEventListener('scroll', handleScroll);

// Throttling events
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Throttle mousemove
const handleMouseMove = throttle((event) => {
  console.log('Mouse position:', event.clientX, event.clientY);
}, 100);

document.addEventListener('mousemove', handleMouseMove);

// Passive event listeners for scroll performance
document.addEventListener('scroll', handleScroll, {
  passive: true  // Tells browser we won't call preventDefault()
});

// Once option - listener automatically removed after first trigger
button.addEventListener('click', () => {
  console.log('This runs only once');
}, { once: true });

// Form validation with events
const form = document.getElementById('myForm');
const emailInput = document.getElementById('email');

emailInput.addEventListener('blur', (event) => {
  const email = event.target.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    event.target.setCustomValidity('Invalid email address');
    event.target.reportValidity();
  } else {
    event.target.setCustomValidity('');
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();  // Prevent default form submission
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  console.log('Form data:', data);
  
  // Send data via fetch
  fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));
});
```

## Common Mistakes

### 1. Not Removing Event Listeners (Memory Leaks)
**Mistake:** Adding listeners without cleanup causes memory leaks.

```javascript
// ❌ BAD: Memory leak in SPA
function setupComponent() {
  const button = document.getElementById('button');
  
  button.addEventListener('click', () => {
    console.log('Clicked');
  });
  
  // Component unmounts but listener remains
}

// Called multiple times in SPA
setupComponent();  // Leak
setupComponent();  // Another leak
setupComponent();  // More leaks...
```

```javascript
// ✅ GOOD: Clean up listeners
function setupComponent() {
  const button = document.getElementById('button');
  
  function handleClick() {
    console.log('Clicked');
  }
  
  button.addEventListener('click', handleClick);
  
  // Return cleanup function
  return () => {
    button.removeEventListener('click', handleClick);
  };
}

const cleanup = setupComponent();
// Later, when component unmounts
cleanup();

// Or use AbortController (modern)
const controller = new AbortController();

button.addEventListener('click', handleClick, {
  signal: controller.signal
});

// Clean up all listeners at once
controller.abort();
```

**Why it matters:** In SPAs, listeners accumulate without cleanup, causing memory leaks and duplicate event handling.

### 2. Using addEventListener Inside Loops Without Delegation
**Mistake:** Attaching individual listeners to many elements.

```javascript
// ❌ BAD: 1000 event listeners
const items = document.querySelectorAll('.item');  // 1000 items

items.forEach(item => {
  item.addEventListener('click', handleClick);  // 1000 listeners!
});
// Memory intensive, slow performance
```

```javascript
// ✅ GOOD: Event delegation (1 listener)
const container = document.getElementById('container');

container.addEventListener('click', (event) => {
  if (event.target.matches('.item')) {
    handleClick(event.target);
  }
});
// Single listener handles all items
```

**Why it matters:** 1000 listeners use 1000x more memory than delegation. Delegation also handles dynamically added elements automatically.

### 3. Forgetting preventDefault() on Form Submit
**Mistake:** Form submits causing page refresh.

```javascript
// ❌ BAD: Page refreshes
const form = document.getElementById('myForm');

form.addEventListener('submit', (event) => {
  const data = new FormData(event.target);
  console.log('Data:', Object.fromEntries(data));
  // Page refreshes here! Data not sent via AJAX
});
```

```javascript
// ✅ GOOD: Prevent default submit
form.addEventListener('submit', (event) => {
  event.preventDefault();  // Stop page refresh
  
  const data = new FormData(event.target);
  
  fetch('/api/submit', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(data))
  });
});
```

**Why it matters:** Without preventDefault(), forms trigger browser's default submit behavior (page refresh), breaking SPA user experience.

## Types of HTML Element Events

**Common Categories of HTML Element Events**

| Event Category         | Description                                                    | Example Events                |
|-----------------------|----------------------------------------------------------------|-------------------------------|
| Mouse Events          | Triggered by mouse actions                                     | click, mouseover, mouseout, mousedown, mouseup, dblclick |
| Keyboard Events       | Triggered by keyboard actions                                  | keydown, keyup, keypress      |
| Form Events           | Related to form input and submission                           | submit, change, input, focus, blur, reset |
| Drag & Drop Events    | Involved in drag-and-drop operations                           | drag, dragstart, dragend, dragenter, dragleave, dragover, drop |
| Clipboard Events      | Triggered by cut, copy, and paste actions                      | copy, cut, paste              |
| Media Events          | Related to media elements like audio and video                 | play, pause, ended, volumechange, timeupdate |
| Focus Events          | Occur when elements gain or lose focus                         | focus, blur, focusin, focusout |
| Load/Unload Events    | Related to loading/unloading of documents or resources         | load, unload, beforeunload    |
| Touch Events          | Triggered by touch interactions (mobile devices)               | touchstart, touchend, touchmove, touchcancel |
| Wheel/Scroll Events   | Triggered by scrolling or mouse wheel actions                  | scroll, wheel                 |
| Animation/Transition  | Related to CSS animations and transitions                      | animationstart, animationend, transitionend |
| Input Events          | Triggered by changes to input fields                           | input, change                 |

## Framework transformation of events

HTML events are handled differently in modern frameworks and libraries to provide enhanced developer experience, maintainability, and integration with their component models. Here’s how each major technology transforms and manages HTML element events:

---

### React

- **Event Syntax**: Uses camelCase for event names (e.g., `onClick` instead of `onclick`).
- **Handler Assignment**: Event handlers are passed as functions inside curly braces, e.g., `<button onClick={handleClick}>`.
- **Synthetic Events**: React wraps native events in a *SyntheticEvent* system for cross-browser consistency.
- **Passing Arguments**: To pass arguments, use an arrow function: `<button onClick={() => handleClick(arg)}>`[1][5].
- **Event Object**: The event handler receives a synthetic event object, which closely mimics the native event but is normalized across browsers[1][5].

---

### Angular

- **Event Binding Syntax**: Uses parentheses around the event name, e.g., `<button (click)="doSomething()">`.
- **Template Statements**: The handler is usually a method or expression in the component class.
- **Event Object Access**: The special `$event` variable provides access to the native event object, e.g., `<input (keyup)="onKey($event)">`[2][6].
- **Event Modifiers**: Angular supports key and code modifiers for keyboard events, such as `(keyup.enter)` to only trigger on Enter key, or combinations like `(keyup.shift.enter)`[2].
- **Legacy AngularJS**: Uses directives like `ng-click`, `ng-mouseover`, etc., but the core concepts remain similar[6].

---

### Vue

- **Event Directive**: Uses the `v-on` directive or its shorthand `@`, e.g., `<button v-on:click="doSomething">` or `<button @click="doSomething">`.
- **Handler Types**: Can use inline expressions or reference methods defined in the component.
- **Event Modifiers**: Vue provides modifiers like `.stop`, `.prevent`, `.once`, `.capture`, and key modifiers for more granular control, e.g., `@submit.prevent="onSubmit"`[3][7].
- **Automatic Reactivity**: When an event changes reactive data, the UI automatically updates[3][7].

---

### Web Components

- **Native Event Handling**: Use standard DOM methods like `addEventListener` directly on elements or within the component’s shadow DOM[8][10].
- **Custom Events**: Web components often define and dispatch custom events using the `CustomEvent` constructor and `dispatchEvent`, enabling communication with parent components or the broader application[8][9].
- **Event Delegation**: Common for optimizing performance, especially with dynamic lists—attach a single listener to a parent and handle events as they bubble up[8].
- **Cleanup**: Event listeners should be removed in lifecycle callbacks (e.g., `disconnectedCallback`) to avoid memory leaks[10].
- **Advanced Patterns**: The `handleEvent()` method can be used for cleaner event handler management in custom elements[10].

---

### Comparison Table

| Framework/Library | Event Syntax Example        | Handler Binding          | Event Object      | Modifiers/Features                     |
|-------------------|----------------------------|-------------------------|-------------------|----------------------------------------|
| React             | `<button onClick={fn}>`    | Function in JSX         | SyntheticEvent    | Arrow functions for args, preventDefault, stopPropagation |
| Angular           | `<button (click)="fn()">`  | Method in component     | `$event` (native) | Key/code modifiers, template expressions |
| Vue               | `<button @click="fn">`     | Method or inline        | Native event      | `.stop`, `.prevent`, `.once`, key modifiers |
| Web Components    | `addEventListener('click', fn)` | Direct DOM binding | Native event      | Custom events, event delegation, cleanup in lifecycle |

---

## Summary 
HTML elements support a rich set of event types, including mouse, keyboard, form, media, drag-and-drop, clipboard, and more. Developers can attach event handlers using inline attributes, DOM properties, or the `addEventListener` method for robust and interactive web applications[1][2][3][5][6].

- **React** transforms HTML events into camelCase props and uses a synthetic event system for consistency.
- **Angular** binds events using parentheses and provides powerful modifiers and access to the native event object.
- **Vue** uses the `v-on` directive (or `@` shorthand) with modifiers for expressive event handling and reactivity.
- **Web Components** leverage standard DOM event APIs, with additional patterns for custom events and lifecycle management.

Each approach reflects the framework's philosophy: React and Vue integrate events tightly with their component models, Angular provides declarative and expressive syntax with modifiers, and Web Components rely on native browser APIs for maximum flexibility and interoperability.

## Quick Quiz

{% include quiz.html id="events-1"
   question="What is an HTML element event?"
   options="A|A server-side hook in the HTTP protocol;;B|A CSS pseudo-class;;C|A signal the browser fires when something happens on a page (click, input change, load, keypress, etc.) that JS can listen to and respond to;;D|A React lifecycle method"
   correct="C"
   explanation="Events are how the DOM surfaces user and system activity. JS subscribes via addEventListener or framework-specific binding to react to them." %}

{% include quiz.html id="events-2"
   question="Which is the most flexible way to attach an event handler in plain HTML/JS?"
   options="A|Assigning element.onclick = fn, which overwrites any existing handler;;B|Inline onclick attribute;;C|jQuery;;D|element.addEventListener('click', fn), which supports multiple handlers and easy removal via removeEventListener"
   correct="D"
   explanation="addEventListener lets you register multiple handlers, choose capture vs bubble, opt into passive/once, and cleanly remove listeners — properties on the element can only hold a single handler." %}

{% include quiz.html id="events-3"
   question="What is the difference between event capturing and event bubbling?"
   options="A|They are the same thing;;B|Capturing flows from the window DOWN to the target; bubbling flows from the target UP to the window. Listeners run during both phases;;C|Bubbling is disabled by default;;D|Capturing applies only to keyboard events"
   correct="B"
   explanation="The event travels in three phases: capture (top-down), target, then bubble (bottom-up). addEventListener defaults to bubble phase; pass `{ capture: true }` to run during capture." %}

{% include quiz.html id="events-4"
   question="What does React's SyntheticEvent give you over a raw DOM event?"
   options="A|A cross-browser normalized wrapper with consistent properties, event pooling (historically), and integration with React's update batching;;B|It disables preventDefault;;C|Nothing — it's a pass-through;;D|It replaces addEventListener for non-React code too"
   correct="A"
   explanation="SyntheticEvent smooths over browser differences and ties event dispatching into React's rendering model — that's why you write `onClick` in camelCase and pass a function, not a string." %}

{% include quiz.html id="events-5"
   question="When attaching a scroll or touchmove listener, why is `{ passive: true }` important?"
   options="A|It prevents the event from firing twice;;B|It makes the listener run in a Web Worker;;C|It tells the browser the handler will not call preventDefault, so it can start scrolling immediately without waiting for JS — critical for 60fps scrolling on mobile;;D|It automatically removes the listener after one call"
   correct="C"
   explanation="Passive listeners unblock the main thread's scroll handling. Non-passive scroll/touchmove handlers force the browser to wait for JS before scrolling, causing jank." %}

## References

- https://developer.mozilla.org/en-US/docs/Web/Events
- [1] https://www.w3schools.com/tags/ref_eventattributes.asp
- [2] https://developer.mozilla.org/en-US/docs/Web/Events
- [3] https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events
- [4] https://html.spec.whatwg.org/dev/webappapis.html
- [5] https://www.w3schools.com/js/js_htmldom_events.asp
- [6] https://education.launchcode.org/intro-to-web-dev-curriculum/dom-and-events/reading/event-types/index.html
- [7] https://www.w3schools.com/js/js_htmldom_eventlistener.asp
- [8] https://stackoverflow.com/questions/59406682/is-there-any-event-type-for-html-element-in-typescript
- [9] https://stackoverflow.com/questions/53356911/where-can-i-find-a-list-of-possible-events-for-an-html-element
- [1] https://www.w3schools.com/react/react_events.asp
- [2] https://angular.dev/guide/templates/event-listeners
- [3] https://www.w3schools.com/vue/vue_events.php
- [4] https://open-wc.org/guides/knowledge/events/
- [5] https://withcodeexample.com/react-event-handling-guide/
- [6] https://www.w3schools.com/angular/angular_events.asp
- [7] https://vuejs.org/guide/essentials/event-handling
- [8] https://blog.pixelfreestudio.com/how-to-use-event-handling-in-web-components/
- [9] https://javascript.plainenglish.io/custom-event-handling-101-a-guide-to-web-component-communication-184bf115a81d
- [10] https://ryanmulligan.dev/blog/handling-events-web-components/
- [11] https://legacy.reactjs.org/docs/handling-events.html
- [12] https://react.dev/learn/responding-to-events
- [13] https://legacy.reactjs.org/docs/events.html
- [14] https://www.shecodes.io/athena/39543-understanding-the-event-target-property-in-react
- [15] https://stackoverflow.com/questions/60998463/react-dynamically-add-html-element-with-event-handler
- [16] https://angular.love/optimizing-events-handling-in-angular
- [17] https://v2.vuejs.org/v2/guide/events
- [18] https://stackoverflow.com/questions/73055022/how-to-handle-event-on-html-render-by-computed-function-in-vue-js
- [19] https://vuejs.org/guide/components/events
- [20] https://stackoverflow.com/questions/43061417/how-to-listen-for-custom-events-defined-web-component
- [21] https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
- [22] https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- [23] https://www.reddit.com/r/elm/comments/18j3iao/how_to_create_and_use_a_custom_web_component_with/
- [24] https://www.freecodecamp.org/news/how-to-handle-events-in-react-19/
- [25] https://stackoverflow.com/questions/56827863/is-there-a-way-to-attach-reactjs-events-to-dynamically-inserted-html-from-ajax-j
- [26] https://www.geeksforgeeks.org/react-js-events/
- [27] https://v17.angular.io/guide/event-binding
- [28] https://stackoverflow.com/questions/59482603/how-to-grab-an-html-element-within-my-angular-component-and-apply-an-event-liste
- [29] https://angular.dev/tutorials/learn-angular/7-event-handling
- [30] https://docs.angular.lat/guide/event-binding
- [31] https://v17.angular.io/guide/event-binding-concepts
- [32] https://30dayscoding.com/blog/handling-events-and-event-handling-patterns-in-vuejs
- [33] https://www.geeksforgeeks.org/vue-js-event-handling/
- [34] https://www.freecodecamp.org/news/how-event-handling-works-in-vue-3-guide-for-devs/
- [35] https://stackoverflow.com/questions/47435724/adding-events-to-dynamically-rendered-html-in-vue-js-component
- [36] https://www.reddit.com/r/vuejs/comments/gn3ki0/vhtml_and_emitting_events/

