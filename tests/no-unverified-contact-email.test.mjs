import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const extensions = new Set([".ts", ".tsx", ".js", ".mjs", ".json", ".txt", ".html", ".xml", ".md"]);

async function scan(relative) {
  const dir = path.join(root, relative);
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const subpath = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", "artifacts"].includes(entry.name)) continue;
      out.push(...await scan(subpath));
    } else if (entry.isFile() && extensions.has(path.extname(entry.name))) {
      out.push(subpath);
    }
  }
  return out;
}

test("no hay direcciones inexistentes ni referencias al correo STORE.email en material público", async () => {
  const publicFiles = [...await scan("src"), ...await scan("public")];
  const violations = [];
  for (const filename of publicFiles) {
    const content = await readFile(path.join(root, filename), "utf8");
    for (const token of ["contacto@sicaru.com", "hola@sicaru.com", "STORE.email"]) {
      if (content.includes(token)) violations.push(filename + ": " + token);
    }
  }
  assert.deepEqual(violations, [], "Eliminar direcciones no verificadas de código y contenido público");
});

test("la solicitud ARCO no requiere enviar identificaciones por un correo o enlace inexistente", async () => {
  const privacy = await readFile(path.join(root, "src/app/(shop)/politica-privacidad/page.tsx"), "utf8");
  assert.match(privacy, /Derechos ARCO/);
  assert.match(privacy, /solicita el procedimiento por/);
  assert.match(privacy, /WhatsApp oficial/);
  assert.match(privacy, /no envíes documentos/);
  assert.doesNotMatch(privacy, /mailto:/);
});

test("el formulario sigue preparando WhatsApp y no envía correos o mensajes de forma automática", async () => {
  const contact = await readFile(path.join(root, "src/components/contact/ContactFormClient.tsx"), "utf8");
  const route = await readFile(path.join(root, "src/app/api/contact/route.ts"), "utf8");
  assert.match(contact, /Continúa a nuestro WhatsApp oficial/);
  assert.match(route, /https:\/\/wa\.me\/528281136652\?text=/);
  assert.doesNotMatch(route, /resend|nodemailer|smtp|sendMail|sendEmail/i);
});
