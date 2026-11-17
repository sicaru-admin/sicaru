import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

const empty = () => null;

// Execute the real schema, JSON-LD serializer, page and metadata with a mocked
// catalog-mode module/backend. No process env changes or external requests.
function loader(catalogMode, product) {
  const cache = new Map();
  const overrides = {
    "@/lib/catalog-mode": { CATALOG_MODE: catalogMode },
    "@/lib/data/products": {
      getProductByHandle: async () => product,
      getProducts: async () => ({ products: product ? [product] : [] }),
    },
    "next/link": { __esModule: true, default: ({ children, ...props }) =>
      React.createElement("a", props, children) },
    "next/navigation": { notFound: () => { throw new Error("404"); } },
    "@/components/product/ImageGallery": { ImageGallery: empty },
    "@/components/product/ProductActions": { ProductActions: empty },
    "@/components/product/ProductTabs": { ProductTabs: empty },
    "@/components/product/RelatedProducts": { RelatedProducts: empty },
    "@/components/layout/Navbar": { Navbar: empty },
    "@/components/layout/Footer": { Footer: empty },
    "@/components/ui/WhatsAppButton": { WhatsAppButton: empty },
    "@/components/home/HeroSection": { HeroSection: empty },
    "@/components/home/CategoriesGrid": { CategoriesGrid: empty },
    "@/components/home/FeaturedProducts": { FeaturedProducts: empty },
    "@/components/home/BrandsShowcase": { BrandsShowcase: empty },
    "@/components/home/WhatsAppBanner": { WhatsAppBanner: empty },
  };
  function load(name) {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (!name.startsWith("@/")) return require(name);
    if (cache.has(name)) return cache.get(name);
    let source;
    for (const extension of [".ts", ".tsx"]) {
      try {
        source = readFileSync(new URL(`../src/${name.slice(2)}${extension}`, import.meta.url), "utf8");
        break;
      } catch { /* Try the other source extension. */ }
    }
    if (!source) throw new Error(`Missing module ${name}`);
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    } }).outputText;
    const mod = { exports: {} };
    vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`)(
      (specifier) => load(specifier.startsWith(".")
        ? path.posix.join(path.posix.dirname(name), specifier) : specifier),
      mod, mod.exports,
    );
    cache.set(name, mod.exports);
    return mod.exports;
  }
  return load;
}

function variant(id = "variant_synthetic", approved = true, amount = 137.42) {
  return {
    id, title: "Presentación sintética", sku: `SYNTHETIC-${id}`,
    metadata: { storefront_price_approved: approved },
    calculated_price: { calculated_amount: amount, currency_code: "mxn" },
  };
}

function product(variants = [variant()]) {
  return {
    id: "prod_synthetic_seo", title: "Producto sintético SEO",
    handle: "producto-sintetico-seo", description: "Descripción sintética sin importe.",
    thumbnail: "https://example.invalid/synthetic-thumbnail.webp",
    images: [{ id: "image_synthetic", url: "https://example.invalid/synthetic.webp" }],
    collection: null, variants,
  };
}

function jsonLd(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

function hasType(node, type) {
  return node?.["@type"] === type || Array.isArray(node?.["@type"]) && node["@type"].includes(type);
}

function assertNoFabricatedReviews(value) {
  if (!value || typeof value !== "object") return;
  assert(!hasType(value, "Review"));
  assert(!hasType(value, "AggregateRating"));
  assert.equal(Object.hasOwn(value, "review"), false);
  assert.equal(Object.hasOwn(value, "aggregateRating"), false);
  Object.values(value).forEach(assertNoFabricatedReviews);
}

async function renderProduct(catalogMode, p) {
  const load = loader(catalogMode, p);
  const page = await load("@/app/(shop)/productos/[handle]/page").default({
    params: Promise.resolve({ handle: p.handle }),
  });
  const html = renderToStaticMarkup(React.createElement(
    load("@/app/(shop)/layout").default, null, page,
  ));
  return { html, schemas: jsonLd(html), load };
}

test("catalog mode omits Product even for an approved price and preserves valid page/global JSON-LD", async () => {
  const p = product();
  const { html, schemas } = await renderProduct(true, p);
  assert(html.includes(`<h1`));
  assert(html.includes(p.title));
  assert.equal(schemas.length, 3);
  assert.equal(schemas.filter((s) => hasType(s, "BreadcrumbList")).length, 1);
  assert.equal(schemas.filter((s) => hasType(s, "FAQPage")).length, 1);
  assert.equal(schemas.filter((s) => hasType(s, "Store") && hasType(s, "LocalBusiness")).length, 1);
  assert(!schemas.some((s) => hasType(s, "Product") || hasType(s, "Offer")));
  assert(!html.includes('"offers"'));
  assert(!html.includes("137.42"));
  assert(!schemas.includes(null));
  schemas.forEach(assertNoFabricatedReviews);
  const breadcrumbs = schemas.find((s) => hasType(s, "BreadcrumbList"));
  assert.equal(breadcrumbs.itemListElement.at(-1).name, p.title);
  assert(breadcrumbs.itemListElement.at(-1).item.endsWith(`/productos/${p.handle}`));
});

test("catalog schema and FAQs do not read a calculated backend price", () => {
  const p = product();
  Object.defineProperty(p.variants[0], "calculated_price", {
    get() { throw new Error("Calculated price must not be read in catalog mode"); },
  });
  const schema = loader(true, p)("@/lib/schema");
  assert.equal(schema.generateProductSchema(p), null);
  const faqs = schema.generateProductFAQs(p);
  assert(faqs[0].answer.includes("Consulta el precio actual"));
});

test("commerce mode preserves one Product and one Offer for the exact approved canonical first variant", async () => {
  const p = product([variant("approved", true), variant("other", false, 9999.99)]);
  const { schemas, html } = await renderProduct(false, p);
  const products = schemas.filter((s) => hasType(s, "Product"));
  assert.equal(products.length, 1);
  assert.equal(schemas.length, 4);
  assert.equal(products[0].sku, "SYNTHETIC-approved");
  assert.equal(products[0].offers["@type"], "Offer");
  assert.equal(products[0].offers.price, 137.42);
  assert.equal(products[0].offers.priceCurrency, "MXN");
  assert(!html.includes("9999.99"));
  assert.equal(schemas.filter((s) => hasType(s, "BreadcrumbList")).length, 1);
  assert.equal(schemas.filter((s) => hasType(s, "FAQPage")).length, 1);
  schemas.forEach(assertNoFabricatedReviews);
});

test("product-level, string and other-variant approvals cannot create an offer or a priced FAQ", async () => {
  for (const approval of [false, undefined, "true"]) {
    const p = product([variant("first", approval), variant("other", true, 9999.99)]);
    p.variants[0].metadata.storefront_price_approved = approval;
    p.metadata = { storefront_price_approved: true };
    const { schemas, html, load } = await renderProduct(false, p);
    assert.equal(load("@/lib/schema").generateProductSchema(p), null);
    assert(!schemas.some((s) => hasType(s, "Product")));
    assert(!html.includes('"offers"'));
    assert(!html.includes("137.42"));
    assert(!html.includes("9999.99"));
    assert(load("@/lib/schema").generateProductFAQs(p)[0].answer.includes("Consulta el precio actual"));
  }
});

test("missing, nonnumeric, infinite and negative amounts never create a price-bearing Product", () => {
  for (const amount of [undefined, null, "137.42", NaN, Infinity, -1]) {
    const p = product([variant("bad", true, amount)]);
    p.variants[0].calculated_price.calculated_amount = amount;
    const schema = loader(false, p)("@/lib/schema");
    assert.equal(schema.generateProductSchema(p), null);
    assert(schema.generateProductFAQs(p)[0].answer.includes("Consulta el precio actual"));
  }
  for (const p of [product([]), product([{ id: "no_price", metadata: { storefront_price_approved: true } }])]) {
    assert.equal(loader(false, p)("@/lib/schema").generateProductSchema(p), null);
  }
  const zero = product([variant("approved_zero", true, 0)]);
  assert.equal(loader(false, zero)("@/lib/schema").generateProductSchema(zero).offers.price, 0);
});

test("catalog metadata retains title, description and image without price OpenGraph or product price tags", async () => {
  const p = product();
  Object.defineProperty(p.variants[0], "calculated_price", {
    get() { throw new Error("Catalog metadata must not read a backend price"); },
  });
  const metadata = await loader(true, p)("@/app/(shop)/productos/[handle]/page").generateMetadata({
    params: Promise.resolve({ handle: p.handle }),
  });
  assert.equal(metadata.title, p.title);
  assert.equal(metadata.description, p.description);
  assert.equal(metadata.openGraph.title, p.title);
  assert.deepEqual(metadata.openGraph.images, [{ url: p.thumbnail }]);
  assert.equal(metadata.other, undefined);
});

test("commerce metadata quotes only the approved first variant and never inherits another approval", async () => {
  for (const approved of [true, false]) {
    const p = product([variant("first", approved), variant("other", true, 9999.99)]);
    p.metadata = { storefront_price_approved: true };
    const metadata = await loader(false, p)("@/app/(shop)/productos/[handle]/page").generateMetadata({
      params: Promise.resolve({ handle: p.handle }),
    });
    assert.equal(metadata.description, p.description);
    assert.deepEqual(metadata.openGraph.images, [{ url: p.thumbnail }]);
    if (approved) {
      assert(metadata.openGraph.title.includes("$137.42"));
      assert.equal(metadata.other["product:price:amount"], "137.42");
      assert.equal(metadata.other["product:price:currency"].toUpperCase(), "MXN");
    } else {
      assert.equal(metadata.openGraph.title, p.title);
      assert.equal(metadata.other, undefined);
    }
    assert(!JSON.stringify(metadata).includes("9999.99"));
  }
});

test("Organization, WebSite, Breadcrumb and FAQ generators remain identical across mode switches", () => {
  const catalog = loader(true, product())("@/lib/schema");
  const commerce = loader(false, product())("@/lib/schema");
  assert.deepEqual(catalog.generateOrganizationSchema(), commerce.generateOrganizationSchema());
  assert.deepEqual(catalog.generateWebSiteSchema(), commerce.generateWebSiteSchema());
  const breadcrumbs = [{ name: "Inicio", url: "/" }, { name: "Prueba", url: "/productos/prueba" }];
  assert.deepEqual(catalog.generateBreadcrumbSchema(breadcrumbs), commerce.generateBreadcrumbSchema(breadcrumbs));
  const faqs = [{ question: "Pregunta sintética", answer: "Respuesta sintética" }];
  assert.deepEqual(catalog.generateFAQSchema(faqs), commerce.generateFAQSchema(faqs));
});

test("Home continues to emit exactly one WebSite and one shop organization in both modes", () => {
  for (const mode of [true, false]) {
    const load = loader(mode, product());
    const home = React.createElement(load("@/app/(shop)/page").default);
    const html = renderToStaticMarkup(React.createElement(load("@/app/(shop)/layout").default, null, home));
    const schemas = jsonLd(html);
    assert.equal(schemas.length, 2);
    assert.equal(schemas.filter((s) => hasType(s, "WebSite")).length, 1);
    assert.equal(schemas.filter((s) => hasType(s, "Store")).length, 1);
    assert(!schemas.some((s) => hasType(s, "Product")));
    schemas.forEach(assertNoFabricatedReviews);
  }
});
