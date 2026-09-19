const check = (name, fn) => {
  try {
    fn();
    return { name, pass: true };
  } catch (err) {
    return { name, pass: false, message: err && err.message ? err.message : String(err) };
  }
};
const assert = (cond, message) => { if (!cond) throw new Error(message); };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export default async function tests(subject) {
  const { toQuery, fromQuery } = subject || {};
  if (typeof toQuery !== "function" || typeof fromQuery !== "function") {
    return [{ name: "exports toQuery and fromQuery", pass: false, message: "a named export is missing" }];
  }
  const DEFAULTS = { q: "", categories: [], sort: "relevance", page: 1 };

  return [
    check("defaults produce an empty query string", () => {
      assert(toQuery(DEFAULTS) === "", `got ${JSON.stringify(toQuery(DEFAULTS))}`);
    }),
    check("only non-default keys appear", () => {
      const out = toQuery({ ...DEFAULTS, page: 3 });
      assert(out === "page=3", `got ${JSON.stringify(out)}`);
    }),
    check("key order is stable regardless of object order", () => {
      const a = toQuery({ page: 2, sort: "newest", categories: ["x"], q: "hi" });
      const b = toQuery({ q: "hi", categories: ["x"], sort: "newest", page: 2 });
      assert(a === b, `"${a}" !== "${b}"`);
    }),
    check("categories round-trip as a comma-separated list", () => {
      const out = fromQuery(toQuery({ ...DEFAULTS, categories: ["books", "toys"] }));
      assert(eq(out.categories, ["books", "toys"]), `got ${JSON.stringify(out.categories)}`);
    }),
    check("a search term with spaces and & survives the round trip", () => {
      const out = fromQuery(toQuery({ ...DEFAULTS, q: "tea & coffee" }));
      assert(out.q === "tea & coffee", `got ${JSON.stringify(out.q)}`);
    }),
    check("page comes back as a number", () => {
      const out = fromQuery("page=4");
      assert(out.page === 4, `got ${JSON.stringify(out.page)} (${typeof out.page})`);
    }),
    check("fromQuery tolerates a leading ?", () => {
      assert(fromQuery("?page=2").page === 2, "a leading ? must be accepted");
    }),
    check("fromQuery supplies every default for an empty string", () => {
      assert(eq(fromQuery(""), DEFAULTS), `got ${JSON.stringify(fromQuery(""))}`);
    }),
    check("malformed values fall back to the default", () => {
      assert(fromQuery("page=-4").page === 1, "page=-4 must fall back to 1");
      assert(fromQuery("sort=drop%20table").sort === "relevance", "an unknown sort must fall back");
    }),
    check("unknown keys are ignored", () => {
      assert(eq(fromQuery("evil=1&page=2"), { ...DEFAULTS, page: 2 }),
        `got ${JSON.stringify(fromQuery("evil=1&page=2"))}`);
    })
  ];
}
