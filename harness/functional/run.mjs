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
