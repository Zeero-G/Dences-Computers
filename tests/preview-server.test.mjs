import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { once } from "node:events";
import { access } from "node:fs/promises";

test("export server serves clean routes safely after the folder move", async () => {
  await access(new URL("../frontend/out/index.html", import.meta.url));
  const portProbe = createServer();
  portProbe.listen(0, "127.0.0.1");
  await once(portProbe, "listening");
  const port = portProbe.address().port;
  await new Promise((resolve, reject) =>
    portProbe.close((e) => (e ? reject(e) : resolve())),
  );
  const server = spawn(
    process.execPath,
    [new URL("../frontend/scripts/serve.mjs", import.meta.url).pathname],
    {
      cwd: "/tmp",
      env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  const exited = once(server, "exit");
  let logs = "";
  server.stderr.on("data", (chunk) => {
    logs += chunk;
  });
  try {
    await Promise.race([
      once(server.stdout, "data"),
      exited.then(() => {
        throw new Error(`Preview failed: ${logs}`);
      }),
      new Promise((_, reject) => {
        const timer = setTimeout(
          () => reject(new Error("Preview startup timed out")),
          10000,
        );
        timer.unref();
      }),
    ]);
    const base = `http://127.0.0.1:${port}`;
    for (const route of ["/", "/shop", "/product/iphone-13-pro"]) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200, route);
      assert.match(response.headers.get("content-type"), /text\/html/);
      assert.equal(response.headers.get("x-frame-options"), "DENY");
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      assert.match(await response.text(), /Dences/i);
    }
    const health = await fetch(base + "/healthz");
    assert.deepEqual(await health.json(), {
      status: "ok",
      service: "frontend",
    });
    assert.equal((await fetch(base + "/shop", { method: "HEAD" })).status, 200);
    assert.equal(
      await (await fetch(base + "/shop", { method: "HEAD" })).text(),
      "",
    );
    assert.equal((await fetch(base + "/", { method: "POST" })).status, 405);
    assert.equal((await fetch(base + "/package.json")).status, 404);
    assert.equal((await fetch(base + "/%2e%2e%2fpackage.json")).status, 403);
    assert.equal((await fetch(base + "/%ZZ")).status, 400);
  } finally {
    server.kill("SIGTERM");
    await exited;
  }
});
