/**
 * Builds a post's table of contents from the headings it actually renders.
 *
 * The TOC container ships empty and hidden (see _includes/blog-toc.html); this
 * fills it from the <h2>/<h3> inside [data-blog-body], assigning a stable id to
 * any heading that lacks one so the anchors resolve. A post with fewer than two
 * headings keeps the TOC hidden — a single-entry contents list is noise. No
 * network, no dependency: the prose is already in the HTML.
 */
(function () {
  "use strict";

  function slugify(text) {
    return (text || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section";
  }

  function init() {
    var body = document.querySelector("[data-blog-body]");
    var toc = document.querySelector("[data-blog-toc]");
    var list = document.querySelector("[data-blog-toc-list]");
    if (!body || !toc || !list) return;

    var headings = Array.prototype.slice.call(body.querySelectorAll("h2, h3"));
    if (headings.length < 2) return;

    var seen = {};
    headings.forEach(function (h) {
      var id = h.id;
      if (!id) {
        id = slugify(h.textContent);
        while (seen[id]) id = id + "-x";
        h.id = id;
      }
      seen[id] = true;

      var li = document.createElement("li");
      li.className = "blog-toc__item blog-toc__item--" + h.tagName.toLowerCase();
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });

    toc.hidden = false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
