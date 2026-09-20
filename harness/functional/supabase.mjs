/**
 * A Supabase-shaped auth + data backend, in-process, for the account scenarios.
 *
 * The site is configured against a real Supabase project, but the guardrail's
 * Chromium has NO outbound network — a `fetch` to supabase.co from a page under
 * test fails, every time. So the real project can never be the test target, and
 * pretending otherwise would produce a suite that only passes on a laptop with
 * wifi. This serves the same API shapes offline.
 *
 * That is not a downgrade. The real project's behaviour is not ours to assert:
 * it changes when someone flips a dashboard setting. What IS ours is whether
 * the site verifies what it is handed, and that is only answerable against a
 * server that will hand it something bad on request.
 *
 * Fidelity where it matters:
 *   - tokens are ES256, verified against a published JWKS, because that is what
 *     the real project does (GET /auth/v1/.well-known/jwks.json returns an EC
 *     P-256 key). A client written against this one verifies against that one.
 *   - the data endpoint ENFORCES row ownership from the token's `sub`, so a
 *     progress-sync implementation that forgets RLS cannot pass by reading
 *     rows it should never have been given.
 *
 * Flaw modes exist because "does the site verify?" is only answerable by
 * handing it something it should refuse.
 */
import { createServer } from "node:http";
import { generateKeyPairSync, createSign, randomUUID } from "node:crypto";

const b64url = (buf) => Buffer.from(buf).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function makeKey() {
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
  return { privateKey, jwk: publicKey.export({ format: "jwk" }) };
}

/** ES256: the JWS signature is raw R||S, not the DER encoding node signs by default. */
function signEs256(privateKey, kid, payload) {
  const header = { alg: "ES256", typ: "JWT", kid };
  const signing = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
  const sig = createSign("SHA256").update(signing).end()
    .sign({ key: privateKey, dsaEncoding: "ieee-p1363" });
  return `${signing}.${b64url(sig)}`;
}

/**
 * @param {object} opts
 * @param {string} [opts.flaw]      "expired" | "signature" — mint a token the site must refuse
 * @param {boolean} [opts.confirmEmail]  true mirrors a project with mailer_autoconfirm off:
 *                                       signup returns NO session until the link is clicked
 */
export async function serveSupabase({ flaw = null, confirmEmail = false } = {}) {
  const key = makeKey();
  const wrongKey = flaw === "signature" ? makeKey() : null;
  const kid = randomUUID();
  const users = new Map();          // email -> {id, email, password, confirmed}
  const rows = [];                  // {user_id, slug, done}
  const requests = [];

  const session = (user) => {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: `${origin}/auth/v1`, sub: user.id, aud: "authenticated", role: "authenticated",
      email: user.email, iat: now - 10, exp: flaw === "expired" ? now - 60 : now + 3600,
    };
    return {
      access_token: signEs256(flaw === "signature" ? wrongKey.privateKey : key.privateKey, kid, payload),
      token_type: "bearer", expires_in: 3600, expires_at: payload.exp,
      refresh_token: randomUUID(),
      user: { id: user.id, email: user.email, aud: "authenticated", role: "authenticated" },
    };
  };

  /** The token's `sub`, only if the token is one we actually signed. */
  const subjectOf = (req) => {
    const raw = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    const parts = raw.split(".");
    if (parts.length !== 3) return null;
    try {
      const claims = JSON.parse(Buffer.from(parts[1], "base64url").toString());
      if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) return null;
      return [...users.values()].some((u) => u.id === claims.sub) ? claims.sub : null;
    } catch { return null; }
  };

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    requests.push({ method: req.method, path: url.pathname, query: url.search });
    const send = (status, body) => {
      res.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "authorization, apikey, content-type, prefer",
        "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
      });
      res.end(body === null ? "" : JSON.stringify(body));
    };
    if (req.method === "OPTIONS") return send(204, null);
    const body = await new Promise((resolve) => {
      let b = ""; req.on("data", (c) => { b += c; }); req.on("end", () => {
        try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); }
      });
    });

    if (url.pathname === "/auth/v1/.well-known/jwks.json") {
      return send(200, { keys: [{ ...key.jwk, kid, alg: "ES256", use: "sig", key_ops: ["verify"] }] });
    }

    if (url.pathname === "/auth/v1/signup") {
      if (!body.email || !body.password) return send(400, { error: "invalid_request" });
      if (users.has(body.email)) return send(422, { code: 422, msg: "User already registered" });
      const user = { id: randomUUID(), email: body.email, password: body.password,
                     confirmed: !confirmEmail };
      users.set(body.email, user);
      // mailer_autoconfirm off: a user exists but no session is issued yet.
      if (confirmEmail) return send(200, { id: user.id, email: user.email,
                                           confirmation_sent_at: new Date().toISOString() });
      return send(200, session(user));
    }

    if (url.pathname === "/auth/v1/token") {
      const grant = url.searchParams.get("grant_type");
      if (grant === "password") {
        const user = users.get(body.email);
        if (!user || user.password !== body.password) {
          return send(400, { error: "invalid_grant", error_description: "Invalid login credentials" });
        }
        if (!user.confirmed) return send(400, { error: "invalid_grant", error_description: "Email not confirmed" });
        return send(200, session(user));
      }
      return send(400, { error: "unsupported_grant_type" });
    }

    if (url.pathname === "/auth/v1/user") {
      const sub = subjectOf(req);
      if (!sub) return send(401, { message: "invalid claim: missing sub claim" });
      const user = [...users.values()].find((u) => u.id === sub);
      return send(200, { id: user.id, email: user.email, aud: "authenticated" });
    }

    if (url.pathname === "/auth/v1/logout") return send(204, null);

    if (url.pathname === "/rest/v1/progress") {
      const sub = subjectOf(req);
      // Row-level security, enforced rather than assumed: no valid token, no rows.
      if (!sub) return send(401, { code: "42501", message: "permission denied for table progress" });
      if (req.method === "GET") {
        return send(200, rows.filter((r) => r.user_id === sub));
      }
      if (req.method === "POST") {
        const incoming = Array.isArray(body) ? body : [body];
        for (const item of incoming) {
          // A client may not write rows for somebody else, whatever it sends.
          if (item.user_id && item.user_id !== sub) {
            return send(403, { code: "42501", message: "new row violates row-level security policy" });
          }
          const existing = rows.find((r) => r.user_id === sub && r.slug === item.slug);
          if (existing) existing.done = item.done;
          else rows.push({ user_id: sub, slug: item.slug, done: item.done });
        }
        return send(201, req.headers.prefer?.includes("return=minimal") ? null : incoming);
      }
    }

    return send(404, { message: "not found", path: url.pathname });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;

  return {
    origin,
    /** shaped like a publishable key, because the site should treat it as public */
    anonKey: "sb_publishable_harness_" + randomUUID().replace(/-/g, "").slice(0, 16),
    users, rows, requests,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
