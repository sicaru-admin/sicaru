import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const React = require("react");
const ts = require("typescript");
const { renderToStaticMarkup } = require("react-dom/server");

// Execute actual component handlers with isolated hooks and network, then render
// each resulting React tree. Browser verification additionally covers native validation.
function client(fetch) {
  const states = [];
  let cursor = 0;
  const logs = [];
  const source = readFileSync(new URL("../src/components/contact/ContactFormClient.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  } }).outputText;
  const componentModule = { exports: {} };
  vm.runInNewContext(compiled, {
    module: componentModule, exports: componentModule.exports, fetch,
    console: new Proxy({}, { get: (_, method) => (...args) => logs.push({ method, args }) }),
    require: (name) => name === "react" ? { ...React, useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = initial;
      return [states[index], (value) => { states[index] = typeof value === "function" ? value(states[index]) : value; }];
    } } : require(name),
  });
  return { logs, render() { cursor = 0; return componentModule.exports.default(); } };
}
function find(tree, predicate) {
  if (!tree || typeof tree !== "object") return;
  if (predicate(tree)) return tree;
  for (const child of React.Children.toArray(tree.props?.children)) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
const field = (tree, name) => find(tree, (el) => el.props.name === name);
const button = (tree, text) => find(tree, (el) => el.type === "button" && el.props.children === text);
const synthetic = { name: "Cliente Sintético", email: "test@example.invalid", phone: "0000000000", subject: "Otro", message: "Consulta sintética & prueba" };
const url = `https://wa.me/528281136652?text=${encodeURIComponent(`Hola, soy ${synthetic.name}. ${synthetic.subject}: ${synthetic.message}`)}`;

test("contact prepares the message without automatic navigation or false delivery and allows editing", async () => {
  const calls = [];
  const ui = client(async (...args) => { calls.push(args); return { ok: true, json: async () => ({ ok: true, whatsappUrl: url }) }; });
  let tree = ui.render();
  for (const [name, value] of Object.entries(synthetic)) field(tree, name).props.onChange({ target: { name, value } });
  tree = ui.render();
  await tree.props.onSubmit({ preventDefault() {} });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/api/contact");
  assert.equal(calls[0][1].method, "POST");
  assert.deepEqual(JSON.parse(calls[0][1].body), synthetic);
  tree = ui.render();
  const html = renderToStaticMarkup(tree);
  assert(html.includes("Aún no se ha enviado"));
  assert(!html.includes("Mensaje Enviado"));
  const link = find(tree, (el) => el.type === "a");
  assert.equal(link.props.href, url);
  assert.equal(link.props.children, "Continuar a WhatsApp");
  assert.equal(link.props.rel, "noopener noreferrer");
  assert.equal(link.props.referrerPolicy, "no-referrer");
  button(tree, "Editar mensaje").props.onClick();
  tree = ui.render();
  for (const [name, value] of Object.entries(synthetic)) assert.equal(field(tree, name).props.value, value);
  assert.deepEqual(ui.logs, []);
});

test("contact preserves native required/email validation and pending state", async () => {
  let resolve;
  const ui = client(() => new Promise((done) => { resolve = done; }));
  const tree = ui.render();
  for (const name of ["name", "email", "subject", "message"]) assert.equal(field(tree, name).props.required, true);
  assert.equal(field(tree, "email").props.type, "email");
  assert.equal(field(tree, "phone").props.required, undefined);
  const pending = tree.props.onSubmit({ preventDefault() {} });
  assert.equal(button(ui.render(), "Preparando...").props.disabled, true);
  resolve({ ok: false, json: async () => ({ error: "Todos los campos obligatorios deben ser completados." }) });
  await pending;
  assert.equal(button(ui.render(), "Preparar mensaje").props.disabled, false);
  assert(renderToStaticMarkup(ui.render()).includes("Todos los campos obligatorios"));
});

test("network failures and invalid handoffs keep the form editable and never show a success state", async () => {
  for (const response of [null, {}, { ok: true }, { ok: true, whatsappUrl: "https://example.invalid" }, { ok: true, whatsappUrl: "javascript:alert(1)" }]) {
    const ui = client(async () => {
      if (response === null) throw new Error("Fallo de conexión sintético");
      return { ok: true, json: async () => response };
    });
    await ui.render().props.onSubmit({ preventDefault() {} });
    const tree = ui.render();
    assert.equal(tree.type, "form");
    assert(find(tree, (el) => el.props.role === "alert"));
    assert.equal(button(tree, "Preparar mensaje").props.disabled, false);
    assert.deepEqual(ui.logs, []);
  }
});
