import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("pie y contacto usan la misma fuente de correo, sin direcciones contradictorias", async () => {
  const footer = await read("src/components/layout/Footer.tsx");
  const contact = await read("src/app/(shop)/contacto/page.tsx");
  const store = await read("src/lib/constants/store.ts");
  assert.match(footer, /STORE\.email/);
  assert.match(contact, /STORE\.email/);
  assert.match(store, /email:\s*"contacto@sicaru\.com"/);
  assert.doesNotMatch(footer, /hola@sicaru\.com/);
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
