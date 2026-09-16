/**
 * Functional capability suite: does the site actually DO what it claims?
 *
 * The static checker in harness/check_harness.py proves form — a page has a
 * playground include, a runner file exists, a filter control is present. None
 * of that proves the button works. This suite drives a real browser against the
 * built site and asserts behaviour, which is the part that used to need a human
 * to click around.
 *
 *   node harness/functional/run.mjs --site <built-dir> [--out results.json] [--only <id>]
 *
 * Exits 0 when every scenario passes. Writes one JSON object per scenario so
 * check_harness.py can map each to its own capability.
 */
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
import { serve } from "./server.mjs";

const require = createRequire(import.meta.url);

function loadPlaywright() {
  for (const spec of ["playwright", "/opt/node22/lib/node_modules/playwright",
                      "/usr/local/lib/node_modules/playwright", "/usr/lib/node_modules/playwright"]) {
    try {
      return require(spec);
    } catch {
      /* try the next location */
    }
  }
  return null;
}

const args = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const SITE = arg("site");
const OUT = arg("out");
const ONLY = args.filter((a, i) => args[i - 1] === "--only");

// --------------------------------------------------------------- assertions
const ok = (cond, message) => { if (!cond) throw new Error(message); };

/** Read the question bank straight out of the rendered index — no second source of truth. */
async function bank(page, origin) {
  await page.goto(`${origin}/practice/`, { waitUntil: "domcontentloaded" });
  return page.$$eval("[data-question]", (rows) =>
    rows.map((r) => ({
      slug: r.getAttribute("data-slug"),
      format: r.getAttribute("data-format"),
      layer: r.getAttribute("data-layer"),
    })));
}

