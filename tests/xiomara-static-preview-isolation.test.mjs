import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page=readFileSync("src/app/qa/xiomara-recortes/page.tsx","utf8");
test("solo Preview, noindex y sin dependencias del backend",()=>{
  assert.match(page,/process\.env\.VERCEL_ENV !== "preview"/);
  assert.match(page,/notFound\(\)/);
  assert.match(page,/robots: \{ index: false, follow: false \}/);
  assert.doesNotMatch(page, /getProductByHandle|store\/products|sdk\.|NEXT_PUBLIC_MEDUSA|fetch\(/);
});
test("solo dos fichas XIOMARA, con originales y recortes aprobados",()=>{
  assert.match(page,/xiomara-shampoo-platinum-250ml/);
  assert.match(page,/xiomara-shampoo-platinum-libre-sulfatos-250ml/);
  assert.match(page,/01-principal-recorte-propietaria-candidato.webp/);
  assert.match(page,/01-principal.webp/);
  assert.doesNotMatch(page,/nekane-morazul-shampoo-matizador-300g|montis-shampoo-extracto-natural/);
});
