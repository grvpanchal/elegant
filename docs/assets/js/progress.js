/**
 * Per-learner progress, kept in localStorage.
 *
 * The site is static — there is no account and no backend — so completion
 * lives in the browser and is exportable as JSON. Every surface that shows
 * progress (the practice index, a plan page, a course, the dashboard, the
 * certificate) reads the same store through this module.
 *
 * A record is `{ "<key>": "<ISO time it was marked done>" }`. Keys are question
 * slugs (`action-creators`), concept-doc refs from a plan (`ui/atom`) and
 * course lessons (`lesson:<course>/<lesson>`). The value has always been the
 * completion time; older exports may hold `true` instead, which still counts as
 * done and simply has no date — readers must not assume a parsable timestamp.
 */
(function () {
  "use strict";

  var KEY = "elegant.progress.v1";

  // Progress belongs to whoever is signed in. With no profile the key is the
  // original one, so a guest keeps the progress they had before accounts
  // existed and nothing is stranded.
  function key() {
    try {
      return KEY + (window.ElegantAccount ? window.ElegantAccount.namespace() : "");
    } catch (err) {
      return KEY;
    }
  }

  function load() {
    try {
      return JSON.parse(window.localStorage.getItem(key()) || "{}") || {};
    } catch (err) {
      return {};
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(key(), JSON.stringify(state));
    } catch (err) {
      /* storage unavailable: progress degrades to this page view only */
    }
  }

  function stamp(at) {
    var t = at ? Date.parse(at) : NaN;
    return isNaN(t) ? new Date().toISOString() : new Date(t).toISOString();
  }

  var api = {
    isDone: function (slug) {
      return Boolean(load()[slug]);
    },
    /**
     * Mark one key done or not. `at` (optional, ISO string) keeps the time the
     * work was really done — a sync from another device passes the remote
     * time so the activity heatmap is not rewritten to "today".
     */
    setDone: function (slug, done, at) {
      var state = load();
      if (done) {
        state[slug] = stamp(at);
      } else {
        delete state[slug];
      }
      save(state);
      document.dispatchEvent(new CustomEvent("progress:changed", { detail: { slug: slug, done: done } }));
      return done;
    },
    /** When a key was marked done, or null (not done, or a legacy dateless record). */
    doneAt: function (slug) {
      var value = load()[slug];
      if (typeof value !== "string") return null;
      var t = Date.parse(value);
      return isNaN(t) ? null : new Date(t);
    },
    /** A copy of every record: { key: ISO time | true }. */
    entries: function () {
      var state = load();
      var out = {};
      Object.keys(state).forEach(function (k) { if (state[k]) out[k] = state[k]; });
      return out;
    },
    /**
     * Add records in one write — "done wins", so a key already done keeps its
     * own time. Fires a single progress:changed with no slug (so the sync layer
     * does not echo each key back) and returns how many keys were new.
     */
    merge: function (records, detail) {
      if (!records) return 0;
      var state = load();
      var added = 0;
      Object.keys(records).forEach(function (k) {
        if (!k || state[k] || !records[k]) return;
        state[k] = typeof records[k] === "string" ? stamp(records[k]) : new Date().toISOString();
        added++;
      });
      if (!added) return 0;
      save(state);
      var info = { slug: null, done: true, merged: added };
      for (var d in detail || {}) info[d] = detail[d];
      document.dispatchEvent(new CustomEvent("progress:changed", { detail: info }));
      return added;
    },
    toggle: function (slug) {
      return api.setDone(slug, !api.isDone(slug));
    },
    completed: function () {
      return Object.keys(load());
    },
    ratio: function (slugs) {
      if (!slugs || !slugs.length) return 0;
      var state = load();
      var done = slugs.filter(function (s) { return Boolean(state[s]); }).length;
      return done / slugs.length;
    },
    reset: function () {
      save({});
      document.dispatchEvent(new CustomEvent("progress:changed", { detail: { slug: null, done: false } }));
    },
    export: function () {
      return JSON.stringify(load(), null, 2);
    },
    /**
     * Records kept under another namespace ("" is the signed-out guest), read
     * only — the account page uses it to offer a guest's progress to a new sign-in.
     */
    entriesOf: function (namespace) {
      try {
        return JSON.parse(window.localStorage.getItem(KEY + (namespace || "")) || "{}") || {};
      } catch (err) {
        return {};
      }
    }
  };

  function paint() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-progress-of]"), function (node) {
      var slugs = (node.getAttribute("data-progress-of") || "")
        .split(/[\s,]+/).filter(Boolean);
      var ratio = api.ratio(slugs);
      var done = Math.round(ratio * slugs.length);
      var bar = node.querySelector("[data-progress-bar]");
      var label = node.querySelector("[data-progress-label]");
      if (bar) {
        bar.style.width = Math.round(ratio * 100) + "%";
        bar.parentElement.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
      }
      if (label) {
        label.textContent = done + " of " + slugs.length + " done (" + Math.round(ratio * 100) + "%)";
      }
      node.classList.toggle("is-complete", slugs.length > 0 && done === slugs.length);
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-progress-toggle]"), function (box) {
      var slug = box.getAttribute("data-progress-toggle");
      if (box.type === "checkbox") box.checked = api.isDone(slug);
      var row = box.closest("[data-question]");
      if (row) row.classList.toggle("is-done", api.isDone(slug));
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-progress-toggle]"), function (box) {
      box.addEventListener("change", function () {
        api.setDone(box.getAttribute("data-progress-toggle"), box.checked);
      });
    });
    var resetBtn = document.querySelector("[data-progress-reset]");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (window.confirm("Clear all saved progress on this browser?")) api.reset();
      });
    }
    document.addEventListener("progress:changed", paint);
    // Switching profile changes which progress is current, so every surface
    // has to repaint — otherwise the previous profile's ticks stay on screen.
    document.addEventListener("account:changed", paint);
    paint();
  }

  // A question page marks itself done the moment every test in its workspace passes.
  document.addEventListener("playground:results", function (evt) {
    var host = evt.target.closest("[data-playground]");
    var slug = host && host.getAttribute("data-slug");
    if (slug && evt.detail && evt.detail.allPassed) api.setDone(slug, true);
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.ElegantProgress = api;
})();