// ---------------------------------------------------------------- scenarios
const SCENARIOS = {
  /** The whole point of the workspace: the starter fails, the reference solution passes. */
  async playground(page, origin) {
    const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
    ok(coding.length > 0, "no coding question in the bank to exercise the playground");
    const slug = coding[0].slug;

    await page.goto(`${origin}/practice/${slug}.html`, { waitUntil: "domcontentloaded" });
    const editor = page.locator("[data-playground-editor]");
    await editor.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });

    const starter = await editor.inputValue();
    ok(starter.trim().length > 0, `starter.js for ${slug} loaded empty`);

    // 1. the starter must FAIL, or the tests prove nothing
    await page.locator("[data-playground-run]").click();
    await page.waitForSelector(".playground__summary", { timeout: 20000 });
    const failedFirst = await page.locator(".playground__summary").getAttribute("class");
    ok(/is-fail/.test(failedFirst || ""),
      `${slug}: the starter passed its own tests — the tests do not test anything`);

    // 2. the reference solution must PASS, in the browser, through the same runner
    const solution = await (await page.request.get(
      `${origin}/practice/workspace/${slug}/solution.js`)).text();
    ok(solution.trim().length > 0, `${slug}: solution.js is empty or not served`);
    await editor.fill(solution);
    await page.locator("[data-playground-run]").click();
    await page.waitForFunction(
      () => document.querySelector(".playground__summary.is-pass") !== null,
      null, { timeout: 20000 });

    const summary = await page.locator(".playground__summary").innerText();
    ok(/(\d+) of \1 tests? passing/.test(summary) || /passing/.test(summary),
      `${slug}: unexpected summary "${summary}"`);

    // 3. passing must mark the question done — the progress wiring, end to end
    const done = await page.evaluate((s) => window.ElegantProgress.isDone(s), slug);
    ok(done === true, `${slug}: all tests passed but the question was not marked done`);
    return `${slug}: starter fails, solution passes, progress recorded`;
  },

  /** A quiz that does not grade is a list of bullet points. */
  async quiz(page, origin) {
    const quizzes = (await bank(page, origin)).filter((q) => q.format === "quiz");
    ok(quizzes.length > 0, "no quiz question in the bank");
    const slug = quizzes[0].slug;
    await page.goto(`${origin}/practice/${slug}.html`, { waitUntil: "domcontentloaded" });

    const form = page.locator("form.quiz-mcq").first();
    await form.waitFor({ state: "visible", timeout: 10000 });
    const correct = (await form.getAttribute("data-correct")).trim().toUpperCase();

    const values = await form.locator('input[type="radio"]').evaluateAll(
      (inputs) => inputs.map((i) => i.value));
    const wrong = values.find((v) => v.toUpperCase() !== correct);
    ok(wrong, `${slug}: quiz has no incorrect option to choose`);

    await form.locator(`input[value="${wrong}"]`).check();
    await form.locator(".quiz-mcq__submit").click();
    ok(await form.evaluate((f) => f.classList.contains("quiz-mcq--incorrect")),
      `${slug}: a wrong answer was not marked incorrect`);
    ok(await form.locator(".quiz-mcq__result").isVisible(),
      `${slug}: no result shown after submitting`);

    await form.locator(".quiz-mcq__reset").click();
    await page.waitForFunction(
      () => !document.querySelector("form.quiz-mcq").hasAttribute("data-answered"),
      null, { timeout: 5000 });

    await form.locator(`input[value="${correct}"]`).check();
    await form.locator(".quiz-mcq__submit").click();
    ok(await form.evaluate((f) => f.classList.contains("quiz-mcq--correct")),
      `${slug}: the correct answer was not marked correct`);
    const explanation = await form.locator(".quiz-mcq__explanation").innerText();
    ok(explanation.trim().length > 20,
      `${slug}: the explanation is missing or too short to teach anything`);
    return `${slug}: grades wrong and right answers and explains both`;
  },

  /** A bank nobody can narrow is a list. */
  async filters(page, origin) {
    const rows = await bank(page, origin);
    ok(rows.length >= 4, `only ${rows.length} questions rendered on the index`);
    const visible = () => page.$$eval("[data-question]", (r) => r.filter((n) => !n.hidden).length);

    ok((await visible()) === rows.length, "some rows start hidden before any filter is applied");

    await page.selectOption('[data-filter="format"]', "coding");
    const codingVisible = await page.$$eval("[data-question]",
      (r) => r.filter((n) => !n.hidden).map((n) => n.getAttribute("data-format")));
    ok(codingVisible.length > 0, "filtering by format=coding hid every row");
    ok(codingVisible.every((f) => f === "coding"),
      `format filter leaked other formats: ${[...new Set(codingVisible)].join(", ")}`);
    ok(codingVisible.length < rows.length, "the format filter changed nothing");

    await page.selectOption('[data-filter="layer"]', "state");
    const both = await page.$$eval("[data-question]",
      (r) => r.filter((n) => !n.hidden).map((n) => `${n.getAttribute("data-format")}/${n.getAttribute("data-layer")}`));
    ok(both.every((s) => s === "coding/state"),
      `two filters did not compose: got ${[...new Set(both)].join(", ")}`);

    await page.click("[data-filter-clear]");
    ok((await visible()) === rows.length, "clearing the filters did not restore every row");

    await page.fill("[data-search]", "zzzznomatchzzzz");
    ok((await visible()) === 0, "a search with no matches still showed rows");
    ok(await page.locator("[data-question-empty]").isVisible(),
      "the empty state was not shown when nothing matched");
    return `${rows.length} rows; format, layer, compose, clear and empty-state all behave`;
  },

  /** Progress that does not survive a reload is not progress. */
  async progress(page, origin) {
    const rows = await bank(page, origin);
    const slug = rows[0].slug;
    const box = page.locator(`[data-progress-toggle="${slug}"]`).first();
    ok(!(await box.isChecked()), "progress was already set before the test ran");

    await box.check();
    const afterTick = await page.locator("[data-progress-label]").first().innerText();
    ok(/1 of \d+ done/.test(afterTick), `label did not update after ticking: "${afterTick}"`);

    await page.reload({ waitUntil: "domcontentloaded" });
    ok(await page.locator(`[data-progress-toggle="${slug}"]`).first().isChecked(),
      `${slug}: completion did not survive a reload`);
    const afterReload = await page.locator("[data-progress-label]").first().innerText();
    ok(afterReload === afterTick,
      `the progress label changed across a reload: "${afterTick}" -> "${afterReload}"`);

    await page.evaluate(() => window.ElegantProgress.reset());
    return `${slug}: ticked, labelled and survived a reload`;
  },

  /** A plan page is generated from the registry; if the layout breaks it renders an empty promise. */
  async plans(page, origin) {
    await page.goto(`${origin}/plans/`, { waitUntil: "domcontentloaded" });
    const cards = await page.locator(".plan-card").count();
    ok(cards >= 4, `the plans index shows ${cards} plans, expected at least 4`);

    const href = await page.locator(".plan-card__title a").first().getAttribute("href");
    await page.goto(`${origin}${href}`, { waitUntil: "domcontentloaded" });
    const steps = await page.locator(".plan-step").count();
    ok(steps >= 5, `the plan page rendered ${steps} steps — the registry did not reach the layout`);

    const labelled = await page.locator(".plan-step__link").first().innerText();
    ok(labelled.trim().length > 0, "a plan step rendered with no title");

    await page.locator("[data-progress-toggle]").first().check();
    const width = await page.locator("[data-progress-bar]").first().evaluate((b) => b.style.width);
    ok(width && width !== "0%", `the plan progress bar stayed at ${width || "unset"} after a tick`);
    await page.evaluate(() => window.ElegantProgress.reset());
    return `${cards} plans; first plan renders ${steps} steps and tracks progress`;
  },

  /** Every capability above runs on JavaScript; a thrown error anywhere silently disables one. */
  async console_clean(page, origin) {
    // Two classes of problem, both of which silently disable a capability:
    // an uncaught exception in our own JavaScript, and a 404 on one of our own
    // assets. Third-party failures (analytics, fonts) are deliberately ignored
    // — a CDN outage is not a defect in this site, and a guardrail that fails
    // on someone else's network teaches the agent to chase noise.
    const problems = [];
    const ours = (url) => url.startsWith(origin);

    page.on("pageerror", (err) => problems.push(`uncaught: ${err.message}`));
    page.on("requestfailed", (req) => {
      if (ours(req.url())) problems.push(`request failed: ${req.url().replace(origin, "")} (${req.failure()?.errorText})`);
    });
    page.on("response", (res) => {
      if (ours(res.url()) && res.status() >= 400) {
        problems.push(`HTTP ${res.status()}: ${res.url().replace(origin, "")}`);
      }
    });
    page.on("console", (msg) => {
      if (msg.type() !== "error") return;
      const text = msg.text();
      // Resource-load console noise is covered by the response/requestfailed
      // hooks above, scoped to our own origin. Everything else is our code talking.
      if (/Failed to load resource/i.test(text)) return;
      problems.push(`console.error: ${text}`);
    });

    const rows = await bank(page, origin);
    const coding = rows.find((q) => q.format === "coding");
    const paths = ["/", "/practice/", "/plans/", "/playbooks/", "/ui/", "/plans/certificate.html"];
    if (coding) paths.push(`/practice/${coding.slug}.html`);
    for (const path of paths) {
      await page.goto(`${origin}${path}`, { waitUntil: "load" });
      await page.waitForTimeout(250);
    }
    ok(problems.length === 0,
      `${problems.length} problem(s) from this site: ${problems.slice(0, 4).join(" | ")}`);
    return `${paths.length} pages loaded with no uncaught errors and no broken local assets`;
  },

  /** Two people sharing a laptop must not overwrite each other's progress. */
  async account_profiles(page, origin) {
    const rows = await bank(page, origin);
    const [first, second] = [rows[0].slug, rows[1].slug];

    await page.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.ElegantAccount), null, { timeout: 10000 });

    // Sign in as Ada and record one question.
    await page.locator("[data-account-signin-name]").first().fill("Ada");
    await page.locator("[data-account-signin-form] button[type=submit]").first().click();
    ok(await page.locator("[data-account-widget][data-signed-in='true']").count() > 0,
      "signing in did not flip the widget to its signed-in state");
    await page.evaluate((s) => window.ElegantProgress.setDone(s, true), first);
    ok(await page.evaluate((s) => window.ElegantProgress.isDone(s), first),
      "the signed-in profile did not record a completion");

    // Switch to Grace: a fresh profile must start empty.
    await page.locator("[data-account-signout]").first().click();
    await page.locator("[data-account-signin-name]").first().fill("Grace");
    await page.locator("[data-account-signin-form] button[type=submit]").first().click();
    ok((await page.evaluate((s) => window.ElegantProgress.isDone(s), first)) === false,
      "a second profile inherited the first profile's progress — the namespace is not applied");
    await page.evaluate((s) => window.ElegantProgress.setDone(s, true), second);

    // Back to Ada: her progress is intact and Grace's is not visible.
    await page.locator("[data-account-signout]").first().click();
    await page.locator("[data-account-signin-name]").first().fill("Ada");
    await page.locator("[data-account-signin-form] button[type=submit]").first().click();
    const restored = await page.evaluate(
      ([a, b]) => [window.ElegantProgress.isDone(a), window.ElegantProgress.isDone(b)], [first, second]);
    ok(restored[0] === true, "the first profile's progress was lost when switching back");
    ok(restored[1] === false, "the second profile's progress leaked into the first");

    // And it survives a reload, which is the whole point of storing it.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.ElegantAccount), null, { timeout: 10000 });
    ok(await page.evaluate(() => window.ElegantAccount.current()?.name) === "Ada",
      "the signed-in profile did not survive a reload");
    return "two profiles keep separate progress, and the active one survives a reload";
  },

  /** With no server to sync to, an export IS the account following you. */
  async account_portable(page, origin) {
    const rows = await bank(page, origin);
    const slug = rows[2].slug;

    await page.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.ElegantAccount), null, { timeout: 10000 });

    await page.locator("[data-account-signin-name]").first().fill("Traveller");
    await page.locator("[data-account-signin-form] button[type=submit]").first().click();
    await page.evaluate((s) => window.ElegantProgress.setDone(s, true), slug);

    const exported = await page.evaluate(() => window.ElegantAccount.export());
    const payload = JSON.parse(exported);
    ok(payload.version === 1 && payload.profile && payload.profile.name === "Traveller",
      `the export does not describe the profile: ${exported.slice(0, 120)}`);
    ok(payload.progress && Object.keys(payload.progress).length > 0,
      "the export carried the profile but not its progress");

    // A different device: wipe everything this origin stored, then import.
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.ElegantAccount), null, { timeout: 10000 });
    ok(await page.evaluate(() => window.ElegantAccount.current()) === null,
      "clearing storage left someone signed in");

    await page.evaluate((json) => window.ElegantAccount.import(json), exported);
    const after = await page.evaluate(
      (s) => ({ name: window.ElegantAccount.current()?.name, done: window.ElegantProgress.isDone(s) }), slug);
    ok(after.name === "Traveller", `import did not sign in as the profile, got ${after.name}`);
    ok(after.done === true, "import restored the profile but not its progress");
    return "a profile and its progress survive an export / wipe / import round trip";
  },

  /** Accounts arrived after progress did; nobody's existing work may be stranded. */
  async account_guest_progress(page, origin) {
    const rows = await bank(page, origin);
    const slug = rows[3].slug;

    await page.goto(`${origin}/practice/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.ElegantProgress), null, { timeout: 10000 });
    await page.evaluate((s) => window.ElegantProgress.setDone(s, true), slug);

    const guestKey = await page.evaluate(() => "elegant.progress.v1" + window.ElegantAccount.namespace());
    ok(guestKey === "elegant.progress.v1",
      `a guest must use the original un-namespaced key, got ${guestKey}`);

    await page.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });
    await page.locator("[data-account-signin-name]").first().fill("Newcomer");
    await page.locator("[data-account-signin-form] button[type=submit]").first().click();
    await page.locator("[data-account-signout]").first().click();

    await page.goto(`${origin}/practice/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.ElegantProgress), null, { timeout: 10000 });
    ok(await page.evaluate((s) => window.ElegantProgress.isDone(s), slug),
      "signing in and out destroyed the progress made before accounts existed");
    return "guest progress is untouched by signing in and out";
  },

  /** The seam a hosted deployment swaps for a real identity provider. */
  async account_provider_seam(page, origin) {
    await page.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => Boolean(window.ElegantAccount), null, { timeout: 10000 });

    const result = await page.evaluate(() => {
      // Stand in for a hosted provider: identity comes from somewhere else
      // entirely, and no caller has to know.
      let who = null;
      window.ElegantAccount.registerProvider("mock-idp", {
        name: "mock-idp",
        signIn: (name) => (who = { id: "idp-" + name.toLowerCase(), name }),
        signOut: () => { who = null; },
        current: () => who,
      });
      window.ElegantAccount.useProvider("mock-idp");
      const profile = window.ElegantAccount.signIn("Remote");
      const ns = window.ElegantAccount.namespace();
      window.ElegantProgress.setDone("seam-check", true);
      const done = window.ElegantProgress.isDone("seam-check");
      window.ElegantAccount.signOut();
      return { provider: window.ElegantAccount.providerName(), id: profile.id, ns,
               done, afterSignOut: window.ElegantAccount.current() };
    });

    ok(result.provider === "mock-idp", `useProvider did not switch, got ${result.provider}`);
    ok(result.id === "idp-remote", `the provider's identity was not used, got ${result.id}`);
    ok(result.ns === ":idp-remote",
      `progress did not follow the provider's identity, namespace was "${result.ns}"`);
    ok(result.done === true, "progress did not record under the swapped provider");
    ok(result.afterSignOut === null, "signOut did not reach the swapped provider");
    return "a third-party provider can be swapped in and progress follows its identity";
  },

  // ---------------------------------------------------------------- frontier
  // Capabilities greatfrontend.com has and this site does not yet. They are
  // declared `required: false` so they never block a contribution, and they
  // fail honestly so `--next` can hand them to the cluster one at a time.
  // A frontier scenario is a real measurement, not a placeholder: when someone
  // builds the feature, this turns green without being rewritten.

  /** GreatFrontend runs React and Vue component tests in the browser; we run plain modules. */
  async workspace_framework_runtime(page, origin) {
    const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
    ok(coding.length > 0, "no coding question to check");

    // The contract this capability implies: a question declares a runtime, and
    // the playground loads that framework and runs DOM-based tests against it.
    const withRuntime = [];
    for (const q of coding) {
      const res = await page.request.get(`${origin}/practice/workspace/${q.slug}/runtime.json`);
      if (res.ok()) withRuntime.push(q.slug);
    }
    ok(withRuntime.length > 0,
      "no coding question declares a framework runtime. A question should be able to ship " +
      "practice/workspace/<slug>/runtime.json ({\"framework\":\"react\"}) and have the playground " +
      "load that framework, transform JSX in-browser and run component tests — today the runner " +
      "only executes plain ES modules, so every ui-coding exercise is read-only.");

    await page.goto(`${origin}/practice/${withRuntime[0]}.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });
    await page.locator("[data-playground-run]").click();
    await page.waitForSelector(".playground__summary", { timeout: 30000 });
    ok(await page.locator(".playground__summary.is-pass").count() > 0,
      `${withRuntime[0]}: a framework-runtime question did not run green in the browser`);
    return `${withRuntime.length} question(s) run component tests in a framework runtime`;
  },

  /** Their workspace has highlighting, resizable panes and a console; ours is a textarea. */
  async workspace_editor_affordances(page, origin) {
    const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
    ok(coding.length > 0, "no coding question to check");
    await page.goto(`${origin}/practice/${coding[0].slug}.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });

    const missing = await page.evaluate(() => {
      const gaps = [];
      if (!document.querySelector("[data-playground-highlight]")) gaps.push("syntax highlighting");
      if (!document.querySelector("[data-playground-resize]")) gaps.push("a resizable editor");
      if (!document.querySelector("[data-playground-console]")) gaps.push("a console pane for console.log");
      return gaps;
    });
    ok(missing.length === 0,
      `the workspace is a plain textarea — missing ${missing.join(", ")}. Reading a 40-line ` +
      "starter with no highlighting is the difference between practising and squinting, and a " +
      "learner debugging with console.log currently has to open devtools to see the output.");
    return "the workspace has highlighting, a resize handle and a console pane";
  },

  /** A workspace you can only use with a mouse fails the site's own accessibility topic. */
  async keyboard(page, origin) {
    const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
    ok(coding.length > 0, "no coding question to exercise");
    await page.goto(`${origin}/practice/${coding[0].slug}.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });

    await page.locator("[data-playground-editor]").focus();
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-playground-run") !== null
      ? "run"
      : document.activeElement?.className || "unknown");
    ok(focused === "run", `Tab from the editor reached "${focused}", not the Run button`);

    await page.keyboard.press("Enter");
    await page.waitForSelector(".playground__summary", { timeout: 20000 });
    ok(await page.locator(".playground__summary").isVisible(),
      "activating Run with the keyboard produced no result");

    const skip = page.locator("#skip-to-content");
    ok(await skip.count() === 1, "the skip-to-content link is missing");
    return "the workspace is reachable and operable from the keyboard";
  },
};

// -------------------------------------------------------------------- main
async function main() {
  if (!SITE) {
    console.error("usage: run.mjs --site <built-dir> [--out results.json] [--only <id>]");
    return 2;
  }
  const playwright = loadPlaywright();
  if (!playwright) {
    const payload = { available: false, reason: "playwright is not installed (npm i -g playwright)", scenarios: {} };
    if (OUT) writeFileSync(OUT, JSON.stringify(payload, null, 2));
    console.error(payload.reason);
    return 3;
  }

  const wanted = ONLY.length ? ONLY : Object.keys(SCENARIOS);
  const server = await serve(SITE);
  const browser = await playwright.chromium.launch();
  const results = {};

  for (const id of wanted) {
    const scenario = SCENARIOS[id];
    if (!scenario) {
      results[id] = { pass: false, detail: `no such scenario: ${id}` };
      continue;
    }
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const started = Date.now();
    try {
      const detail = await scenario(page, server.origin);
      results[id] = { pass: true, detail, ms: Date.now() - started };
      console.log(`  pass  ${id}  ${detail}`);
    } catch (err) {
      results[id] = { pass: false, detail: String(err && err.message ? err.message : err).slice(0, 600),
                      ms: Date.now() - started };
      console.log(`  FAIL  ${id}  ${results[id].detail}`);
    }
    await context.close();
  }

  await browser.close();
  await server.close();

  const payload = { available: true, scenarios: results };
  if (OUT) writeFileSync(OUT, JSON.stringify(payload, null, 2));
  return Object.values(results).every((r) => r.pass) ? 0 : 1;
}

main().then((code) => process.exit(code), (err) => { console.error(err); process.exit(2); });
