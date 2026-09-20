const check = async (name, fn) => {
  try { await fn(); return { name, pass: true }; }
  catch (err) { return { name, pass: false, message: err && err.message ? err.message : String(err) }; }
};
const assert = (cond, message) => { if (!cond) throw new Error(message); };
const httpError = (status) => Object.assign(new Error(`HTTP ${status}`), { status });

export default async function tests(subject) {
  const retry = typeof subject === "function" ? subject : subject && subject.default;
  if (typeof retry !== "function") {
    return [{ name: "module default-exports retry", pass: false, message: "no default export" }];
  }
  // Injected so the suite never waits in real time.
  const fast = (delays) => ({ sleep: (ms) => { delays.push(ms); return Promise.resolve(); } });

  return [
    await check("returns the result without retrying on success", async () => {
      let calls = 0;
      const out = await retry(async () => { calls += 1; return "ok"; }, fast([]));
      assert(out === "ok" && calls === 1, `got ${out} after ${calls} call(s)`);
    }),
    await check("retries then succeeds", async () => {
      let calls = 0;
      const out = await retry(async () => {
        calls += 1;
        if (calls < 3) throw httpError(503);
        return "ok";
      }, fast([]));
      assert(out === "ok" && calls === 3, `got ${out} after ${calls} call(s)`);
    }),
    await check("gives up after `retries` and rejects with the LAST error", async () => {
      let calls = 0;
      let caught = null;
      try {
        await retry(async () => { calls += 1; throw httpError(500 + calls); }, { retries: 2, ...fast([]) });
      } catch (err) { caught = err; }
      assert(calls === 3, `expected 3 calls for retries:2, got ${calls}`);
      assert(caught && caught.status === 503, `expected the last error (503), got ${caught && caught.status}`);
    }),
    await check("delays grow exponentially and are capped", async () => {
      const delays = [];
      try {
        await retry(async () => { throw httpError(500); },
          { retries: 5, baseMs: 100, maxMs: 500, random: () => 1, ...fast(delays) });
      } catch { /* expected */ }
      assert(JSON.stringify(delays) === JSON.stringify([100, 200, 400, 500, 500]),
        `got ${JSON.stringify(delays)}`);
    }),
    await check("full jitter keeps the delay within [0, ceiling]", async () => {
      const delays = [];
      try {
        await retry(async () => { throw httpError(500); },
          { retries: 3, baseMs: 100, random: () => 0.5, ...fast(delays) });
      } catch { /* expected */ }
      assert(JSON.stringify(delays) === JSON.stringify([50, 100, 200]),
        `jitter should scale the ceiling, got ${JSON.stringify(delays)}`);
    }),
    await check("a 400 is not retried", async () => {
      let calls = 0;
      try {
        await retry(async () => { calls += 1; throw httpError(400); }, fast([]));
      } catch { /* expected */ }
      assert(calls === 1, `a 4xx must not be retried, got ${calls} call(s)`);
    }),
    await check("a 429 IS retried", async () => {
      let calls = 0;
      try {
        await retry(async () => { calls += 1; throw httpError(429); }, { retries: 2, ...fast([]) });
      } catch { /* expected */ }
      assert(calls === 3, `a 429 should be retried, got ${calls} call(s)`);
    }),
    await check("a custom shouldRetry overrides the default", async () => {
      let calls = 0;
      try {
        await retry(async () => { calls += 1; throw httpError(500); },
          { retries: 3, shouldRetry: () => false, ...fast([]) });
      } catch { /* expected */ }
      assert(calls === 1, `shouldRetry:false must stop immediately, got ${calls} call(s)`);
    }),
    await check("an already-aborted signal rejects before calling fn", async () => {
      const controller = new AbortController();
      controller.abort(new Error("gone"));
      let calls = 0;
      let caught = null;
      try {
        await retry(async () => { calls += 1; return "ok"; }, { signal: controller.signal, ...fast([]) });
      } catch (err) { caught = err; }
      assert(calls === 0, `fn must not run when the signal is already aborted (ran ${calls})`);
      assert(caught && caught.message === "gone", `expected the abort reason, got ${caught && caught.message}`);
    }),
    await check("aborting during the retry loop rejects with the abort reason", async () => {
      const controller = new AbortController();
      let calls = 0;
      let caught = null;
      try {
        await retry(async () => {
          calls += 1;
          if (calls === 2) controller.abort(new Error("cancelled"));
          throw httpError(500);
        }, { retries: 5, signal: controller.signal, ...fast([]) });
      } catch (err) { caught = err; }
      assert(caught && caught.message === "cancelled",
        `expected the abort reason, got ${caught && caught.message}`);
      assert(calls === 2, `should stop at the abort, got ${calls} call(s)`);
    })
  ];
}
