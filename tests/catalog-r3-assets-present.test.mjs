import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { APPROVED_R3_CANDIDATES } from "../scripts/audit-catalog-photo-repair.mjs";

const root = process.cwd();

function webpDimensions(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", "Debe ser archivo RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", "Debe ser WebP");
  const kind = bytes.toString("ascii", 12, 16);
  if (kind === "VP8X") return {
    width: 1 + bytes.readUIntLE(24, 3),
    height: 1 + bytes.readUIntLE(27, 3),
  };
  if (kind === "VP8L") {
    const signature = bytes[20];
    assert.equal(signature, 0x2f, "Firma WebP lossless inválida");
    return {
      width: 1 + (((bytes[22] & 0x3f) << 8) | bytes[21]),
      height: 1 + (((bytes[24] & 0x0f) << 10) | (bytes[23] << 2) | ((bytes[22] & 0xc0) >> 6)),
    };
  }
  throw new Error(`Contenedor WebP no esperado: ${kind}`);
}

test("las referencias R3 tienen rutas únicas y archivos reales de 1600x1600", async () => {
  const paths = APPROVED_R3_CANDIDATES.flatMap(c => [c.front, ...(c.back ? [c.back] : [])]);
  assert.equal(paths.length, 5);
  assert.equal(new Set(paths).size, 5);
  for (const urlPath of paths) {
    assert.match(urlPath, /^\/images\/products\/[a-z0-9-]+\/(01-principal|02-reverso)-r3\.webp$/);
    const absolute = join(root, "public", urlPath.slice(1));
    await access(absolute);
    const b = await readFile(absolute);
    assert.ok(b.length > 1000, `Archivo R3 vacío: ${urlPath}`);
    assert.deepEqual(webpDimensions(b), {width:1600,height:1600}, `Dimensiones no esperadas: ${urlPath}`);
  }
});

test("ninguna de las referencias R3 se atribuye a dos productos", () => {
  const ids = APPROVED_R3_CANDIDATES.map(c=>c.masterId);
  const handles = APPROVED_R3_CANDIDATES.map(c=>c.handle);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(handles).size, handles.length);
});
