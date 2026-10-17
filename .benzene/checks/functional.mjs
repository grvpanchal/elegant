#!/usr/bin/env node
// The learner journey in a real browser: what the training-site sub-agent keeps working.
//
//   node .benzene/checks/functional.mjs [--limit N]
//
// Builds the site (python3 .benzene/checks/site.py build), serves it locally, and drives Chromium (Playwright from
// ~/.local/share/benzene-tools/node, or PLAYWRIGHT_PATH) through it, offline: every request that leaves the local
// server is refused, so the verdict never depends on PayPal, Supabase or a CDN being up.
//   1. every key page at 1280px and 375px: no page error, no console error of the page's own code, no failed local
//      request, no horizontal scroll at 375px
//   2. the dashboard renders its stats on a first visit (empty state) and counts a lesson after it is completed
//   3. a lesson is completed from the keyboard (Space on its toggle) and the course page shows the progress
//   4. the pricing page renders its tiers and loads no payment SDK until a paid tier is chosen
// Prints `FAIL learner.journey [<rule>] <what>` per finding (the first --limit after a count) and exits 1 on any.

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir, homedir } from "node:os";
import { join, extname, resolve } from "node:path";

const ROOT = process.cwd();
const limit = Number((process.argv.find((a) => a.startsWith("--limit=")) || "--limit=12").split("=")[1]);
const out = process.env.SITE_OUT || join(tmpdir(), "elegant-site-" + createHash("sha1").update(resolve(ROOT)).digest("hex").slice(0, 10));
const lines = [];
const fail = (rule, what) => lines.push(`FAIL learner.journey [${rule}] ${what}`);

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require(process.env.PLAYWRIGHT_PATH || join(homedir(), ".local/share/benzene-tools/node/node_modules/playwright")));
} catch (e) {
  console.log(`FAIL learner.journey [setup] Playwright is not installed: ${String(e.message).slice(0, 160)}`);
  process.exit(1);
}

