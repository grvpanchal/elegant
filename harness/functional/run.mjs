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
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { serve } from "./server.mjs";
import { serveIssuer } from "./issuer.mjs";
import { serveSupabase } from "./supabase.mjs";

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
// The three below drive the site's REAL provider (Supabase) against a local
// stand-in, because the guardrail's Chromium has no outbound network — a
// fetch to supabase.co from a page under test fails every time. Testing the
// live project would also assert somebody's dashboard settings rather than
// this site's code. See harness/functional/supabase.mjs.
const withSupabase = async (page, origin, opts, body) => {
  const sb = await serveSupabase(opts);
  try {
    await page.addInitScript((cfg) => { window.ELEGANT_SUPABASE = cfg; },
      { url: sb.origin, anonKey: sb.anonKey });
    await page.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });
    const form = page.locator("[data-account-supabase-form]");
    ok(await form.count() === 1,
      "no [data-account-supabase-form] on the account page. Signing in is still typing a " +
      "name, so nothing is verified and the profile cannot leave this browser.");
    return await body(sb);
  } finally {
    await sb.close();
  }
};

const credentials = { email: "learner@example.com", password: "harness-pw-8812" };

const submit = async (page, { email, password }, mode = "signin") => {
  await page.locator("[data-account-supabase-email]").fill(email);
  await page.locator("[data-account-supabase-password]").fill(password);
  await page.locator(mode === "signup"
    ? "[data-account-supabase-signup]" : "[data-account-supabase-signin]").click();
  await page.waitForTimeout(900);
};

