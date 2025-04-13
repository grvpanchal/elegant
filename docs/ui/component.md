---
title: Component
layout: doc
slug: component
---
# Component

> - An interactive unit of element comprising of HTML, CSS and JS.
> - JS framework element to delivery reactivity with html tags, JS and CSS.

Web Components consist of three main technologies: Custom Elements, Shadow DOM, and HTML Templates.

Here's a simple example of a Web Component using Custom Elements:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Custom Button Component</title>
  </head>
  <body>
    <!-- Define the custom button component -->
    <script>
      class CustomButton extends HTMLElement {
        constructor() {
          super();

          // Create a shadow root
          this.attachShadow({ mode: "open" });

          // Define the button element
          const button = document.createElement("button");
          button.textContent = "Click me!";
          button.addEventListener("click", () => alert("Button clicked!"));

          // Append the button to the shadow DOM
          this.shadowRoot.appendChild(button);
        }
      }

      // Register the custom element
      customElements.define("custom-button", CustomButton);
    </script>

    <!-- Use the custom button component -->
    <custom-button></custom-button>
  </body>
</html>
```

- The `CustomButton` class extends `HTMLElement` to create a custom element.
- The `constructor` method is used to define the behavior of the custom element.
- `this.attachShadow({ mode: 'open' })` creates a shadow DOM for encapsulating the component's styles and functionality.
- A button element is created and added to the shadow DOM.
- The custom element is registered using `customElements.define('custom-button', CustomButton)`.

In the HTML body, `<custom-button></custom-button>` is used to insert an instance of the custom button component.

## References

- https://react.dev/learn/your-first-component
- https://medium.com/@adityaa803/components-in-javascript-1f5c66042fa5
- https://developer.mozilla.org/en-US/docs/Web/API/Web_components
