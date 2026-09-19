/**
 * Client-side filter + search over the question bank.
 *
 * docs/practice/index.md renders one row per entry in docs/_data/questions.yml
 * with its facets as data attributes; every control carries
 * data-filter="<facet>" and the search box carries data-search. No index is
 * fetched: the bank is already in the HTML, so filtering is instant and works
 * with JavaScript disabled down to "the full list".
 */
(function () {
  "use strict";

  function norm(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function init() {
    var list = document.querySelector("[data-question-list]");
    if (!list) return;
    var rows = Array.prototype.slice.call(list.querySelectorAll("[data-question]"));
    var controls = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var search = document.querySelector("[data-search]");
    var count = document.querySelector("[data-question-count]");
    var empty = document.querySelector("[data-question-empty]");

    function matches(row) {
      for (var i = 0; i < controls.length; i++) {
        var facet = controls[i].getAttribute("data-filter");
        var wanted = norm(controls[i].value);
        if (!wanted) continue;
        var actual = norm(row.getAttribute("data-" + facet));
        var values = actual.split(/[\s,]+/).filter(Boolean);
        if (values.indexOf(wanted) === -1) return false;
      }
      if (search && norm(search.value)) {
        var needle = norm(search.value);
        if (norm(row.getAttribute("data-searchtext")).indexOf(needle) === -1) return false;
      }
      return true;
    }

    function apply() {
      var shown = 0;
      rows.forEach(function (row) {
        var ok = matches(row);
        row.hidden = !ok;
        if (ok) shown++;
      });
      if (count) {
        count.textContent = shown + " question" + (shown === 1 ? "" : "s");
      }
      if (empty) empty.hidden = shown !== 0;
    }

    controls.forEach(function (c) { c.addEventListener("change", apply); });
    if (search) search.addEventListener("input", apply);
    var clear = document.querySelector("[data-filter-clear]");
    if (clear) {
      clear.addEventListener("click", function () {
        controls.forEach(function (c) { c.value = ""; });
        if (search) search.value = "";
        apply();
      });
    }
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
