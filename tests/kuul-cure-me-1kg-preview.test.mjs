import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const page = readFileSync(join(root,"src/app/qa/kuul-cure-me-1kg/page.tsx"),"utf8");
const image = readFileSync(join(root,"public/images/products/kuul-cure-me-reconstructor-1kg/01-principal.webp"));

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
