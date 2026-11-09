import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { checkAdvisoryDb } from "../scripts/check-advisory-db.mjs";

test("advisory checks reject missing, empty, stale, future and incompatible data", async () => {
  const directory = await mkdtemp(join(tmpdir(), "dences-advisory-test-"));
  const now = Date.now();
  const valid = {
    Version: 2,
    UpdatedAt: new Date(now - 3600000).toISOString(),
    NextUpdate: new Date(now + 3600000).toISOString(),
  };
  const metadata = join(directory, "metadata.json");
  try {
    await assert.rejects(checkAdvisoryDb(directory, now));
    await writeFile(metadata, JSON.stringify(valid));
    await writeFile(join(directory, "trivy.db"), "");
    await assert.rejects(checkAdvisoryDb(directory, now), /empty/);
    await writeFile(join(directory, "trivy.db"), "synthetic fixture");
    assert.deepEqual(await checkAdvisoryDb(directory, now), valid);
    for (const change of [
      { Version: 1 },
      { UpdatedAt: "invalid" },
      { UpdatedAt: new Date(now + 1).toISOString() },
      { UpdatedAt: new Date(now - 49 * 3600000).toISOString() },
      { NextUpdate: new Date(now - 1).toISOString() },
    ]) {
      await writeFile(metadata, JSON.stringify({ ...valid, ...change }));
      await assert.rejects(checkAdvisoryDb(directory, now));
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
