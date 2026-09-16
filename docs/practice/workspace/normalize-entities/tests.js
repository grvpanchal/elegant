const check = (name, fn) => {
  try { fn(); return { name, pass: true }; }
  catch (err) { return { name, pass: false, message: err && err.message ? err.message : String(err) }; }
};
const assert = (cond, message) => { if (!cond) throw new Error(message); };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const fixture = () => ([
  {
    id: "p1", title: "First",
    author: { id: "u1", name: "Ada" },
    comments: [
      { id: "c1", body: "nice", author: { id: "u2", name: "Grace" } },
      { id: "c2", body: "agreed", author: { id: "u1", name: "Ada" } },
    ],
  },
  { id: "p2", title: "Second", author: { id: "u2", name: "Grace", bio: "compiler" }, comments: [] },
]);

export default async function tests(subject) {
  const normalize = typeof subject === "function" ? subject : subject && subject.default;
  if (typeof normalize !== "function") {
    return [{ name: "module default-exports normalize", pass: false, message: "no default export" }];
  }

  return [
    check("result keeps the input order", () => {
      assert(eq(normalize(fixture()).result, ["p1", "p2"]),
        `got ${JSON.stringify(normalize(fixture()).result)}`);
    }),
    check("posts are keyed by id and reference their author by id", () => {
      const { entities } = normalize(fixture());
      assert(entities.posts.p1.author === "u1", `got ${JSON.stringify(entities.posts.p1.author)}`);
      assert(entities.posts.p1.title === "First", "title must survive");
    }),
    check("comments become a list of ids", () => {
      const { entities } = normalize(fixture());
      assert(eq(entities.posts.p1.comments, ["c1", "c2"]),
        `got ${JSON.stringify(entities.posts.p1.comments)}`);
    }),
    check("a repeated entity is stored once", () => {
      const { entities } = normalize(fixture());
      assert(Object.keys(entities.users).length === 2,
        `expected 2 users, got ${Object.keys(entities.users)}`);
    }),
    check("a later partial copy MERGES rather than replacing", () => {
      const { entities } = normalize(fixture());
      assert(entities.users.u2.bio === "compiler",
        "u2 appears first without a bio and later with one; the bio must survive");
      assert(entities.users.u2.name === "Grace", "the name must survive too");
    }),
    check("nested comment authors are extracted", () => {
      const { entities } = normalize(fixture());
      assert(entities.comments.c1.author === "u2", `got ${JSON.stringify(entities.comments.c1.author)}`);
    }),
    check("the input is not mutated", () => {
      const input = fixture();
      const snapshot = JSON.stringify(input);
      normalize(input);
      assert(JSON.stringify(input) === snapshot, "the input payload was modified");
    }),
    check("an empty input returns empty tables", () => {
      const out = normalize([]);
      assert(eq(out.result, []), `result should be [], got ${JSON.stringify(out.result)}`);
      assert(out.entities && out.entities.users && eq(out.entities.users, {}),
        `entities.users should be {}, got ${JSON.stringify(out.entities && out.entities.users)}`);
    })
  ];
}
