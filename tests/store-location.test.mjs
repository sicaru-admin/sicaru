import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const read = (filename) => readFile(new URL("../" + filename, import.meta.url), "utf8");

const storeSource = await read("src/lib/constants/store.ts");
const code = ts.transpileModule(storeSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { STORE } = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));

test("domicilio coincide con Google Maps de SICARÚ sin inventar local", () => {
  assert.equal(STORE.address.street, "Calle 20 de Noviembre Norte 102");
  assert.equal(STORE.address.neighborhood, "Centro");
  assert.equal(STORE.address.zip, "67480");
  assert.match(STORE.address.full, /Cadereyta Jiménez, Nuevo León/);
  assert.match(STORE.address.full, /C\.P\. 67480, México/);
  assert.doesNotMatch(STORE.address.full, /Local \d|La Plaza/i);
  assert.doesNotMatch(storeSource, /25\.5933|-99\.9836|La Plaza, Local 204/);
  assert.equal(STORE.whatsapp, "528281136652");
});

test("enlace Maps usa ficha del negocio con Place ID, no coordenadas supuestas", () => {
  const place = new URL(STORE.googleMapsPlaceUrl);
  assert.equal(place.hostname, "www.google.com");
  assert.equal(place.pathname, "/maps/search/");
  assert.equal(place.searchParams.get("api"), "1");
  assert.equal(place.searchParams.get("query_place_id"), "ChIJwc6gTeXbYoYReSmhZYk0oMA");
  assert.match(place.searchParams.get("query"), /20 de Noviembre Nte\. 102/);

  const embed = new URL(STORE.googleMapsEmbedUrl);
  assert.equal(embed.hostname, "maps.google.com");
  assert.equal(embed.searchParams.get("output"), "embed");
  assert.match(embed.searchParams.get("q"), /Sicarú, C\. 20 de Noviembre Nte\. 102/);
  assert.doesNotMatch(embed.searchParams.get("q"), /25\.5933|-99\.9836/);
});

test("contacto, privacidad y datos estructurados comparten identidad de tienda", async () => {
  const [contact,privacy,schema] = await Promise.all([
    read("src/app/(shop)/contacto/page.tsx"),
    read("src/app/(shop)/politica-privacidad/page.tsx"),
    read("src/lib/schema.ts"),
  ]);
  assert.match(contact, /STORE\.address\.full/);
  assert.match(contact, /STORE\.googleMapsEmbedUrl/);
  assert.match(contact, /href=\{STORE\.googleMapsPlaceUrl\}/);
  assert.match(privacy, /\{STORE\.address\.full\}/);
  assert.doesNotMatch(privacy, /La Plaza Local/);
  assert.match(schema, /streetAddress: STORE\.address\.street/);
  assert.match(schema, /postalCode: STORE\.address\.zip/);
  assert.match(schema, /hasMap: STORE\.googleMapsPlaceUrl/);
});
