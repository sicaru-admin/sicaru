import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("SICARÚ no publica ni configura correos no verificados", async () => {
  const paths = [
    "src/components/layout/Footer.tsx",
    "src/app/(shop)/contacto/page.tsx",
    "src/app/(shop)/politica-privacidad/page.tsx",
    "src/app/(shop)/terminos/page.tsx",
    "src/lib/constants/store.ts",
  ];
  for (const path of paths) {
    const file = await read(path);
    assert.doesNotMatch(file, /contacto@sicaru\\.com|hola@sicaru\\.com|mailto:/i, path);
    assert.doesNotMatch(file, /STORE\\.email/, path);
  }
  const privacy = await read("src/app/(shop)/politica-privacidad/page.tsx");
  assert.match(privacy, /Derechos ARCO/);
  assert.match(privacy, /solicita el procedimiento por/);
  assert.match(privacy, /o directamente en nuestro establecimiento/);
});

test("el número oficial conduce a WhatsApp, no a llamadas telefónicas", async () => {
  const contact = await read("src/app/(shop)/contacto/page.tsx");
  const notice = await read("src/app/(shop)/politica-privacidad/page.tsx");
  assert.match(contact, /https:\/\/wa\.me\/\$\{STORE\.whatsapp\}/);
  assert.match(contact, /WhatsApp/);
  assert.match(notice, /WhatsApp de atención/);
  assert.match(notice, /href="https:\/\/wa\.me\/528281136652"/);
  assert.doesNotMatch(notice, /href="tel:\+528281136652"/);
});
