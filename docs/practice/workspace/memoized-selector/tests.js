/**
 * Contract: default-export `async (subject) => [{name, pass, message?}, ...]`.
 * `subject` is the learner's module namespace, or its default export.
 * The same file runs in the browser playground and under Node in
 * harness/check_harness.py, so keep it dependency-free.
 */
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
  const createSelector = typeof subject === "function" ? subject : subject.default;
  if (typeof createSelector !== "function") {
    return [{ name: "module default-exports createSelector", pass: false, message: "no default export" }];
  }

  const todos = (s) => s.todos;
  const filter = (s) => s.filter;
  const build = () =>
    createSelector(todos, filter, (list, f) => list.filter((t) => (f === "all" ? true : t.done === (f === "done"))));

  return [
    check("returns the computed result", () => {
      const sel = build();
      const state = { todos: [{ done: true }, { done: false }], filter: "done" };
      assert(sel(state).length === 1, `expected 1 item, got ${JSON.stringify(sel(state))}`);
    }),
    check("same inputs -> no recomputation", () => {
      const sel = build();
      const state = { todos: [{ done: true }], filter: "all" };
      sel(state);
      sel(state);
      sel({ ...state });
      assert(sel.recomputations() === 1, `expected 1 recomputation, got ${sel.recomputations()}`);
    }),
    check("same inputs -> identical result reference", () => {
      const sel = build();
      const state = { todos: [{ done: true }], filter: "all" };
      assert(sel(state) === sel(state), "cached result must be the same reference");
    }),
    check("changed input -> recomputes", () => {
      const sel = build();
      const list = [{ done: true }, { done: false }];
      sel({ todos: list, filter: "all" });
      sel({ todos: list, filter: "done" });
      assert(sel.recomputations() === 2, `expected 2 recomputations, got ${sel.recomputations()}`);
    }),
    check("cache is one entry deep", () => {
      const sel = build();
      const a = [{ done: true }];
      const b = [{ done: false }];
      sel({ todos: a, filter: "all" });
      sel({ todos: b, filter: "all" });
      sel({ todos: a, filter: "all" });
      assert(sel.recomputations() === 3, `expected 3 recomputations for A,B,A; got ${sel.recomputations()}`);
    }),
    check("recomputations() starts at 0", () => {
      const sel = build();
      assert(sel.recomputations() === 0, `expected 0, got ${sel.recomputations()}`);
    })
  ];
}
