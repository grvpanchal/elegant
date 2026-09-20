/**
 * Client-side filter + search over the blog.
 *
 * docs/blog/index.md renders one card per entry in docs/_data/blog.yml with its
 * facets as data attributes; every control carries data-filter="<facet>" and the
 * search box carries data-search. No index is fetched: the posts are already in
 * the HTML, so filtering is instant and degrades to "the full list" without JS.
 *
 * A byline/tag link like /blog/?category=terminology deep-links a filtered view:
 * on load we read the query string and pre-select the matching controls.
 */
(function () {
  "use strict";

  function norm(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function init() {
    var list = document.querySelector("[data-post-list]");
    if (!list) return;
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-post]"));
    var controls = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var search = document.querySelector("[data-search]");
    var count = document.querySelector("[data-post-count]");
    var empty = document.querySelector("[data-post-empty]");

    function matches(card) {
      for (var i = 0; i < controls.length; i++) {
        var facet = controls[i].getAttribute("data-filter");
        var wanted = norm(controls[i].value);
        if (!wanted) continue;
        var actual = norm(card.getAttribute("data-" + facet));
        var values = actual.split(/[\s,]+/).filter(Boolean);
        if (values.indexOf(wanted) === -1) return false;
      }
      if (search && norm(search.value)) {
        var needle = norm(search.value);
        if (norm(card.getAttribute("data-searchtext")).indexOf(needle) === -1) return false;
      }
      return true;
    }

    function apply() {
      var shown = 0;
      cards.forEach(function (card) {
        var ok = matches(card);
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (count) {
        count.textContent = shown + " post" + (shown === 1 ? "" : "s");
      }
      if (empty) empty.hidden = shown !== 0;
    }

    // Deep-link: /blog/?category=terminology&tag=ssr pre-selects controls.
    function preselect() {
      var params = new URLSearchParams(window.location.search || "");
      controls.forEach(function (c) {
        var facet = c.getAttribute("data-filter");
        var v = params.get(facet);
        if (v) c.value = v;
      });
      var q = params.get("q");
      if (q && search) search.value = q;
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
    preselect();
    apply();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
