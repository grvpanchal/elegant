/**
 * The Supabase controls of the sign-in page (/account/: sign in, email a magic
 * link, reset a password, and — once signed in — the sync state, a password
 * change and sign-out) and the create-account page (/account/create/). Each
 * page wires the forms it has. One view shows at a time ([data-sb-view]), and
 * the page's heading and lede follow whichever block is showing, from its
 * data-sb-title and data-sb-lede.
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

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  ready(function () {
    var api = window.ElegantSupabase;
    var sync = window.ElegantProgressSync;
    var progress = window.ElegantProgress;
    var panel = $("[data-account-supabase]");
    var absent = $("[data-account-supabase-absent]");
    var switcher = $("[data-sb-switch]");
    var heading = $("[data-sb-heading]");
    var subhead = $("[data-sb-subhead]");
    var devicePanel = $("[data-device-panel]");
    var devicePaused = $("[data-device-paused]");

    // No project configured: say so, rather than showing a form that cannot work.
    if (!api || !api.configured) {
      if (panel) panel.hidden = true;
      if (absent) absent.hidden = false;
      if (switcher) switcher.hidden = true;
      return;
    }
    if (absent) absent.hidden = true;

    var signedOut = $("[data-sb-signed-out]");
    var signedIn = $("[data-sb-signed-in]");
    var recovery = $("[data-sb-recovery]");
    var message = $("[data-sb-message]");
    var error = $("[data-sb-error]");
    var resend = $("[data-sb-resend]");
    var emailOut = $("[data-sb-email]");
    var syncText = $("[data-sync-text]");
    var syncRetry = $("[data-sync-retry]");
    var guestImport = $("[data-sb-guest-import]");
    var guestText = $("[data-sb-guest-import-text]");
    var guestGo = $("[data-sb-guest-import-go]");
    var lastEmail = "";

    function say(node, text) {
      if (!node) return;
      node.textContent = text || "";
      node.hidden = !text;
    }

    function clearNotes() { say(message, ""); say(error, ""); if (resend) resend.hidden = true; }

    // --------------------------------------------------------------- views
    var views = $$("[data-sb-view]");
    var first = views.length ? views[0].getAttribute("data-sb-view") : "";
    var view = first;

    function viewNode(name) { return $("[data-sb-view='" + name + "']"); }

    function showView(name, focus) {
      if (!viewNode(name)) return;
      view = name;
      views.forEach(function (node) { node.hidden = node.getAttribute("data-sb-view") !== name; });
      clearNotes();
      paint();
      var field = focus && $("input, button", viewNode(name));
      if (field) field.focus();
    }

    $$("[data-sb-goto]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var name = btn.getAttribute("data-sb-goto");
        // Carry the email across so nobody types it twice.
        var from = btn.closest("form");
        var typed = from && from.elements.email ? from.elements.email.value : "";
        showView(name, true);
        var to = $("[data-sb-form='" + name + "']");
        if (to && typed && to.elements.email && !to.elements.email.value) to.elements.email.value = typed;
      });
    });

    // The page's heading and lede name what the showing block is for.
    function headline(node) {
      if (!node) return;
      if (heading && node.hasAttribute("data-sb-title")) heading.textContent = node.getAttribute("data-sb-title");
      if (subhead && node.hasAttribute("data-sb-lede")) {
        subhead.textContent = node.getAttribute("data-sb-lede");
        subhead.hidden = !subhead.textContent;
      }
    }

    // ------------------------------------------------------------- painting
    function paintSync() {
      if (!sync) return;
      var d = sync.describe();
      if (syncText) {
        syncText.textContent = d.text;
        syncText.setAttribute("data-tone", d.tone);
      }
      if (syncRetry) syncRetry.hidden = sync.status().state !== "unavailable";
    }

    function paintGuestImport(who) {
      if (!guestImport || !progress) return;
      if (!who) { guestImport.hidden = true; return; }
      // Progress a signed-out visitor made in this browser, not yet in the account.
      var guest = progress.entriesOf("");
      var mine = progress.entries();
      var extra = Object.keys(guest).filter(function (k) { return guest[k] && !mine[k]; });
      guestImport.hidden = extra.length === 0;
      if (guestText && extra.length) {
        guestText.textContent = "Before you signed in, this browser recorded " + extra.length +
          " completed item" + (extra.length === 1 ? "" : "s") + " as a guest that your account does not have yet.";
      }
      guestImport.setAttribute("data-count", String(extra.length));
    }

    function paint() {
      var who = api.current();
      // A reset link lands on the sign-in page, the one with the new-password form.
      var recovering = api.recoveryPending() && Boolean(recovery);
      if (panel) panel.hidden = false;
      if (signedOut) signedOut.hidden = Boolean(who);
      if (signedIn) signedIn.hidden = !who || recovering;
      if (recovery) recovery.hidden = !(who && recovering);
      // "Don't have an account?" belongs to the page's main form, not to a reset or a sent email.
      if (switcher) switcher.hidden = Boolean(who) || !(viewNode(view) && viewNode(view).hasAttribute("data-sb-switchable"));
      if (emailOut) emailOut.textContent = who ? (who.email || who.name) : "";
      headline(who ? (recovering ? recovery : signedIn) : viewNode(view));
      // A verified account and a device profile at once would be two answers
      // to "who is this"; the device controls wait until the account signs out.
      if (devicePanel) devicePanel.hidden = Boolean(who);
      if (devicePaused) devicePaused.hidden = !who;
      paintSync();
      paintGuestImport(who);
    }

    function run(button, work) {
      clearNotes();
      if (button) { button.disabled = true; button.setAttribute("aria-busy", "true"); }
      return Promise.resolve().then(work).catch(function (err) {
        // Every refusal gets a reason on the page. A sign-in button that
        // silently does nothing is worse than no button at all.
        say(error, (err && err.message) || "That did not work.");
        if (err && err.code === "email_not_confirmed" && resend) resend.hidden = false;
      }).then(function () {
        if (button) { button.disabled = false; button.removeAttribute("aria-busy"); }
        paint();
      });
    }

    function valid(form) {
      // Native constraint validation, reported in the browser's own words, so
      // an empty or malformed field is named before anything is sent.
      if (form.checkValidity()) return true;
      form.reportValidity();
      return false;
    }

    function wire(name, handler) {
      var form = $("[data-sb-form='" + name + "']");
      if (!form) return;
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!valid(form)) return;
        var email = form.elements.email ? form.elements.email.value.trim() : "";
        lastEmail = email || lastEmail;
        run(form.querySelector("button[type=submit]"), function () { return handler(form, email); });
      });
    }

    wire("signin", function (form, email) {
      return api.signIn(email, form.elements.password.value).then(function () {
        form.reset();
        say(message, "");
      });
    });

    wire("signup", function (form, email) {
      return api.signUp(email, form.elements.password.value).then(function (res) {
        form.reset();
        if (res && res.pending) {
          var sentTo = $("[data-sb-sent-to]");
          if (sentTo) sentTo.textContent = email;
          showView("sent");
          if (resend) resend.hidden = false;
        }
      });
    });

    wire("magic", function (form, email) {
      return api.sendMagicLink(email).then(function () {
        say(message, "Check " + email + " for your sign-in link. Open it on this device; it works once.");
      });
    });

    wire("reset", function (form, email) {
      return api.sendPasswordReset(email).then(function () {
        say(message, "If " + email + " has an account, a reset link is on its way.");
      });
    });

    if (resend) {
      resend.addEventListener("click", function () {
        var email = lastEmail || (($("[data-sb-form='signin']") || {}).elements || {}).email && $("[data-sb-form='signin']").elements.email.value;
        if (!email) { say(error, "Type your email in the form first."); return; }
        run(resend, function () {
          return api.resendConfirmation(email).then(function () {
            say(message, "Sent again to " + email + ".");
          });
        });
      });
    }

    if (recovery) {
      var recoveryError = $("[data-sb-recovery-error]");
      recovery.addEventListener("submit", function (event) {
        event.preventDefault();
        say(recoveryError, "");
        if (!valid(recovery)) return;
        if (recovery.elements.password.value !== recovery.elements.confirm.value) {
          say(recoveryError, "The two passwords do not match.");
          recovery.elements.confirm.focus();
          return;
        }
        var btn = recovery.querySelector("button[type=submit]");
        btn.disabled = true;
        api.updatePassword(recovery.elements.password.value).then(function () {
          recovery.reset();
          paint();
          say(message, "Password saved.");
          if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus(); }
        }).catch(function (err) {
          say(recoveryError, (err && err.message) || "That did not work.");
        }).then(function () { btn.disabled = false; });
      });
    }

    var passwordForm = $("[data-sb-password]");
    if (passwordForm) {
      var pwMessage = $("[data-sb-password-message]");
      var pwError = $("[data-sb-password-error]");
      passwordForm.addEventListener("submit", function (event) {
        event.preventDefault();
        say(pwMessage, ""); say(pwError, "");
        if (!valid(passwordForm)) return;
        var btn = passwordForm.querySelector("button[type=submit]");
        btn.disabled = true;
        api.updatePassword(passwordForm.elements.password.value).then(function () {
          passwordForm.reset();
          say(pwMessage, "Password changed.");
        }).catch(function (err) {
          say(pwError, (err && err.message) || "That did not work.");
        }).then(function () { btn.disabled = false; });
      });
    }

    $$("[data-sb-signout]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (api.current()) api.signOut();
        showView(first, true);
      });
    });

    if (syncRetry && sync) {
      syncRetry.addEventListener("click", function () { sync.retry().then(paint); });
    }

    if (guestGo && progress) {
      guestGo.addEventListener("click", function () {
        var guest = progress.entriesOf("");
        var added = progress.merge(guest);
        // merge() deliberately does not push key by key; a pull pushes every
        // local row the account lacks in one request.
        if (sync) sync.retry();
        guestGo.disabled = true;
        if (guestText) guestText.textContent = "Added " + added + " item" + (added === 1 ? "" : "s") + " to your account's progress.";
        setTimeout(function () { guestGo.disabled = false; paint(); }, 1500);
      });
    }

    document.addEventListener("account:changed", paint);
    document.addEventListener("progress:sync", paint);
    document.addEventListener("progress:changed", function () { paintGuestImport(api.current()); });

    // A stored session is re-verified, never trusted because it is in storage;
    // an email link's token is verified the same way. Paint once that is done,
    // and say what an email link that brought the learner here did.
    function showRedirect(result) {
      if (result) {
        if (!result.ok) {
          showView(result.code === "otp_expired" ? "magic" : "signin");
          say(error, result.message);
        } else if (result.type === "signup") {
          say(message, "Email confirmed. You're signed in.");
        }
        // a recovery link: paint() shows the new-password form
      }
      paint();
      if (result && result.ok && result.type === "recovery" && recovery) {
        var field = recovery.elements.password;
        if (field) field.focus();
      }
    }

    paint();
    (api.ready || Promise.resolve()).then(function () {
      showRedirect(api.redirectResult && api.redirectResult());
    });
    document.addEventListener("account:redirect", function (event) { showRedirect(event.detail); });
  });
})();
