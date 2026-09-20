/**
 * createSelector(...inputSelectors, resultFn)
 *
 * Return a selector that:
 *   - runs every input selector against `state`
 *   - reuses the cached result when every input is `===` to the previous call
 *   - otherwise calls resultFn(...inputs) and caches the result
 *   - exposes selector.recomputations() -> how many times resultFn ran
 */
export default function createSelector(...fns) {
  // Your code here.
  throw new Error("not implemented");
}
