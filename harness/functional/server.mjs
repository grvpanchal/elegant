/**
 * The smallest static server that can host the built site correctly.
 *
 * Correctly matters: the practice workspace is loaded with dynamic `import()`,
 * so `.js` must be served as `text/javascript`. A server that answers
 * `application/octet-stream` makes every playground scenario fail for a reason
 * that has nothing to do with the site.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function resolveFile(root, urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidates = [join(root, clean)];
  if (clean.endsWith("/")) candidates.push(join(root, clean, "index.html"));
  else candidates.push(join(root, clean + ".html"), join(root, clean, "index.html"));
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* try the next shape */
    }
  }
  return null;
}

export function serve(root) {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const file = await resolveFile(root, req.url || "/");
      if (!file) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404");
        return;
      }
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
      createReadStream(file).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ origin: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(r)) });
    });
  });
}
