import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";

const source = await readFile(new URL("../src/lib/catalog-verified-card-photos.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { getVerifiedCatalogCardPhoto, getVerifiedCatalogGalleryPhoto } =
  await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));

const base = "https://www.sicarubeauty.com";
const approved = [
  { id: "prod_01M79C6MFY2YPX504ZMDW9HJ0A", handle: "xiomara-shampoo-platinum-250ml", barcode: "7501846500905", variant: "250 ml", sha256: "868c47a8d945eb3406b2446557a2ce9aca2d35e5c430a1eb124693dc23a9eb85", bytes: 402958 },
  { id: "prod_01M79C7BHA8D7GCZG4DTBM1Q68", handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml", barcode: "7501846505863", variant: "250 ml", sha256: "5d829ee65edfe4618eb74a64d62b91db7aa592c4e768823cce4890e43c1bc07f", bytes: 536118 },
];

const entry = (p) => ({ id: p.id, handle: p.handle, variants: [{ title: p.variant, barcode: p.barcode }] });
const original = (p) => `${base}/images/products/${p.handle}/01-principal.webp`;
const candidate = (p) => `/images/products/${p.handle}/01-principal-recorte-propietaria-candidato.webp`;

test("exactamente dos frontales XIOMARA aprobados; tarjeta y ficha muestran el mismo recorte", () => {
  assert.equal(approved.length, 2);
  for (const p of approved) {
    assert.equal(getVerifiedCatalogCardPhoto(entry(p), original(p)), candidate(p));
    assert.equal(getVerifiedCatalogGalleryPhoto(entry(p), original(p)), candidate(p));
  }
});

test("WebP originales de la propietaria conservan el SHA-256 y el tamaño aprobado", async () => {
  for (const p of approved) {
    const path = new URL(`../public${candidate(p)}`, import.meta.url);
    const bytes = await readFile(path);
    assert.equal(bytes.byteLength, p.bytes);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), p.sha256);
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
});

test("identidad incompleta o discrepante bloquea la sustitución y conserva fuente de Medusa", () => {
  for (const p of approved) {
    const good = entry(p);
    const changes = [
      { ...good, id: "prod_OTRO" },
      { ...good, handle: "otro-handle" },
      { ...good, variants: [] },
      { ...good, variants: [{ ...good.variants[0], title: "1 L" }] },
      { ...good, variants: [{ ...good.variants[0], barcode: "0000000000000" }] },
      { ...good, variants: [...good.variants, ...good.variants] },
    ];
    for (const changed of changes) {
      assert.equal(getVerifiedCatalogCardPhoto(changed, original(p)), original(p));
      assert.equal(getVerifiedCatalogGalleryPhoto(changed, original(p)), original(p));
    }
    assert.equal(getVerifiedCatalogCardPhoto(good, null), null);
  }
});

test("reversos, archivos nuevos de Medusa, dominios distintos y parámetros nunca se sobreescriben", () => {
  for (const p of approved) {
    const good = entry(p), current = original(p);
    for (const url of [
      current + "?v=2",
      current + "#galeria",
      current.replace(base, "https://otro.example"),
      current.replace("/01-principal.webp", "/02-reverso.webp"),
      current.replace("/01-principal.webp", "/01-actualizado.webp"),
    ]) {
      assert.equal(getVerifiedCatalogCardPhoto(good, url), url);
      assert.equal(getVerifiedCatalogGalleryPhoto(good, url), url);
    }
  }
});

test("NEKANE y MONTIS permanecen sin sustitución", () => {
  const others = [
    { id: "prod_01M79C817D78WYM8K6D9W32NH1", handle: "nekane-morazul-shampoo-matizador-300g", variants: [{ title: "300 g" }] },
    { id: "prod_01KVV3GD5ZR40Q6YWBS7QHJ48Z", handle: "montis-shampoo-extracto-natural", variants: [{ title: "500ml" }] },
  ];
  for (const p of others) {
    const url = `${base}/images/products/${p.handle}/01-principal.webp`;
    assert.equal(getVerifiedCatalogCardPhoto(p, url), url);
    assert.equal(getVerifiedCatalogGalleryPhoto(p, url), url);
  }
});
