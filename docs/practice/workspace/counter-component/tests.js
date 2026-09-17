/**
 * Component tests. Unlike every other tests.js on the site these need a DOM,
 * so they run in the browser only — workspace.tests_pass skips any question
 * with a runtime.json, and workspace.framework_runtime covers them in Chromium.
 */
import { html, render, mount, unmount, tick } from "@runtime";

const assert = (cond, message) => { if (!cond) throw new Error(message); };

async function withRender(Component, props, body) {
  const host = mount();
  try {
    render(html`<${Component} ...${props} />`, host);
    await tick();
    return await body(host);
  } finally {
    unmount(host);
  }
}

const check = async (name, fn) => {
  try { await fn(); return { name, pass: true }; }
  catch (err) { return { name, pass: false, message: err && err.message ? err.message : String(err) }; }
};

const value = (host) => host.querySelector(".counter__value").textContent.trim();

export default async function tests(subject) {
  const Counter = typeof subject === "function" ? subject : subject && subject.default;
  if (typeof Counter !== "function") {
    return [{ name: "module default-exports Counter", pass: false, message: "no default export" }];
  }

  return [
    await check("renders the starting value", () => withRender(Counter, { start: 3 }, (host) => {
      assert(value(host) === "3", `expected 3, got ${value(host)}`);
    })),
    await check("renders the three parts", () => withRender(Counter, {}, (host) => {
      assert(host.querySelector(".counter__dec"), "no .counter__dec button");
      assert(host.querySelector(".counter__inc"), "no .counter__inc button");
      assert(host.querySelector("output.counter__value"),
        "the value must be in an <output> so it is announced");
    })),
    await check("+ increments by step", () => withRender(Counter, { start: 0, step: 5 }, async (host) => {
      host.querySelector(".counter__inc").click();
      await tick();
      assert(value(host) === "5", `expected 5 after one click with step 5, got ${value(host)}`);
    })),
    await check("- decrements by step", () => withRender(Counter, { start: 10, step: 4 }, async (host) => {
      host.querySelector(".counter__dec").click();
      await tick();
      assert(value(host) === "6", `expected 6, got ${value(host)}`);
    })),
    await check("clamps at max and disables +", () => withRender(Counter, { start: 9, max: 10 }, async (host) => {
      host.querySelector(".counter__inc").click();
      await tick();
      assert(value(host) === "10", `expected 10, got ${value(host)}`);
      assert(host.querySelector(".counter__inc").disabled,
        "+ must be disabled once another step would pass max");
    })),
    await check("clamps at min and disables -", () => withRender(Counter, { start: 1, min: 0 }, async (host) => {
      host.querySelector(".counter__dec").click();
      await tick();
      assert(value(host) === "0", `expected 0, got ${value(host)}`);
      assert(host.querySelector(".counter__dec").disabled,
        "- must be disabled once another step would pass min");
    })),
    await check("state is per instance", () => withRender(Counter, { start: 0 }, async (host) => {
      host.querySelector(".counter__inc").click();
      await tick();
      const first = value(host);
      await withRender(Counter, { start: 0 }, (second) => {
        assert(value(second) === "0",
          `a second instance started at ${value(second)} — state is shared between instances`);
      });
      assert(value(host) === first, "the first instance changed when a second mounted");
    })),
  ];
}
