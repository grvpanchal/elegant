# Element

> - A single purpose entity of HTML
> - A building block of page.

Elements have an associated `namespace`, `namespace prefix`, `local name`, `custom element state`, `custom element definition`, `is value`. When an element is created, all of these values are initialized.

An element’s custom element state is one of `"undefined"`, `"failed"`, `"uncustomized"`, `"precustomized"`, or `"custom"`. An element whose custom element state is `"uncustomized"` or `"custom"` is said to be defined. An element whose custom element state is "custom" is said to be custom.

The following code illustrates elements in each of these four states:

```js
<!DOCTYPE html>
<script>
  window.customElements.define("sw-rey", class extends HTMLElement {})
  window.customElements.define("sw-finn", class extends HTMLElement {}, { extends: "p" })
  window.customElements.define("sw-kylo", class extends HTMLElement {
    constructor() {
      // super() intentionally omitted for this example
    }
  })
</script>

<!-- "undefined" (not defined, not custom) -->
<sw-han></sw-han>
<p is="sw-luke"></p>
<p is="asdf"></p>

<!-- "failed" (not defined, not custom) -->
<sw-kylo></sw-kylo>

<!-- "uncustomized" (defined, not custom) -->
<p></p>
<asdf></asdf>

<!-- "custom" (defined, custom) -->
<sw-rey></sw-rey>
<p is="sw-finn"></p>
```

## Reference:

- https://dom.spec.whatwg.org/#concept-element
