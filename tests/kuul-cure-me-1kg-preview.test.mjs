import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const page = readFileSync(join(root,"src/app/qa/kuul-cure-me-1kg/page.tsx"),"utf8");
const image = readFileSync(join(root,"public/images/products/kuul-cure-me-reconstructor-1kg/cure-me-1kg-preview-400.webp"));

test("reference photo is a nonempty RIFF WEBP asset", () => {
  assert.ok(image.length > 1000, "unexpected placeholder image");
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
