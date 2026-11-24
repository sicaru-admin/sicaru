import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const component = readFileSync(resolve(root, "src/components/layout/BrandWordmark.tsx"), "utf8");

test("BrandWordmark uses unaltered official assets with correct accessible link name", () => {
  assert.ok(existsSync(resolve(root, "public/brand/logo-dark.png")));
  assert.ok(existsSync(resolve(root, "public/brand/logo-cream.png")));
  assert.match(component, /"\/brand\/logo-dark\.png"/);
  assert.match(component, /"\/brand\/logo-cream\.png"/);
  assert.match(component, /width=\{1600\}/);
  assert.match(component, /height=\{993\}/);
  assert.match(component, /aria-label="SICARÚ, productos de belleza\. Ir al inicio"/);
  assert.match(component, /href="\/"/);
  assert.doesNotMatch(component, />\s*SICARÚ\s*</);
});

test("BrandWordmark is larger on desktop and accommodates mobile layout", () => {
  assert.match(component, /lg:w-\[240px\]/);
  assert.match(component, /w-\[178px\]/);
  assert.match(component, /md:w-\[188px\]/);
  assert.match(component, /overflow-hidden/);
  assert.match(component, /logo-cream\.png/);
});
