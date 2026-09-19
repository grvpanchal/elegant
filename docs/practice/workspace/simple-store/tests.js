export default async function tests(subject) {
  const results = [];

  // Test 1: getState returns initialState
  try {
    const store = subject((state = 0) => state, 5);
    if (store.getState() === 5) {
      results.push({ name: "getState returns initialState", pass: true, message: "" });
    } else {
      results.push({ name: "getState returns initialState", pass: false, message: `Expected 5, got ${store.getState()}` });
    }
  } catch (e) {
    results.push({ name: "getState returns initialState", pass: false, message: e.message });
  }

  // Test 2: dispatch updates state via reducer
  try {
    const store = subject((state = 0, action) => {
      if (action.type === 'INCREMENT') return state + 1;
      return state;
    }, 0);
    store.dispatch({ type: 'INCREMENT' });
    if (store.getState() === 1) {
      results.push({ name: "dispatch updates state", pass: true, message: "" });
    } else {
      results.push({ name: "dispatch updates state", pass: false, message: `Expected 1, got ${store.getState()}` });
    }
  } catch (e) {
    results.push({ name: "dispatch updates state", pass: false, message: e.message });
  }

  // Test 3: subscribe listener is called on dispatch
  try {
    let called = false;
    const store = subject((state = 0) => state, 0);
    const unsubscribe = store.subscribe(() => { called = true; });
    store.dispatch({ type: 'ANY' });
    if (called) {
      results.push({ name: "subscribe listener called", pass: true, message: "" });
    } else {
      results.push({ name: "subscribe listener called", pass: false, message: "Listener was not called" });
    }
    // cleanup
    unsubscribe();
  } catch (e) {
    results.push({ name: "subscribe listener called", pass: false, message: e.message });
  }

  // Test 4: unsubscribe removes listener
  try {
    let callCount = 0;
    const store = subject((state = 0) => state, 0);
    const unsubscribe = store.subscribe(() => { callCount++; });
    store.dispatch({ type: 'FIRST' }); // callCount = 1
    unsubscribe();
    store.dispatch({ type: 'SECOND' }); // should not call
    if (callCount === 1) {
      results.push({ name: "unsubscribe removes listener", pass: true, message: "" });
    } else {
      results.push({ name: "unsubscribe removes listener", pass: false, message: `Expected 1 call, got ${callCount}` });
    }
  } catch (e) {
    results.push({ name: "unsubscribe removes listener", pass: false, message: e.message });
  }

  // Test 5: multiple subscribers
  try {
    let a = 0, b = 0;
    const store = subject((state = 0) => state, 0);
    const unsubA = store.subscribe(() => { a++; });
    const unsubB = store.subscribe(() => { b++; });
    store.dispatch({ type: 'X' });
    if (a === 1 && b === 1) {
      results.push({ name: "multiple subscribers", pass: true, message: "" });
    } else {
      results.push({ name: "multiple subscribers", pass: false, message: `Expected a=1,b=1, got a=${a},b=${b}` });
    }
    unsubA();
    unsubB();
  } catch (e) {
    results.push({ name: "multiple subscribers", pass: false, message: e.message });
  }

  return results;
}