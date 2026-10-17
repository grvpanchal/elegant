/**
 * Course surfaces: the "Start / Continue" buttons, done marks on lesson lists
 * and practice cards, and the lesson page's "saved where" note.
 *
 * Completion itself is plain progress.js — a lesson's checkbox is a
 * [data-progress-toggle="lesson:<course>/<slug>"] like a plan step's — so this
 * file only paints. Loaded with `defer` by the course and lesson layouts, which
 * runs it after the identity scripts at the end of the page.
 */
(function () {
  "use strict";

  function lessonsOf(node) {
    try { return JSON.parse(node.getAttribute("data-lessons") || "[]") || []; }
    catch (err) { return []; }
  }

  function paint() {
    var progress = window.ElegantProgress;
    if (!progress) return;

    Array.prototype.forEach.call(document.querySelectorAll("[data-course-continue]"), function (btn) {
      var lessons = lessonsOf(btn);
      if (!lessons.length) return;
      var done = lessons.filter(function (l) { return progress.isDone(l.key); }).length;
      var next = lessons.filter(function (l) { return !progress.isDone(l.key); })[0];
      if (!done) {
        btn.textContent = "Start course";
        btn.href = lessons[0].url;
      } else if (next) {
        btn.textContent = "Continue: " + next.title;
        btn.href = next.url;
      } else {
        btn.textContent = "Course complete — review it";
        btn.href = lessons[0].url;
      }
      btn.setAttribute("data-state", !done ? "start" : next ? "continue" : "complete");
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-done-key]"), function (node) {
      node.classList.toggle("is-done", progress.isDone(node.getAttribute("data-done-key")));
    });

    var article = document.querySelector("[data-lesson-key]");
    var note = document.querySelector("[data-lesson-note]");
    if (article && note) {
      var key = article.getAttribute("data-lesson-key");
      if (!progress.isDone(key)) {
        note.textContent = "";
      } else {
        var at = progress.doneAt(key);
        var sync = window.ElegantProgressSync;
        var where = sync && sync.describe().synced ? "Saved to your account." : "Saved in this browser.";
        note.textContent = "Completed" + (at ? " on " + at.toLocaleDateString() : "") + ". " + where;
      }
    }
  }

  function init() {
    document.addEventListener("progress:changed", paint);
    document.addEventListener("account:changed", paint);
    document.addEventListener("progress:sync", paint);
    paint();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