const state = (page) => page.evaluate(() => {
  const w = document.querySelector("[data-account-widget]");
  const e = document.querySelector("[data-account-supabase-error]");
  const n = document.querySelector("[data-account-name]");
  return {
    signedIn: w ? w.getAttribute("data-signed-in") === "true" : false,
    error: e && !e.hidden ? (e.textContent || "").trim() : "",
    name: n ? (n.textContent || "").trim() : "",
  };
});

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

    // Same contract as `playground`, and for the same reason: a starter that
    // passes its own tests means the tests assert nothing. The first version of
    // this scenario ran only the starter and expected green, which was wrong in
    // exactly that way — it would have been satisfied by a component question
    // whose tests never ran.
    const slug = withRuntime[0];
    await page.goto(`${origin}/practice/${slug}.html`, { waitUntil: "domcontentloaded" });
    const editor = page.locator("[data-playground-editor]");
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });

    await page.locator("[data-playground-run]").click();
    await page.waitForSelector(".playground__summary", { timeout: 30000 });
    ok(/is-fail/.test((await page.locator(".playground__summary").getAttribute("class")) || ""),
      `${slug}: the starter passed its own component tests — they assert nothing`);

    const solution = await (await page.request.get(
      `${origin}/practice/workspace/${slug}/solution.js`)).text();
    ok(solution.trim().length > 0, `${slug}: solution.js is empty or not served`);
    await editor.fill(solution);
    await page.locator("[data-playground-run]").click();
    await page.waitForFunction(
      () => document.querySelector(".playground__summary.is-pass") !== null,
      null, { timeout: 30000 });

    const summary = await page.locator(".playground__summary").innerText();
    ok(/passing/.test(summary), `${slug}: unexpected summary "${summary}"`);
    return `${withRuntime.length} question(s) render components in a runtime: ` +
           `${slug} starter fails, solution ${summary.trim().toLowerCase()}`;
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

    // Presence is not the capability. Three empty divs with the right data-
    // attributes satisfy the check above, so each affordance has to be made to
    // do its job before this passes.

    // 1. the overlay must paint the editor's actual text, with tokens coloured.
    const paint = await page.evaluate(() => {
      const editor = document.querySelector("[data-playground-editor]");
      const pre = document.querySelector("[data-playground-highlight]");
      return {
        aligned: pre.textContent.trim() === editor.value.trim(),
        tokens: pre.querySelectorAll("[class^='tok-']").length,
      };
    });
    ok(paint.aligned, "the highlight overlay does not show the same text as the editor — " +
      "a decorative layer behind the textarea is worse than none, it just misaligns.");
    ok(paint.tokens > 0, "the highlight overlay paints the text but colours nothing: no token spans.");

    // 2. the handle must resize the editor, from the keyboard as well as a pointer.
    const grew = await (async () => {
      const editor = page.locator("[data-playground-editor]");
      const before = (await editor.boundingBox()).height;
      await page.locator("[data-playground-resize]").focus();
      for (let i = 0; i < 3; i += 1) await page.keyboard.press("ArrowDown");
      const after = (await editor.boundingBox()).height;
      return { before, after };
    })();
    ok(grew.after > grew.before + 1,
      `the resize handle did not resize anything: the editor stayed ${Math.round(grew.before)}px ` +
      "after three ArrowDown presses. A drag-only handle is also unusable without a pointer.");

    // 3. console.log from the learner's own code must reach the pane, which is
    //    the whole point — otherwise they still open devtools.
    const probe = "harness-console-probe-" + Date.now();
    const starter = await (await page.request.get(
      `${origin}/practice/workspace/${coding[0].slug}/starter.js`)).text();
    await page.locator("[data-playground-editor]").fill(`${starter}\nconsole.log(${JSON.stringify(probe)});\n`);
    await page.locator("[data-playground-run]").click();
    await page.waitForSelector("[data-playground-console]:not([hidden])", { timeout: 20000 })
      .catch(() => {});
    const logged = await page.evaluate(() => {
      const pane = document.querySelector("[data-playground-console]");
      return { hidden: pane.hidden, text: pane.innerText };
    });
    ok(!logged.hidden && logged.text.includes(probe),
      "console.log from the learner's code never reached the console pane " +
      `(hidden=${logged.hidden}). The pane exists but is not wired to the runner.`);

    return "highlighting paints tokens, the handle resizes from the keyboard, console.log reaches the pane";
  },

  // ------------------------------------------------------------- credentials
  // greatfrontend.com has real accounts. This site has named local profiles,
  // which is honest but is not the same product: nothing is verified and
  // nothing follows you off this browser. The scenarios below are the standard
  // for closing that gap WITHOUT a backend, using OAuth 2.0 Authorization Code
  // + PKCE against a hosted issuer — the flow designed for public clients that
  // cannot keep a secret.
  //
  // The contract they hold the site to:
  //   window.ELEGANT_OIDC = { issuer, clientId }   set before account JS loads;
  //                                                absent means stay dormant
  //   [data-account-oidc-signin]                   starts the flow
  //   [data-account-name]                          shows the VERIFIED identity
  //   [data-account-error]                         says why a token was refused

  /** The flow must actually be PKCE, not a redirect that looks like one. */
  async account_oauth_pkce(page, origin) {
    const issuer = await serveIssuer();
    try {
      await page.addInitScript((cfg) => { window.ELEGANT_OIDC = cfg; },
        { issuer: issuer.origin, clientId: issuer.clientId });
      await page.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });

      const btn = page.locator("[data-account-oidc-signin]");
      ok(await btn.count() === 1,
        "no [data-account-oidc-signin] control. Signing in is still typing a name, so " +
        "nothing is verified and the profile cannot leave this browser.");

      await btn.click();
      await page.waitForURL((u) => u.toString().startsWith(`${origin}/account`), { timeout: 20000 });
      // The redirect back is not the end of the flow: the page still has to
      // exchange the code, fetch the JWKS and verify the signature. Asserting
      // before that settles raced the client and failed one run in three on a
      // correct implementation. Wait for it to report either way; the
      // assertions below are unchanged.
      await page.waitForFunction(() => {
        const w = document.querySelector("[data-account-widget]");
        const e = document.querySelector("[data-account-oidc-error], [data-account-error]");
        return (w && w.getAttribute("data-signed-in") === "true") || (e && !e.hidden && e.textContent.trim());
      }, null, { timeout: 10000 }).catch(() => {});

      ok(issuer.authorizeCalls.length === 1,
        `the site made ${issuer.authorizeCalls.length} authorize requests, expected 1`);
      const p = issuer.authorizeCalls[0];
      ok(p.response_type === "code", `response_type was "${p.response_type}", must be "code" — ` +
        "the implicit flow returns tokens in the URL fragment and is not safe here");
      ok(p.code_challenge_method === "S256",
        `code_challenge_method was "${p.code_challenge_method}", must be "S256"`);
      ok((p.state || "").length >= 16, "state is missing or too short to be unguessable");
      ok(p.nonce, "no nonce, so a replayed ID token cannot be detected");

      ok(issuer.tokenCalls.length === 1,
        "the code was never exchanged at the token endpoint, so no identity was obtained");
      const verifier = issuer.tokenCalls[0].code_verifier;
      ok(verifier && verifier.length >= 43, "code_verifier is missing or shorter than the 43 chars RFC 7636 requires");
      ok(verifier !== p.code_challenge,
        "the code_verifier was sent as the code_challenge. That is `plain` PKCE wearing an " +
        "S256 label: anyone who intercepts the redirect can complete the exchange.");
      ok(issuer.s256(verifier) === p.code_challenge,
        "the code_challenge is not S256(code_verifier)");

      // Two separate failures, told apart: the token never became an identity,
      // versus it did and the panel was never painted with it.
      const shown = await page.evaluate(() => {
        const w = document.querySelector("[data-account-widget]");
        const n = document.querySelector("[data-account-name]");
        return { signedIn: w ? w.getAttribute("data-signed-in") === "true" : false,
                 text: n ? (n.textContent || "").trim() : null,
                 visible: n ? !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length) : false };
      });
      ok(shown.signedIn, "the token was exchanged but the widget never reported a signed-in state");
      ok(shown.text && shown.text.includes("Ada"),
        `[data-account-name] holds "${shown.text}" — the name from the verified ID token never reached it`);
      ok(shown.visible, "the signed-in identity is in the DOM but hidden, so the learner cannot see who they are");
      return "authorization code + S256 PKCE, state and nonce, exchanged for a verified identity";
    } finally {
      await issuer.close();
    }
  },

  /** Signing in must cost a credential the site did not invent. */
  async account_verified_credentials(page, origin) {
    return withSupabase(page, origin, {}, async () => {
      await submit(page, credentials, "signup");
      let now = await state(page);
      ok(now.signedIn, `creating an account did not sign anyone in (error: "${now.error}")`);
      ok(now.name.includes(credentials.email),
        `signed in, but [data-account-name] shows "${now.name}" rather than the verified email`);

      // The half that matters: a WRONG password must be refused, out loud.
      // Sign out, THEN reload: the page re-verifies a stored session on load,
      // so reloading first just signs back in and hides the form.
      await page.evaluate(() => window.ElegantSupabase.signOut());
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);
      await submit(page, { email: credentials.email, password: "not-the-password" });
      now = await state(page);
      ok(!now.signedIn,
        "a wrong password signed the learner in. The credential is not being checked by " +
        "anything, which makes this a typed name with extra steps.");
      ok(now.error.length > 0, "the wrong password was refused, but the page says nothing");
      return "a real credential is required, and a wrong password is refused with a reason";
    });
  },

  /** A token you decoded is not a token you verified. This is THE bug to catch. */
  async account_token_verified(page, origin) {
    return withSupabase(page, origin, { flaw: "signature" }, async () => {
      await submit(page, credentials, "signup");
      const now = await state(page);
      ok(!now.signedIn,
        "the site accepted a session token signed by a key that is NOT in the provider's " +
        "JWKS. Reading a JWT's payload is base64, not authentication — the signature has to " +
        "be checked against the published key, or anyone can mint an identity by editing a string.");
      ok(now.error.length > 0, "the forged token was refused but the page says nothing");

      // And the same page must still work when the token is genuine, or
      // "refuses everything" would pass this check.
      const sb2 = await serveSupabase({});
      try {
        const context = await page.context().browser().newContext();
        const good = await context.newPage();
        await good.addInitScript((cfg) => { window.ELEGANT_SUPABASE = cfg; },
          { url: sb2.origin, anonKey: sb2.anonKey });
        await good.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });
        await submit(good, credentials, "signup");
        const ok2 = await state(good);
        ok(ok2.signedIn, "a correctly signed token was ALSO refused — this refuses everything, " +
          "which is not verification");
        await context.close();
      } finally {
        await sb2.close();
      }
      return "a token signed by the wrong key is refused, a correctly signed one is accepted";
    });
  },

  /** An expired credential is not a credential. */
  async account_session_expiry(page, origin) {
    return withSupabase(page, origin, { flaw: "expired" }, async (sb) => {
      await submit(page, credentials, "signup");
      const now = await state(page);
      // Prove the exchange actually happened first. "Not signed in, with an
      // error on screen" is equally true when the network is broken, and a
      // check that cannot tell those apart passes on a site that cannot sign
      // anyone in at all — this one did, before the config override was fixed.
      ok(sb.requests.some((r) => r.path === "/auth/v1/signup"),
        "the site never called the identity provider, so nothing was refused — it failed " +
        "before it got that far");
      ok(sb.requests.some((r) => r.path === "/auth/v1/.well-known/jwks.json"),
        "the site never fetched the provider's JWKS, so it cannot have verified anything; " +
        "refusing the token here is an accident, not a check");
      ok(!now.signedIn, "a session token whose `exp` is in the past was accepted");
      ok(now.error.length > 0,
        "the expired token was refused but the page says nothing, so the learner sees a " +
        "sign-in button that silently does nothing");
      return "an expired session token is refused after a real exchange, and the page says so";
    });
  },

  /** A verified identity is only worth having if progress follows it. */
  async account_identity_sync(page, origin, { browser }) {
    const sb = await serveSupabase({});
    let second = null;
    try {
      const signIn = async (target, mode) => {
        await target.addInitScript((cfg) => { window.ELEGANT_SUPABASE = cfg; },
          { url: sb.origin, anonKey: sb.anonKey });
        await target.goto(`${origin}/account/`, { waitUntil: "domcontentloaded" });
        ok(await target.locator("[data-account-supabase-form]").count() === 1,
          "no [data-account-supabase-form] — there is no identity to sync to");
        await submit(target, credentials, mode);
        const now = await state(target);
        ok(now.signedIn, `could not sign in on this device (error: "${now.error}")`);
      };

      await signIn(page, "signup");
      const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
      ok(coding.length > 0, "no question to record progress against");
      const slug = coding[0].slug;

      await page.goto(`${origin}/practice/${slug}.html`, { waitUntil: "domcontentloaded" });
      const done = page.locator("[data-progress-toggle]").first();
      ok(await done.count() === 1, "no progress control on the question page");
      await done.check().catch(async () => { await done.click(); });
      await page.waitForTimeout(1500);

      // A SECOND browser: different localStorage, same verified person. If
      // progress lives only on the device, this is where it stops. The fake
      // backend enforces row ownership from the token, so an implementation
      // that skips row-level security cannot pass this by reading everything.
      second = await browser.newContext();
      const other = await second.newPage();
      other.setDefaultTimeout(15000);
      await signIn(other, "signin");
      await other.goto(`${origin}/practice/${slug}.html`, { waitUntil: "domcontentloaded" });
      await other.waitForTimeout(2000);
      const carried = await other.evaluate(() => {
        const box = document.querySelector("[data-progress-toggle]");
        return box ? box.checked === true : false;
      });
      ok(carried,
        `"${slug}" was completed while signed in, but a second browser signed in as the same ` +
        "verified identity shows it unfinished. Progress is still device-local, so an account " +
        "buys the learner nothing a named profile did not already give them.");
      return "progress recorded under a verified identity is there on another device";
    } finally {
      if (second) await second.close();
      await sb.close();
    }
  },

  // ---------------------------------------------- workspace parity (GFE)
  // greatfrontend.com advertises a "customizable workspace: resize, syntax
  // highlighting, theming, keyboard shortcuts". Resize and highlighting are
  // done. These two are the rest of that sentence.

  /** Practising at night on a white page is a real reason people stop. */
  async workspace_theming(page, origin) {
    const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
    ok(coding.length > 0, "no coding question to check");
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto(`${origin}/practice/${coding[0].slug}.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });

    const luminance = (rgb) => {
      const m = String(rgb).match(/\d+/g);
      if (!m) return 1;
      const [r, g, b] = m.map(Number);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    };
    const shades = await page.evaluate(() => {
      const body = getComputedStyle(document.body).backgroundColor;
      const ed = document.querySelector(".playground__editor-wrap");
      return { body, editor: ed ? getComputedStyle(ed).backgroundColor : body };
    });
    ok(luminance(shades.body) < 0.5,
      `with prefers-color-scheme: dark the page background is still ${shades.body}. A learner ` +
      "practising at night gets a white rectangle, which is the point at which they stop.");
    ok(luminance(shades.editor) < 0.5,
      `the page went dark but the workspace did not (${shades.editor}) — a bright editor in a ` +
      "dark page is worse than no dark mode");

    // And it must still be readable in light: a dark mode that hardcodes dark
    // colours breaks the default for everyone else.
    await page.emulateMedia({ colorScheme: "light" });
    await page.reload({ waitUntil: "domcontentloaded" });
    const light = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    ok(luminance(light) > 0.5,
      `light mode is now dark too (${light}) — the theme is hardcoded rather than responding`);
    return "the workspace follows prefers-color-scheme in both directions";
  },

  /** Reaching for the mouse to run tests is the friction an interview does not have. */
  async workspace_shortcuts(page, origin) {
    const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
    ok(coding.length > 0, "no coding question to check");
    await page.goto(`${origin}/practice/${coding[0].slug}.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });

    // Deliberately never click Run: the shortcut is the whole assertion.
    await page.locator("[data-playground-editor]").focus();
    await page.keyboard.press("ControlOrMeta+Enter");
    const ran = await page.waitForSelector(".playground__summary", { timeout: 12000 })
      .then(() => true).catch(() => false);
    ok(ran, "Ctrl/Cmd+Enter in the editor did not run the tests. Every editor a candidate has " +
      "ever used runs on that chord; reaching for the mouse is friction an interview does not have.");

    // The shortcut has to be discoverable, or only the person who wrote it knows.
    const hinted = await page.evaluate(() => {
      const text = document.body.innerText;
      return /(ctrl|cmd|⌘|command)\s*\+\s*enter/i.test(text) ||
        !!document.querySelector("[data-playground-run]")?.getAttribute("title");
    });
    ok(hinted, "the shortcut works but nothing on the page mentions it, so nobody will find it");
    return "Ctrl/Cmd+Enter runs the tests, and the page says so";
  },

  /** The nav's account widget must be painted on EVERY page, not only the ones that load its script. */
  async account_widget_painted(page, origin) {
    // One page per layout that renders the nav. The home page shipped for a
    // while showing "Sign in" and "Sign out" side by side, because the widget
    // was included by the nav on every layout and account.js by only two.
    const pages = ["/", "/practice/", "/plans/", "/account/", "/ui/"];
    const broken = [];
    for (const path of pages) {
      const res = await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" }).catch(() => null);
      if (!res || res.status() >= 400) continue;  // a layout with no such page is not this check's business
      await page.waitForTimeout(300);
      const seen = await page.evaluate(() => {
        const w = document.querySelector("[data-account-widget]");
        if (!w) return null;
        const vis = (el) => !!el && !el.hidden && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        const inn = Array.from(w.querySelectorAll("[data-account-signout]")).filter(vis).length;
        const out = Array.from(w.querySelectorAll("[data-account-signed-out], [data-account-signin-form], a[href*='account']")).filter(vis).length;
        return { scripted: typeof window.ElegantAccount === "object", signout: inn, signin: out };
      });
      if (seen === null) continue;  // no widget on this page
      if (!seen.scripted) broken.push(`${path}: the widget is rendered but account.js never loaded`);
      else if (seen.signout > 0 && seen.signin > 0) broken.push(`${path}: shows both signed-in and signed-out controls at once`);
    }
    ok(broken.length === 0, "the account widget is unpainted on: " + broken.join("; "));
    return `widget painted on ${pages.length} layouts, one state each`;
  },

  // ------------------------------------------------------------ the front door
  // greatfrontend.com's home page is a conversion page; ours sold the CLI while
  // the practice product sat behind four nav links. These measure the front
  // door the way a student meets it: first screen, first click, phone width.

  /** The first screen is about practising, its CTA lands on a working bank, and it holds on a phone. */
  async landing_hero(page, origin) {
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);
    const fold = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const inFold = (el) => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight && r.height > 0; };
      const ctas = Array.from(document.querySelectorAll("a[href]")).filter(inFold)
        .map((a) => ({ text: (a.textContent || "").trim(), href: a.getAttribute("href") || "", primary: /btn|cta|button/i.test(a.className) }));
      const text = Array.from(document.querySelectorAll("body *")).filter(inFold).map((e) => e.textContent || "").join(" ");
      return { h1: h1 ? h1.textContent.trim() : "", h1InFold: !!h1 && inFold(h1), ctas, text };
    });
    ok(fold.h1InFold && /interview|practi[cs]e|train/i.test(fold.h1),
      `the first screen's headline is "${fold.h1}" — a student looking for interview practice reads about a CLI. ` +
      "The h1 above the fold must say what this is for.");
    const cta = fold.ctas.find((c) => /\/practice\/?$/.test(c.href.replace(/\?.*$/, "")) && c.primary)
      || fold.ctas.find((c) => /\/practice\/?$/.test(c.href.replace(/\?.*$/, "")));
    ok(cta, "no call to action above the fold links to /practice/ — the first click has nowhere to go");
    ok(/no sign[- ]?up required|no account needed|free/i.test(fold.text),
      "the first screen does not say a student can start without an account. It is true (guest progress " +
      "works), and greatfrontend.com says it under its button because it removes the first objection.");

    // The click has to land somewhere that works, not just somewhere.
    await page.click(`a[href="${cta.href}"]`);
    await page.waitForURL((u) => /\/practice\/?(\?.*)?$/.test(u.pathname), { timeout: 15000 });
    const rows = await page.$$eval("[data-question]", (r) => r.length);
    ok(rows > 0, "the CTA landed on /practice/ but the bank rendered no questions");

    // A phone is where most first visits happen.
    const phone = await page.context().browser().newContext({ viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 });
    try {
      const p2 = await phone.newPage();
      await p2.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
      await p2.waitForTimeout(400);
      const m = await p2.evaluate(() => {
        const h1 = document.querySelector("h1"); const r = h1 && h1.getBoundingClientRect();
        return { h1Visible: !!r && r.top >= 0 && r.top < innerHeight && r.height > 0,
                 sideways: document.documentElement.scrollWidth > innerWidth + 1 };
      });
      ok(m.h1Visible, "at 390px the headline is not on the first screen");
      ok(!m.sideways, "at 390px the home page scrolls sideways — something is wider than the phone");
    } finally { await phone.close(); }
    return `"${fold.h1}" → ${cta.href} → ${rows} questions; holds at 390px`;
  },

  /** Every number on the front door equals the bank as rendered. */
  async landing_proof(page, origin) {
    const rows = await bank(page, origin);
    ok(rows.length > 0, "no bank to count");
    const byFormat = {};
    for (const r of rows) byFormat[r.format] = (byFormat[r.format] || 0) + 1;
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
    const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
    const missing = [];
    if (!new RegExp(`\\b${rows.length}\\b[^.]{0,40}\\bquestions?\\b`, "i").test(text))
      missing.push(`the total (${rows.length} questions)`);
    for (const [format, n] of Object.entries(byFormat)) {
      const label = format.replace("-", "[- ]");
      if (!new RegExp(`\\b${n}\\b[^.]{0,40}\\b${label}\\b|\\b${label}\\b[^.]{0,40}\\b${n}\\b`, "i").test(text))
        missing.push(`${n} ${format}`);
    }
    ok(missing.length === 0,
      `the home page does not state ${missing.join(", ")}. The numbers must come from the bank at build ` +
      "time (site.data.questions), not be typed, so the claim cannot outlive the content.");
    return `${rows.length} questions and ${Object.keys(byFormat).length} formats stated, all matching the bank`;
  },

  /** A real question's Run button works on the home page itself. */
  async landing_workspace_preview(page, origin) {
    const slugs = new Set((await bank(page, origin)).filter((q) => q.format === "coding").map((q) => q.slug));
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
    const host = page.locator("[data-playground]").first();
    ok(await host.count() > 0, "the home page has no workspace. A student cannot try the product before reading about it; " +
      "greatfrontend.com's home shows the editor and ours should let them press Run.");
    const slug = await host.getAttribute("data-slug");
    ok(slug && slugs.has(slug), `the home workspace names "${slug}", which is not a coding question in the bank`);
    await page.waitForFunction(() => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 }).catch(() => {});
    ok(await page.locator("[data-playground-editor]").isEnabled(), "the home workspace's editor never enabled — playground.js is not loaded on this layout");
    await page.locator("[data-playground-run]").first().click();
    const ran = await page.waitForSelector(".playground__summary", { timeout: 20000 }).then(() => true).catch(() => false);
    ok(ran, "Run on the home workspace produced no result");
    return `live workspace for "${slug}" on the home page; Run executes its tests`;
  },

  /** Every question the server rendered must survive the browser's parse. */
  async bank_rendered(page, origin) {
    // Two harness questions were in the HTML and gone from the DOM: a `"` in a
    // summary closed data-searchtext early and the parser ate the rest of the
    // row. bank.registry counts files and filters counts whatever rendered, so
    // neither noticed. This compares what Jekyll wrote with what the browser kept.
    const html = await (await page.request.get(`${origin}/practice/`)).text();
    const written = (html.match(/<li\b[^>]*\bdata-question\b/gs) || []).length;
    const header = (html.match(/data-question-count[^>]*>\s*(\d+)/) || [])[1];
    const rows = await bank(page, origin);
    ok(written > 0, "no question rows in the served HTML");
    ok(rows.length === written,
      `Jekyll wrote ${written} question rows but the browser kept ${rows.length} — a row is malformed ` +
      "(most likely an unescaped quote in an attribute) and the questions it drops are invisible to a learner");
    ok(!header || Number(header) === written,
      `the page's own count says ${header} but ${written} rows were rendered`);
    return `${written} rows written, ${rows.length} kept, header agrees`;
  },

  /** A workspace you can only use with a mouse fails the site's own accessibility topic. */
  async keyboard(page, origin) {
    const coding = (await bank(page, origin)).filter((q) => q.format === "coding");
    ok(coding.length > 0, "no coding question to exercise");
    await page.goto(`${origin}/practice/${coding[0].slug}.html`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () => { const e = document.querySelector("[data-playground-editor]"); return e && !e.disabled; },
      null, { timeout: 15000 });

    // Tabbing forward from the editor must reach Run without a mouse. This
    // deliberately allows controls in between: the resize handle is focusable
    // on purpose, and demanding Run in exactly one press would make ADDING a
    // keyboard-operable control fail the keyboard check. What is not allowed
    // is Run being unreachable, or focus passing through something inert.
    await page.locator("[data-playground-editor]").focus();
    const path = [];
    let focused = "unknown";
    for (let i = 0; i < 4 && focused !== "run"; i += 1) {
      await page.keyboard.press("Tab");
      focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return "unknown";
        if (el.getAttribute("data-playground-run") !== null) return "run";
        return el.getAttribute("aria-label") || el.className || el.tagName.toLowerCase();
      });
      path.push(focused);
    }
    ok(focused === "run",
      `tabbing forward from the editor never reached the Run button (visited ${path.join(" -> ")})`);

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
/**
 * Kill the browsers and runners this harness leaked in an earlier, killed run.
 *
 * A run that is SIGKILLed — its parent restarted, the checker killed from
 * outside — cannot close its own browser. Because the checker starts the runner
 * in its own process group (start_new_session), a killed checker leaves the
 * whole group orphaned: a `node ... run.mjs` reparented to init (PPID 1) with
 * `headless_shell` beneath it. Enough of those slow the next cold start until it
 * times out and, under bza, becomes the cell's next "task".
 *
 * The sweep finds processes reparented to init (PPID 1) that are either a
 * browser or one of our own orphaned runners, and SIGKILLs their whole process
 * group so the runner and every browser under it die together. It never touches
 * this process's own group, so a running suite is safe. Best-effort and
 * Linux-shaped (the guardrail's own container); any failure is ignored.
 */
