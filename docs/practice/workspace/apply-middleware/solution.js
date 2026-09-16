/**
 * Apply middleware to a store's dispatch function.
 * @param {Function} dispatch - Original store.dispatch
 * @param {Array<Function>} middlewares - Array of middleware functions
 * @returns {Function} Enhanced dispatch
 */
export default function applyMiddleware(dispatch, middlewares) {
  if (!Array.isArray(middlewares)) {
    throw new Error('middlewares must be an array');
  }
  if (middlewares.length === 0) {
    return dispatch;
  }

  // Mock store with only dispatch (getState is not required for this exercise)
  const mockStore = {
    getState: () => {
      throw new Error('getState not implemented in applyMiddleware mock store');
    },
    dispatch: (...args) => dispatch(...args)
  };

  // Enhance dispatch with each middleware
  const chain = middlewares.map(middleware => middleware(mockStore));
  // Compose from right to left so that middleware is applied in the order given
  let enhancedDispatch = chain.reduceRight((next, enhancer) => enhancer(next), dispatch);
  return enhancedDispatch;
}