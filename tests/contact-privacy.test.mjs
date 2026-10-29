import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const { NextResponse } = require("next/server");
const synthetic = {
  name: "Cliente Sintético PRIVACY_TEST",
  subject: "Consulta sintética & prueba",
  message: "Mensaje sintético con acentos y símbolos ? & #",
};

// Run the actual handler with real NextResponse and an isolated console/network.
function loadHandler() {
  const logs = [];
  const source = readFileSync(new URL("../src/app/api/contact/route.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const handlerModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: handlerModule, exports: handlerModule.exports,
    require: (name) => { assert.equal(name, "next/server"); return { NextResponse }; },
    console: new Proxy({}, { get: (_, method) => (...args) => logs.push({ method, args }) }),
    fetch: () => { throw new Error("External delivery is forbidden in this test"); },
  });
  return { POST: handlerModule.exports.POST, logs };
}

function request(body) {
  return new Request("http://localhost/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
}

test("valid contact submissions preserve the WhatsApp handoff without logging personal data", async () => {
  for (const extra of [{}, { email: "ignored@example.invalid", phone: "0000000000" }]) {
    const { POST, logs } = loadHandler();
    const response = await POST(request({ ...synthetic, ...extra }));
    assert.equal(response.status, 200);
    const result = await response.json();
    assert.equal(result.ok, true);
    const url = new URL(result.whatsappUrl);
    assert.equal(url.origin + url.pathname, "https://wa.me/528281136652");
    assert.equal(url.searchParams.get("text"), `Hola, soy ${synthetic.name}. ${synthetic.subject}: ${synthetic.message}`);
    assert(!result.whatsappUrl.includes("ignored@example.invalid"));
    assert(!result.whatsappUrl.includes("0000000000"));
    assert.deepEqual(logs, []);
  }
});

test("required fields still reject missing or empty values without logging or echoing the body", async () => {
  for (const field of ["name", "subject", "message"]) {
    for (const value of [undefined, "", "   ", null, 123, {}, []]) {
      const { POST, logs } = loadHandler();
      const response = await POST(request({ ...synthetic, [field]: value }));
      assert.equal(response.status, 400);
      assert.deepEqual(await response.json(), { error: "Todos los campos obligatorios deben ser completados." });
      assert.deepEqual(logs, []);
    }
  }
});

test("parse and unexpected failures return generic errors without logging sensitive exceptions", async () => {
  for (const request of [
    new Request("http://localhost/api/contact", { method: "POST", body: "{invalid" }),
    { json: async () => { throw new Error(JSON.stringify(synthetic)); } },
  ]) {
    const { POST, logs } = loadHandler();
    const response = await POST(request);
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "Error al procesar la solicitud." });
    assert.deepEqual(logs, []);
  }
});


test("null or non-object bodies fail validation without logging or disclosure", async () => {
  for (const body of [null, [], "synthetic", 123]) {
    const { POST, logs } = loadHandler();
    const response = await POST(request(body));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "Todos los campos obligatorios deben ser completados." });
    assert.deepEqual(logs, []);
  }
});
