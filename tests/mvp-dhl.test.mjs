import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import path from "node:path";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");
const read = name => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
function loader(catalogMode = true) {
  const modules = new Map();
  function load(name) {
    if (name === "@/lib/catalog-mode") return { CATALOG_MODE: catalogMode };
    if (name === "next/link") return { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) };
    if (name === "next/image") return { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) };
    if (name === "next/navigation") return { usePathname: () => "/cuenta/pedidos" };
    if (name === "@/components/auth/AuthProvider") return { useAuth: () => ({ logout: async () => {} }) };
    if (name === "@/components/auth/ProtectedRoute") return { ProtectedRoute: ({ children }) => children };
    if (!name.startsWith("@/")) return require(name);
    if (modules.has(name)) return modules.get(name);
    let source;
    for (const ext of [".tsx", ".ts"]) { try { source = read(`src/${name.slice(2)}${ext}`); break; } catch {} }
    if (!source) throw new Error(`Missing ${name}`);
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const mod = { exports: {} };
    vm.runInThisContext(`(function(require,module,exports){${code}\n})`)(specifier => load(specifier.startsWith(".") ? path.posix.join(path.posix.dirname(name), specifier) : specifier), mod, mod.exports);
    modules.set(name, mod.exports);
    return mod.exports;
  }
  return load;
}
const render = (Component, props = {}) => renderToStaticMarkup(React.createElement(Component, props));
const forbidden = /DHL|cobertura nacional|a todo México|\$|env[ií]os? gratis|mismo d[ií]a|OXXO|Mercado\s?Pago|\bVisa\b|Mastercard|c[aá]lculo autom[aá]tico/i;

test("shipping communication quotes each order without public rates or automatic purchasing", () => {
  const html = render(loader()("@/components/checkout/ShippingNotice").ShippingNotice);
  for (const copy of ["Consulta de envíos", "Escríbenos por WhatsApp para consultar opciones de envío a tu destino.", "Te confirmaremos cobertura y costo antes de confirmar tu pedido.", "Consulta los productos que necesitas por WhatsApp y te ayudamos a confirmar disponibilidad, precio y envío.", "Los pedidos y pagos en línea aún no están habilitados."]) assert.ok(html.includes(copy), copy);
  assert.ok(html.includes('href="https://wa.me/528281136652"'));
  assert.ok(html.includes("Consultar envío por WhatsApp"));
  assert.doesNotMatch(html.replace(/<[^>]+>/g, ""), forbidden);
});

test("shipping metadata has the approved title and no tariff or delivery deadline", () => {
  const { metadata } = loader()("@/app/(shop)/envios/page");
  assert.equal(metadata.title.absolute, "Consulta de envíos | SICARÚ");
  assert.match(metadata.description, /opciones de envío, cobertura y costo a tu destino/);
  assert.doesNotMatch(metadata.description, /\$|\bkg\b|d[ií]as|gratis/i);
});

test("catalog checkout and confirmation layout cannot mount payment or order content", () => {
  const html = render(loader()("@/app/(checkout)/checkout/layout").default, { children: React.createElement("form", null, "SYNTHETIC-PAYMENT-CONTENT") });
  assert.ok(html.includes("Los pedidos y pagos en línea aún no están habilitados."));
  assert.doesNotMatch(html, /SYNTHETIC-PAYMENT-CONTENT|<form|<iframe/);
  const enabled = render(loader(false)("@/app/(checkout)/checkout/layout").default, { children: "SYNTHETIC-FUTURE-CONTENT" });
  assert.ok(enabled.includes("SYNTHETIC-FUTURE-CONTENT"));
});

test("the compact shipping hint links to the real policy without quoting a price", () => {
  const html = render(loader()("@/components/checkout/ShippingInquiryHint").ShippingInquiryHint);
  assert.ok(html.includes("Opciones de envío ·"));
  assert.ok(html.includes("Consulta cobertura y costo por WhatsApp"));
  assert.ok(html.includes('href="/envios"'));
  assert.doesNotMatch(html, /\$|<form|<img/);
});

