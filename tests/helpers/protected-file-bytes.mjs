import assert from "node:assert/strict";

/** Preserve historical hashes; permit only the authorized review-branch deploy opt-out. */
export function protectedFileBytes(file, bytes) {
  if (file !== "vercel.json") return bytes;
  const config = JSON.parse(bytes.toString());
  assert.deepEqual(config.git, { deploymentEnabled: { "codex/catalog-visibility-cache": false } });
  delete config.git;
  return JSON.stringify(config, null, 2) + "\n";
}
