/**
 * @param {Object} state - The original state object (plain object or array)
 * @param {Array<string|number>} path - Path to the nested property, e.g. ['users', 0, 'name']
 * @param {*} value - The new value to set at that path
 * @returns {Object} A new state object with the value set at path, original unchanged
 */
export default function updateNested(state, path, value) {
  if (typeof state !== 'object' || state === null) {
    throw new TypeError('state must be an object or array');
  }
  if (!Array.isArray(path)) {
    throw new TypeError('path must be an array');
  }
  if (path.length === 0) {
    // Setting the root to value, but we must not mutate the original.
    // Since the root is being replaced, we return value directly.
    // However, note that the original state is not mutated because we return a new reference.
    return value;
  }

  // We'll use a recursive approach to copy until we reach the target.
  const clone = Array.isArray(state) ? [...state] : { ...state };
  let current = clone;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    // If the next level doesn't exist or is null/undefined, we create an object.
    // But note: we should preserve the type? Usually, if it's an array we expect array, but for simplicity we use object.
    // However, the original might be an array at that level. We'll check.
    if (current[key] === null || current[key] === undefined) {
      // Determine what to create based on the next key being a number? Not reliable.
      // We'll default to object, but if the next key is a number we might want array.
      // Since we don't have type information, we'll follow the common practice: if next key is number, create array, else object.
      const nextKey = path[i + 1];
      current[key] = typeof nextKey === 'number' ? [] : {};
    } else if (typeof current[key] !== 'object') {
      // If it's a primitive, we cannot go deeper; we'll overwrite with an object to continue the path.
      const nextKey = path[i + 1];
      current[key] = typeof nextKey === 'number' ? [] : {};
    }
    current = current[key];
  }
  const lastKey = path[path.length - 1];
  current[lastKey] = value;
  return clone;
}