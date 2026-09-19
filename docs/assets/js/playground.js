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
 *
 * The editor is a plain textarea with three affordances layered on top:
 *   - syntax highlighting: a transparent <pre> behind the textarea paints the
 *     same text in colour (data-playground-highlight);
 *   - a resize handle drags the editor taller/shorter (data-playground-resize);
 *   - a console pane captures console.log from the learner's code so they can
 *     debug without opening devtools (data-playground-console).
 *
 * Ctrl/Cmd+Enter in the editor runs the tests, the same chord every editor a
 * candidate has used runs on — no reaching for the mouse in an interview.
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

  // ------------------------------------------------------- syntax highlighting
  // A tiny, dependency-free tokeniser for the subset of JavaScript a starter
  // and a learner's solution actually use. It is deliberately not a full
  // grammar: it only has to make a 40-line starter readable, not compile it.
  var KEYWORDS = /\b(?:const|let|var|function|return|if|else|for|while|of|in|new|typeof|class|export|default|import|from|async|await|try|catch|throw|switch|case|break|continue|this|null|undefined|true|false|=>)\b/;

  function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlight(code) {
    var out = "";
    var re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)/g;
    var last = 0;
    var m;
    while ((m = re.exec(code)) !== null) {
      out += escapeHtml(code.slice(last, m.index));
      if (m[1]) {
        out += '<span class="tok-comment">' + escapeHtml(m[1]) + "</span>";
      } else if (m[2]) {
        out += '<span class="tok-string">' + escapeHtml(m[2]) + "</span>";
      } else if (m[3]) {
        out += '<span class="tok-number">' + escapeHtml(m[3]) + "</span>";
      } else if (KEYWORDS.test(m[4])) {
        out += '<span class="tok-keyword">' + escapeHtml(m[4]) + "</span>";
      } else {
        out += escapeHtml(m[4]);
      }
      last = m.index + m[0].length;
    }
    out += escapeHtml(code.slice(last));
    return out;
  }

  function syncHighlight(editor, pre) {
    if (!pre) return;
    pre.innerHTML = highlight(editor.value) + "\n";
    pre.scrollTop = editor.scrollTop;
    pre.scrollLeft = editor.scrollLeft;
  }

  // ------------------------------------------------------------- console pane
  function makeConsole(root) {
    var pane = root.querySelector("[data-playground-console]");
    var body = root.querySelector("[data-playground-console-body]");
    if (!pane || !body) return null;
    var lines = 0;
    return {
      show: function () { pane.hidden = false; },
      clear: function () { body.innerHTML = ""; lines = 0; },
      line: function (text) {
        var item = el("div", "playground__console-line", String(text));
        body.appendChild(item);
        lines += 1;
        body.scrollTop = body.scrollHeight;
      },
      hasLines: function () { return lines > 0; }
    };
  }

  // ------------------------------------------------------------ resize handle
  // Pointer events so mouse, touch and pen all work from one handler, plus
  // arrow keys so the handle is operable without a pointer at all — a
  // drag-only affordance would be invisible to anyone on a keyboard.
  var MIN_EDITOR_H = 80;
  var KEY_STEP = 24;

  function setEditorHeight(editor, px) {
    editor.style.height = Math.max(MIN_EDITOR_H, px) + "px";
  }

  function wireResize(editor, handle) {
    if (!handle) return;
    var startY = 0;
    var startH = 0;

    handle.addEventListener("pointerdown", function (e) {
      startY = e.clientY;
      startH = editor.offsetHeight;
      handle.setPointerCapture(e.pointerId);
      document.body.classList.add("playground__resizing");
      e.preventDefault();
    });
    handle.addEventListener("pointermove", function (e) {
      if (!handle.hasPointerCapture(e.pointerId)) return;
      setEditorHeight(editor, startH + (e.clientY - startY));
    });
    function release(e) {
      if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
      document.body.classList.remove("playground__resizing");
    }
    handle.addEventListener("pointerup", release);
    handle.addEventListener("pointercancel", release);

    handle.addEventListener("keydown", function (e) {
      var step = e.key === "ArrowDown" ? KEY_STEP : e.key === "ArrowUp" ? -KEY_STEP : 0;
      if (!step) return;
      setEditorHeight(editor, editor.offsetHeight + step);
      e.preventDefault();
    });
  }

  /**
   * Import the learner's source as a real ES module, then hand the module
   * namespace to the question's tests. console.log calls made while the module
   * body runs (and while the tests run) are forwarded to the console pane.
   */
  async function runTests(slug, source, consolePane) {
    var blob = new Blob([source], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    var originalLog = window.console.log;
    var originalError = window.console.error;
    try {
      if (consolePane) {
        window.console.log = function () {
          originalLog.apply(window.console, arguments);
          consolePane.line(Array.prototype.slice.call(arguments).join(" "));
        };
        window.console.error = function () {
          originalError.apply(window.console, arguments);
          consolePane.line("error: " + Array.prototype.slice.call(arguments).join(" "));
        };
      }
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
      window.console.log = originalLog;
      window.console.error = originalError;
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
    var painted = root.querySelector("[data-playground-highlight]");
    var resize = root.querySelector("[data-playground-resize]");
    var consolePane = makeConsole(root);
    if (!editor || !output || !runBtn) return;

    var pristine = "";

    // The one path every trigger funnels through: the Run button, and the
    // Ctrl/Cmd+Enter chord in the editor, both run the same tests.
    function run() {
      output.textContent = "Running…";
      if (consolePane) consolePane.clear();
      runTests(slug, editor.value, consolePane)
        .then(function (results) {
          render(output, results);
          if (consolePane && consolePane.hasLines()) consolePane.show();
        })
        .catch(function (err) { fail(output, String(err && err.stack ? err.stack : err)); });
    }

    wireResize(editor, resize);

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
        syncHighlight(editor, painted);
      })
      .catch(function (err) {
        fail(output, String(err && err.message ? err.message : err));
      });

    editor.addEventListener("input", function () {
      writeDraft(slug, editor.value);
      syncHighlight(editor, painted);
    });
    editor.addEventListener("scroll", function () { syncHighlight(editor, painted); });

    // Ctrl/Cmd+Enter runs the tests from the editor — the chord every editor a
    // candidate has used runs on, so the mouse never has to be reached for.
    editor.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
    });

    runBtn.addEventListener("click", run);

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        editor.value = pristine;
        writeDraft(slug, pristine);
        output.innerHTML = "";
        if (consolePane) { consolePane.clear(); consolePane.show(); }
        syncHighlight(editor, painted);
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
