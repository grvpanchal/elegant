/**
 * retry(fn, options)
 *
 * options: {
 *   retries = 3,          // retries AFTER the first call (4 calls at most)
 *   baseMs = 100,
 *   maxMs = 30000,
 *   signal,               // AbortSignal: stops mid-request AND mid-delay
 *   shouldRetry,          // (error, attempt) => boolean
 *   random = Math.random, // injected so jitter is testable
 *   sleep,                // injected so tests do not wait in real time
 * }
 *
 * Delay for attempt n is random() * min(maxMs, baseMs * 2 ** (n - 1)).
 * Rejects with the LAST error when retries run out, or with signal.reason
 * when aborted.
 */
export default async function retry(fn, options = {}) {
  throw new Error("not implemented");
}
