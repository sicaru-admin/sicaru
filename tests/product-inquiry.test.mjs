import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const React = require("react");
const ts = require("typescript");

function loader(overrides = {}) {
  const modules = new Map();
  function load(name) {
    if (name in overrides) return overrides[name];
    if (!name.startsWith("@/")) return require(name);
    if (modules.has(name)) return modules.get(name);
    let source;
    for (const extension of [".ts", ".tsx"]) {
      try { source = readFileSync(new URL(`../src/${name.slice(2)}${extension}`, import.meta.url), "utf8"); break; }
      catch { /* Try the component extension. */ }
    }
    if (!source) throw new Error(`Missing module ${name}`);
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const loadedModule = { exports: {} };
    vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`)(
      (specifier) => load(specifier.startsWith(".")
        ? path.posix.join(path.posix.dirname(name), specifier) : specifier),
      loadedModule, loadedModule.exports,
    );
    modules.set(name, loadedModule.exports);
    return loadedModule.exports;
  }
  return load;
}

const inquiry = loader()("@/lib/product-inquiry").getProductWhatsAppHref;
const variant = (id, approved = false, amount = 123.45) => ({
  id, title: `Tono ${id}`, sku: `TUBE-${id}`, options: [{ option_id: "tone", value: `Tono ${id}` }],
  metadata: { storefront_price_approved: approved },
  calculated_price: { calculated_amount: amount, currency_code: "mxn" },
});
const product = (variants) => ({ id: "product_synthetic", title: "Coloración sintética", variants });
const text = (href) => new URL(href).searchParams.get("text");

test("every one of 23 synthetic tones retains its exact title and SKU in the official handoff", () => {
  const variants = Array.from({ length: 23 }, (_, index) => variant(String(index + 1).padStart(3, "0")));
  const p = product(variants);
  const messages = new Set();
  for (const v of variants) {
    const href = new URL(inquiry(p, v.id));
    assert.equal(href.origin + href.pathname, "https://wa.me/528281136652");
    const message = href.searchParams.get("text");
    assert(message.includes(`Variante: ${v.title}.`));
    assert(message.includes(`SKU: ${v.sku}.`));
    assert(!message.includes("123.45"));
    messages.add(message);
  }
  assert.equal(messages.size, 23);
});

test("no selection and a foreign variant ID produce a general inquiry without quoting any SKU or price", () => {
  const p = product([variant("001", true), variant("002", true, 999)]);
  for (const selected of [undefined, null, "", "foreign"]) {
    const message = text(inquiry(p, selected));
    assert(message.includes(p.title));
    assert(message.includes("confirmar precio y disponibilidad"));
    assert(!message.includes("Variante:"));
    assert(!message.includes("SKU:"));
    assert(!message.includes("123.45"));
    assert(!message.includes("999"));
  }
});

test("only the canonical selected variant can contribute an approved price", () => {
  const p = product([variant("001", true), variant("002", false, 999)]);
  assert(text(inquiry(p, "001")).includes("Precio publicado: $123.45."));
  const unapproved = text(inquiry(p, "002"));
  assert(unapproved.includes("SKU: TUBE-002."));
  assert(!unapproved.includes("999"));
  assert(!unapproved.includes("Precio publicado:"));
  const tampered = { ...p.variants[1], metadata: { storefront_price_approved: true } };
  assert(!text(inquiry(p, tampered.id)).includes("Precio publicado:"));
  assert(!text(inquiry({ ...p, metadata: { storefront_price_approved: true } }, "002")).includes("Precio publicado:"));
});

test("missing information, false/string approvals and invalid amounts never invent or expose a price", () => {
  for (const v of [
    { id: "missing" },
    { ...variant("001"), metadata: { storefront_price_approved: "true" } },
    variant("001", true, NaN), variant("001", true, -1),
    { id: "missing_price", metadata: { storefront_price_approved: true } },
  ]) {
    const message = text(inquiry(product([v]), v.id));
    assert(!message.includes("Precio publicado:"));
    assert(!message.includes("undefined"));
    assert(!message.includes("null"));
    assert(!message.includes("NaN"));
  }
  assert(!text(inquiry({ id: "empty" })).includes("undefined"));
});

test("identifiers, accents, special characters and source data remain intact", () => {
  const p = product([{ ...variant("001", true), title: "7.1 Castaño & café + 90 ml", sku: "000123&456" }]);
  p.title = "KÜÜL + Voglia & SICARÚ";
  const before = JSON.stringify(p);
  const href = new URL(inquiry(p, "001"));
  assert.equal(href.searchParams.size, 1);
  assert(text(href).includes("SKU: 000123&456."));
  assert(text(href).includes("7.1 Castaño & café + 90 ml"));
  assert(text(href).includes(p.title));
  assert.equal(JSON.stringify(p), before);
});

function find(tree, predicate) {
  if (!tree || typeof tree !== "object") return;
  if (predicate(tree)) return tree;
  for (const child of React.Children.toArray(tree.props?.children)) {
    const match = find(child, predicate);
    if (match) return match;
  }
}

test("the real product action updates the WhatsApp reference after selection without cart or external calls", () => {
  const states = [];
  let cursor = 0;
  let cartCalls = 0;
  const load = loader({
    react: { ...React, useMemo: (fn) => fn(), useState(initial) {
      const index = cursor++;
      if (!(index in states)) states[index] = initial;
      return [states[index], (value) => { states[index] = typeof value === "function" ? value(states[index]) : value; }];
    } },
    "@/components/cart/CartProvider": { useCart: () => ({ addToCart: () => { cartCalls++; }, isLoading: false }) },
  });
  const Actions = load("@/components/product/ProductActions").ProductActions;
  const p = product([variant("001", true), variant("002", false, 999)]);
  const render = () => { cursor = 0; return Actions({ product: p }); };
  const link = (tree) => find(tree, (el) => el.type === "a" && el.props.href?.startsWith("https://wa.me/"));
  let tree = render();
  assert(!text(link(tree).props.href).includes("SKU:"));
  find(tree, (el) => typeof el.props.onSelect === "function").props.onSelect("tone", "Tono 001");
  tree = render();
  assert(text(link(tree).props.href).includes("SKU: TUBE-001."));
  assert(text(link(tree).props.href).includes("Precio publicado: $123.45."));
  find(tree, (el) => typeof el.props.onSelect === "function").props.onSelect("tone", "Tono 002");
  tree = render();
  assert(text(link(tree).props.href).includes("SKU: TUBE-002."));
  assert(!text(link(tree).props.href).includes("TUBE-001"));
  assert(!text(link(tree).props.href).includes("999"));
  assert.equal(link(tree).props.target, "_blank");
  assert.equal(link(tree).props.rel, "noopener noreferrer");
  assert.equal(cartCalls, 0);
});
