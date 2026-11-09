import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

export async function checkAdvisoryDb(directory, now = Date.now()) {
  const metadata = JSON.parse(
    await readFile(resolve(directory, "metadata.json"), "utf8"),
  );
  const updated = Date.parse(metadata.UpdatedAt);
  const next = Date.parse(metadata.NextUpdate);
  if (
    metadata.Version !== 2 ||
    !Number.isFinite(updated) ||
    !Number.isFinite(next) ||
    updated > now ||
    now - updated > 48 * 60 * 60 * 1000 ||
    next <= now ||
    next <= updated
  ) {
    throw new Error(
      "Advisory database has an unsupported schema, stale or invalid timestamps",
    );
  }
  if (!(await stat(resolve(directory, "trivy.db"))).size)
    throw new Error("Advisory database is empty");
  return metadata;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === new URL(import.meta.url).pathname
) {
  const metadata = await checkAdvisoryDb(process.argv[2]);
  console.log(`Advisory database updated: ${metadata.UpdatedAt}`);
}
