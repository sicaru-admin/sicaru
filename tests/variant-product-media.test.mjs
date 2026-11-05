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
const image = (id, rank) => ({ id, url: `https://example.invalid/variant-media/${id}.png`, ...(rank == null ? {} : { rank }) });

function loader(overrides = {}) {
  const cache = new Map();
  function load(name) {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name === "next/image") return { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) };
    if (!name.startsWith("@/")) return require(name);
    if (cache.has(name)) return cache.get(name);
    let source;
    for (const extension of [".ts", ".tsx"]) {
      try { source = readFileSync(new URL(`../src/${name.slice(2)}${extension}`, import.meta.url), "utf8"); break; }
      catch { /* Try the other extension. */ }
    }
    if (!source) throw new Error(`Missing source module ${name}`);
    const compiled = ts.transpileModule(source, { compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    } }).outputText;
    const mod = { exports: {} };
    vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`)(
      (specifier) => load(specifier.startsWith(".") ? path.posix.join(path.posix.dirname(name), specifier) : specifier),
      mod, mod.exports,
    );
    cache.set(name, mod.exports);
    return mod.exports;
  }
  return load;
}

function hooks() {
  const state = []; let cursor = 0;
  return {
    reset() { cursor = 0; },
    react: { ...React, useMemo: (fn) => fn(), useState(initial) {
      const index = cursor++;
      if (!(index in state)) state[index] = typeof initial === "function" ? initial() : initial;
      return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }];
    } },
  };
}

function findAll(tree, predicate) {
  if (!tree || typeof tree !== "object") return [];
  return [
    ...(predicate(tree) ? [tree] : []),
    ...React.Children.toArray(tree.props?.children).flatMap((child) => findAll(child, predicate)),
  ];
}
const find = (tree, predicate) => findAll(tree, predicate)[0];

function variant(id, images = []) {
  return {
    id, title: `Opción sintética ${id}`, sku: `SYNTHETIC-${id}`,
    product_id: "product_media_synthetic", images,
    options: [{ option_id: "tone", value: `Opción sintética ${id}`, option: { id: "tone", title: "Tono" } }],
    manage_inventory: true, inventory_quantity: 2, allow_backorder: false,
    metadata: { storefront_price_approved: false },
  };
}
function product() {
  const a1 = image("a-front", 0), a2 = image("a-detail", 1), b1 = image("b-front", 0);
  return {
    id: "product_media_synthetic", title: "Producto sintético con variantes", handle: "producto-sintetico-media",
    images: [image("general"), a1, a2, b1], thumbnail: image("general").url,
    options: [{ id: "tone", title: "Tono", values: ["a", "b", "c"].map((id) => ({ value: `Opción sintética ${id}` })) }],
    variants: [variant("a", [a1, a2]), variant("b", [b1]), variant("c")],
  };
}
const media = (p, id) => loader()("@/lib/product-media").getProductMedia(p, id);
const urls = (result) => result.images.map((item) => item.url);

test("a product without any images stays empty for general, selected and invalid references", () => {
  const p = product(); p.images = []; p.thumbnail = null; p.variants.forEach((v) => { v.images = []; });
  for (const id of [undefined, "a", "c", "foreign"]) {
    assert.deepEqual(media(p, id).images, []);
    assert.equal(media(p, id).variantTitle, null);
  }
});

test("general product images and a general thumbnail remain valid fallbacks", () => {
  const p = product(); p.variants.forEach((v) => { v.images = []; });
  p.images = [image("general-one"), image("general-two")];
  assert.deepEqual(urls(media(p)), p.images.map((item) => item.url));
  p.images = [];
  assert.deepEqual(urls(media(p, "c")), [p.thumbnail]);
});

test("no selection or foreign variant uses only general media, never an arbitrary tone", () => {
  const p = product();
  for (const id of [undefined, null, "", "foreign"]) {
    assert.deepEqual(urls(media(p, id)), [image("general").url]);
    assert.equal(media(p, id).variantTitle, null);
  }
});

test("selecting A and then B returns exclusively the matching native variant images", () => {
  const p = product(); const before = JSON.stringify(p);
  assert.deepEqual(urls(media(p, "a")), [image("a-front").url, image("a-detail").url]);
  assert.equal(media(p, "a").variantTitle, p.variants[0].title);
  assert.deepEqual(urls(media(p, "b")), [image("b-front").url]);
  assert.equal(media(p, "b").variantTitle, p.variants[1].title);
  assert.equal(JSON.stringify(p), before);
});

test("a variant with no own image falls back to general only, or placeholder if none exists", () => {
  const p = product();
  assert.deepEqual(urls(media(p, "c")), [image("general").url]);
  p.images = p.images.filter((item) => item.id !== "general"); p.thumbnail = image("a-front").url;
  assert.deepEqual(media(p, "c").images, []);
  assert.deepEqual(media(p).images, []);
});

test("native variant thumbnails are reserved even when absent from product images", () => {
  const p = product(); const only = image("thumbnail-only").url;
  p.variants[0].images = []; p.variants[0].thumbnail = only; p.images = []; p.thumbnail = only;
  assert.deepEqual(urls(media(p, "a")), [only]);
  assert.deepEqual(media(p, "b").images.map((item) => item.url), [image("b-front").url]);
  assert.deepEqual(media(p, "c").images, []);
  assert.deepEqual(media(p).images, []);
});

test("a reserved ID or duplicate URL cannot leak back as general media", () => {
  const p = product();
  p.images.push({ id: "duplicate-url", url: image("a-front").url });
  p.images.push({ id: "a-front", url: image("same-id-another-url").url });
  assert.deepEqual(urls(media(p)), [image("general").url]);
  p.variants[0].images.push({ id: "another-id", url: image("a-front").url });
  assert.deepEqual(urls(media(p, "a")), [image("a-front").url, image("a-detail").url]);
});

test("native rank is respected and an own thumbnail is first without duplicating its URL", () => {
  const p = product();
  p.variants[0].images = [image("rank-two", 2), image("rank-zero", 0), image("rank-one", 1)];
  assert.deepEqual(urls(media(p, "a")), [image("rank-zero").url, image("rank-one").url, image("rank-two").url]);
  p.variants[0].thumbnail = image("rank-two").url;
  assert.deepEqual(urls(media(p, "a")), [image("rank-two").url, image("rank-zero").url, image("rank-one").url]);
});

test("layout reservation remains stable across general, A, B and empty-variant selections", () => {
  const p = product();
  const results = [undefined, "a", "b", "c"].map((id) => media(p, id));
  assert(results.every((r) => r.reserveImageSpace === results[0].reserveImageSpace));
  assert(results.every((r) => r.reserveThumbnails === results[0].reserveThumbnails));
  assert.equal(results[0].reserveImageSpace, true);
  assert.equal(results[0].reserveThumbnails, true);
});

function experienceHarness(p) {
  const state = hooks(), calls = [];
  const load = loader({ react: state.react,
    "@/components/cart/CartProvider": { useCart: () => ({ addToCart: async (...args) => { calls.push(args); }, isLoading: false }) },
  });
  const Experience = load("@/components/product/ProductExperience").ProductExperience;
  const Gallery = load("@/components/product/ImageGallery").ImageGallery;
  const entry = Experience({ product: p, children: React.createElement("h1", null, p.title) });
  const Actions = load("@/components/product/ProductActions").ProductActions;
  assert.equal(entry.type, Actions);
  return { calls, Gallery, render() { state.reset(); return Actions(entry.props); } };
}

test("one canonical selection drives gallery, exact cart input and WhatsApp through rerenders without navigation", async () => {
  const p = product();
  p.thumbnail = image("a-front").url;
  const ui = experienceHarness(p);
  let tree = ui.render();
  assert.deepEqual(find(tree, (node) => node.type === ui.Gallery).props.images.map((i) => i.url), [image("general").url]);
  const initialMessage = new URL(find(tree, (node) => node.type === "a" && node.props.href?.startsWith("https://wa.me/")).props.href).searchParams.get("text");
  assert(!initialMessage.includes("SKU:"));
  for (const v of p.variants) {
    find(tree, (node) => typeof node.props.onSelect === "function").props.onSelect("tone", v.title);
    tree = ui.render();
    const gallery = find(tree, (node) => node.type === ui.Gallery);
    assert.deepEqual(gallery.props.images.map((i) => i.url), urls(media(p, v.id)));
    find(tree, (node) => typeof node.props.onChange === "function" && "quantity" in node.props).props.onChange(2);
    tree = ui.render();
    assert.deepEqual(find(tree, (node) => node.type === ui.Gallery).props.images.map((i) => i.url), urls(media(p, v.id)));
    const href = new URL(find(tree, (node) => node.type === "a" && node.props.href?.startsWith("https://wa.me/")).props.href);
    assert.equal(href.origin + href.pathname, "https://wa.me/528281136652");
    const message = href.searchParams.get("text");
    assert(message.includes(`Variante: ${v.title}.`)); assert(message.includes(`SKU: ${v.sku}.`));
    const button = find(tree, (node) => node.type === "button" && typeof node.props.onClick === "function");
    assert.equal(button.props.disabled, false); await button.props.onClick();
    const [input, quantity] = ui.calls.at(-1);
    assert.equal(input.variantId, v.id); assert.equal(input.variantTitle, v.title); assert.equal(input.variantSku, v.sku);
    assert.deepEqual(input.variantOptionValues, { Tono: v.title }); assert.equal(quantity, 2);
    assert.equal(input.thumbnail, media(p, v.id).images[0]?.url ?? null);
    const otherSkus = p.variants.filter((other) => other.id !== v.id).map((other) => other.sku);
    otherSkus.forEach((sku) => assert(!message.includes(`SKU: ${sku}.`)));
  }
  assert.equal(ui.calls.length, 3);
});

test("stale variant URLs cannot expose a reserved product URL through an earlier duplicate ID", () => {
  const p = product();
  const actual = image("a-front");
  p.images = [{ id: "unreserved-alias", url: actual.url }, actual];
  p.thumbnail = actual.url;
  p.variants[0].images = [{ id: actual.id, url: image("stale-url").url }];
  assert.deepEqual(media(p).images, []);
  assert.deepEqual(media(p, "c").images, []);
});

test("cart thumbnail is empty when no safe image exists for a selected no-photo variant", async () => {
  const p = product();
  p.images = p.images.filter((i) => i.id !== "general"); p.thumbnail = image("a-front").url;
  const ui = experienceHarness(p);
  let tree = ui.render();
  find(tree, (n) => typeof n.props.onSelect === "function").props.onSelect("tone", p.variants[2].title);
  tree = ui.render();
  assert.deepEqual(find(tree, (n) => n.type === ui.Gallery).props.images, []);
  await find(tree, (n) => n.type === "button" && n.props.onClick).props.onClick();
  assert.equal(ui.calls[0][0].variantId, "c");
  assert.equal(ui.calls[0][0].thumbnail, null);
});

test("a product with no variants still renders its heading and general gallery", () => {
  const p = product(); p.variants = []; p.options = [];
  const ui = experienceHarness(p), tree = ui.render();
  assert(find(tree, (node) => node.type === "h1" && node.props.children === p.title));
  assert(find(tree, (node) => node.type === ui.Gallery));
  assert.equal(findAll(tree, (node) => node.type === "a" && node.props.href?.startsWith("https://wa.me/")).length, 0);
});

test("ambiguous unselectable variants do not silently choose a tone for gallery or inquiry", () => {
  const p = product(); p.options = [];
  p.variants.forEach((v) => { v.options = []; v.title = "Misma opción"; });
  const ui = experienceHarness(p), tree = ui.render();
  assert.deepEqual(find(tree, (node) => node.type === ui.Gallery).props.images.map((i) => i.url), [image("general").url]);
  const href = find(tree, (node) => node.type === "a" && node.props.href?.startsWith("https://wa.me/")).props.href;
  assert(!new URL(href).searchParams.get("text").includes("SKU:"));
  assert.equal(find(tree, (node) => node.type === "button" && node.props.onClick).props.disabled, true);
  assert.equal(ui.calls.length, 0);
});

test("gallery clamps a stale thumbnail index after images change and exposes pressed thumbnail state", () => {
  const state = hooks(), load = loader({ react: state.react });
  const Gallery = load("@/components/product/ImageGallery").ImageGallery;
  const render = (images) => { state.reset(); return Gallery({ images, title: "Producto sintético", reserveImageSpace: true, reserveThumbnails: true }); };
  let tree = render([image("one"), image("two")]);
  let buttons = findAll(tree, (node) => node.type === "button");
  assert.equal(buttons.length, 2); assert.equal(buttons[0].props["aria-pressed"], true);
  assert.equal(buttons[1].props["aria-pressed"], false);
  assert.equal(buttons[1].props["aria-label"], "Ver imagen 2");
  buttons[1].props.onClick(); tree = render([image("one"), image("two")]);
  buttons = findAll(tree, (node) => node.type === "button");
  assert.equal(buttons[1].props["aria-pressed"], true);
  tree = render([image("different")]);
  assert.equal(find(tree, (node) => node.props?.src)?.props.src, image("different").url);
  assert.doesNotThrow(() => renderToStaticMarkup(tree));
  assert.doesNotThrow(() => render([]));
});

test("only the product-detail query expands native variant images; list queries retain their existing fields", async () => {
  const queries = [], p = product();
  const load = loader({
    "@/lib/medusa": { sdk: { store: { product: { list: async (query) => {
      queries.push(query); return { products: [p], count: 1, offset: 0, limit: query.limit };
    } } } } },
    "@/lib/catalog-request": { catalogRequest: (request) => request() },
    "@/lib/data/regions": { getMexicoRegion: async () => ({ id: "region_synthetic_mx" }) },
  });
  const api = load("@/lib/data/products");
  assert.equal((await api.getProductByHandle(p.handle)).id, p.id);
  await api.getProducts();
  await api.getProductsByCollection("collection_synthetic");
  assert.equal(queries.length, 3);
  assert.equal(queries[0].handle, p.handle); assert.equal(queries[0].limit, 1);
  assert(queries[0].fields.split(",").includes("*variants.images"));
  const originalFields = "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata,+metadata";
  assert.equal(queries[1].fields, originalFields);
  assert.equal(queries[2].fields, originalFields);
  assert.deepEqual(queries[2].collection_id, ["collection_synthetic"]);
  for (const query of queries) assert.equal(query.region_id, "region_synthetic_mx");
});
