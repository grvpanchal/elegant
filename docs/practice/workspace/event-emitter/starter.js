/**
 * EventEmitter
 *
 * on(event, handler)    -> unsubscribe function
 * once(event, handler)  -> fires at most once; off(event, handler) still removes it
 * off(event, handler)   -> removes that handler
 * emit(event, ...args)  -> calls handlers subscribed AT CALL TIME, in order,
 *                          returns true if any ran
 *
 * A throwing handler must not stop the others: report it through
 * `this.onError(err, event)` rather than rethrowing. A handler that
 * unsubscribes during emit must not cause another handler to be skipped.
 */
export default class EventEmitter {
  constructor(onError) {
    this.onError = onError || ((err) => console.error("EventEmitter handler threw:", err));
  }

  on(event, handler) {
    throw new Error("not implemented");
  }

  once(event, handler) {
    throw new Error("not implemented");
  }

  off(event, handler) {
    throw new Error("not implemented");
  }

  emit(event, ...args) {
    throw new Error("not implemented");
  }
}
