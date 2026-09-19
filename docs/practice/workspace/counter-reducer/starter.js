/**
 * A Redux-style counter reducer.
 *
 * Handles 'increment', 'decrement' and 'reset' on `{ count: number }`, returns
 * a NEW state object on every change, and never mutates the state argument.
 * An unknown action returns the state it was given, by reference.
 */
export default function counterReducer(state = { count: 0 }, action) {
  throw new Error("not implemented");
}
