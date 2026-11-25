import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page=readFileSync("src/app/qa/reparacion-shampoos/page.tsx","utf8");

test("comparativa de los dos reversos R3 existentes en Preview",()=>{
  assert.match(page, /nekane-morazul-shampoo-matizador-300g\/02-reverso-r3\.webp/);
  assert.match(page, /xiomara-shampoo-platinum-libre-sulfatos-250ml\/02-reverso-r3\.webp/);
  assert.match(page, /candidate\.originalBack && candidate\.preparedBack/);
  assert.match(page, /compare-back-/);
  assert.match(page, /<CompareImage src={candidate\.originalBack}/);
  assert.match(page, /<CompareImage src={candidate\.preparedBack}/);
});

test("comparativa sigue limitada a laboratorio, sin ediciones comerciales",()=>{
  assert.match(page, /process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(page, /notFound\(\)/);
  assert.match(page, /robots: \{ index: false, follow: false \}/);
  assert.doesNotMatch(page, /sdk\.admin|method:\s*["'](?:POST|PUT|PATCH|DELETE)["']/);
});
