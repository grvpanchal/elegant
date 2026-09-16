export default class EventEmitter {
  constructor(onError) {
    this._listeners = new Map();
    // A throwing handler is reported, never rethrown into the host: an
    // asynchronous rethrow reaches window.onerror in a browser and takes the
    // whole process down under Node, which is not a portable contract.
    this.onError = onError || ((err) => console.error("EventEmitter handler threw:", err));
  }

  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, []);
    this._listeners.get(event).push(handler);
    return () => this.off(event, handler);
  }

  once(event, handler) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      handler(...args);
    };
    wrapper.handler = handler;
    return this.on(event, wrapper);
  }

  off(event, handler) {
    const handlers = this._listeners.get(event);
    if (!handlers) return;
    const index = handlers.findIndex((h) => h === handler || h.handler === handler);
    if (index !== -1) handlers.splice(index, 1);
    if (handlers.length === 0) this._listeners.delete(event);
  }

  emit(event, ...args) {
    const handlers = this._listeners.get(event);
    if (!handlers || handlers.length === 0) return false;
    for (const handler of [...handlers]) {
      try {
        handler(...args);
      } catch (err) {
        this.onError(err, event);
      }
    }
    return true;
  }
}
