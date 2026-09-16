const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const check = async (name, fn) => {
  try { await fn(); return { name, pass: true }; }
  catch (err) { return { name, pass: false, message: err && err.message ? err.message : String(err) }; }
};
const assert = (cond, message) => { if (!cond) throw new Error(message); };

export default async function tests(subject) {
  const debounce = typeof subject === "function" ? subject : subject && subject.default;
  if (typeof debounce !== "function") {
    return [{ name: "module default-exports debounce", pass: false, message: "no default export" }];
  }

  return [
    await check("does not call through immediately", async () => {
      let calls = 0;
      debounce(() => { calls += 1; }, 40)();
      assert(calls === 0, `called ${calls} time(s) synchronously`);
    }),
    await check("calls once after the wait", async () => {
      let calls = 0;
      debounce(() => { calls += 1; }, 30)();
      await sleep(70);
      assert(calls === 1, `expected 1 call, got ${calls}`);
    }),
    await check("three rapid calls collapse into one", async () => {
      let calls = 0;
      const d = debounce(() => { calls += 1; }, 30);
      d(); d(); d();
      await sleep(70);
      assert(calls === 1, `expected 1 call, got ${calls}`);
    }),
    await check("a call inside the window resets the timer", async () => {
      let calls = 0;
      const d = debounce(() => { calls += 1; }, 50);
      d();
      await sleep(30);
      d();                      // resets: the first deadline must not fire
      await sleep(30);
      assert(calls === 0, `fired early — the timer was not reset (calls=${calls})`);
      await sleep(40);
      assert(calls === 1, `expected 1 call after the reset window, got ${calls}`);
    }),
    await check("func receives the LATEST arguments", async () => {
      let seen = null;
      const d = debounce((...args) => { seen = args; }, 30);
      d("first");
      d("second", 2);
      await sleep(70);
      assert(JSON.stringify(seen) === JSON.stringify(["second", 2]),
        `expected ["second",2], got ${JSON.stringify(seen)}`);
    }),
    await check("this is preserved", async () => {
      let seen = null;
      const obj = { name: "ada", go: debounce(function () { seen = this.name; }, 30) };
      obj.go();
      await sleep(70);
      assert(seen === "ada", `expected "ada", got ${JSON.stringify(seen)}`);
    }),
    await check("cancel() drops the pending call", async () => {
      let calls = 0;
      const d = debounce(() => { calls += 1; }, 30);
      d();
      d.cancel();
      await sleep(70);
      assert(calls === 0, `expected 0 calls after cancel, got ${calls}`);
    }),
    await check("the debounced function is reusable after it fires", async () => {
      let calls = 0;
      const d = debounce(() => { calls += 1; }, 25);
      d();
      await sleep(60);
      d();
      await sleep(60);
      assert(calls === 2, `expected 2 separate calls, got ${calls}`);
    })
  ];
}