import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const root = process.cwd();
const page = readFileSync(join(root,"src/app/qa/kuul-cure-me-1kg/page.tsx"),"utf8");
const image = readFileSync(join(root,"public/images/products/kuul-cure-me-reconstructor-1kg/01-principal.webp"));
const require = createRequire(import.meta.url);
const ts = require("typescript");
const { CURE_ME } = require("../src/lib/kuul-cure-me.ts");
const previewEnv = {
  VERCEL_ENV: "preview",
  VERCEL_GIT_COMMIT_REF: "codex/kuul-cure-me-1kg-photo-preview-20261125",
};

function load(file, dependencies, env = previewEnv) {
  const exports = {};
  const source = readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(compiled, { require: (key) => dependencies[key], exports, process: { env } });
  return exports;
}

const size = { id: CURE_ME.sizeId, value: "1L" };
const variant = {
  id: CURE_ME.variantId, title: "1L", sku: CURE_ME.sku, ean: null, barcode: null,
  inventory_quantity: 4, manage_inventory: true, options: [size],
  calculated_price: { currency_code: "mxn", calculated_amount: 389 },
};
const legacy = {
  id: CURE_ME.productId, handle: CURE_ME.legacyHandle, title: "Küül Cure Me Reconstructor 1L",
  thumbnail: null, images: [], options: [{ id: "opt_size", title: "Tamaño", values: [size] }],
  variants: [variant], status: "published",
};
const projection = (env, getProductByHandle) =>
  load("lib/data/kuul-cure-me-preview.ts", {
    "@/lib/kuul-cure-me": { CURE_ME },
    "@/lib/data/products": { getProductByHandle },
  }, env);

test("reference photo is a nonempty RIFF WEBP asset", () => {
  assert.equal(createHash("sha256").update(image).digest("hex"), "363a20a1e70cb3d2a0e1af4da5fd8c4bed5730674ceedd7e1383fa5e27d51633");
  assert.equal(image.toString("ascii",0,4),"RIFF");
  assert.equal(image.toString("ascii",8,12),"WEBP");
});
test("page is QA only and noindex", () => {
  assert.match(page,/VERCEL_ENV === "preview"/);
  assert.match(page,/notFound\(\)/);
  assert.match(page,/index: false, follow: false/);
});
test("display distinguishes correct 1 kg identity from Medusa 1 L", () => {
  assert.match(page,/Reconstructor System 1 kg/);
  assert.match(page,/KUUL-CURE-1L/);
  assert.match(page,/No es una ficha publicada/);
  assert.match(page,/528281136652/);
});

test("commercial preview preserves the exact product, variant and commercial data", () => {
  const before = JSON.stringify(legacy);
  const result = projection().projectCureMePreview(legacy);
  assert.equal(result.id, legacy.id);
  assert.equal(result.handle, CURE_ME.handle);
  assert.equal(result.status, legacy.status);
  assert.equal(result.title, CURE_ME.title);
  assert.equal(result.description, CURE_ME.description);
  assert.equal(result.thumbnail, CURE_ME.photo);
  assert.equal(result.images[0].url, CURE_ME.photo);
  assert.equal(result.images[0].variants.length, 0);
  assert.equal(result.options[0].values[0].id, CURE_ME.sizeId);
  assert.equal(result.options[0].values[0].value, "1 kg");
  assert.equal(result.variants[0].options[0].value, "1 kg");
  const { title, options, ...retained } = result.variants[0];
  assert.equal(title, "1 kg");
  assert.equal(options[0].id, CURE_ME.sizeId);
  assert.deepEqual(retained, Object.fromEntries(Object.entries(variant).filter(([key]) => !["title", "options"].includes(key))));
  assert.equal(JSON.stringify(legacy), before);
});

test("the projection is disabled outside this Preview and declines a different product or variant", () => {
  for (const env of [{ ...previewEnv, VERCEL_ENV: "production" }, { ...previewEnv, VERCEL_GIT_COMMIT_REF: "main" }, {}]) {
    assert.equal(projection(env).projectCureMePreview(legacy), legacy);
  }
  const project = projection().projectCureMePreview;
  for (const value of [{ ...legacy, id: "prod_leave_in" }, { ...legacy, variants: [{ ...variant, id: "variant_other" }] },
    { ...legacy, variants: [{ ...variant, sku: "SKU_OTHER" }] }, { ...legacy, variants: [variant, variant] }]) {
    assert.equal(project(value), value);
  }
});

test("the review URL uses the existing Store API record and rejects a different ID at the destination", async () => {
  const calls = [];
  let destination = null;
  const { getProductForDisplay } = projection(undefined, async (handle) => {
    calls.push(handle);
    return handle === CURE_ME.legacyHandle ? legacy : destination;
  });
  assert.equal((await getProductForDisplay(CURE_ME.handle)).id, legacy.id);
  assert.equal((await getProductForDisplay(CURE_ME.legacyHandle)).handle, CURE_ME.handle);
  assert.deepEqual(calls, [CURE_ME.handle, CURE_ME.legacyHandle, CURE_ME.legacyHandle]);
  destination = { ...legacy, id: "prod_distinct", handle: CURE_ME.handle };
  assert.equal(await getProductForDisplay(CURE_ME.handle), null);
});
