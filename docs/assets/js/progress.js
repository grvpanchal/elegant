/**
 * Per-learner progress, kept in localStorage.
 *
 * The site is static — there is no account and no backend — so completion
 * lives in the browser and is exportable as JSON. Every surface that shows
 * progress (the practice index, a plan page, the certificate) reads the same
 * store through this module.
 */
(function () {
  "use strict";

  var KEY = "elegant.progress.v1";

  function load() {
    try {
      return JSON.parse(window.localStorage.getItem(KEY) || "{}") || {};
    } catch (err) {
      return {};
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      /* storage unavailable: progress degrades to this page view only */
    }
  }

  var api = {
    isDone: function (slug) {
      return Boolean(load()[slug]);
    },
    setDone: function (slug, done) {
      var state = load();
      if (done) {
        state[slug] = new Date().toISOString();
      } else {
        delete state[slug];
      }
      save(state);
      document.dispatchEvent(new CustomEvent("progress:changed", { detail: { slug: slug, done: done } }));
      return done;
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
