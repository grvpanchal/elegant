---
title: Build an event emitter
layout: question
slug: event-emitter
format: coding
difficulty: medium
layer: ui
topics: [events, dom]
skill: ui-events
minutes: 25
summary: Subscribe, emit, unsubscribe — and survive a handler that removes itself while the event is being dispatched.
---

Implement an `EventEmitter`:

- `on(event, handler)` subscribes and returns an unsubscribe function.
- `once(event, handler)` fires at most once.
- `off(event, handler)` removes a specific handler.
- `emit(event, ...args)` calls every handler subscribed **at the moment emit
  was called**, in subscription order, and returns whether any ran.
- A handler that throws must not prevent the remaining handlers from running;
  the error is reported through an `onError(err, event)` hook passed to the
  constructor, never rethrown.
- A handler that unsubscribes itself (or another) during `emit` must not corrupt
  the iteration.

{% include code-playground.html %}

## Solution

### Approach 1: a Map of arrays, iterated over a copy

```js
export default class EventEmitter {
  #listeners = new Map();

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(handler);
    return () => this.off(event, handler);
  }

  emit(event, ...args) {
    const handlers = this.#listeners.get(event);
    if (!handlers || handlers.length === 0) return false;
    for (const handler of [...handlers]) {   // the copy is the whole trick
      try { handler(...args); } catch (err) { this.onError(err, event); }
    }
    return true;
  }
}
```

Two details carry this. **Iterating a copy** means a handler that calls
`off` mid-emit does not shift the array under the loop — without it, removing
the handler at index 0 causes index 1 to be skipped entirely, and that bug
appears only when two handlers are subscribed and the first one unsubscribes.

**Reporting through a hook** keeps one bad handler from swallowing the rest
while still surfacing the error. A bare `catch {}` is how a broken handler goes
unnoticed for months. The tempting alternative — `queueMicrotask(() => { throw
err; })`, so the error reaches `window.onerror` — is not portable: under Node
the same line is an unhandled rejection that takes the process down, which this
question's own tests catch.

### Approach 2: a Set, with `once` wrapped

```js
once(event, handler) {
  const wrapper = (...args) => { this.off(event, wrapper); handler(...args); };
  wrapper.handler = handler;          // so off(event, handler) can find it
  return this.on(event, wrapper);
}

off(event, handler) {
  const handlers = this.#listeners.get(event);
  if (!handlers) return;
  const i = handlers.findIndex((h) => h === handler || h.handler === handler);
  if (i !== -1) handlers.splice(i, 1);
}
```

A `Set` gives O(1) removal and deduplicates, which quietly changes behaviour:
subscribing the same function twice then registers once. Node's `EventEmitter`
allows duplicates and calls twice; the DOM deduplicates. Pick one and document
it, because callers rely on whichever they met first.

The `wrapper.handler` back-reference is what makes `off(event, original)` work
after a `once` — without it the caller cannot remove a one-shot listener before
it fires.

## Trade-offs

**Unsubscribe function vs `off`.** Returning a disposer from `on` is harder to
get wrong: the caller cannot pass the wrong reference, and it composes with
cleanup blocks. Keep `off` too — it is the shape people expect — but the
disposer is what you should use.

**Array vs Set.** Arrays preserve order and allow duplicates, and removal is
O(n). Sets are O(1), deduplicate, and preserve insertion order anyway in modern
engines. For handler counts in the tens, this is a preference; at thousands, use
the Set.

**Memory.** An emitter holds strong references to every handler, so a component
that subscribes and never unsubscribes leaks itself and everything it closes
over. This is the most common real bug with emitters, and it is why the disposer
matters more than the API surface.

**Errors.** Throwing synchronously on the first bad handler is defensible for a
tightly-controlled internal bus and wrong for anything plugin-facing, where one
third-party listener should not be able to break the app.

## Related

- Reading: [Events](../ui/events.html) · [DOM](../ui/dom.html)
- Agent Skill: `ui-events`
