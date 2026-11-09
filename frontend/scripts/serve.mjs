// Local preview of the static frontend export. No application backend or uploads.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";
const root = resolve(fileURLToPath(new URL("../out/", import.meta.url)));
const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("PORT must be an integer from 1 to 65535");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};
createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method ?? "")) {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === "/healthz") {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Cache-Control": "no-store",
      });
      res.end(
        req.method === "HEAD"
          ? undefined
          : JSON.stringify({ status: "ok", service: "frontend" }),
      );
      return;
    }
    const path = resolve(root, "." + pathname);
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let target;
    for (const candidate of [
      path,
      path + ".html",
      resolve(path, "index.html"),
    ]) {
      try {
        if ((await stat(candidate)).isFile()) {
          target = candidate;
          break;
        }
      } catch {
        /* Try clean-route variants. */
      }
    }
    const status = target ? 200 : 404;
    target ??= resolve(root, "404.html");
    const data = await readFile(target);
    res.writeHead(status, {
      "Content-Type": types[extname(target)] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
      "Cache-Control": "no-cache",
    });
    res.end(req.method === "HEAD" ? undefined : data);
  } catch {
    res.writeHead(400);
    res.end("Unable to load this page.");
  }
}).listen(port, host, () => {
  console.log(`Dences preview on this computer: http://localhost:${port}`);
  if (host === "0.0.0.0" || host === "::") {
    for (const [name, addresses] of Object.entries(networkInterfaces())) {
      if (/^(docker|veth|br-|virbr|lo)/.test(name)) continue;
      for (const address of addresses ?? []) {
        if (address.family === "IPv4" && !address.internal)
          console.log(
            `Phone on the same network (${name}): http://${address.address}:${port}`,
          );
      }
    }
  }
});
