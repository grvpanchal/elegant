---
title: "State: decide where a value lives first"
layout: lesson
course: state-layer
slug: state
term: state/state
skill: state-state
practice: deep-clone
description: "Before an agent writes a reducer, classify every value as local, global, server or URL state. That one decision sizes everything after it."
insight: "State is the memory of your application. The first design decision is not which library to use but where each value lives: local, global, server or URL. An agent defaults to putting everything in the store, so classify each value before it writes a line."
---

## Four homes for a value

The [State]({{ '/state/state.html' | relative_url }}) doc names three kinds of state, and the `state-state` skill adds a fourth:

- **Local** state belongs to one component: an input's value, or whether a dropdown is open.
- **Global** state is shared across unrelated components or routes: the signed-in user, the theme, a cart. This is what the store is for.
- **Server** state is data fetched from an API that has to stay in sync, which brings loading, caching and stale copies with it.
- **URL** state is shareable and bookmarkable: the page, the filters, the sort order.

The skill's decision tree is short enough to paste into a prompt. If unrelated components need the value, it is global. Otherwise, if it comes from an API, it is server state. Otherwise, if it should survive a shared link, it goes in the URL. Anything left is local.

## What the templates chose

Open `templates/chota-react-redux/src/state/` to see those decisions made. `rootReducer.js` combines three slices: `todo`, `filters` and `config`. The todo slice's initial state (`todo/todo.initial.js`) holds `todoItems` with its lifecycle flags `isLoading`, `isActionLoading`, `isContentLoading` and `error`. That is server state, stored next to its loading and error flags. The visibility filter gets its own `filters` slice because the filter buttons and the list both read it. If the filtered view had to survive a refresh or a shared link, the decision tree would send it to the URL instead.

## The three mistakes agents make

The doc's Common Mistakes are what an agent writes when nobody steers it:

1. **Storing derived data.** It keeps `itemCount` beside `items` and updates both. Compute `items.length` instead: with a single source of truth, the two can never drift apart.
2. **Mutating state directly.** It writes `user.age = 31; setUser(user)`. React and most state libraries detect a change by comparing references, so this update silently disappears.
3. **Putting everything in global state.** It adds `modal1Open`, `dropdown1Expanded` and `inputFocused` to the store. Every subscriber now re-renders, and every component becomes harder to reuse.

The second mistake is why the practice question has you clone data at the store's edge. When data comes from outside, copy it once on the way in, and never keep a reference that other code can still mutate.

## Brief an agent with it

Before you ask for a feature, list its values and where each one lives:

```text
State plan for the product list:
- search box text: local (SearchInput)
- signed-in user: global (store, user slice)
- products: server state, with loading and error tracked
- category filter and page: URL search params
Derive counts and totals in selectors; store none of them.
```

Then review the diff against the skill's quality gates:

- No value is stored in two places.
- Derived data is computed, not stored.
- Loading and error states are handled.
- Everything in the store can be serialised.
