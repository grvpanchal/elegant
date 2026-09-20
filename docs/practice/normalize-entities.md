---
title: Normalise a nested API response
layout: question
slug: normalize-entities
format: coding
difficulty: hard
layer: state
topics: [store, crud, state]
skill: state-store
minutes: 35
summary: Flatten a deeply nested payload into entity tables keyed by id, so one update touches one place.
---

Your API returns posts with their author and comments embedded, and the same
author appears inside many posts. Storing that shape means one user rename has
to be applied in a dozen places, and half the time it is missed.

Implement `normalize(posts)` returning:

```js
{
  entities: {
    users:    { [id]: { id, name } },
    comments: { [id]: { id, body, author: <userId> } },
    posts:    { [id]: { id, title, author: <userId>, comments: [<commentId>] } }
  },
  result: [<postId>]   // the original order, preserved
}
```

Rules the tests enforce:

- Nested objects are replaced by their id; the object moves into `entities`.
- A repeated entity is stored once. Later copies **merge into** the stored one
  rather than replacing it, so a partial copy cannot erase fields.
- `result` keeps the input order.
- The input is never mutated.
- An empty input returns empty tables, not `undefined`.

{% include code-playground.html %}

## Solution

### Approach 1: a recursive walk with a schema

```js
const schema = {
  posts: { author: "users", comments: ["comments"] },
  comments: { author: "users" },
  users: {},
};
```

Walk each entity, and for every key the schema marks as a relation, extract the
nested value into its own table and leave the id behind. A relation written as
an array (`["comments"]`) means "a list of these".

The schema is what keeps this honest. Guessing relations from the data — "an
object with an `id` is an entity" — works on the fixture and fails the first
time a payload contains a value object that happens to carry an id.

### Approach 2: an explicit per-type extractor

```js
function normalize(posts) {
  const entities = { users: {}, comments: {}, posts: {} };
  const put = (table, entity) => {
    entities[table][entity.id] = { ...entities[table][entity.id], ...entity };
    return entity.id;
  };
  const result = posts.map((post) => put("posts", {
    id: post.id,
    title: post.title,
    author: put("users", post.author),
    comments: (post.comments || []).map((c) =>
      put("comments", { id: c.id, body: c.body, author: put("users", c.author) })),
  }));
  return { entities, result };
}
```

No schema, no recursion, and you can read the whole shape in one screen. `put`
is where the merge rule lives, in exactly one place.

The cost is that it only normalises this payload. A second endpoint means a
second function, and the two will drift.

## Trade-offs

Normalisation buys a single source of truth per entity: rename a user once and
every screen updates, because every screen reads through a
[selector](../state/selectors.html) that joins by id. It costs you the join —
rendering a post now needs three lookups instead of one property access — and
it costs you the normalising code itself.

The merge-don't-replace rule is the one people get wrong, and the bug is
delayed. A list endpoint returns `{id, name}` for an author; a detail endpoint
returns `{id, name, bio}`. If a later partial copy replaces the stored one, the
`bio` vanishes from a screen that was working a moment ago, and nothing in the
stack reports an error. Merging is two extra characters and removes the whole
class.

Do not normalise everything. A payload you render once and never mutate is
cheaper left as it arrived; the machinery pays for itself when an entity is
referenced from more than one place *and* can change.

## Related

- Reading: [Store](../state/store.html) · [CRUD](../state/crud.html) · [Selectors](../state/selectors.html)
- Playbook: [State management](../playbooks/state-management.html)
- Agent Skill: `state-store`
