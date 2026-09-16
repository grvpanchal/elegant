/**
 * Accounts on a site with no server.
 *
 * GreatFrontend has real accounts: sign in anywhere, your progress follows you.
 * This site is static Jekyll on GitHub Pages, so there is no session to hold
 * and no database to hold it in. Pretending otherwise would be the worst
 * option — a "Sign in" button that only sets a flag teaches the wrong thing on
 * a site about frontend architecture.
 *
 * So an account here is a real, honest thing with a smaller promise:
 *
 *   - a named PROFILE, stored on this device
 *   - progress NAMESPACED per profile, so two people sharing a laptop do not
 *     overwrite each other
 *   - a portable EXPORT that moves a profile to another device
 *   - a provider SEAM (`registerProvider`) so a hosted deployment can swap the
 *     local store for a real identity provider without touching any caller
 *
 * What it deliberately does NOT claim: authentication. There is no password,
 * nothing is verified, and anyone with this browser is every profile in it.
 * The UI says so. A real provider is the frontier capability
 * `account.remote_provider`, and it needs a backend this repository does not
 * have.
 */
(function () {
  "use strict";

  var KEY = "elegant.accounts.v1";
  var GUEST = null;

  // ------------------------------------------------------------- storage
  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var state = raw ? JSON.parse(raw) : null;
      if (!state || typeof state !== "object") return { profiles: {}, activeId: null };
      state.profiles = state.profiles && typeof state.profiles === "object" ? state.profiles : {};
      return state;
    } catch (err) {
      return { profiles: {}, activeId: null };
    }
  }

  function write(state) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      return false;   // private mode / blocked storage: this session only
    }
  }

  function slug(name) {
    return String(name || "").trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  }

  function announce(type, detail) {
    document.dispatchEvent(new CustomEvent(type, { detail: detail || {} }));
  }

  // ------------------------------------------------------------ providers
  // A provider owns "who is signed in". The default keeps it on this device.
  var providers = {};
  var providerName = "local";

  providers.local = {
    name: "local",
    label: "This device",
    signIn: function (name) {
      var id = slug(name);
      if (!id) throw new Error("A profile needs a name.");
      var state = read();
      if (!state.profiles[id]) {
        state.profiles[id] = { id: id, name: String(name).trim(), createdAt: new Date().toISOString() };
      }
      state.activeId = id;
      write(state);
      return state.profiles[id];
    },
    signOut: function () {
      var state = read();
      state.activeId = null;          // the profile and its progress stay
      write(state);
    },
    current: function () {
      var state = read();
      return state.activeId ? state.profiles[state.activeId] || GUEST : GUEST;
    },
  };

  // ---------------------------------------------------------------- api
  var api = {
    /** Register an identity provider — the seam a hosted deployment swaps. */
    registerProvider: function (name, adapter) {
      if (!adapter || typeof adapter.signIn !== "function" || typeof adapter.current !== "function") {
        throw new Error("A provider needs signIn(), signOut() and current().");
      }
      providers[name] = adapter;
      return api;
    },

    useProvider: function (name) {
      if (!providers[name]) throw new Error("No such provider: " + name);
      providerName = name;
      announce("account:changed", { profile: api.current() });
      return api;
    },

    providerName: function () { return providerName; },

    /** The signed-in profile, or null for the guest. */
    current: function () {
      try { return providers[providerName].current() || GUEST; }
      catch (err) { return GUEST; }
    },

    /** The storage namespace progress should use right now. */
    namespace: function () {
      var profile = api.current();
      return profile ? ":" + profile.id : "";
    },

    signIn: function (name) {
      var profile = providers[providerName].signIn(name);
      announce("account:changed", { profile: profile });
      return profile;
    },

    signOut: function () {
      if (providers[providerName].signOut) providers[providerName].signOut();
      announce("account:changed", { profile: null });
    },

    list: function () {
      var state = read();
      return Object.keys(state.profiles).map(function (id) { return state.profiles[id]; });
    },

    remove: function (id) {
      var state = read();
      delete state.profiles[id];
      if (state.activeId === id) state.activeId = null;
      write(state);
      try { window.localStorage.removeItem("elegant.progress.v1:" + id); } catch (err) { /* ignore */ }
      announce("account:changed", { profile: api.current() });
    },

    /**
     * Everything needed to continue on another device: the profile and the
     * progress that belongs to it. This is the honest version of "your account
     * follows you" on a site with nowhere to sync to.
     */
    export: function () {
      var profile = api.current();
      var progressKey = "elegant.progress.v1" + api.namespace();
      var progress = {};
      try { progress = JSON.parse(window.localStorage.getItem(progressKey) || "{}") || {}; }
      catch (err) { progress = {}; }
      return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(),
                              profile: profile, progress: progress }, null, 2);
    },

    /** Restore an export. Returns the profile it signed you in as. */
    import: function (json) {
      var payload = typeof json === "string" ? JSON.parse(json) : json;
      if (!payload || payload.version !== 1 || !payload.profile) {
        throw new Error("That is not an Elegant profile export.");
      }
      var state = read();
      var profile = payload.profile;
      state.profiles[profile.id] = profile;
      state.activeId = profile.id;
      write(state);
      try {
        window.localStorage.setItem("elegant.progress.v1:" + profile.id,
          JSON.stringify(payload.progress || {}));
      } catch (err) { /* storage blocked: the profile still applies this session */ }
      announce("account:changed", { profile: profile });
      return profile;
    },
  };

  window.ElegantAccount = api;

  // ------------------------------------------------------------- the widget
  function paint() {
    var profile = api.current();
    Array.prototype.forEach.call(document.querySelectorAll("[data-account-widget]"), function (node) {
      var nameEl = node.querySelector("[data-account-name]");
      var inEl = node.querySelector("[data-account-signed-in]");
      var outEl = node.querySelector("[data-account-signed-out]");
      if (nameEl) nameEl.textContent = profile ? profile.name : "";
      if (inEl) inEl.hidden = !profile;
      if (outEl) outEl.hidden = Boolean(profile);
      node.setAttribute("data-signed-in", profile ? "true" : "false");
    });
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-account-signin-form]"), function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("[data-account-signin-name]");
        var error = form.querySelector("[data-account-error]");
        try {
          api.signIn(input ? input.value : "");
          if (error) { error.textContent = ""; error.hidden = true; }
          if (input) input.value = "";
        } catch (err) {
          if (error) { error.textContent = err.message; error.hidden = false; }
        }
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-account-signout]"), function (button) {
      button.addEventListener("click", function () { api.signOut(); });
    });
    document.addEventListener("account:changed", paint);
    paint();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
