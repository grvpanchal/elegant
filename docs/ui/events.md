---
title: Events
layout: doc
slug: events
---

# Events

> - A single purpose component
> - Deliver display or interactiveness with single action

Events are fired to notify code of `"interesting changes"` that may affect code execution. These can arise from user interactions such as using a mouse or resizing a window, changes in the state of the underlying environment (e.g. low battery or media events from the operating system), and other causes.

Here's a simple example of handling a `click` event:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JavaScript Event Example</title>
  </head>
  <body>
    <button id="myButton">Click me</button>

    <script>
      // Get a reference to the button element
      const button = document.getElementById("myButton");

      // Define a function to be called when the button is clicked
      function handleClick() {
        alert("Button clicked!");
      }

      // Attach the event listener to the button
      button.addEventListener("click", handleClick);
    </script>
  </body>
</html>
```
## Types of HTML Element Events

HTML elements can respond to a wide variety of events, allowing developers to create interactive and dynamic web pages. These events can be broadly categorized based on their purpose and the user actions or system changes that trigger them.

**Common Categories of HTML Element Events**

| Event Category         | Description                                                                                         | Example Events                |
|-----------------------|-----------------------------------------------------------------------------------------------------|-------------------------------|
| Mouse Events          | Triggered by mouse actions.                                                                         | onclick, onmouseover, onmouseout, onmousedown, onmouseup, ondblclick[1][2][5] |
| Keyboard Events       | Triggered by keyboard actions.                                                                      | onkeydown, onkeyup, onkeypress[2][5]         |
| Form Events           | Related to form input and submission.                                                               | onsubmit, onchange, oninput, onfocus, onblur, onreset[2][5][6] |
| Drag & Drop Events    | Involved in drag-and-drop operations.                                                               | ondrag, ondragstart, ondragend, ondragenter, ondragleave, ondragover, ondrop[1][2] |
| Clipboard Events      | Triggered by cut, copy, and paste actions.                                                          | oncopy, oncut, onpaste[2]     |
| Media Events          | Related to media elements like audio and video.                                                     | onplay, onpause, onended, onvolumechange, ontimeupdate[1][2] |
| Focus Events          | Occur when elements gain or lose focus.                                                             | onfocus, onblur[2][5]         |
| Load/Unload Events    | Related to the loading and unloading of documents or resources.                                     | onload, onunload, onbeforeunload[5][6] |
| Touch Events          | Triggered by touch interactions (mainly on mobile devices).                                         | ontouchstart, ontouchend, ontouchmove, ontouchcancel[2] |
| Wheel/Scroll Events   | Triggered by scrolling or mouse wheel actions.                                                      | onscroll, onwheel[1][2]       |
| Animation/Transition  | Related to CSS animations and transitions.                                                          | onanimationstart, onanimationend, ontransitionend[2] |
| Mutation Events       | Triggered when the DOM structure changes (now largely replaced by MutationObserver API).            | DOMSubtreeModified, DOMNodeInserted, DOMNodeRemoved[2] |
| Input Events          | Triggered by changes to input fields.                                                               | oninput, onchange[5]          |

### Examples of Event Usage

- **Mouse Events:**  
  ```html
  <button onclick="alert('Clicked!')">Click Me</button>
  ```
- **Keyboard Events:**  
  ```javascript
  document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
  });
  ```
- **Form Events:**  
  ```html
  <form onsubmit="return validateForm()">
    <input type="text" onchange="checkInput(this)">
  </form>
  ```
- **Drag & Drop Events:**  
  ```html
  <div ondrop="dropHandler(event)" ondragover="allowDrop(event)"></div>
  ```

### How to Attach Event Handlers

- **Inline HTML Attributes:**  
  Use attributes like `onclick`, `onchange`, etc., directly in HTML[5].
- **DOM Properties:**  
  Assign a function to an element's event property, e.g., `element.onclick = handler;`[3][5].
- **addEventListener Method:**  
  Attach multiple event handlers or listen for events dynamically:
  ```javascript
  element.addEventListener('click', handler);
  ```
  This method is recommended for flexibility and scalability[3][7].

### Comprehensive References

- [W3Schools Event Attributes Reference](https://www.w3schools.com/tags/ref_eventattributes.asp)
- [MDN Web Docs Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)

These sources provide exhaustive lists and documentation for all standard HTML events.

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

