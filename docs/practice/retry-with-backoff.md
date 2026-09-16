---
title: Retry a request with backoff
layout: question
slug: retry-with-backoff
format: coding
difficulty: hard
layer: state
topics: [ajax, operations, middleware]
skill: state-ajax
minutes: 35
summary: Retry only what is worth retrying, back off exponentially, add jitter, and stop when the caller walks away.
---

A saga retries failed requests with `setTimeout(fn, 1000)` in a loop. Under a
partial outage every client retries in lockstep and finishes the server off.

Implement `retry(fn, options)`:

- Calls `fn({ attempt, signal })` and returns its result.
- On failure, retries up to `retries` times (default 3, so 4 calls at most).
- Delay is exponential: `baseMs * 2 ** (attempt - 1)`, capped at `maxMs`.
- **Full jitter**: the actual delay is a random value in `[0, computed]`.
- `shouldRetry(error, attempt)` decides; the default retries network errors and
  `5xx`/`429`, and never retries `4xx` other than `429`.
- An `AbortSignal` stops it immediately — mid-delay as well as mid-request — and
  the rejection is the abort reason, not the last request error.
- Rejects with the **last** error once retries are exhausted.

{% include code-playground.html %}

## Solution

### Approach 1: a loop with an abortable sleep

```js
const sleep = (ms, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(signal.reason);
  const timer = setTimeout(resolve, ms);
  signal?.addEventListener("abort", () => {
    clearTimeout(timer);
    reject(signal.reason);
  }, { once: true });
});

export default async function retry(fn, options = {}) {
  const { retries = 3, baseMs = 100, maxMs = 30000, signal,
          shouldRetry = defaultShouldRetry, random = Math.random } = options;
  let lastError;
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    if (signal?.aborted) throw signal.reason;
    try {
      return await fn({ attempt, signal });
    } catch (err) {
      if (signal?.aborted) throw signal.reason;
      lastError = err;
      if (attempt > retries || !shouldRetry(err, attempt)) throw err;
      const ceiling = Math.min(maxMs, baseMs * 2 ** (attempt - 1));
      await sleep(random() * ceiling, signal);
    }
  }
  throw lastError;
}
```

The abortable sleep is the part naive versions miss. `await sleep(8000)` with no
signal means a cancelled request keeps a timer alive for eight more seconds and
then fires a retry nobody wants — which is how a component that unmounted keeps
hitting your API.

Checking `signal.aborted` **after** the catch matters too: an aborted `fetch`
rejects with an `AbortError`, and without that check it looks like a normal
failure and gets retried.

### Approach 2: inject the clock and the randomness

Note `random = Math.random` in the options. Jitter makes the delay
non-deterministic by design, which makes it untestable by default. Injecting the
source lets a test assert the exact delay sequence:

```js
const delays = [];
await retry(failTwiceThenSucceed, {
  baseMs: 100, random: () => 1,                 // full jitter -> take the ceiling
  sleep: (ms) => { delays.push(ms); return Promise.resolve(); },
});
// delays === [100, 200]
```

Injecting `sleep` as well turns a test that would take seven seconds into one
that takes none. Any retry implementation you cannot test without real time will
not be tested.

## Trade-offs

**Full jitter vs equal jitter vs none.** No jitter is the bug this question
exists for: every client that failed at the same moment retries at the same
moment, and the thundering herd knocks the server over again just as it
recovers. Full jitter (`random() * ceiling`) spreads clients the widest and
occasionally retries almost immediately. Equal jitter (`ceiling/2 + random() *
ceiling/2`) keeps a floor. AWS's published analysis puts full jitter ahead on
both server load and completion time, and it is the simpler line of code.

**What deserves a retry.** A `400` will fail identically forever — retrying it
wastes a round trip and hides the bug. A `429` should be retried, but honouring
`Retry-After` when the server sends it beats any backoff you compute. Retrying a
non-idempotent `POST` risks charging a card twice, which is why real retry
policies key on the method and an idempotency key, not just the status.

**Where this lives.** Inside a [middleware](../state/middleware.html) layer, one
policy covers every request and no feature has to remember. Inside each saga,
policies drift and half of them end up without jitter. The argument for the saga
is per-operation control — and that is better expressed as options on the shared
helper.

**Total time budget.** `retries` bounds the count, not the wall clock. With
`maxMs` at 30s, four retries can hold a user for over a minute. A deadline
(`AbortSignal.timeout(10000)`) is usually what you actually want, and it composes
with the signal you already accept.

## Related

- Reading: [AJAX](../state/ajax.html) · [Operations](../state/operations.html) · [Middleware](../state/middleware.html)
- Agent Skill: `state-ajax`