try {
  execFileSync("python3", [join(ROOT, ".benzene/checks/site.py"), "build", "--out", out], { cwd: ROOT, stdio: "pipe", timeout: 600000 });
} catch (e) {
  console.log(`FAIL learner.journey [build] the site does not build: ${String(e.stdout || e.message).trim().slice(-300)}`);
  process.exit(1);
}

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".md": "text/markdown", ".xml": "application/xml",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".pdf": "application/pdf" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = join(out, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  else if (!existsSync(f) && existsSync(f + ".html")) f = f + ".html";
  if (!resolve(f).startsWith(resolve(out)) || !existsSync(f)) { res.writeHead(404); res.end("not found"); return; }
  res.writeHead(200, { "Content-Type": TYPES[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const SITE = `http://127.0.0.1:${server.address().port}`;

const linksOf = (rel) => {
  const html = readFileSync(join(out, rel), "utf-8");
  return [...html.matchAll(/href="(\/courses\/[a-z0-9-]+\/(?:[a-z0-9-]+\.html)?)"/g)].map((m) => m[1]);
};
const courses = existsSync(join(out, "courses/index.html")) ? [...new Set(linksOf("courses/index.html").filter((h) => h.endsWith("/")))] : [];
const lessons = courses.flatMap((c) => [...new Set(linksOf(c.slice(1) + "index.html").filter((h) => h.startsWith(c) && h.endsWith(".html")))].slice(0, 2));
const pages = ["/", "/dashboard/", "/courses/", ...courses, ...lessons, "/practice/", "/plans/", "/pricing/", "/account/"];
if (!courses.length) fail("courses", "no course is linked from /courses/");

const browser = await chromium.launch();
const ownError = (text) => !/Failed to load resource|net::ERR_|ERR_BLOCKED|Potential permissions policy|blocked by CORS|Content Security Policy/i.test(text);
async function open(ctx, path, errs) {
  const page = await ctx.newPage();
  await page.route("**/*", (route) => (route.request().url().startsWith(SITE) ? route.continue() : route.abort("blockedbyclient")));
  page.on("pageerror", (e) => errs.push(`page error: ${e.message.slice(0, 160)}`));
  page.on("console", (m) => { if (m.type() === "error" && ownError(m.text())) errs.push(`console: ${m.text().slice(0, 160)}`); });
  page.on("response", (r) => { const u = r.url(); if (u.startsWith(SITE) && r.status() >= 400 && !u.includes("/demos/")) errs.push(`HTTP ${r.status()} ${u.slice(SITE.length)}`); });
  await page.goto(SITE + path, { waitUntil: "networkidle", timeout: 30000 });
  return page;
}

try {
  for (const width of [1280, 375]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    for (const path of pages) {
      const errs = [];
      let page;
      try {
        page = await open(ctx, path, errs);
      } catch (e) {
        fail("load", `${path} at ${width}px: ${String(e.message).slice(0, 120)}`);
        continue;
      }
      if (width === 375) {
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (over > 1) fail("h-scroll", `${path} scrolls sideways by ${over}px at 375px`);
      }
      for (const e of errs) fail("errors", `${path} at ${width}px: ${e}`);
      await page.close();
    }
    await ctx.close();
  }

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  let page = await open(ctx, "/dashboard/", errs);
  for (const stat of ["questions", "lessons"]) {
    if (!(await page.$(`[data-stat='${stat}']`))) fail("dashboard", `the dashboard shows no [data-stat='${stat}']`);
  }
  if ((await page.textContent("[data-stat='lessons']").catch(() => "")) !== "0") fail("dashboard", "a first visit should count 0 lessons");
  await page.close();

  if (lessons[0]) {
    page = await open(ctx, lessons[0], errs);
    const toggle = await page.$("[data-progress-toggle^='lesson:']");
    if (!toggle) {
      fail("lesson", `${lessons[0]} has no lesson toggle ([data-progress-toggle='lesson:...'])`);
    } else {
      const key = await toggle.getAttribute("data-progress-toggle");
      await toggle.focus();
      await page.keyboard.press("Space");
      const stored = await page.evaluate((k) => (JSON.parse(localStorage.getItem("elegant.progress.v1") || "{}"))[k], key);
      if (!stored) fail("lesson", `Space on ${key} did not mark the lesson complete`);
      await page.close();
      page = await open(ctx, lessons[0].replace(/[^/]+\.html$/, ""), errs);
      const label = (await page.$$eval(".progress-tracker__label", (n) => n.map((x) => x.textContent).join("|")).catch(() => ""));
      if (!/1 of \d+ done/.test(label)) fail("course", `the course page does not show 1 lesson done after completing one (${label.slice(0, 80)})`);
      await page.close();
      page = await open(ctx, "/dashboard/", errs);
      if ((await page.textContent("[data-stat='lessons']").catch(() => "")) !== "1") fail("dashboard", "the dashboard does not count the completed lesson");
      await page.close();
    }
  }

  page = await open(ctx, "/pricing/", errs);
  const tiers = await page.$$eval(".pricing-tiers .tier, [data-tier]", (n) => n.length).catch(() => 0);
  if (tiers < 2) fail("pricing", `the pricing page renders ${tiers} tiers`);
  const sdkEarly = await page.evaluate(() => [...document.scripts].some((s) => /paypal\.com\/sdk|paypal\.com\/web-sdk/.test(s.src)));
  if (sdkEarly) fail("pricing", "the PayPal SDK loads before a paid tier is chosen");
  await page.close();
  for (const e of errs) fail("errors", `journey: ${e}`);
  await ctx.close();
} finally {
  await browser.close();
  server.close();
}

if (!lines.length) {
  console.log(`ok learner.journey: ${pages.length} pages at 1280 and 375px, the dashboard, a lesson and pricing in Chromium`);
  process.exit(0);
}
const rules = {};
for (const l of lines) { const r = l.split("[")[1].split("]")[0]; rules[r] = (rules[r] || 0) + 1; }
console.log("learner.journey: " + Object.entries(rules).sort((a, b) => b[1] - a[1]).map(([r, n]) => `${n} ${r}`).join(", "));
for (const l of lines.slice(0, limit)) console.log(l);
if (lines.length > limit) console.log(`... ${lines.length - limit} more: the next run lists the rest`);
process.exit(1);
