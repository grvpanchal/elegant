/**
 * A real OpenID Connect provider for the account seam: Authorization Code +
 * PKCE against a hosted issuer.
 *
 * account.js keeps profiles on this device: you type a name and you are that
 * person. Useful, honest, and not an account — nothing is verified and nothing
 * follows you to another browser. This swaps that for a credential the site did
 * not invent, through the registerProvider seam that was always there for it.
 *
 * A static site is a public client: it cannot keep a secret, so it must not
 * pretend to. OAuth 2.0 Authorization Code + PKCE exists precisely for that
 * case. The page redirects to the issuer's /authorize endpoint with an S256
 * challenge, a state and a nonce; the issuer redirects back with a code; the
 * page exchanges that code at the token endpoint with the verifier; and the
 * returned ID token is verified against the issuer's published JWKS before it
 * is allowed to mean anything.
 *
 * Configuration is runtime, not baked in:
 *
 *   window.ELEGANT_OIDC = { issuer: "https://idp.example", clientId: "..." }
 *
 * set before this script loads. With nothing set the provider stays dormant and
 * the site behaves exactly as it does today, which is what keeps a local
 * checkout and a fork with no issuer of their own working.
 */
(function () {
  "use strict";

  var cfg = window.ELEGANT_OIDC;
  if (!cfg || !cfg.issuer || !cfg.clientId) return;

  var ISSUER = String(cfg.issuer).replace(/\/+$/, "");
  var CLIENT_ID = cfg.clientId;
  var REDIRECT_URI = window.location.origin + "/account/";
  var PKCE_STORE = "elegant.oidc.pkce.v1";
  var SESSION_STORE = "elegant.oidc.session.v1";

  var session = null;      // only ever set to a VERIFIED session

  // ------------------------------------------------------------ helpers
  function b64url(bytes) {
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function b64urlToBytes(s) {
    var pad = s.replace(/-/g, "+").replace(/_/g, "/");
    while (pad.length % 4) pad += "=";
    var raw = atob(pad);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function randomString(n) {
    var out = new Uint8Array(n);
    crypto.getRandomValues(out);
    return b64url(out).slice(0, n);
  }

  function sha256(str) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  }

  function claimsOf(token) {
    var parts = String(token || "").split(".");
    if (parts.length !== 3) throw new Error("that is not a token");
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
  }

  function announce() {
    try {
      window.dispatchEvent(new CustomEvent("account:changed",
        { detail: { profile: session ? { id: session.id, name: session.name } : null } }));
    } catch (err) { /* ancient browser */ }
  }

  function showError(message) {
    var el = document.querySelector("[data-account-oidc-error]");
    if (!el) return;
    el.textContent = message || "";
    el.hidden = !message;
  }

  // ------------------------------------------------------------ verifying
  function jwks() {
    return fetch(ISSUER + "/.well-known/jwks.json")
      .then(function (r) { return r.json(); });
  }

  /**
   * Resolve to the token's claims, or reject with why it was refused.
   * Signature first, then who it is from, then whether it is still alive.
   */
  function verify(token) {
    var parts = String(token || "").split(".");
    if (parts.length !== 3) return Promise.reject(new Error("that is not a token"));
    var header;
    try { header = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0]))); }
    catch (err) { return Promise.reject(new Error("that is not a token")); }
    if (header.alg !== "RS256") {
      // `none`, or a swap to a symmetric alg, is the oldest JWT attack there is.
      return Promise.reject(new Error("unexpected token algorithm: " + header.alg));
    }
    return jwks().then(function (set) {
      var keys = (set && set.keys) || [];
      var jwk = keys.filter(function (k) { return !header.kid || k.kid === header.kid; })[0] || keys[0];
      if (!jwk) throw new Error("the identity provider published no signing key");
      return crypto.subtle.importKey(
        "jwk", { kty: jwk.kty, n: jwk.n, e: jwk.e },
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]
      );
    }).then(function (key) {
      return crypto.subtle.verify(
        { name: "RSASSA-PKCS1-v1_5" }, key,
        b64urlToBytes(parts[2]),
        new TextEncoder().encode(parts[0] + "." + parts[1])
      );
    }).then(function (good) {
      if (!good) throw new Error("the sign-in could not be verified");
      var claims = claimsOf(token);
      if (claims.iss !== ISSUER) throw new Error("that sign-in came from somewhere else");
      if (claims.aud !== CLIENT_ID) throw new Error("that sign-in was not for this site");
      var now = Math.floor(Date.now() / 1000);
      if (!claims.exp || claims.exp <= now) throw new Error("that sign-in has expired — please sign in again");
      return claims;
    });
  }

  // ------------------------------------------------------------ the flow
  function start() {
    var state = randomString(32);
    var nonce = randomString(32);
    var verifier = randomString(64);
    return sha256(verifier).then(function (hash) {
      var challenge = b64url(new Uint8Array(hash));
      try {
        localStorage.setItem(PKCE_STORE, JSON.stringify({ verifier: verifier, state: state, nonce: nonce }));
      } catch (err) { /* private mode: the exchange will fail, which is honest */ }
      var params = new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: "openid profile email",
        state: state,
        nonce: nonce,
        code_challenge: challenge,
        code_challenge_method: "S256"
      });
      window.location.assign(ISSUER + "/authorize?" + params.toString());
    });
  }

  function exchange(code, state) {
    var pkce;
    try { pkce = JSON.parse(localStorage.getItem(PKCE_STORE) || "null"); }
    catch (err) { pkce = null; }
    if (!pkce || pkce.state !== state) {
      return Promise.reject(new Error("state did not match — this sign-in was not started here"));
    }
    var body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: pkce.verifier
    });
    return fetch(ISSUER + "/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString()
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (!data.id_token) throw new Error(data.error_description || "the token exchange failed");
      return verify(data.id_token).then(function (claims) {
        if (claims.nonce !== pkce.nonce) throw new Error("nonce did not match — this token was replayed");
        session = { id: claims.sub, name: claims.name || claims.email || claims.sub, email: claims.email };
        try { localStorage.setItem(SESSION_STORE, JSON.stringify(session)); } catch (err) { /* private mode */ }
        try { if (window.ElegantAccount) window.ElegantAccount.useProvider("oidc"); } catch (err) { /* ignore */ }
        announce();
        return session;
      });
    });
  }

  // ---------------------------------------------------------------- api
  var provider = {
    name: "oidc",
    label: "Your account",
    /** The seam is synchronous, so this reports the cached VERIFIED session. */
    current: function () {
      return session ? { id: session.id, name: session.name, email: session.email } : null;
    },
    signIn: function () {
      start();
      return null;
    },
    signOut: function () {
      session = null;
      try { localStorage.removeItem(SESSION_STORE); } catch (err) { /* ignore */ }
      try { if (window.ElegantAccount) window.ElegantAccount.useProvider("local"); } catch (err) { /* ignore */ }
      announce();
    },
  };

  if (window.ElegantAccount && typeof window.ElegantAccount.registerProvider === "function") {
    window.ElegantAccount.registerProvider("oidc", provider);
  }

  // ------------------------------------------------------------- the page
  // The exchange needs no DOM and the code is in the URL the moment this script
  // runs, so start it immediately rather than waiting for the DOM.
  var params = new URLSearchParams(window.location.search);
  var code = params.get("code");
  var state = params.get("state");
  if (code && state) {
    exchange(code, state).then(function () {
      showError("");
      history.replaceState({}, "", window.location.pathname);
    }).catch(function (err) {
      showError((err && err.message) || "sign-in failed");
      history.replaceState({}, "", window.location.pathname);
    });
  }

  function wire() {
    var panel = document.querySelector("[data-account-oidc]");
    var btn = document.querySelector("[data-account-oidc-signin]");
    if (panel) panel.hidden = false;
    if (btn) {
      btn.hidden = false;
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        showError("");
        start();
      });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