test("catalog discovery keeps its search and cards while exposing a single shipping hint", () => {
  const html = render(loader()("@/app/(shop)/productos/ProductosContent").ProductosContent, { products: [] });
  assert.equal((html.match(/Opciones de envío ·/g) ?? []).length, 1);
  assert.ok(html.includes("Buscar en productos"));
  assert.ok(html.includes('href="/categorias/color-y-tintes"'));
  assert.ok(html.includes("0 productos en el catálogo"));
});

test("home help offers shipping inquiries once and preserves the approved professional invitation", () => {
  const html = render(loader()("@/components/home/WhatsAppBanner").WhatsAppBanner);
  assert.ok(html.includes("Consulta opciones de envío, cobertura y costo por WhatsApp antes de confirmar tu pedido."));
  for (const copy of ["SICARÚ PROFESIONALES", "Para quienes hacen de la belleza su profesión.", "Valoramos tu experiencia y apoyamos tu trabajo con productos profesionales y precios especiales."]) assert.ok(html.includes(copy));
  assert.ok(html.includes('href="/salon-pro"'));
});

test("catalog terms permit WhatsApp shipping inquiries without claiming enabled online payments", () => {
  const html = render(loader()("@/app/(shop)/terminos/page").default);
  assert.ok(html.includes("Consulta y confirma disponibilidad, precio y envío por WhatsApp."));
  assert.ok(html.includes("Los pedidos y pagos en línea aún no están habilitados."));
  assert.doesNotMatch(html, /se confirman directamente en tienda|no acepta.*solicitudes de envío|OXXO|Mercado Pago/);
});

test("catalog privacy omits the dormant payment-provider claim and preserves the legal identity", () => {
  const catalog = render(loader()("@/app/(shop)/politica-privacidad/page").default);
  assert.doesNotMatch(catalog, /Mercado Pago|Proveedores de pago/);
  assert.ok(catalog.includes("responsable del tratamiento de tus datos personales"));
  assert.ok(catalog.includes("Derechos ARCO"));
  assert.ok(catalog.includes("Servicios de paquetería"));
  assert.ok(render(loader(false)("@/app/(shop)/politica-privacidad/page").default).includes("Mercado Pago"));
});

test("direct account routes in catalog mode show only consultation and cannot mount registration", () => {
  const children = React.createElement("form", null, "SYNTHETIC-ACCOUNT-FORM");
  const html = render(loader()("@/app/(shop)/cuenta/layout").default, { children });
  assert.ok(html.includes("Consulta tu pedido por WhatsApp"));
  assert.ok(html.includes('href="https://wa.me/528281136652"'));
  assert.doesNotMatch(html, /SYNTHETIC-ACCOUNT-FORM|Mi Cuenta|Mis Pedidos|<form/);
  assert.ok(render(loader(false)("@/app/(shop)/cuenta/layout").default, { children }).includes("SYNTHETIC-ACCOUNT-FORM"));
});

test("catalog return inquiries use WhatsApp without inventing refund terms or a launch date", () => {
  const html = render(loader()("@/app/(shop)/devoluciones/page").default);
  assert.ok(html.includes("Para consultar un cambio o devolución de tu pedido, contáctanos por WhatsApp."));
  assert.ok(html.includes('href="https://wa.me/528281136652"'));
  assert.doesNotMatch(html, /próximamente|15 d[ií]as|reembolso|OXXO/);
  assert.ok(render(loader(false)("@/app/(shop)/devoluciones/page").default).includes("Política de Devoluciones"));
});

// This change withdraws the carrier claim across public entry points, including metadata.
test("shipping entry points do not promise a carrier, tariff or nationwide coverage", () => {
  for (const file of [
    "src/components/home/WhatsAppBanner.tsx",
    "src/components/checkout/ShippingInquiryHint.tsx",
    "src/components/checkout/ShippingNotice.tsx",
    "src/app/(shop)/carrito/page.tsx",
    "src/app/(shop)/contacto/page.tsx",
    "src/app/(shop)/envios/page.tsx",
    "src/app/(shop)/terminos/page.tsx",
  ]) assert.doesNotMatch(read(file), /DHL|cobertura nacional|a todo México/i, file);
});
