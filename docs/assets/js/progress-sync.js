/**
 * Mirrors local progress to the signed-in identity, and back.
 *
 * Deliberately a layer rather than a change to progress.js. localStorage stays
 * the source of truth for the page: the site has to keep working signed out,
 * offline, and in a fork with no identity provider at all, and it would be a
 * bad trade to make ticking a checkbox depend on a network round trip. This
 * adds the half that a device-local store cannot do — carrying what you did to
 * the next browser you sign in on.
 *
 * Merge rule: done wins. Progress here only ever moves forward, so a union of
 * the two sides is right, and it means neither device has to be "newer". Undoing
 * a question is a local act; it is not propagated as a deletion.
 */
(function () {
  "use strict";

  var progress = window.ElegantProgress;
  var remote = window.ElegantSupabase;
  if (!progress || !remote || !remote.configured) return;

  // setDone() fires progress:changed, which would push, which would... A single
  // flag is enough because all of this runs on one thread.
  var applying = false;

  function pull() {
    if (!remote.current()) return;
    remote.pull().then(function (rows) {
      var slugs = Object.keys(rows || {});
      if (!slugs.length) return;
      applying = true;
      try {
        slugs.forEach(function (slug) {
          if (!progress.isDone(slug)) progress.setDone(slug, true);
        });
      } finally {
        applying = false;
      }
      document.dispatchEvent(new CustomEvent("progress:changed", { detail: { synced: true } }));
    });
  }

  function push(evt) {
    if (applying || !remote.current()) return;
    var slug = evt && evt.detail && evt.detail.slug;
    if (!slug) return;
    remote.push(slug, Boolean(evt.detail.done));
  }

  document.addEventListener("progress:changed", push);
  // Signing in is when the other device's work should appear.
  window.addEventListener("account:changed", pull);
  document.addEventListener("account:changed", pull);

  // Also on load, for a session restored from storage rather than just created.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(pull, 0); });
  } else {
    setTimeout(pull, 0);
  }
})();
