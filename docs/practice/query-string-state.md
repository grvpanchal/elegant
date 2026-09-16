---
title: Round-trip filter state through the URL
layout: question
slug: query-string-state
format: coding
difficulty: medium
layer: server
topics: [router, links, page]
skill: server-router
minutes: 25
summary: Serialise a filter object to a query string and parse it back, so a filtered view is shareable and the back button works.
---

A product list has filters: a search term, a set of selected categories, a sort
order and a page number. Today they live in component state, so a filtered view
cannot be linked, refreshed or reached with the back button.

Move them into the URL. Implement two functions:

- `toQuery(filters)` — returns a query string **without** the leading `?`.
- `fromQuery(search)` — parses a query string (with or without the `?`) back
  into a filter object.

Rules the tests enforce:

- Keys appear in a stable order, so the same filters always produce the same
  string and the URL is cacheable.
- A value equal to its default is **omitted**, so a clean view has a clean URL.
  Defaults: `q: ""`, `categories: []`, `sort: "relevance"`, `page: 1`.
- `categories` round-trips as a comma-separated list.
- `page` comes back as a number, not a string.
- Unknown keys are ignored; malformed values fall back to the default.

{% include code-playground.html %}

## Solution

### Approach 1: URLSearchParams with an explicit key order

```js
const DEFAULTS = { q: "", categories: [], sort: "relevance", page: 1 };
const ORDER = ["q", "categories", "sort", "page"];

export function toQuery(filters) {
  const merged = { ...DEFAULTS, ...filters };
  const params = new URLSearchParams();
  for (const key of ORDER) {
    const value = merged[key];
    if (key === "categories") {
      if (value.length) params.set(key, value.join(","));
    } else if (value !== DEFAULTS[key]) {
      params.set(key, String(value));
    }
  }
  return params.toString();
}
```

`URLSearchParams` handles the encoding, which is the part people get wrong by
hand — a search term containing `&` or a space silently breaks a manual
implementation. Iterating a fixed `ORDER` rather than `Object.keys` is what
makes the output stable: object key order follows insertion, and the filter
object is built in a different order in every call site.

### Approach 2: a per-key codec table

```js
const CODECS = {
  q:          { encode: (v) => v, decode: (v) => v, default: "" },
  categories: { encode: (v) => v.join(","), decode: (v) => v.split(",").filter(Boolean), default: [] },
  sort:       { encode: (v) => v, decode: (v) => (SORTS.includes(v) ? v : "relevance"), default: "relevance" },
  page:       { encode: String, decode: (v) => (Number.isInteger(+v) && +v > 0 ? +v : 1), default: 1 },
};
```

Each key owns its encoding, its decoding and its default in one place, and
`toQuery` / `fromQuery` become loops over the table. Adding a filter is one
entry instead of three edits in two functions, and validation lives next to the
thing it validates.

## Trade-offs

The codec table costs an indirection and earns it the moment there are more
than three or four filters, because the failure mode of Approach 1 is a decoder
that drifts out of step with its encoder — you add a filter to `toQuery` and
forget `fromQuery`, and the URL silently loses state on reload.

Omitting defaults is the detail worth defending. It keeps the canonical URL for
"no filters" identical to the bare path, which means one cache entry instead of
many and a share link that does not look like a debug dump. The cost is that
`fromQuery` must supply every default, so the two functions are only correct
together — which is the argument for the table.

Validating on decode is not optional. The query string is user input: someone
will hand you `page=-4` or `sort=drop%20table`, and a filter object built from
it flows straight into a request.

## Related

- Reading: [Router](../server/router.html) · [Links](../server/links.html) · [Page](../server/page.html)
- Agent Skill: `server-router`
