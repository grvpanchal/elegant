export default async function tests(subject) {
  const results = [];

  // Helper to create a mock dispatch that records calls
  function createMockDispatch() {
    const calls = [];
    const mock = (...args) => {
      calls.push(args);
      return undefined;
    };
    mock.calls = calls;
    return mock;
  }

  // Test 1: empty middlewares returns original dispatch
  try {
    const dispatch = createMockDispatch();
    const enhanced = subject(dispatch, []);
    // Should be the same function
    if (enhanced === dispatch) {
      results.push({ name: "empty middlewares returns original dispatch", pass: true, message: "Correctly returns the original dispatch when no middlewares are provided." });
    } else {
      results.push({ name: "empty middlewares returns original dispatch", pass: false, message: `Expected original dispatch, got ${enhanced.name || enhanced}` });
    }
  } catch (e) {
    results.push({ name: "empty middlewares returns original dispatch", pass: false, message: `Threw exception: ${e.message}` });
  }

  // Test 2: single middleware that increments a counter
  try {
    const dispatch = createMockDispatch();
    let counter = 0;
    const middleware = store => next => action => {
      counter++;
      return next(action);
    };
    const enhanced = subject(dispatch, [middleware]);
    enhanced({ type: 'INCREMENT' });
    if (counter === 1) {
      results.push({ name: "single middleware increments counter", pass: true, message: "Middleware was called exactly once." });
    } else {
      results.push({ name: "single middleware increments counter", pass: false, message: `Expected counter to be 1, got ${counter}` });
    }
  } catch (e) {
    results.push({ name: "single middleware increments counter", pass: false, message: `Threw exception: ${e.message}` });
  }

  // Test 3: two middlewares where first adds a property and second reads it
  try {
    const dispatch = createMockDispatch();
    const middleware1 = store => next => action => {
      // Add a property to action
      const newAction = { ...action, addedByMiddleware1: true };
      return next(newAction);
    };
    const middleware2 = store => next => action => {
      // Expect the property to be present
      if (!action.addedByMiddleware1) {
        throw new Error('Property addedByMiddleware1 missing');
      }
      return next(action);
    };
    const enhanced = subject(dispatch, [middleware1, middleware2]);
    enhanced({ type: 'TEST' });
    // If we reach here without error, middleware2 saw the property
    results.push({ name: "two middlewares propagate added property", pass: true, message: "Second middleware received the property added by the first." });
  } catch (e) {
    results.push({ name: "two middlewares propagate added property", pass: false, message: `Expected no error, got: ${e.message}` });
  }

  // Test 4: middleware that short-circuits (does not call next)
  try {
    const dispatch = createMockDispatch();
    const middleware = store => next => action => {
      // Do not call next, swallow the action
      return undefined;
    };
    const enhanced = subject(dispatch, [middleware]);
    const result = enhanced({ type: 'SWALLOW' });
    // Since dispatch was never called, result should be undefined (from middleware)
    if (result === undefined && dispatch.calls.length === 0) {
      results.push({ name: "middleware can short-circuit and prevent dispatch", pass: true, message: "Dispatch was not called when middleware did not invoke next." });
    } else {
      results.push({ name: "middleware can short-circuit and prevent dispatch", pass: false, message: `Expected dispatch not called and result undefined, got dispatch calls ${dispatch.calls.length} and result ${result}` });
    }
  } catch (e) {
    results.push({ name: "middleware can short-circuit and prevent dispatch", pass: false, message: `Threw exception: ${e.message}` });
  }

  return results;
}