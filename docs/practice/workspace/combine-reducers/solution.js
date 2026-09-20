/**
 * Combine multiple reducer functions into a single reducer.
 * @param {Object.<string, Function>} reducers - An object where keys are state slice names and values are reducer functions.
 * @returns {Function} A reducer that handles every slice.
 */
export default function combineReducers(reducers) {
  // Ensure reducers is an object
  if (typeof reducers !== 'object' || reducers === null || Array.isArray(reducers)) {
    throw new Error('combineReducers expects an object.');
  }

  // Get the list of reducer keys
  const reducerKeys = Object.keys(reducers);
  // Ensure every reducer is a function
  for (let key of reducerKeys) {
    if (typeof reducers[key] !== 'function') {
      throw new Error(`Expected the reducer at ${key} to be a function.`);
    }
  }

  // Return the combined reducer
  return function combination(state = {}, action) {
    // If state is undefined, initialize each slice with its reducer's initial state
    const nextState = {};
    let hasChanged = false;

    for (let key of reducerKeys) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    // If no slice changed, return the original state object (for immutability)
    return hasChanged ? nextState : state;
  };
}