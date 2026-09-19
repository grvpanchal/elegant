export default function createSelector(...fns) {
  const resultFn = fns.pop();
  const inputs = fns;
  let lastArgs = null;
  let lastResult;
  let recomputations = 0;

  function selector(state) {
    const next = inputs.map((fn) => fn(state));
    const hit =
      lastArgs !== null &&
      lastArgs.length === next.length &&
      next.every((value, i) => value === lastArgs[i]);
    if (!hit) {
      lastResult = resultFn(...next);
      lastArgs = next;
      recomputations += 1;
    }
    return lastResult;
  }

  selector.recomputations = () => recomputations;
  return selector;
}
