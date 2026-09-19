/**
 * The account page's Supabase controls.
 *
 * Kept apart from account-supabase.js on purpose: that file is the provider and
 * has no opinion about markup, so a page that wants a different sign-in surface
 * swaps this file and keeps the verification. It also means the provider can be
 * loaded on every page (to restore a session) while only this page grows a form.
 */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var api = window.ElegantSupabase;
    var panel = document.querySelector("[data-account-supabase]");
    var absent = document.querySelector("[data-account-supabase-absent]");

    // No project configured: say so, rather than showing a form that cannot work.
    if (!api || !api.configured) {
      if (panel) panel.hidden = true;
      if (absent) absent.hidden = false;
      return;
    }
    if (panel) panel.hidden = false;
    if (absent) absent.hidden = true;

    var form = document.querySelector("[data-account-supabase-form]");
    var email = document.querySelector("[data-account-supabase-email]");
    var password = document.querySelector("[data-account-supabase-password]");
    var signup = document.querySelector("[data-account-supabase-signup]");
    var error = document.querySelector("[data-account-supabase-error]");
    var widget = document.querySelector("[data-account-widget]");
    var nameOut = document.querySelector("[data-account-name]");
    var signedIn = document.querySelector("[data-account-signed-in]");
    var signedOut = document.querySelector("[data-account-signed-out]");

    function show(message) {
      if (!error) return;
      error.textContent = message || "";
      error.hidden = !message;
    }

    function paint() {
      var who = api.current();
      if (widget) widget.setAttribute("data-signed-in", who ? "true" : "false");
      if (signedIn) signedIn.hidden = !who;
      if (signedOut) signedOut.hidden = !!who;
      if (nameOut && who) nameOut.textContent = who.name || who.email || who.id;
      if (panel) panel.hidden = !!who;
    }

    function attempt(run) {
      show("");
      return run().then(paint).catch(function (err) {
        // Every refusal gets a reason on the page. A sign-in button that
        // silently does nothing is worse than no button at all.
        show((err && err.message) || "That did not work.");
        paint();
      });
    }

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        attempt(function () { return api.signIn(email.value, password.value); });
      });
    }
    if (signup) {
      signup.addEventListener("click", function () {
        if (!form.reportValidity()) return;
        attempt(function () { return api.signUp(email.value, password.value); });
      });
    }

    Array.prototype.forEach.call(document.querySelectorAll("[data-account-signout]"), function (btn) {
      btn.addEventListener("click", function () {
        if (api.current()) { api.signOut(); paint(); }
      });
    });

    // A stored session is re-verified, never trusted because it is in storage.
    api.restore().then(paint).catch(paint);
  });
})();
