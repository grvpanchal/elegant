/**
 * A real OpenID Connect issuer, in-process, for the account scenarios.
 *
 * The site is static files on GitHub Pages. That rules out us verifying a
 * password, but it does NOT rule out real credentials: OAuth 2.0 Authorization
 * Code + PKCE exists precisely for public clients that cannot keep a secret.
 * The page redirects to an issuer, gets a code back, exchanges it, and verifies
 * the returned ID token's signature against the issuer's JWKS. That is real
 * authentication, and it works from a page with no server behind it.
 *
 * So the harness has to be an issuer. It signs RS256 tokens with a throwaway
 * key, publishes a JWKS, and enforces PKCE properly — a token endpoint that
 * accepts any `code_verifier` would let a broken client pass. It deliberately
 * can mint bad tokens (expired, wrong issuer, wrong audience, signed by the
 * wrong key) because "does the site verify?" is only answerable by handing it
 * something that should be rejected.
 *
 * Testing against a local issuer rather than a vendor is the right call, not a
 * compromise: it proves the site speaks the protocol, and the guardrail's
 * browser has no outbound network anyway.
 */
import { createServer } from "node:http";
import { generateKeyPairSync, createSign, createHash, randomUUID } from "node:crypto";

const b64url = (buf) => Buffer.from(buf).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const s256 = (verifier) => b64url(createHash("sha256").update(verifier).digest());

function makeKey() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  return { publicKey, privateKey, jwk: publicKey.export({ format: "jwk" }) };
}

function signJwt(privateKey, kid, payload) {
  const header = { alg: "RS256", typ: "JWT", kid };
  const signing = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = createSign("RSA-SHA256").update(signing).end().sign(privateKey);
  return `${signing}.${b64url(sig)}`;
}

/**
 * @param {object} opts
 * @param {string} opts.clientId      the client the site is expected to use
 * @param {string} [opts.flaw]        mint a token that SHOULD be rejected:
 *                                    "expired" | "issuer" | "audience" | "signature" | "nonce"
 */
export async function serveIssuer({ clientId = "elegant-training-site", flaw = null } = {}) {
  const key = makeKey();
  const wrongKey = flaw === "signature" ? makeKey() : null;
  const kid = "harness-" + randomUUID().slice(0, 8);
  /** every /authorize hit, so a scenario can assert what the site actually sent */
  const authorizeCalls = [];
  const tokenCalls = [];
  const codes = new Map();

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const send = (status, body, type = "application/json; charset=utf-8") => {
      res.writeHead(status, { "content-type": type, "access-control-allow-origin": "*",
                              "access-control-allow-headers": "content-type" });
      res.end(typeof body === "string" ? body : JSON.stringify(body));
    };
    if (req.method === "OPTIONS") return send(204, "");

    if (url.pathname === "/.well-known/openid-configuration") {
      return send(200, {
        issuer: origin,
        authorization_endpoint: `${origin}/authorize`,
        token_endpoint: `${origin}/token`,
        jwks_uri: `${origin}/.well-known/jwks.json`,
        response_types_supported: ["code"],
        code_challenge_methods_supported: ["S256"],
        id_token_signing_alg_values_supported: ["RS256"],
      });
    }

    if (url.pathname === "/.well-known/jwks.json") {
      // Always the real key. The "signature" flaw signs with a key that is NOT
      // published here, which is exactly the token a client must reject and
      // exactly the one a client that only base64-decodes the payload accepts.
      return send(200, { keys: [{ ...key.jwk, kid, alg: "RS256", use: "sig" }] });
    }

    if (url.pathname === "/authorize") {
      const p = Object.fromEntries(url.searchParams);
      authorizeCalls.push(p);
      const missing = ["response_type", "client_id", "redirect_uri", "state",
                       "code_challenge", "code_challenge_method"].filter((k) => !p[k]);
      if (missing.length) return send(400, { error: "invalid_request", missing });
      if (p.response_type !== "code") return send(400, { error: "unsupported_response_type" });
      if (p.client_id !== clientId) return send(400, { error: "invalid_client" });
      if (p.code_challenge_method !== "S256") {
        // `plain` is the downgrade PKCE exists to prevent; refusing it here is
        // what makes `account.oauth_pkce` a real check rather than a shape test.
        return send(400, { error: "invalid_request", detail: "code_challenge_method must be S256" });
      }
      const code = randomUUID();
      codes.set(code, { challenge: p.code_challenge, nonce: p.nonce, redirect_uri: p.redirect_uri });
      const back = new URL(p.redirect_uri);
      back.searchParams.set("code", code);
      back.searchParams.set("state", p.state);
      res.writeHead(302, { location: back.toString() });
      return res.end();
    }

    if (url.pathname === "/token" && req.method === "POST") {
      const raw = await new Promise((resolve) => {
        let b = ""; req.on("data", (c) => { b += c; }); req.on("end", () => resolve(b));
      });
      const p = Object.fromEntries(new URLSearchParams(raw));
      tokenCalls.push(p);
      const entry = codes.get(p.code);
      if (!entry) return send(400, { error: "invalid_grant", detail: "unknown code" });
      codes.delete(p.code);
      if (!p.code_verifier) return send(400, { error: "invalid_grant", detail: "no code_verifier" });
      if (s256(p.code_verifier) !== entry.challenge) {
        return send(400, { error: "invalid_grant", detail: "code_verifier does not match code_challenge" });
      }

      const now = Math.floor(Date.now() / 1000);
      const payload = {
        iss: flaw === "issuer" ? "https://attacker.example" : origin,
        aud: flaw === "audience" ? "some-other-client" : clientId,
        sub: "harness-user-1",
        name: "Ada Lovelace",
        email: "ada@example.org",
        nonce: flaw === "nonce" ? randomUUID() : entry.nonce,
        iat: now - 30,
        exp: flaw === "expired" ? now - 60 : now + 3600,
      };
      const signer = flaw === "signature" ? wrongKey.privateKey : key.privateKey;
      return send(200, {
        token_type: "Bearer",
        expires_in: 3600,
        access_token: randomUUID(),
        id_token: signJwt(signer, kid, payload),
      });
    }

    return send(404, { error: "not_found", path: url.pathname });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;

  return {
    origin,
    clientId,
    authorizeCalls,
    tokenCalls,
    /** the S256 transform, so a scenario can verify the challenge was real */
    s256,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
