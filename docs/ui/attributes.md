---
title: Attributes
layout: default
---
# Attributes

> - Information entity of HTML elements
> - HTML attributes provide additional information about HTML elements adjust their behavior

Elements in HTML have attributes; these are additional values that configure the elements or adjust their behavior in various ways to meet the criteria the users want:

- Boolean Attributes (e.g. `required`, `readonly`, `disabled`). If a boolean attribute is present, its value is true, and if it's absent, its value is false. HTML defines restrictions on the allowed values of boolean attributes: If the attribute is present, its value must either be the empty string (equivalently, the attribute may have an unassigned value), or a value that is an ASCII case-insensitive match for the attribute's canonical name, with no leading or trailing whitespace.

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

- Event handler attributes

  > `WARNING:` The use of event handler content attributes is discouraged. The mix of HTML and JavaScript often produces unmaintainable code, and the execution of event handler attributes may also be blocked by content security policies.

  All event handler attributes accept a string. The string will be used to synthesize a JavaScript function like `function name(/*args*/) {body}`, where name is the attribute's `name`, and `body` is the attribute's value. The handler receives the same parameters as its JavaScript event handler counterpart — most handlers receive only one `event` parameter, while `onerror` receives five: `event`, `source`, `lineno`, `colno`, `error`. This means you can, in general, use the `event` variable within the attribute.

  ```html
  <div onclick="console.log(event)">Click me!</div>
  <!-- The synthesized handler has a name; you can reference itself -->
  <div onclick="console.log(onclick)">Click me!</div>
  ```

## HTML attribute reference:

- https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
