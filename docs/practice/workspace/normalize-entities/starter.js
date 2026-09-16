/**
 * normalize(posts) -> { entities: { users, comments, posts }, result }
 *
 * - nested objects are replaced by their id and moved into `entities`
 * - a repeated entity is stored once; later copies MERGE into the stored one
 * - `result` keeps the input order
 * - the input is never mutated
 */
export default function normalize(posts) {
  throw new Error("not implemented");
}
