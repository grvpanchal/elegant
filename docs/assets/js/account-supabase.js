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
 * and that check runs again on every page load, not just at sign-in.
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
 * what the database sees. See docs/account/index.md.
 */
(function () {
  "use strict";

  var cfg = window.ELEGANT_SUPABASE;
  if (!cfg || !cfg.url || !cfg.anonKey) return;

  var BASE = String(cfg.url).replace(/\/+$/, "");
  var AUTH = BASE + "/auth/v1";
  var REST = BASE + "/rest/v1";
  var STORE = "elegant.supabase.session.v1";
  var ISSUER = AUTH;

  var session = null;      // only ever set to a VERIFIED session
  var jwksPromise = null;

  function headers(extra) {
    var h = { apikey: cfg.anonKey, "content-type": "application/json" };
    for (var k in extra || {}) h[k] = extra[k];
    if (session && session.access_token) h.authorization = "Bearer " + session.access_token;
    return h;
  }

  // ------------------------------------------------------------ verifying
  function jwks() {
    if (!jwksPromise) {
      jwksPromise = fetch(AUTH + "/.well-known/jwks.json", { headers: { apikey: cfg.anonKey } })
        .then(function (r) { return r.json(); })
        .catch(function () { jwksPromise = null; throw new Error("could not reach the identity provider"); });
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

  /**
   * Resolve to the token's claims, or reject with why it was refused.
   * Order matters: signature first, then who it is from, then whether it is
   * still alive. A caller that checks `exp` on an unverified token has checked
   * a number the attacker chose.
   */
  function verify(token) {
    var parts = String(token || "").split(".");
    if (parts.length !== 3) return Promise.reject(new Error("that is not a token"));

    var header;
    try { header = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0]))); }
    catch (err) { return Promise.reject(new Error("that is not a token")); }
    if (header.alg !== "ES256") {
      // `none`, or a swap to a symmetric alg, is the oldest JWT attack there is.
      return Promise.reject(new Error("unexpected token algorithm: " + header.alg));
    }

    return jwks().then(function (set) {
      var keys = (set && set.keys) || [];
      var jwk = keys.filter(function (k) { return !header.kid || k.kid === header.kid; })[0] || keys[0];
      if (!jwk) throw new Error("the identity provider published no signing key");
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
      if (!good) throw new Error("the sign-in could not be verified");
      var claims = claimsOf(token);
      if (claims.iss !== ISSUER) throw new Error("that sign-in came from somewhere else");
      var now = Math.floor(Date.now() / 1000);
      if (!claims.exp || claims.exp <= now) throw new Error("that sign-in has expired — please sign in again");
      return claims;
    });
  }

  function adopt(payload) {
    if (!payload || !payload.access_token) {
      var why = payload && (payload.error_description || payload.msg || payload.message);
      throw new Error(why || "sign-in failed");
    }
    return verify(payload.access_token).then(function (claims) {
      session = {
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        expires_at: claims.exp,
        id: claims.sub,
        name: claims.email || claims.sub,
        email: claims.email,
      };
      try { localStorage.setItem(STORE, JSON.stringify(session)); } catch (err) { /* private mode */ }
      // Become the active provider, so Account.namespace() and every surface
      // that asks "who is signed in" get the verified identity rather than a
      // device profile that happens to still be selected.
      try { if (window.ElegantAccount) window.ElegantAccount.useProvider("supabase"); } catch (err) { /* ignore */ }
      announce();
      return session;
    });
  }

  function announce() {
    try {
      window.dispatchEvent(new CustomEvent("account:changed",
        { detail: { profile: session ? { id: session.id, name: session.name } : null } }));
    } catch (err) { /* ancient browser */ }
  }

  function post(path, body, extraHeaders) {
    return fetch(path, { method: "POST", headers: headers(extraHeaders), body: JSON.stringify(body) })
      .then(function (r) { return r.status === 204 ? {} : r.json().catch(function () { return {}; }); });
  }

  // ---------------------------------------------------------------- api
  var provider = {
    name: "supabase",
    label: "Your account",
    /** The seam is synchronous, so this reports the cached VERIFIED session. */
    current: function () {
      return session ? { id: session.id, name: session.name, email: session.email } : null;
    },
    signIn: function () {
      throw new Error("Use ElegantSupabase.signIn(email, password) — a credential is checked, not typed.");
    },
    signOut: function () {
      var token = session && session.access_token;
      session = null;
      try { localStorage.removeItem(STORE); } catch (err) { /* ignore */ }
      try { if (window.ElegantAccount) window.ElegantAccount.useProvider("local"); } catch (err) { /* ignore */ }
      if (token) {
        fetch(AUTH + "/logout", { method: "POST", headers: { apikey: cfg.anonKey,
          authorization: "Bearer " + token } }).catch(function () { /* best effort */ });
      }
      announce();
    },
  };

  var api = {
    configured: true,
    provider: provider,

    signUp: function (email, password) {
      return post(AUTH + "/signup", { email: email, password: password }).then(function (d) {
        if (!d.access_token && d.confirmation_sent_at) {
          // mailer_autoconfirm is off on the project: there is a user but no
          // session. Say so plainly rather than looking like a silent failure.
          var e = new Error("Check " + email + " for a confirmation link, then sign in.");
          e.pending = true;
          throw e;
        }
        return adopt(d);
      });
    },

    signIn: function (email, password) {
      return post(AUTH + "/token?grant_type=password", { email: email, password: password })
        .then(adopt);
    },

    signOut: function () { provider.signOut(); },

    current: function () { return provider.current(); },

    /** Progress for the signed-in person, from the database rather than this device. */
    pull: function () {
      if (!session) return Promise.resolve({});
      return fetch(REST + "/progress?select=slug,done", { headers: headers() })
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (rowsIn) {
          var out = {};
          (rowsIn || []).forEach(function (row) { if (row.done) out[row.slug] = true; });
          return out;
        })
        .catch(function () { return {}; });
    },

    /** Record one question, under this identity, so another device sees it. */
    push: function (slug, done) {
      if (!session) return Promise.resolve(false);
      return fetch(REST + "/progress", {
        method: "POST",
        headers: headers({ prefer: "resolution=merge-duplicates,return=minimal" }),
        body: JSON.stringify({ user_id: session.id, slug: slug, done: !!done }),
      }).then(function (r) { return r.ok; }).catch(function () { return false; });
    },

    /** Re-verify a stored session on load. An expired one is dropped, not trusted. */
    restore: function () {
      var raw;
      try { raw = localStorage.getItem(STORE); } catch (err) { return Promise.resolve(null); }
      if (!raw) return Promise.resolve(null);
      var saved;
      try { saved = JSON.parse(raw); } catch (err) { return Promise.resolve(null); }
      return verify(saved.access_token).then(function (claims) {
        session = saved;
        session.id = claims.sub;
        announce();
        return session;
      }).catch(function () {
        try { localStorage.removeItem(STORE); } catch (err) { /* ignore */ }
        session = null;
        return null;
      });
    },
  };

  window.ElegantSupabase = api;
  if (window.ElegantAccount && typeof window.ElegantAccount.registerProvider === "function") {
    window.ElegantAccount.registerProvider("supabase", provider);
  }

  // Restore here, not in the page controller: every page that shows or records
  // progress needs to know who is signed in, and only the account page loads a
  // controller. Without this, a question page pushes nothing because it thinks
  // nobody is signed in — which is exactly how it failed the first time.
  api.restore().catch(function () { /* an unverifiable session is simply not one */ });
})();
