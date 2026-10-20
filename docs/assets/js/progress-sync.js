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
 * the two sides is right, and it means neither device has to be "newer". On
 * every pull, remote rows this device lacks are added (keeping the time they
 * were done, so the dashboard's activity is not rewritten to "today"), and
 * local rows the account lacks are pushed. Undoing a question is a local act;
 * it is not propagated as a deletion.
 *
 * Reads and writes exactly one table, `public.progress` (user_id, slug, done,
 * updated_at) — supabase/migrations/0001_progress.sql creates it with
 * row-level security. Until that migration is run the REST API answers 404,
 * and this layer reports "unavailable" and leaves the page device-only rather
 * than failing: nothing the learner does depends on it.
 *
 * Status, for the dashboard and the account page:
 *   window.ElegantProgressSync.status() -> { state, reason, at }
 *     state: "off"          no identity provider configured on this deployment
 *            "signed-out"   provider configured, nobody signed in: device-only
 *            "syncing"      a pull or push is in flight
 *            "synced"       the last round trip succeeded (`at` is when)
 *            "unavailable"  signed in, but the account store cannot be used:
 *                           reason "missing" (table not created yet),
 *                           "denied", "offline", "auth" or "error"
 *   and a `progress:sync` event on document whenever it changes.
 */
(function () {
  "use strict";

  var progress = window.ElegantProgress;
  var remote = window.ElegantSupabase;
  var UNAVAILABLE = "elegant.sync.unavailable.v1";   // sessionStorage: skip the network for a while
  var BACKOFF_MS = 10 * 60 * 1000;

  var status = { state: "off", reason: null, at: null };

  function setStatus(state, reason) {
    status = { state: state, reason: reason || null, at: new Date().toISOString() };
    document.dispatchEvent(new CustomEvent("progress:sync", { detail: status }));
  }

  function clock(iso) {
    try { return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }
    catch (err) { return ""; }
  }

  /**
   * One sentence for "where is my progress", shared by the dashboard and the
   * account page so they can never disagree. `synced` is true only when the
   * account really holds this device's progress.
   */
  function describe() {
    var seam = window.ElegantAccount;
    var who = seam ? seam.current() : null;
    var device = who && seam.providerName() === "local";
    var s = status;
    if (s.state === "synced") {
      return { synced: true, tone: "pass", text: "Synced to your account" + (s.at ? " at " + clock(s.at) : "") + ". Sign in anywhere and it is there." };
    }
    if (s.state === "syncing") return { synced: false, tone: "info", text: "Syncing your progress with your account…" };
    if (s.state === "unavailable") {
      var why = {
        missing: "your account's progress store is not set up on the server yet",
        offline: "your account cannot be reached right now",
        denied: "your account refused the sync",
        auth: "your sign-in needs renewing — sign in again",
        error: "the last sync failed",
      }[s.reason] || "the last sync failed";
      return { synced: false, tone: "warn", text: "Device-only for now: " + why + ". Everything is still saved in this browser and syncs once it can." };
    }
    if (device) return { synced: false, tone: "info", text: "Device profile " + who.name + ": progress is saved in this browser only." };
    if (s.state === "off") return { synced: false, tone: "info", text: "Progress is saved in this browser only — this deployment has no account sign-in." };
    return { synced: false, tone: "info", text: "Progress is saved in this browser only. Sign in to sync it to your account." };
  }

  window.ElegantProgressSync = {
    status: function () { return { state: status.state, reason: status.reason, at: status.at }; },
    describe: describe,
    /** Try again now, ignoring a remembered "unavailable" (the account page's retry button). */
    retry: function () {
      try { sessionStorage.removeItem(UNAVAILABLE); } catch (err) { /* ignore */ }
      return remote && remote.configured && progress ? pull() : Promise.resolve(status);
    },
  };

  if (!progress || !remote || !remote.configured) return;
  status.state = "signed-out";

  // setDone() fires progress:changed, which would push, which would... A single
  // flag is enough because all of this runs on one thread.
  var applying = false;

  function remembered() {
    try {
      var raw = sessionStorage.getItem(UNAVAILABLE);
      var mark = raw ? JSON.parse(raw) : null;
      if (mark && Date.now() - mark.t < BACKOFF_MS) return mark.reason;
    } catch (err) { /* ignore */ }
    return null;
  }

  function remember(reason) {
    // Only reasons that will not fix themselves within a page view are
    // remembered, so the next pages in this tab do not each repeat a request
    // that is known to fail (each one would be a 404 in the console).
    if (reason !== "missing" && reason !== "denied") return;
    try { sessionStorage.setItem(UNAVAILABLE, JSON.stringify({ reason: reason, t: Date.now() })); }
    catch (err) { /* ignore */ }
  }

  function unavailable(reason) {
    remember(reason);
    setStatus("unavailable", reason);
  }

  function pull() {
    if (!remote.current()) {
      setStatus("signed-out");
      return Promise.resolve(status);
    }
    var known = remembered();
    if (known) {
      setStatus("unavailable", known);
      return Promise.resolve(status);
    }
    setStatus("syncing");
    return remote.pull().then(function (result) {
      if (!result || !result.ok) {
        unavailable((result && result.reason) || "error");
        return status;
      }
      var rows = result.rows || {};
      applying = true;
      try {
        progress.merge(rows, { synced: true });
      } finally {
        applying = false;
      }
      // Whatever this device has that the account does not, the account gets.
      var local = progress.entries();
      var missing = Object.keys(local).filter(function (slug) { return !rows[slug]; })
        .map(function (slug) {
          return { slug: slug, done: true, at: typeof local[slug] === "string" ? local[slug] : null };
        });
      if (!missing.length) {
        setStatus("synced");
        return status;
      }
      return remote.push(missing).then(function (res) {
        if (res && res.ok) setStatus("synced");
        else unavailable((res && res.reason) || "error");
        return status;
      });
    });
  }

  function push(evt) {
    if (applying || !remote.current()) return;
    var slug = evt && evt.detail && evt.detail.slug;
    if (!slug) return;
    // Known not to work right now: the change is safe locally and the next
    // successful pull pushes it with everything else this device has.
    if (status.state === "unavailable") return;
    var done = Boolean(evt.detail.done);
    var at = done ? (progress.entries()[slug] || null) : null;
    setStatus("syncing");
    remote.push([{ slug: slug, done: done, at: typeof at === "string" ? at : null }]).then(function (res) {
      if (res && res.ok) setStatus("synced");
      else unavailable((res && res.reason) || "error");
    });
  }

  document.addEventListener("progress:changed", push);
  // Signing in is when the other device's work should appear. The seam
  // announces on document (account.js useProvider), so that is the one place
  // to listen — listening on window as well used to pull twice.
  document.addEventListener("account:changed", function () { pull(); });

  // Also on load, for a session restored from storage rather than just
  // created. Restoring is async (the token is re-verified against the JWKS),
  // so wait for it rather than racing it.
  var ready = remote.ready && typeof remote.ready.then === "function" ? remote.ready : Promise.resolve();
  ready.then(function () {
    if (!remote.current()) setStatus("signed-out");
    // A restored session already triggered account:changed -> pull().
  });
})();
