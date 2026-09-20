export default async function tests(subject) {
  const results = [];

  // Helper to create a simple reducer that increments a number
  function counterReducer(state = 0, action) {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state;
    }
  }

  // Helper to create a reducer that toggles a boolean
  function toggleReducer(state = false, action) {
    switch (action.type) {
      case 'TOGGLE':
        return !state;
      default:
        return state;
    }
  }

  // Helper to create a reducer that stores a string
  function textReducer(state = '', action) {
    switch (action.type) {
      case 'SET_TEXT':
        return action.payload;
      default:
        return state;
    }
  }

  // Test 1: Basic combination of two reducers
  try {
    const combined = subject({ counter: counterReducer, toggle: toggleReducer });
    let state = combined(undefined, {}); // Initialize
    // Check initial state
    if (state.counter !== 0 || state.toggle !== false) {
      results.push({ name: "basic combination initial state", pass: false, message: `Expected { counter: 0, toggle: false }, got ${JSON.stringify(state)}` });
    } else {
      // Dispatch an action
      state = combined(state, { type: 'INCREMENT' });
      if (state.counter === 1 && state.toggle === false) {
        results.push({ name: "basic combination handles INCREMENT", pass: true, message: "Counter incremented, toggle unchanged." });
      } else {
        results.push({ name: "basic combination handles INCREMENT", pass: false, message: `Expected counter 1 and toggle false, got ${JSON.stringify(state)}` });
      }
    }
  } catch (e) {
    results.push({ name: "basic combination of two reducers", pass: false, message: `Threw exception: ${e.message}` });
  }

  // Test 2: State immutability when no changes
  try {
    const combined = subject({ counter: counterReducer, toggle: toggleReducer });
    let state = combined(undefined, {});
    const action = { type: 'UNKNOWN' };
    const nextState = combined(state, action);
    if (nextState === state) {
      results.push({ name: "state immutability when no changes", pass: true, message: "Combined reducer returns the same state when no reducer changes state." });
    } else {
      results.push({ name: "state immutability when no changes", pass: false, message: "Expected same state reference, got a new one." });
    }
  } catch (e) {
    results.push({ name: "state immutability when no changes", pass: false, message: `Threw exception: ${e.message}` });
  }

  // Test 3: Error handling for non-object reducers
  try {
    subject(null);
    results.push({ name: "error handling for non-object reducers", pass: false, message: "Expected throw when reducers is null." });
  } catch (e) {
    if (e instanceof Error && e.message.includes('expects an object')) {
      results.push({ name: "error handling for non-object reducers", pass: true, message: "Correctly throws for non-object input." });
    } else {
      results.push({ name: "error handling for non-object reducers", pass: false, message: `Threw but wrong message: ${e.message}` });
    }
  }

  // Test 4: Error handling for non-function reducer
  try {
    subject({ counter: 'not a function' });
    results.push({ name: "error handling for non-function reducer", pass: false, message: "Expected throw when a reducer is not a function." });
  } catch (e) {
    if (e instanceof Error && e.message.includes('Expected the reducer at counter to be a function')) {
      results.push({ name: "error handling for non-function reducer", pass: true, message: "Correctly throws for non-function reducer." });
    } else {
      results.push({ name: "error handling for non-function reducer", pass: false, message: `Threw but wrong message: ${e.message}` });
    }
  }

  return results;
}