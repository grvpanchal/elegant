const check = (name, fn) => {
  try { fn(); return { name, pass: true }; }
  catch (err) { return { name, pass: false, message: err && err.message ? err.message : String(err) }; }
};
const assert = (cond, message) => { if (!cond) throw new Error(message); };

export default async function tests(subject) {
  const deepClone = typeof subject === "function" ? subject : subject && subject.default;
  if (typeof deepClone !== "function") {
    return [{ name: "module default-exports deepClone", pass: false, message: "no default export" }];
  }

  return [
    check("primitives and null pass through", () => {
      assert(deepClone(5) === 5 && deepClone("x") === "x" && deepClone(null) === null,
        "a primitive should come back unchanged");
    }),
    check("nested objects are copied, not shared", () => {
      const input = { a: { b: { c: 1 } } };
      const out = deepClone(input);
      assert(out.a.b.c === 1, "the value did not survive");
      assert(out.a !== input.a && out.a.b !== input.a.b, "a nested reference is shared with the input");
    }),
    check("arrays clone as arrays", () => {
      const out = deepClone([1, [2, [3]]]);
      assert(Array.isArray(out) && Array.isArray(out[1]), "nested arrays must stay arrays");
      assert(out[1][1][0] === 3, `got ${JSON.stringify(out)}`);
    }),
    check("Date clones as a Date with the same time", () => {
      const d = new Date("2020-01-02T03:04:05Z");
      const out = deepClone({ d }).d;
      assert(out instanceof Date, "Date became " + Object.prototype.toString.call(out));
      assert(out.getTime() === d.getTime() && out !== d, "a Date must be copied, not shared");
    }),
    check("Map and Set clone as their own types", () => {
      const out = deepClone({ m: new Map([["k", { v: 1 }]]), s: new Set([1, 2]) });
      assert(out.m instanceof Map, "Map became " + Object.prototype.toString.call(out.m));
      assert(out.s instanceof Set, "Set became " + Object.prototype.toString.call(out.s));
      assert(out.m.get("k").v === 1, "the Map value did not survive");
    }),
    check("functions come back as-is", () => {
      const fn = () => 1;
      assert(deepClone({ fn }).fn === fn, "functions are not cloned");
    }),
    check("a cycle clones without hanging and keeps its cycle", () => {
      const a = { name: "a" };
      a.self = a;
      const out = deepClone(a);
      assert(out !== a, "the clone is the input");
      assert(out.self === out, "the cycle was not preserved");
    }),
    check("a shared reference stays shared in the clone", () => {
      const shared = { n: 1 };
      const out = deepClone({ x: shared, y: shared });
      assert(out.x === out.y, "the graph was flattened into two separate copies");
      assert(out.x !== shared, "the clone still points at the original");
    }),
    check("mutating the clone does not touch the input", () => {
      const input = { list: [{ n: 1 }] };
      const out = deepClone(input);
      out.list[0].n = 99;
      assert(input.list[0].n === 1, `the input was mutated to ${input.list[0].n}`);
    })
  ];
}