function sweepOrphanBrowsers() {
  try {
    const mine = String(process.pid);
    let ownPgid = "";
    try { ownPgid = execSync(`ps -o pgid= -p ${mine}`, { encoding: "utf8" }).trim(); } catch { /* ignore */ }
    const rows = execSync("ps -eo pid=,ppid=,pgid=,comm=,args=", { encoding: "utf8" }).split("\n");
    const groups = new Set();
    for (const row of rows) {
      const m = row.trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s*(.*)$/);
      if (!m) continue;
      const [, pid, ppid, pgid, comm, args] = m;
      if (ppid !== "1") continue;                 // only genuine orphans (reparented to init)
      const isBrowser = /headless_shell|chrome|chromium/i.test(comm);
      const isRunner = /\bnode\b/.test(comm) && /functional\/run\.mjs/.test(args);
      if (!isBrowser && !isRunner) continue;
      if (pgid === ownPgid || pid === mine) continue;   // never our own run
      groups.add(pgid);
    }
    let killed = 0;
    for (const pgid of groups) {
      try { process.kill(-Number(pgid), "SIGKILL"); killed += 1; } catch { /* gone already */ }
    }
    if (killed) console.error(`swept ${killed} orphaned run group(s) from a prior run`);
  } catch { /* ps unavailable or not Linux: skip */ }
}

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

  sweepOrphanBrowsers();
  const wanted = ONLY.length ? ONLY : Object.keys(SCENARIOS);
  const server = await serve(SITE);
  const browser = await playwright.chromium.launch();
  // Close the browser on a termination signal so a killed run does not orphan
  // Chromium. (SIGKILL cannot be caught — the checker's process-group reap and
  // the sweep above cover that path; this handles SIGTERM/SIGINT.)
  let torndown = false;
  const teardown = async () => {
    if (torndown) return; torndown = true;
    try { await browser.close(); } catch { /* already gone */ }
    try { await server.close(); } catch { /* already gone */ }
  };
  for (const sig of ["SIGTERM", "SIGINT", "SIGHUP"]) {
    process.on(sig, () => { teardown().finally(() => process.exit(130)); });
  }
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
      const detail = await scenario(page, server.origin, { browser, context });
      results[id] = { pass: true, detail, ms: Date.now() - started };
      console.log(`  pass  ${id}  ${detail}`);
    } catch (err) {
      results[id] = { pass: false, detail: String(err && err.message ? err.message : err).slice(0, 600),
                      ms: Date.now() - started };
      console.log(`  FAIL  ${id}  ${results[id].detail}`);
    }
    await context.close();
  }

  await teardown();

  const payload = { available: true, scenarios: results };
  if (OUT) writeFileSync(OUT, JSON.stringify(payload, null, 2));
  return Object.values(results).every((r) => r.pass) ? 0 : 1;
}

main().then((code) => process.exit(code), (err) => { console.error(err); process.exit(2); });
