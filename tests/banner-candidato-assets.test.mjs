import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(resolve(root, "docs/qa/banner-candidato-assets.json"), "utf8"));

function webpDimensions(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  const chunk = bytes.toString("ascii", 12, 16);
  assert.equal(chunk, "VP8 ", "Los archivos esperados usan WebP VP8");
  assert.equal(bytes[23], 0x9d);
  assert.equal(bytes[24], 0x01);
  assert.equal(bytes[25], 0x2a);
  return {
    width: bytes.readUInt16LE(26) & 0x3fff,
    height: bytes.readUInt16LE(28) & 0x3fff,
  };
}

test("WebP de banner: ambos presentes o ambos ausentes, con integridad verificada", () => {
  const paths = manifest.files.map((f) => resolve(root, f.path));
  const present = paths.map((p) => existsSync(p));
  assert.equal(present[0], present[1], "No subir solo uno de los dos WebP");
  const liveHome = readFileSync(resolve(root, "src/app/(shop)/page.tsx"), "utf8");
  assert.doesNotMatch(liveHome, /CampaignHeroCandidate/, "No activar banner antes de aprobación fotográfica final");
  if (!present[0]) return; // staging route renders a safe fallback until both photos arrive.

  for (const entry of manifest.files) {
    const path = resolve(root, entry.path);
    assert.equal(statSync(path).size, entry.bytes);
    const bytes = readFileSync(path);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256);
    assert.deepEqual(webpDimensions(bytes), { width: entry.width, height: entry.height });
  }
});
