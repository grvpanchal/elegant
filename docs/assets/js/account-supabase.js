/**
 * A real identity provider for the account seam, backed by Supabase.
 *
 * `account.js` keeps profiles on this device: you type a name and you are that
 * person. Useful, honest, and not an account — nothing is verified and nothing
 * follows you to another browser. This swaps that for a credential the site did
 * not invent, through the `registerProvider` seam that was always there for it.
 *
 * The one rule that matters here: **a token you decoded is not a token you
 * verified.** A JWT's payload is base64, so reading a name out of it proves
 * nothing at all — anyone can type one. Every session below is checked against
 * the project's published JWKS (ES256 / EC P-256, which is what Supabase's new
 * publishable-key projects sign with) before it is allowed to mean anything,
 * and that check runs again on every page load, not just at sign-in. That
 * includes a token that arrives in the URL from an email link: it is verified
 * exactly like one from the password form.
 *
 * Only the email provider is enabled on the project, so the flows are:
 *   - email + password sign-up (the project sends a confirmation email; there
 *     is no session until the link is followed)
 *   - email + password sign-in
 *   - magic link (POST /otp) — the email link returns here with a session
 *   - password reset (POST /recover) — the link returns with a recovery
 *     session, and the account page asks for the new password (PUT /user)
 * Email links come back as `#access_token=…&type=…` (the implicit flow), or
 * `#error=…` when a link has expired; both are consumed and wiped from the
 * address bar on whatever page they land on.
 *
 * Configuration is deliberately runtime, not baked in:
 *
 *   window.ELEGANT_SUPABASE = { url: "https://<ref>.supabase.co", anonKey: "sb_publishable_..." }
 *
 * set before this script loads. With nothing set the provider stays dormant and
 * the site behaves exactly as it does today, which is what keeps a local
 * checkout and a fork with no project of their own working.
 *
 * The publishable key is not a secret — it is designed to ship in client code —
 * but it is only safe when row-level security is on, because the key alone is
 * what the database sees. See docs/account/index.md and supabase/README.md.
 *
 * The verified session is kept in localStorage, as supabase-js does by default:
 * a static site has no server to set an httpOnly cookie. That is the trade the
 * Session lesson warns about, made knowingly — it is why tokens are short-lived,
 * re-verified on every load, refreshed rather than extended, and why nothing
 * here ever writes a token into a URL or a log.
 */
