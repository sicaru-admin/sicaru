import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
import vm from "node:vm";

function loadHelper() {
  const source = readFileSync(new URL("../src/lib/cart-inquiry.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  const require = (id) => {
    if (id === "@/lib/constants/store") return { STORE: { whatsapp: "528281136652" } };
    if (id === "@/components/cart/cart-line-variant") return {
      getCartLineVariantLabel(item) {
        const entries = Object.entries(item.variant_option_values ?? {});
        const tone = entries.find(([name]) => name.toLowerCase() === "tono")?.[1];
        if (typeof tone === "string" && tone.trim()) return "Tono: " + tone.trim();
        const title = item.variant_title ?? item.variant?.title ?? "";
        return /^\d{1,2}(?:[./-]\d+)?\s+\S+/.test(title) ? "Tono: " + title : null;
      },
    };
    throw new Error("Unexpected module " + id);
  };
  vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`)(require, mod, mod.exports);
  return mod.exports.getCartWhatsAppHref;
}

const getHref = loadHelper();
const message = (href) => new URL(href).searchParams.get("text");

test("carrito multiproducto conserva producto, presentación, tono, SKU y cantidad", () => {
  const href = getHref([
    {
      product_title: "Voglia Tinte Permanente 90ml",
      quantity: 2,
      variant_sku: "VOGLIA-TINTE-8-31-90ML",
      variant_option_values: { Tono: "8.31 Rubio claro dorado cenizo", "Presentación": "90 ml" },
    },
    {
      product_title: "Voglia Tinte Permanente 90ml",
      quantity: 3,
      variant_sku: "VOGLIA-TINTE-6-622-90ML",
      variant_option_values: { Tono: "6.622 Rojo violeta · rojo cereza · borgoña", "Presentación": "90 ml" },
    },
  ]);
  const parsed = new URL(href);
  assert.equal(parsed.origin + parsed.pathname, "https://wa.me/528281136652");
  const text = message(href);
  assert.match(text, /Voglia Tinte Permanente 90ml/);
  assert.equal((text.match(/Presentación: 90 ml/g) ?? []).length, 2);
  assert.match(text, /Tono: 8\.31 Rubio claro dorado cenizo/);
  assert.match(text, /SKU: VOGLIA-TINTE-8-31-90ML/);
  assert.match(text, /Cantidad: 2/);
  assert.match(text, /Tono: 6\.622 Rojo violeta · rojo cereza · borgoña/);
  assert.match(text, /SKU: VOGLIA-TINTE-6-622-90ML/);
  assert.match(text, /Cantidad: 3/);
});

test("la consulta nunca expone unit_price, total, envío ni datos de pago", () => {
  const text = message(getHref([{
    product_title: "Producto prueba",
    quantity: 1,
    unit_price: 999999,
    total: 999999,
    variant_sku: "SKU-1",
  }]));
  assert.doesNotMatch(text, /999999/);
  assert.doesNotMatch(text, /Mercado Pago|OXXO|tarjeta|dirección de envío/i);
  assert.match(text, /confirmar disponibilidad y total/i);
});

test("cantidad inválida cae de forma segura a uno y SKU faltante no se inventa", () => {
  const text = message(getHref([{ product_title: "Sin SKU", quantity: 0 }]));
  assert.match(text, /Cantidad: 1/);
  assert.doesNotMatch(text, /SKU:/);
});

test("el carrito usa WhatsApp solo en modo catálogo y conserva checkout fuera de él", () => {
  const page = readFileSync(new URL("../src/app/(shop)/carrito/page.tsx", import.meta.url), "utf8");
  const drawer = readFileSync(new URL("../src/components/cart/CartDrawer.tsx", import.meta.url), "utf8");
  for (const source of [page, drawer]) {
    assert.match(source, /CATALOG_MODE/);
    assert.match(source, /getCartWhatsAppHref/);
    assert.match(source, /\/checkout/);
  }
  assert.match(page, /Consultar carrito por WhatsApp/);
  assert.match(drawer, /Consultar por WhatsApp/);
});
