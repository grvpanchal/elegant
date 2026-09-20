---
title: Create a debounce utility
layout: question
slug: debounce-utility
format: coding
difficulty: medium
layer: ui
topics: [events]
skill: ui-atom
minutes: 15
summary: Create a debounce function that delays invocation until after a wait period.
---

A button click handler fires on every user click, but you only want to react to the
final click after a pause. Rapid clicks (e.g., double‑click, auto‑complete) should
not trigger the handler repeatedly.

Implement `debounce(func, wait)` that returns a new function. When the returned
function is invoked, it postpones calling `func` until `wait` milliseconds have
passed without another invocation. If the debounced function is called again
before the wait expires, the timer is reset.

- The returned function should preserve `this` and arguments when it eventually
  calls `func`.
- Optionally expose a `.cancel()` method to clear the pending call.

{% include code-playground.html %}

## Solution

### Approach 1: Basic trailing debounce

Use a closure to store the timer ID. Each call clears any existing timeout and
starts a new one. When the timeout finally fires, the original function is
called with the latest arguments and `this` value.

```js
export default function debounce(func, wait) {
  let timeoutId;
  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  }
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
}
```

### Approach 2: Debounce with leading edge

Sometimes you want the function to fire on the leading edge (immediately) and
then ignore further calls until the wait period elapses. This version adds an
optional `leading` flag. When `leading` is true, `func` is invoked on the first
call, and subsequent calls are ignored until the wait expires.

```js
export default function debounce(func, wait, { leading = false } = {}) {
  let timeoutId;
  let lastArgs = null;
  let lastThis = null;
  let invokeNow = false;

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    const shouldInvoke = leading && !timeoutId;
    if (shouldInvoke) {
      func.apply(lastThis, lastArgs);
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (!leading) {
        func.apply(lastThis, lastArgs);
      }
      // clear state so the next call can be treated as fresh
      timeoutId = null;
      lastArgs = null;
      lastThis = null;
    }, wait);
    if (shouldInvoke) invokeNow = true;
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
  };
  return debounced;
}
```

## Trade-offs

| Aspect | Basic trailing | Leading‑edge option |
|--------|----------------|---------------------|
| Immediate response | No – waits for pause | Yes – fires on first click |
| Complexity | Very simple | Slightly more state to manage |
| Use case | Autosave, resize listeners | Submit button that should not double‑send |
| Cancel safety | `.cancel()` clears pending call | `.cancel()` also clears any pending leading call |

The trailing version is the safest default because it guarantees `func` is
invoked only after a quiet period, which matches the typical “react after the
user stops typing” pattern. The leading edge variant is useful when an
immediate reaction improves perceived responsiveness, but it requires careful
testing to avoid duplicate invocations.

## Related

- Concept: [Events](../ui/events.html)
- Concept: [Component](../ui/component.html)
- Agent Skill: `ui-atom`