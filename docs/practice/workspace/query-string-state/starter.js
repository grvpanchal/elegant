/**
 * Round-trip filter state through the URL.
 *
 * Defaults: { q: "", categories: [], sort: "relevance", page: 1 }
 *
 * toQuery(filters)  -> a query string with no leading "?", keys in a stable
 *                      order, values equal to their default omitted.
 * fromQuery(search) -> a full filter object, with every default supplied and
 *                      malformed values replaced by their default.
 */
export function toQuery(filters) {
  throw new Error("not implemented");
}

export function fromQuery(search) {
  throw new Error("not implemented");
}
