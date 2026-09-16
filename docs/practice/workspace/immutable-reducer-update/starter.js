/**
 * @param {Object} state - The original state object (plain object or array)
 * @param {Array<string|number>} path - Path to the nested property, e.g. ['users', 0, 'name']
 * @param {*} value - The new value to set at that path
 * @returns {Object} A new state object with the value set at path, original unchanged
 * @throws {TypeError} If state is not an object or path is not an array
 */
export default function updateNested(state, path, value) {
  throw new Error("not implemented");
}