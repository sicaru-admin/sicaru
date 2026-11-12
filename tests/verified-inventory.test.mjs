import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const React = require("react");
const ts = require("typescript");
const { renderToStaticMarkup } = require("react-dom/server");

function loadModules({ catalogMode = true, cartCalls = [], hooks = React } = {}) {
  const modules = new Map();
  function load(name) {
    if (name === "react") return hooks;
    if (name === "@/lib/catalog-mode") return { CATALOG_MODE: catalogMode };
    if (name === "@/components/cart/CartProvider") return {
      useCart: () => ({ addToCart: async (...args) => { cartCalls.push(args); }, isLoading: false }),
    };
    if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
    if (name === "next/image") return { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) };
    if (!name.startsWith("@/")) return require(name);
    if (modules.has(name)) return modules.get(name);
    let source;
    for (const extension of [".ts", ".tsx"]) {
      try {
        source = readFileSync(new URL(`../src/${name.slice(2)}${extension}`, import.meta.url), "utf8");
        break;
      } catch { /* Try the other component extension. */ }
    }
    assert.ok(source, `Missing module ${name}`);
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const mod = { exports: {} };
    vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`)(
      (specifier) => load(specifier.startsWith(".") ? path.posix.join(path.posix.dirname(name), specifier) : specifier),
      mod, mod.exports,
    );
    modules.set(name, mod.exports);
    return mod.exports;
  }
  return load;
}

const variant = (quantity, metadata = {}) => ({
  id: "variant_synthetic", title: "Tono sintético 02", sku: "SYNTHETIC-02",
  manage_inventory: true, inventory_quantity: quantity, allow_backorder: false,
  metadata, options: [], calculated_price: { calculated_amount: 75, currency_code: "mxn" },
});
const product = (v) => ({ id: "product_synthetic", title: "Producto de prueba", handle: "producto-de-prueba", options: [], images: [], variants: [v] });
const render = (Component, p) => renderToStaticMarkup(React.createElement(Component, { product: p }));

test("catalog cards route all unverified quantities to an exact WhatsApp inquiry", () => {
  const Card = loadModules()("@/components/products/RetailProductCard").RetailProductCard;
  for (const quantity of [500, 10, 5, 0, undefined]) {
    const p = product(variant(quantity));
    p.metadata = { storefront_inventory_verified: true };
    const before = JSON.stringify(p);
    const html = render(Card, p);
    assert.match(html, /Disponibilidad por confirmar/);
    assert.doesNotMatch(html, /aria-label="Agregar/);
    assert.doesNotMatch(html, /Sin existencias|En stock/);
    const href = html.match(/href="(https:\/\/wa.me\/[^\"]+)"/)[1];
    const url = new URL(href.replaceAll("&amp;", "&"));
    assert.equal(url.pathname, "/528281136652");
    assert.match(url.searchParams.get("text"), /Tono sintético 02/);
    assert.match(url.searchParams.get("text"), /SYNTHETIC-02/);
    assert.doesNotMatch(url.searchParams.get("text"), /75\.00/);
    assert.equal(JSON.stringify(p), before);
  }
});

test("verified quantity and price approval stay independent on cards and product details", () => {
  const load = loadModules();
  const Card = load("@/components/products/RetailProductCard").RetailProductCard;
  const Actions = load("@/components/product/ProductActions").ProductActions;
  const inventoryOnly = product(variant(2, { storefront_inventory_verified: true }));
  assert.match(render(Card, inventoryOnly), /aria-label="Agregar Producto de prueba"/);
  assert.match(render(Actions, inventoryOnly), /Consultar precio/);
  const priceOnly = product(variant(500, { storefront_price_approved: true }));
  assert.match(render(Actions, priceOnly).replace(/<[^>]+>/g, ""), /\$75\.00/);
  assert.match(render(Actions, priceOnly), /Disponibilidad por confirmar/);
  assert.match(render(Actions, priceOnly), /disabled=""/);
});

test("product details cannot add an unverified selected variant even if a handler is invoked directly", async () => {
  const cartCalls = [];
  const hooks = { ...React, useMemo: (fn) => fn(), useState: (initial) => [typeof initial === "function" ? initial() : initial, () => {}] };
  const Actions = loadModules({ cartCalls, hooks })("@/components/product/ProductActions").ProductActions;
  const tree = Actions({ product: product(variant(500)) });
  function find(node) {
    if (!node || typeof node !== "object") return undefined;
    if (node.type === "button" && typeof node.props.onClick === "function") return node;
    return React.Children.toArray(node.props?.children).map(find).find(Boolean);
  }
  const button = find(tree);
  assert.equal(button.props.disabled, true);
  await button.props.onClick();
  assert.equal(cartCalls.length, 0);
});

test("a previous verified variant does not authorize an unverified sibling", () => {
  const load = loadModules();
  const { getInventoryStatus } = load("@/lib/product-retail");
  const approved = variant(3, { storefront_inventory_verified: true });
  const sibling = { ...variant(500), id: "sibling" };
  assert.equal(getInventoryStatus(approved), "available");
  assert.equal(getInventoryStatus(sibling), "unverified");
  assert.equal(getInventoryStatus({ ...approved, inventory_quantity: 0 }), "unavailable");
  assert.equal(getInventoryStatus({ ...approved, inventory_quantity: undefined }), "unverified");
});

test("the dormant sticky action cannot expose an unverified or zero-stock catalog action", () => {
  const hooks = { ...React, useEffect: () => {}, useState: (initial) => [initial === false ? true : initial, () => {}] };
  const Sticky = loadModules({ hooks })("@/components/product/StickyAddToCart").StickyAddToCart;
  assert.equal(Sticky({ product: product(variant(500)) }), null);
  assert.equal(Sticky({ product: product(variant(0, { storefront_inventory_verified: true })) }), null);
  assert.ok(Sticky({ product: product(variant(2, { storefront_inventory_verified: true })) }));
});

test("non-catalog cards preserve the existing technical availability rule", () => {
  const Card = loadModules({ catalogMode: false })("@/components/products/RetailProductCard").RetailProductCard;
  assert.match(render(Card, product(variant(5))), /aria-label="Agregar Producto de prueba"/);
});
