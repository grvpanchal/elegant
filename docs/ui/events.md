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

## References:

- https://developer.mozilla.org/en-US/docs/Web/Events
