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

export default async function tests(subject) {
  const reducer = typeof subject === "function" ? subject : subject && subject.default;
  if (typeof reducer !== "function") {
    return [{ name: "module default-exports the reducer", pass: false, message: "no default export" }];
  }

  return [
    check("increment adds one", () => {
      assert(reducer({ count: 1 }, { type: "increment" }).count === 2,
        `got ${JSON.stringify(reducer({ count: 1 }, { type: "increment" }))}`);
    }),
    check("decrement subtracts one", () => {
      assert(reducer({ count: 1 }, { type: "decrement" }).count === 0,
        `got ${JSON.stringify(reducer({ count: 1 }, { type: "decrement" }))}`);
    }),
    check("reset returns to zero", () => {
      assert(reducer({ count: 42 }, { type: "reset" }).count === 0,
        `got ${JSON.stringify(reducer({ count: 42 }, { type: "reset" }))}`);
    }),
    check("the state argument is never mutated", () => {
      const state = { count: 5 };
      reducer(state, { type: "increment" });
      assert(state.count === 5, `the input state changed to ${state.count}`);
    }),
    check("a change returns a NEW object", () => {
      const state = { count: 5 };
      assert(reducer(state, { type: "increment" }) !== state,
        "the reducer returned the same object reference after a change");
    }),
    check("an unknown action returns the same reference", () => {
      const state = { count: 5 };
      assert(reducer(state, { type: "NOT_A_REAL_ACTION" }) === state,
        "an unhandled action must return the state it was given, by reference");
    }),
    check("the default initial state is { count: 0 }", () => {
      assert(reducer(undefined, { type: "@@INIT" }).count === 0,
        `got ${JSON.stringify(reducer(undefined, { type: "@@INIT" }))}`);
    })
  ];
}
