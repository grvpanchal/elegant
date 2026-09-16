const check = (name, fn) => {
  try { fn(); return { name, pass: true }; }
  catch (err) { return { name, pass: false, message: err && err.message ? err.message : String(err) }; }
};
const assert = (cond, message) => { if (!cond) throw new Error(message); };

export default async function tests(subject) {
  const EventEmitter = typeof subject === "function" ? subject : subject && subject.default;
  if (typeof EventEmitter !== "function") {
    return [{ name: "module default-exports EventEmitter", pass: false, message: "no default export" }];
  }

  return [
    check("on + emit calls the handler with the arguments", () => {
      const e = new EventEmitter();
      let seen = null;
      e.on("go", (...args) => { seen = args; });
      e.emit("go", 1, "two");
      assert(JSON.stringify(seen) === JSON.stringify([1, "two"]), `got ${JSON.stringify(seen)}`);
    }),
    check("emit returns false when nothing is subscribed", () => {
      assert(new EventEmitter().emit("nobody") === false, "emit should return false with no handlers");
    }),
    check("handlers run in subscription order", () => {
      const e = new EventEmitter();
      const order = [];
      e.on("go", () => order.push("a"));
      e.on("go", () => order.push("b"));
      e.emit("go");
      assert(order.join("") === "ab", `got ${order.join("")}`);
    }),
    check("the returned disposer unsubscribes", () => {
      const e = new EventEmitter();
      let calls = 0;
      const off = e.on("go", () => { calls += 1; });
      off();
      e.emit("go");
      assert(calls === 0, `expected 0 calls after the disposer ran, got ${calls}`);
    }),
    check("once fires exactly once", () => {
      const e = new EventEmitter();
      let calls = 0;
      e.once("go", () => { calls += 1; });
      e.emit("go");
      e.emit("go");
      assert(calls === 1, `expected 1, got ${calls}`);
    }),
    check("off removes a once handler before it fires", () => {
      const e = new EventEmitter();
      let calls = 0;
      const handler = () => { calls += 1; };
      e.once("go", handler);
      e.off("go", handler);
      e.emit("go");
      assert(calls === 0, `a removed once handler still fired (${calls})`);
    }),
    check("a handler that unsubscribes itself does not skip the next one", () => {
      const e = new EventEmitter();
      const ran = [];
      const first = () => { ran.push("first"); e.off("go", first); };
      e.on("go", first);
      e.on("go", () => ran.push("second"));
      e.emit("go");
      assert(ran.join(",") === "first,second",
        `iteration was corrupted by an unsubscribe during emit: got ${ran.join(",")}`);
    }),
    check("a throwing handler does not stop the rest", () => {
      const reported = [];
      const e = new EventEmitter((err) => reported.push(err));
      let reached = false;
      e.on("go", () => { throw new Error("boom"); });
      e.on("go", () => { reached = true; });
      e.emit("go");
      assert(reached, "the handler after a throwing one never ran");
      assert(reported.length === 1 && reported[0].message === "boom",
        `the error should be reported through onError, got ${JSON.stringify(reported.map(String))}`);
    }),
    check("events are independent", () => {
      const e = new EventEmitter();
      let a = 0;
      e.on("a", () => { a += 1; });
      e.emit("b");
      assert(a === 0, "emitting one event called another event's handler");
    })
  ];
}
