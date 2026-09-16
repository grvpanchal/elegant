/**
 * In-browser practice workspace.
 *
 * A coding question ships three files under /practice/workspace/<slug>/:
 *   starter.js   what the learner sees first (ES module, default export)
 *   solution.js  the reference implementation (never fetched by this runner)
 *   tests.js     `export default async (subject) => [{name, pass, message?}]`
 *
 * The same tests.js is what harness/check_harness.py runs under Node against
 * solution.js (capability `workspace.tests_pass`), so a question that is green
 * here is green in CI and vice versa — one contract, two runners.
 */
(function () {
  "use strict";

  var STORAGE_PREFIX = "elegant.playground.v1:";

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function base(slug) {
    return "/practice/workspace/" + slug + "/";
  }

  function draftKey(slug) {
    return STORAGE_PREFIX + slug;
  }

  function readDraft(slug) {
    try {
      return window.localStorage.getItem(draftKey(slug));
    } catch (err) {
      return null;
    }
  }

  function writeDraft(slug, code) {
    try {
      window.localStorage.setItem(draftKey(slug), code);
    } catch (err) {
      /* private mode, quota, blocked storage — drafts are a convenience only */
    }
  }

  /**
   * Import the learner's source as a real ES module, then hand the module
   * namespace to the question's tests.
   */
  async function runTests(slug, source) {
    var blob = new Blob([source], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    try {
      var subject = await import(/* webpackIgnore: true */ url);
      var tests = await import(/* webpackIgnore: true */ base(slug) + "tests.js");
      var runner = tests.default || tests.tests;
      if (typeof runner !== "function") {
        throw new Error("tests.js must default-export a function");
      }
      var results = await runner(subject.default != null ? subject.default : subject);
      if (!Array.isArray(results) || results.length === 0) {
        throw new Error("tests.js returned no results");
      }
      return results;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function render(host, results) {
    host.innerHTML = "";
    var passed = results.filter(function (r) { return r.pass; }).length;
    var head = el("p", "playground__summary",
      passed + " of " + results.length + " test" + (results.length === 1 ? "" : "s") + " passing");
    head.classList.add(passed === results.length ? "is-pass" : "is-fail");
    host.appendChild(head);
    var list = el("ul", "playground__results");
    results.forEach(function (r) {
      var item = el("li", "playground__result " + (r.pass ? "is-pass" : "is-fail"));
      item.appendChild(el("span", "playground__mark", r.pass ? "✓" : "✗"));
      item.appendChild(el("span", "playground__name", r.name));
      if (!r.pass && r.message) item.appendChild(el("span", "playground__message", r.message));
      list.appendChild(item);
    });
    host.appendChild(list);
    host.dispatchEvent(new CustomEvent("playground:results", {
      bubbles: true,
      detail: { passed: passed, total: results.length, allPassed: passed === results.length }
    }));
  }

  function fail(host, message) {
    host.innerHTML = "";
    var p = el("p", "playground__summary is-fail", "Could not run the tests");
    host.appendChild(p);
    host.appendChild(el("pre", "playground__error", message));
  }

  function mount(root) {
    var slug = root.getAttribute("data-slug");
    if (!slug) return;
    var editor = root.querySelector("[data-playground-editor]");
    var output = root.querySelector("[data-playground-output]");
    var runBtn = root.querySelector("[data-playground-run]");
    var resetBtn = root.querySelector("[data-playground-reset]");
    if (!editor || !output || !runBtn) return;

    var pristine = "";

    fetch(base(slug) + "starter.js")
      .then(function (res) {
        if (!res.ok) throw new Error("starter.js: HTTP " + res.status);
        return res.text();
      })
      .then(function (text) {
        pristine = text;
        var draft = readDraft(slug);
        editor.value = draft != null ? draft : text;
        editor.removeAttribute("disabled");
        runBtn.removeAttribute("disabled");
      })
      .catch(function (err) {
        fail(output, String(err && err.message ? err.message : err));
      });

    editor.addEventListener("input", function () { writeDraft(slug, editor.value); });

    runBtn.addEventListener("click", function () {
      output.textContent = "Running…";
      runTests(slug, editor.value)
        .then(function (results) { render(output, results); })
        .catch(function (err) { fail(output, String(err && err.stack ? err.stack : err)); });
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        editor.value = pristine;
        writeDraft(slug, pristine);
        output.innerHTML = "";
      });
    }
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-playground]"), mount);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.ElegantPlayground = { runTests: runTests };
})();
