const check = (name, fn) => {
  try {
    fn();
    return { name, pass: true };
  } catch (err) {
    return { name, pass: false, message: err && err.message ? err.message : String(err) };
  }
};

const assert = (cond, message) => {
  if (!cond) throw new Error(message);
};

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default async function tests(subject) {
  const { increment, decrement, setCount } = subject || {};
  if (typeof increment !== "function" || typeof decrement !== "function" || typeof setCount !== "function") {
    return [{ name: "exports increment, decrement and setCount", pass: false,
              message: "one or more named exports is missing" }];
  }

  return [
    check("increment() -> { type: 'INCREMENT' }", () => {
      assert(same(increment(), { type: "INCREMENT" }), `got ${JSON.stringify(increment())}`);
    }),
    check("decrement() -> { type: 'DECREMENT' }", () => {
      assert(same(decrement(), { type: "DECREMENT" }), `got ${JSON.stringify(decrement())}`);
    }),
    check("setCount(7) carries the payload", () => {
      assert(same(setCount(7), { type: "SET_COUNT", payload: 7 }), `got ${JSON.stringify(setCount(7))}`);
    }),
    check("setCount(0) does not drop a falsy payload", () => {
      const action = setCount(0);
      assert("payload" in action && action.payload === 0,
        `payload must survive being 0, got ${JSON.stringify(action)}`);
    }),
    check("a fresh object every call — actions must not be shared", () => {
      assert(increment() !== increment(), "two calls returned the same object reference");
    }),
    check("pure: no argument is mutated and no state is kept", () => {
      const payload = { id: 1 };
      const first = setCount(payload);
      setCount({ id: 2 });
      assert(first.payload === payload, "the first action's payload was replaced by a later call");
      assert(same(payload, { id: 1 }), "the argument object was mutated");
    })
  ];
}
