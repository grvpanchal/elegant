---
title: "Normalize your API responses: the refactor that pays for itself"
layout: post
slug: normalize-your-api-responses
date: 2026-09-21
author: The Elegant team
category: architecture
tags: [state, store, api, refactor]
description: A nested API payload is a tax you pay on every read and every update. Flattening it into entity tables keyed by id is the one refactor that makes the rest of your state code simpler.
cover: /assets/img/diagrams/state-system-diagram.png
reading_minutes: 5
related_practice: [normalize-entities, deep-clone, memoized-selector]
---

APIs return data shaped for *transport*: deeply nested, with the same entity
duplicated wherever it is referenced. A list of posts each carries its author
object; the same author appears in ten posts. If you store that payload in your
state as-is, every one of those copies is now a fact you have to keep in sync, and
updating an author's name means finding and editing ten nested objects. The fix
is **normalization**: flatten the nesting into flat tables keyed by id, exactly
like a relational database. It is the one state refactor that reliably makes
everything downstream simpler.

<figure class="blog-figure" data-blog-diagram>
<svg viewBox="0 0 640 220" role="img" aria-labelledby="nz-t nz-d" class="blog-figure__svg">
  <title id="nz-t">Nested duplicated payload versus normalised entity tables keyed by id</title>
  <desc id="nz-d">On the left two posts each embed a copy of the same author. On the right posts and users are separate tables keyed by id, and posts reference the author by id, so the author exists once.</desc>
  <text x="150" y="26" text-anchor="middle" fill="#c2571a" font-size="12" font-weight="700">nested (duplicated)</text>
  <g fill="#fff4ec" stroke="#fe854c" stroke-width="2" font-size="9" text-anchor="middle">
    <rect x="55" y="40" width="190" height="55" rx="6"/><text x="150" y="60" fill="#c2571a">post 1 → author {id:7, name}</text>
    <rect x="55" y="105" width="190" height="55" rx="6"/><text x="150" y="125" fill="#c2571a">post 2 → author {id:7, name}</text>
  </g>
  <text x="150" y="185" text-anchor="middle" fill="#819198" font-size="9">author 7 stored twice → edit both or drift</text>
  <line x1="320" y1="26" x2="320" y2="200" stroke="#dce6f0"/>
  <text x="480" y="26" text-anchor="middle" fill="#157878" font-size="12" font-weight="700">normalised</text>
  <g fill="#e8f0f8" stroke="#157878" stroke-width="2" font-size="9" text-anchor="middle">
    <rect x="360" y="40" width="240" height="30" rx="5"/><text x="480" y="59" fill="#157878">posts.byId: 1 → {authorId:7}, 2 → {authorId:7}</text>
    <rect x="360" y="90" width="240" height="30" rx="5"/><text x="480" y="109" fill="#157878">users.byId: 7 → {name}</text>
  </g>
  <text x="480" y="160" text-anchor="middle" fill="#819198" font-size="9">author 7 stored once → edit one place</text>
</svg>
<figcaption>The same data, two shapes. Nested duplicates the author into every post; normalised stores it once and references it by id.</figcaption>
</figure>

## The shape: byId plus allIds

The normalised form for a collection is two parts: a `byId` map for O(1) lookup by
id, and an `allIds` array to preserve order and let you iterate. A transform turns
the API's array into this shape:

```js
function normalize(posts) {
  const byId = {};
  const allIds = [];
  for (const post of posts) {
    byId[post.id] = post;      // keyed lookup
    allIds.push(post.id);      // ordered list
  }
  return { byId, allIds };
}
// { byId: { 1: {...}, 2: {...} }, allIds: [1, 2] }
```

Nested relationships get the same treatment: pull the authors into their own
`users.byId` table and replace each post's embedded author with an `authorId`.

## Reads and updates both get cheaper

With `byId`, looking up a post is `state.posts.byId[id]` — no `.find()` scan of an
array. And updating an entity touches exactly one place, immutably, without
walking a nested tree:

```js
// update one user's name — one entry, no matter how many posts reference them
case "USER_RENAMED":
  return {
    ...state,
    users: {
      ...state.users,
      byId: { ...state.users.byId, [action.id]: {
        ...state.users.byId[action.id], name: action.name,
      }},
    },
  };
```

Every post that references `authorId: 7` now reads the new name automatically,
because there was only ever one copy.

## Rehydrate the shape with selectors

The nested shape was convenient for rendering, and you do not lose it — you
*derive* it back with a selector at read time, joining the tables. A memoized
selector recombines `posts` with their `users` only when either table changes, so
the join is cheap and the stored state stays flat:

```js
const selectPostsWithAuthors = createSelector(
  [(s) => s.posts.allIds, (s) => s.posts.byId, (s) => s.users.byId],
  (ids, posts, users) =>
    ids.map((id) => ({ ...posts[id], author: users[posts[id].authorId] }))
);
```

This is the same principle behind a database's normal forms: store each fact once,
join on read. Normalisation front-loads a little transform code and pays it back
on every update you no longer have to duplicate and every list scan you turn into
a keyed lookup. The normalize-entities exercise builds the `byId`/`allIds`
transform and the selector join, which is the whole pattern in miniature.