(function () {
  "use strict";

  var cfg = window.ELEGANT_SUPABASE;
  if (!cfg || !cfg.url || !cfg.anonKey) return;

  var BASE = String(cfg.url).replace(/\/+$/, "");
  var AUTH = BASE + "/auth/v1";
  var REST = BASE + "/rest/v1";
  var STORE = "elegant.supabase.session.v1";
  var RECOVERY = "elegant.supabase.recovery.v1";   // sessionStorage: a reset link was followed
  var ISSUER = AUTH;
  // Where email links come back to. The project's Auth settings must allow it
  // (Authentication -> URL Configuration -> Redirect URLs); see supabase/README.md.
  var REDIRECT = cfg.redirectTo || (window.location.origin + "/account/");

  var session = null;      // only ever set to a VERIFIED session
  var jwksPromise = null;
  var refreshing = null;
  var refreshTimer = null;
  var redirectResult = null;

  // The publishable key goes in `apikey` only — it is not a JWT and must never
  // be sent as a bearer. The user's verified access token is the bearer, and
  // only on calls that act as that user (REST, PUT /user, logout).
  function headers(extra, asUser) {
    var h = { apikey: cfg.anonKey, "content-type": "application/json" };
    for (var k in extra || {}) h[k] = extra[k];
    if (asUser && session && session.access_token) h.authorization = "Bearer " + session.access_token;
    return h;
  }

  // ------------------------------------------------------------ verifying
  function jwks() {
    if (!jwksPromise) {
      jwksPromise = fetch(AUTH + "/.well-known/jwks.json", { headers: { apikey: cfg.anonKey } })
        .then(function (r) {
          if (!r.ok) throw new Error("jwks " + r.status);
          return r.json();
        })
        .catch(function () { jwksPromise = null; throw new Error("Could not reach the identity provider."); });
    }
    return jwksPromise;
  }

  function b64urlToBytes(s) {
    var pad = s.replace(/-/g, "+").replace(/_/g, "/");
    while (pad.length % 4) pad += "=";
    var raw = atob(pad);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function claimsOf(token) {
    var parts = String(token || "").split(".");
    if (parts.length !== 3) throw new Error("that is not a token");
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
  }

  function refusal(message, code) {
    var e = new Error(message);
    e.code = code;
    return e;
  }

  /**
   * Resolve to the token's claims, or reject with why it was refused.
   * Order matters: signature first, then who it is from and for, then whether
   * it is still alive. A caller that checks `exp` on an unverified token has
   * checked a number the attacker chose.
   */
  function verify(token) {
    var parts = String(token || "").split(".");
    if (parts.length !== 3) return Promise.reject(refusal("That is not a sign-in token.", "malformed"));

    var header;
    try { header = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0]))); }
    catch (err) { return Promise.reject(refusal("That is not a sign-in token.", "malformed")); }
    if (header.alg !== "ES256") {
      // `none`, or a swap to a symmetric alg, is the oldest JWT attack there is.
      return Promise.reject(refusal("Unexpected token algorithm: " + header.alg, "alg"));
    }

    return jwks().then(function (set) {
      var keys = ((set && set.keys) || []).filter(function (k) { return k.kty === "EC" && k.crv === "P-256"; });
      // With a kid, only that key may verify; without one, try the first EC key.
      var jwk = header.kid ? keys.filter(function (k) { return k.kid === header.kid; })[0] : keys[0];
      if (!jwk) throw refusal("The identity provider published no matching signing key.", "nokey");
      return crypto.subtle.importKey(
        "jwk", { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y },
        { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]
      );
    }).then(function (key) {
      return crypto.subtle.verify(
        { name: "ECDSA", hash: "SHA-256" }, key,
        b64urlToBytes(parts[2]),
        new TextEncoder().encode(parts[0] + "." + parts[1])
      );
    }).then(function (good) {
      if (!good) throw refusal("The sign-in could not be verified.", "signature");
      var claims = claimsOf(token);
      if (claims.iss !== ISSUER) throw refusal("That sign-in came from somewhere else.", "issuer");
      var aud = claims.aud;
      if (aud !== "authenticated" && !(Array.isArray(aud) && aud.indexOf("authenticated") !== -1)) {
        throw refusal("That token is not a user sign-in.", "audience");
      }
      if (!claims.sub) throw refusal("That token names nobody.", "subject");
      var now = Math.floor(Date.now() / 1000);
      if (!claims.exp || claims.exp <= now) throw refusal("That sign-in has expired — please sign in again.", "expired");
      return claims;
    });
  }

  // -------------------------------------------------------------- talking
  // Supabase Auth answers errors as { error_code, msg } or { error, error_description }.
  // A refusal always gets a reason a person can act on.
  var FRIENDLY = {
    invalid_credentials: "That email and password do not match an account.",
    invalid_grant: "That email and password do not match an account.",
    email_not_confirmed: "Confirm your email first — the link is in your inbox. You can resend it below.",
    over_email_send_rate_limit: "Too many emails were sent just now. Wait a minute, then try again.",
    over_request_rate_limit: "Too many attempts. Wait a minute, then try again.",
    user_already_exists: "There is already an account for that email. Sign in, or reset the password.",
    email_exists: "There is already an account for that email. Sign in, or reset the password.",
    weak_password: "Choose a stronger password: at least 8 characters, not a common one.",
    same_password: "That is your current password. Choose a new one.",
    signup_disabled: "New sign-ups are closed on this project right now.",
    otp_expired: "That email link has expired or was already used. Request a new one.",
    otp_disabled: "Email links are not enabled on this project.",
    email_address_invalid: "That email address cannot receive mail from the project.",
    session_not_found: "That sign-in has ended. Please sign in again.",
    refresh_token_not_found: "That sign-in has ended. Please sign in again.",
    refresh_token_already_used: "That sign-in has ended. Please sign in again."
  };

  function failure(body, status) {
    body = body || {};
    var code = body.error_code || body.error || "";
    var raw = body.msg || body.error_description || body.message || "";
    var e = new Error(FRIENDLY[code] || raw || (status ? "The identity provider said no (" + status + ")." : "That did not work."));
    e.code = code || String(status || "");
    e.status = status;
    return e;
  }

  function call(method, url, body, extraHeaders, asUser) {
    return fetch(url, { method: method, headers: headers(extraHeaders, asUser), body: body === undefined ? undefined : JSON.stringify(body) })
      .then(function (r) {
        if (r.status === 204) return { ok: r.ok, status: r.status, body: {} };
        return r.json().catch(function () { return {}; })
          .then(function (b) { return { ok: r.ok, status: r.status, body: b }; });
      }, function () {
        throw refusal("Could not reach the identity provider. Check your connection.", "offline");
      });
  }

  function withRedirect(path) {
    return path + (path.indexOf("?") === -1 ? "?" : "&") + "redirect_to=" + encodeURIComponent(REDIRECT);
  }

  // ------------------------------------------------------------- sessions
  function persist() {
    try {
      if (session) localStorage.setItem(STORE, JSON.stringify(session));
      else localStorage.removeItem(STORE);
    } catch (err) { /* private mode: this tab only */ }
  }

  function becomeActive() {
    // Become the active provider, so Account.namespace() and every surface
    // that asks "who is signed in" get the verified identity rather than a
    // device profile that happens to still be selected. useProvider announces
    // account:changed on document, which is where every listener is.
    var seam = window.ElegantAccount;
    if (!seam) return;
    try {
      if (session) seam.useProvider("supabase");
      else if (seam.providerName() === "supabase") seam.useProvider("local");
    } catch (err) { /* ignore */ }
  }

  function scheduleRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = null;
    if (!session || !session.refresh_token || !session.expires_at) return;
    var wait = (session.expires_at - 60) * 1000 - Date.now();
    refreshTimer = setTimeout(function () {
      refresh().catch(function (err) {
        // Offline is not signed out: try again in a minute.
        if (err && err.code === "offline") refreshTimer = setTimeout(scheduleRefresh, 60000);
      });
    }, Math.max(wait, 5000));
  }

  function adopt(payload) {
    if (!payload || !payload.access_token) return Promise.reject(failure(payload));
    return verify(payload.access_token).then(function (claims) {
      var wasId = session && session.id;
      session = {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token || (session && session.refresh_token) || null,
        expires_at: claims.exp,
        id: claims.sub,
        name: claims.email || claims.sub,
        email: claims.email || null,
      };
      persist();
      scheduleRefresh();
      // A refreshed token for the same person is not a new sign-in; only
      // announce when who is signed in actually changed.
      if (wasId !== session.id) becomeActive();
      return session;
    });
  }

  function drop() {
    session = null;
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = null;
    persist();
    becomeActive();
  }

  /** Swap the refresh token for a new access token. The new one is verified like any other. */
  function refresh(saved) {
    var source = saved || session;
    if (!source || !source.refresh_token) return Promise.reject(refusal("Nothing to refresh.", "norefresh"));
    if (!refreshing) {
      refreshing = call("POST", AUTH + "/token?grant_type=refresh_token", { refresh_token: source.refresh_token })
        .then(function (res) {
          if (!res.ok) throw failure(res.body, res.status);
          return adopt(res.body);
        })
        .then(function (s) { refreshing = null; return s; },
              function (err) {
                refreshing = null;
                // A refused refresh token means the sign-in is over (revoked,
                // reused, signed out elsewhere with scope=global). Offline
                // means nothing yet.
                if (!err || err.code !== "offline") drop();
                throw err;
              });
    }
    return refreshing;
  }

  /** A token good for at least the next 30 seconds, or a rejection. */
  function fresh() {
    if (!session) return Promise.reject(refusal("Not signed in.", "signedout"));
    if (session.expires_at - 30 > Math.floor(Date.now() / 1000)) return Promise.resolve(session);
    return refresh();
  }

  // Email links land here as #access_token=…&refresh_token=…&type=… (or #error=…).
  function consumeRedirect() {
    var hash = window.location.hash.replace(/^#/, "");
    var query = window.location.search.replace(/^\?/, "");
    var params = new URLSearchParams(hash);
    var qparams = new URLSearchParams(query);
    var hasToken = params.get("access_token");
    var hasError = params.get("error") || params.get("error_code") || qparams.get("error_code");
    if (!hasToken && !hasError) return null;

    // Wipe the token from the address bar (and so from history and any
    // screenshot) before anything else can read or log it.
    try {
      var clean = window.location.pathname;
      if (hasError && qparams.get("error_code")) {
        ["error", "error_code", "error_description"].forEach(function (k) { qparams.delete(k); });
        var rest = qparams.toString();
        clean += rest ? "?" + rest : "";
      } else {
        clean += window.location.search;
      }
      window.history.replaceState(null, document.title, clean);
    } catch (err) { /* ignore */ }

    if (hasError && !hasToken) {
      var code = params.get("error_code") || qparams.get("error_code") || params.get("error");
      var desc = params.get("error_description") || qparams.get("error_description") || "";
      redirectResult = { ok: false, type: "error", code: code, message: FRIENDLY[code] || desc.replace(/\+/g, " ") || "That email link did not work." };
      return Promise.resolve(null);
    }

    var type = params.get("type") || "magiclink";
    return adopt({ access_token: hasToken, refresh_token: params.get("refresh_token") })
      .then(function (s) {
        if (type === "recovery") {
          try { sessionStorage.setItem(RECOVERY, "1"); } catch (err) { /* ignore */ }
        }
        redirectResult = { ok: true, type: type };
        return s;
      }, function (err) {
        redirectResult = { ok: false, type: "error", code: err.code, message: err.message };
        return null;
      });
  }

  /** Re-verify a stored session on load. An expired one is refreshed, a bad one dropped — never trusted. */
  function restore() {
    var raw;
    try { raw = localStorage.getItem(STORE); } catch (err) { return Promise.resolve(null); }
    if (!raw) return Promise.resolve(null);
    var saved;
    try { saved = JSON.parse(raw); } catch (err) { return Promise.resolve(null); }
    if (!saved || !saved.access_token) return Promise.resolve(null);
    return verify(saved.access_token).then(function (claims) {
      session = saved;
      session.id = claims.sub;
      session.expires_at = claims.exp;
      scheduleRefresh();
      becomeActive();
      return session;
    }).catch(function (err) {
      if (err && err.code === "expired" && saved.refresh_token) {
        return refresh(saved).catch(function () { return null; });
      }
      if (err && err.code === "offline") {
        // The provider is unreachable, so nothing can be verified: stay signed
        // out for this page, but keep the stored session for the next load.
        return null;
      }
      drop();
      return null;
    });
  }

  // ---------------------------------------------------------------- api
  var provider = {
    name: "supabase",
    label: "Your account",
    /** The seam is synchronous, so this reports the cached VERIFIED session. */
    current: function () {
      return session ? { id: session.id, name: session.name, email: session.email, verified: true } : null;
    },
    signIn: function () {
      throw new Error("Use ElegantSupabase.signIn(email, password) — a credential is checked, not typed.");
    },
    signOut: function () {
      var token = session && session.access_token;
      try { sessionStorage.removeItem(RECOVERY); } catch (err) { /* ignore */ }
      drop();
      if (token) {
        // scope=local ends this browser's session only; signing out here must
        // not sign the same person out of their other devices.
        fetch(AUTH + "/logout?scope=local", { method: "POST", headers: { apikey: cfg.anonKey,
          authorization: "Bearer " + token } }).catch(function () { /* best effort */ });
      }
    },
  };

  var api = {
    configured: true,
    provider: provider,
    redirectTo: REDIRECT,

    /**
     * Create an account. With email confirmation on (it is, on this project)
     * this resolves `{ pending: true }`: there is a user but no session until
     * the emailed link is followed.
     */
    signUp: function (email, password) {
      return call("POST", withRedirect(AUTH + "/signup"), { email: email, password: password }).then(function (res) {
        if (!res.ok) throw failure(res.body, res.status);
        var d = res.body || {};
        if (d.access_token) return adopt(d).then(function () { return { pending: false }; });
        return { pending: true, email: email };
      });
    },

    signIn: function (email, password) {
      return call("POST", AUTH + "/token?grant_type=password", { email: email, password: password })
        .then(function (res) {
          if (!res.ok) throw failure(res.body, res.status);
          return adopt(res.body);
        });
    },

    /** Email a one-time sign-in link. Works for a new address too: following it creates the account. */
    sendMagicLink: function (email) {
      return call("POST", withRedirect(AUTH + "/otp"), { email: email, create_user: true }).then(function (res) {
        if (!res.ok) throw failure(res.body, res.status);
        return { sent: true, email: email };
      });
    },

    /** Email a password-reset link. The answer is the same whether or not the address has an account. */
    sendPasswordReset: function (email) {
      return call("POST", withRedirect(AUTH + "/recover"), { email: email }).then(function (res) {
        if (!res.ok) throw failure(res.body, res.status);
        return { sent: true, email: email };
      });
    },

    /** Send the sign-up confirmation email again. */
    resendConfirmation: function (email) {
      return call("POST", withRedirect(AUTH + "/resend"), { type: "signup", email: email }).then(function (res) {
        if (!res.ok) throw failure(res.body, res.status);
        return { sent: true, email: email };
      });
    },

    /** Set a new password for the signed-in person (after a reset link, or from the account page). */
    updatePassword: function (password) {
      return fresh().then(function () {
        return call("PUT", AUTH + "/user", { password: password }, null, true);
      }).then(function (res) {
        if (!res.ok) throw failure(res.body, res.status);
        try { sessionStorage.removeItem(RECOVERY); } catch (err) { /* ignore */ }
        return { updated: true };
      });
    },

    /** True after a password-reset link was followed and no new password has been set yet. */
    recoveryPending: function () {
      try { return Boolean(session) && sessionStorage.getItem(RECOVERY) === "1"; } catch (err) { return false; }
    },

    /** What an email link that brought the learner here did: { ok, type, code?, message? } or null. */
    redirectResult: function () { return redirectResult; },

    signOut: function () {
      if (window.ElegantAccount && window.ElegantAccount.providerName() === "supabase") {
        window.ElegantAccount.signOut();     // the seam announces; it calls provider.signOut
      } else {
        provider.signOut();
      }
    },

    current: function () { return provider.current(); },

    /**
     * Progress for the signed-in person, from the database rather than this device.
     * Resolves { ok: true, rows: { slug: updated_at } } or { ok: false, reason }.
     * Never rejects: sync failing must leave the page working device-only.
     */
    pull: function () {
      if (!session) return Promise.resolve({ ok: false, reason: "signedout" });
      return fresh().then(function () {
        return call("GET", REST + "/progress?select=slug,done,updated_at", undefined, null, true);
      }).then(function (res) {
        if (!res.ok) return { ok: false, reason: reasonFor(res), status: res.status };
        var out = {};
        (Array.isArray(res.body) ? res.body : []).forEach(function (row) {
          if (row && row.slug && row.done) out[row.slug] = row.updated_at || true;
        });
        return { ok: true, rows: out };
      }).catch(function (err) {
        return { ok: false, reason: (err && err.code) === "offline" ? "offline" : "auth" };
      });
    },

    /**
     * Record progress under this identity, so another device sees it.
     * Accepts one slug (with `done`) or an array of { slug, done, at }.
     * Resolves { ok, reason? }; never rejects.
     */
    push: function (slugOrRows, done) {
      if (!session) return Promise.resolve({ ok: false, reason: "signedout" });
      var rows = Array.isArray(slugOrRows) ? slugOrRows : [{ slug: slugOrRows, done: done }];
      if (!rows.length) return Promise.resolve({ ok: true });
      return fresh().then(function () {
        var body = rows.map(function (r) {
          var at = typeof r.at === "string" && !isNaN(Date.parse(r.at)) ? r.at : new Date().toISOString();
          return { user_id: session.id, slug: String(r.slug), done: Boolean(r.done), updated_at: at };
        });
        return call("POST", REST + "/progress?on_conflict=user_id,slug", body,
          { prefer: "resolution=merge-duplicates,return=minimal" }, true);
      }).then(function (res) {
        return res.ok ? { ok: true } : { ok: false, reason: reasonFor(res), status: res.status };
      }).catch(function (err) {
        return { ok: false, reason: (err && err.code) === "offline" ? "offline" : "auth" };
      });
    },

    restore: restore,
  };

  // PostgREST says "the table is not there" as 404 + PGRST205 (or 42P01 from
  // Postgres). That is the state of the project until the migration in
  // supabase/migrations/ is run, and it is not an error the learner can fix.
  function reasonFor(res) {
    var code = res.body && res.body.code;
    if (res.status === 404 || code === "PGRST205" || code === "42P01") return "missing";
    if (res.status === 401 || res.status === 403 || code === "42501") return "denied";
    return "error";
  }

  window.ElegantSupabase = api;
  if (window.ElegantAccount && typeof window.ElegantAccount.registerProvider === "function") {
    window.ElegantAccount.registerProvider("supabase", provider);
  }

  // Restore here, not in the page controller: every page that shows or records
  // progress needs to know who is signed in, and only the account page loads a
  // controller. Without this, a question page pushes nothing because it thinks
  // nobody is signed in — which is exactly how it failed the first time.
  // A token in the URL (an email link) wins over a stored session.
  api.ready = (consumeRedirect() || restore()).catch(function () { return null; });

  // An email link opened in a tab already on that page is a same-document
  // navigation: only the hash changes and no script runs again. Consume it
  // here too, and tell the page what it did.
  window.addEventListener("hashchange", function () {
    var pending = consumeRedirect();
    if (!pending) return;
    pending.then(function () {
      document.dispatchEvent(new CustomEvent("account:redirect", { detail: redirectResult }));
    });
  });
})();
