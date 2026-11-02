import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const retired = [
  "abrir-salon-nuevo-leon-productos-esenciales",
  "cuidado-cabello-clima-nuevo-leon",
  "guia-precios-productos-capilares-mexico-2026",
  "kuul-vs-voglia-tinte-comparativa",
  "senales-tratamiento-keratina",
];

test("los cinco artículos comerciales auditados permanecen en el repositorio pero retirados", () => {
  for (const slug of retired) {
    const source = readFileSync(new URL(`../content/blog/${slug}.mdx`, import.meta.url), "utf8");
    assert.match(source, /\npublished:\s*false\s*\n/);
    assert.match(source, new RegExp(`slug:\\s*["']${slug}["']`));
  }
});

test("el lector del blog excluye borradores del listado y de las URLs directas", () => {
  const source = readFileSync(new URL("../src/lib/blog.ts", import.meta.url), "utf8");
  assert.match(source, /published:\s*data\.published\s*!==\s*false/);
  assert.match(source, /p\s*!==\s*null\s*&&\s*p\.published/);
  assert.match(source, /post\?\.published\s*\?\s*post\s*:\s*null/);
});

test("el sitemap consume getAllPosts, por lo que no reintroduce borradores", () => {
  const source = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  assert.match(source, /getAllPosts\(\)/);
  assert.doesNotMatch(source, /content\/blog/);
});
