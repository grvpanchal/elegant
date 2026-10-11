#!/usr/bin/env node
// Print the book to PDF with Chromium and record what was built.
//
//   node scripts/book/print-book.mjs
//
// Pass 1 prints the book and reads back the page every chapter starts on
// (Chromium writes each in-document anchor as a named destination). Pass 2
// rebuilds the HTML with those numbers in the contents and prints again; the
// contents page is the same length either way, so the numbers stay true.
// Outputs docs/assets/book/elegant-frontend.pdf, its cover.jpg and
// docs/_data/book.yml (page count, size, part pages, a hash of the sources).

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const outPdf = path.join(root, "docs/assets/book/elegant-frontend.pdf");
const outData = path.join(root, "docs/_data/book.yml");
const outCover = path.join(root, "docs/assets/book/cover.jpg");
const work = fs.mkdtempSync(path.join(os.tmpdir(), "elegant-book-"));

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  for (const spec of ["playwright", "/opt/node22/lib/node_modules/playwright",
                      "/usr/local/lib/node_modules/playwright", "/usr/lib/node_modules/playwright"]) {
    try { return require(spec); } catch {}
  }
  throw new Error("playwright is not installed (npm i -g playwright)");
}

function buildHtml(pagesJson) {
  const html = path.join(work, "book.html");
  const args = [path.join(here, "build-book.rb"), html];
  if (pagesJson) args.push(pagesJson);
  const summary = JSON.parse(execFileSync("ruby", args, { cwd: root, encoding: "utf8" }).trim().split("\n").pop());
  return { html, summary };
}

// Map each named destination to its 1-based page, straight from the PDF
// objects (Skia writes them uncompressed: /Dests << /name [N 0 R /XYZ ...] >>).
function namedDestPages(pdf) {
  const src = pdf.toString("latin1");
  const objs = new Map();
  for (const m of src.matchAll(/(\d+) 0 obj\s*([\s\S]*?)endobj/g)) objs.set(m[1], m[2]);
  const catalog = [...objs.values()].find((o) => /\/Type\s*\/Catalog/.test(o));
  const pagesRef = catalog.match(/\/Pages\s+(\d+) 0 R/)[1];
  const order = [];
  (function walk(id) {
    const o = objs.get(id);
    if (/\/Type\s*\/Pages/.test(o)) {
      const kids = o.match(/\/Kids\s*\[([^\]]*)\]/)[1];
      for (const k of kids.matchAll(/(\d+) 0 R/g)) walk(k[1]);
    } else order.push(id);
  })(pagesRef);
  const pageOf = new Map(order.map((id, i) => [id, i + 1]));
  let dests = catalog.match(/\/Dests\s*(\d+) 0 R/);
  const body = dests ? objs.get(dests[1]) : catalog;
  const map = {};
  for (const m of body.matchAll(/\/([\w.-]+)\s*\[\s*(\d+) 0 R\s*\/XYZ/g)) {
    if (pageOf.has(m[2])) map[m[1]] = pageOf.get(m[2]);
  }
  return { map, pages: order.length };
}

async function print(browser, html, file, cover) {
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } });
  await page.goto("file://" + html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, outline: true });
  if (cover) {
    // The download page shows the real cover, cut from the same HTML.
    await page.emulateMedia({ media: "print" });
    await page.locator(".cover").screenshot({ path: cover, type: "jpeg", quality: 88 });
  }
  await page.close();
  return fs.readFileSync(file);
}

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
try {
  const first = buildHtml();
  const pass1 = await print(browser, first.html, path.join(work, "pass1.pdf"));
  const { map } = namedDestPages(pass1);
  const chapters = Object.keys(map).filter((k) => k.startsWith("ch-"));
  if (chapters.length !== first.summary.chapters) {
    throw new Error(`found ${chapters.length} chapter destinations, expected ${first.summary.chapters}`);
  }
  const pagesJson = path.join(work, "pages.json");
  fs.writeFileSync(pagesJson, JSON.stringify(map));

  const second = buildHtml(pagesJson);
  fs.mkdirSync(path.dirname(outPdf), { recursive: true });
  const pass2 = await print(browser, second.html, path.join(work, "pass2.pdf"), outCover);
  const check = namedDestPages(pass2);
  const drift = Object.keys(map).filter((k) => check.map[k] !== map[k]);
  if (drift.length) throw new Error(`contents page numbers moved on pass 2: ${drift.join(", ")}`);

  fs.writeFileSync(outPdf, pass2);

  // Hash the sources, so a stale PDF can be told apart from a fresh one.
  const sources = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "docs/ui", "docs/server", "docs/state",
    "docs/_data/topics", "skills", "scripts/book", "docs/assets/img/logos"], { cwd: root, encoding: "utf8" })
    .split("\n").filter((f) => f && /\.(md|csv|rb|css|mjs|svg)$/.test(f)).sort();
  const hash = createHash("sha256");
  for (const f of sources) hash.update(f).update(fs.readFileSync(path.join(root, f)));

  const s = second.summary;
  const yml = [
    "# Generated by scripts/book/print-book.mjs - do not edit by hand.",
    `file: /assets/book/elegant-frontend.pdf`,
    `cover: /assets/book/cover.jpg`,
    `pages: ${check.pages}`,
    `size_mb: ${(pass2.length / 1048576).toFixed(1)}`,
    `chapters: ${s.chapters}`,
    `built: ${new Date().toISOString().slice(0, 10)}`,
    `source_sha256: ${hash.digest("hex")}`,
    "parts:",
    ...s.parts.map((p) => `  - { layer: ${p.layer}, title: "${p.title}", terms: ${p.terms}, logo: ${p.logo}, page: ${map["part-" + p.layer]} }`),
    "",
  ].join("\n");
  fs.writeFileSync(outData, yml);
  console.log(`book: ${check.pages} pages, ${(pass2.length / 1048576).toFixed(1)} MB -> ${path.relative(root, outPdf)}`);
} finally {
  await browser.close();
  fs.rmSync(work, { recursive: true, force: true });
}
