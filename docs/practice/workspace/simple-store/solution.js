/**
 * Create a Redux-like store.
 * @param {Function} reducer - A reducing function that returns the next state.
 * @param {*} [initialState] - The initial state.
 * @returns {{getState: Function, dispatch: Function, subscribe: Function}}
 */
export default function createStore(reducer, initialState) {
  let state = initialState;
  let listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      listeners = listeners.filter(l => l !== listener);
    };
  }

  // Initialize the store with an init action to set up state
  dispatch({ type: '@@INIT' });

  return { getState, dispatch, subscribe };
}