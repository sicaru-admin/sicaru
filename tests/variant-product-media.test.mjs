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
const image = (id, rank, variantIds = []) => ({ id, url: `https://example.invalid/variant-media/${id}.png`, variants: variantIds.map((id) => ({ id })), ...(rank == null ? {} : { rank }) });

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
  const general = image("general", 0);
  const a1 = image("a-front", 0, ["a"]), a2 = image("a-detail", 1, ["a"]), b1 = image("b-front", 0, ["b"]);
  return {
    id: "product_media_synthetic", title: "Producto sintético con variantes", handle: "producto-sintetico-media",
    images: [general, a1, a2, b1], thumbnail: general.url,
    options: [{ id: "tone", title: "Tono", values: ["a", "b", "c"].map((id) => ({ value: `Opción sintética ${id}` })) }],
    // Medusa 2.13.1 returns generals + applicable specifics in variant.images.
    variants: [variant("a", [general, a1, a2]), variant("b", [general, b1]), variant("c", [general])],
  };
}
const media = (p, id) => loader()("@/lib/product-media").getProductMedia(p, id);
const urls = (result) => result.images.map((item) => item.url);

test("no product images means placeholder, even with standalone thumbnails or derived variant arrays", () => {
  const p = product(); p.images = [];
  for (const id of [undefined, "a", "c", "foreign"]) {
    assert.deepEqual(media(p, id).images, []);
    assert.equal(media(p, id).variantTitle, null);
  }
});

test("explicitly unassociated general images remain visible before and after every selection", () => {
  const p = product(); p.images = [image("general-one", 1), image("general-two", 2)];
  for (const id of [undefined, "a", "b", "c"]) {
    assert.deepEqual(urls(media(p, id)), p.images.map((item) => item.url));
  }
});

test("no selection or foreign variant shows only proven generals despite merged variant.images", () => {
  const p = product();
  for (const id of [undefined, null, "", "foreign"]) {
    assert.deepEqual(urls(media(p, id)), [image("general").url]);
    assert.equal(media(p, id).variantTitle, null);
  }
});

test("A and B show generals first plus their explicit specifics with no cross-contamination", () => {
  const p = product(); const before = JSON.stringify(p);
  assert.deepEqual(urls(media(p, "a")), [image("general").url, image("a-front").url, image("a-detail").url]);
  assert.deepEqual(urls(media(p, "b")), [image("general").url, image("b-front").url]);
  assert.equal(media(p, "a").variantTitle, p.variants[0].title);
  assert.equal(media(p, "b").variantTitle, p.variants[1].title);
  assert.equal(JSON.stringify(p), before);
});

test("a variant without specifics retains generals, otherwise placeholder without another tone's thumbnail", () => {
  const p = product();
  assert.deepEqual(urls(media(p, "c")), [image("general").url]);
  p.images = p.images.filter((item) => item.id !== "general"); p.thumbnail = image("a-front").url;
  assert.deepEqual(media(p, "c").images, []);
  assert.deepEqual(media(p).images, []);
  assert.deepEqual(urls(media(p, "a")), [image("a-front").url, image("a-detail").url]);
});

test("a native image linked to A+B is shown for both but never as general or for C", () => {
  const p = product(); const shared = image("shared-ab", 2, ["a", "b"]);
  p.images.push(shared);
  p.variants[0].images.push(shared); p.variants[1].images.push(shared);
  assert.deepEqual(urls(media(p)), [image("general").url]);
  assert.deepEqual(urls(media(p, "a")), [image("general").url, image("a-front").url, image("a-detail").url, shared.url]);
  assert.deepEqual(urls(media(p, "b")), [image("general").url, image("b-front").url, shared.url]);
  assert.deepEqual(urls(media(p, "c")), [image("general").url]);
});

test("an image explicitly linked to every variant is still specific before selection", () => {
  const p = product(); const shared = image("shared-all", 0, ["a", "b", "c"]);
  p.images = [shared]; p.thumbnail = shared.url;
  p.variants.forEach((v) => { v.images = [shared]; });
  assert.deepEqual(media(p).images, []);
  for (const v of p.variants) assert.deepEqual(urls(media(p, v.id)), [shared.url]);
});

test("missing, null or malformed explicit links are unknown, never equivalent to variants: []", () => {
  const p = product();
  const missing = image("missing"); delete missing.variants;
  p.images = [missing, { ...image("null"), variants: null }, { ...image("bad"), variants: [{}] },
    { ...image("blank"), variants: [{ id: "" }] }, { ...image("wrong-shape"), variants: ["a"] }];
  for (const id of [undefined, "a", "b", "c"]) assert.deepEqual(media(p, id).images, []);
  p.images.push(image("proven-general"));
  assert.deepEqual(urls(media(p)), [image("proven-general").url]);
});

test("an association outside the returned variant set does not become general", () => {
  const p = product(); p.images = [image("foreign-linked", 0, ["not-returned"])];
  assert.deepEqual(media(p).images, []);
  for (const id of ["a", "b", "c", "not-returned"]) assert.deepEqual(media(p, id).images, []);
});

test("ordering is generals by rank then applicable specifics by rank, stable and deduplicated by ID", () => {
  const p = product();
  const firstSpecific = image("specific-zero", 0, ["a"]);
  p.images = [image("general-two", 2), image("specific-two", 2, ["a"]), image("general-one", 1),
    firstSpecific, image("specific-one", 1, ["a"]), { ...firstSpecific }];
  p.variants[0].thumbnail = image("specific-two").url;
  assert.deepEqual(urls(media(p, "a")), ["general-one", "general-two", "specific-zero", "specific-one", "specific-two"].map((id) => image(id).url));
});

test("association membership uses IDs, not URL equality or derived variant arrays", () => {
  const p = product();
  const a = image("a-link", 0, ["a"]), b = { ...image("b-link", 0, ["b"]), url: a.url };
  p.images = [a, b]; p.thumbnail = a.url;
  p.variants.forEach((v) => { v.images = [a, b]; v.thumbnail = a.url; });
  assert.deepEqual(media(p).images, []);
  assert.deepEqual(media(p, "a").images.map((i) => i.id), [a.id]);
  assert.deepEqual(media(p, "b").images.map((i) => i.id), [b.id]);
  assert.deepEqual(media(p, "c").images, []);
});

test("conflicting duplicate IDs are withheld instead of trusting an earlier general row", () => {
  const p = product(); const general = image("conflicting");
  p.images = [general, { ...general, variants: [{ id: "a" }] }, image("safe-general")];
  for (const id of [undefined, "a", "b"]) assert.deepEqual(urls(media(p, id)), [image("safe-general").url]);
});

test("layout reservation remains stable across general, A, B and no-specific selections", () => {
  const p = product();
  const results = [undefined, "a", "b", "c"].map((id) => media(p, id));
  assert(results.every((r) => r.reserveImageSpace === true));
  assert(results.every((r) => r.reserveThumbnails === true));
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
    assert.equal(findAll(tree, (n) => n.type === "p" && n.props.children === v.title).length, 0);
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

test("standalone product and variant thumbnails cannot override proven gallery membership", async () => {
  const p = product();
  p.images = p.images.filter((i) => i.id !== "general");
  p.thumbnail = image("a-front").url;
  p.variants[1].thumbnail = image("a-front").url;
  const ui = experienceHarness(p);
  let tree = ui.render();
  find(tree, (n) => typeof n.props.onSelect === "function").props.onSelect("tone", p.variants[1].title);
  tree = ui.render();
  assert.deepEqual(find(tree, (n) => n.type === ui.Gallery).props.images.map((i) => i.url), [image("b-front").url]);
  await find(tree, (n) => n.type === "button" && n.props.onClick).props.onClick();
  assert.equal(ui.calls[0][0].thumbnail, image("b-front").url);
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

test("only detail expands explicit image-to-variant IDs; list and collection fields are unchanged", async () => {
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
  assert(queries[0].fields.split(",").includes("+images.variants.id"));
  assert(!queries[0].fields.split(",").includes("*variants.images"));
  const originalFields = "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata,+metadata";
  assert.equal(queries[1].fields, originalFields);
  assert.equal(queries[2].fields, originalFields);
  assert.deepEqual(queries[2].collection_id, ["collection_synthetic"]);
  for (const query of queries) assert.equal(query.region_id, "region_synthetic_mx");
});

test("the exact variant title is visible when there is no selector, without changing the inquiry", () => {
  const p = product();
  p.variants = [{ ...p.variants[0], title: "42", options: [{ option_id: "tone", value: "42" }] }];
  p.options[0].values = [{ value: "42" }];
  const tree = experienceHarness(p).render();
  assert.equal(findAll(tree, (n) => n.type === "p" && n.props.children === "Tono 42").length, 1);
  const inquiry = find(tree, (n) => n.type === "a" && n.props.href?.startsWith("https://wa.me/"));
  assert.match(new URL(inquiry.props.href).searchParams.get("text"), /Variante: 42.*SKU: SYNTHETIC-a/s);

  p.variants[0].title = "Tono 42";
  assert.equal(findAll(experienceHarness(p).render(), (n) => n.type === "p" && n.props.children === "Tono 42").length, 1);
  p.variants[0].title = "Default variant";
  assert.equal(findAll(experienceHarness(p).render(), (n) => n.type === "p" && n.props.children === "Default variant").length, 0);
});

test("the Next optimizer accepts only staging static media in the variant QA Preview", () => {
  const source = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const { hasRemoteMatch } = require("next/dist/shared/lib/match-remote-pattern");
  const origin = "https://sicaru-backend-staging-voglia.up.railway.app";
  const preview = {
    VERCEL_ENV: "preview",
    VERCEL_GIT_COMMIT_REF: "codex/variant-product-photos",
    NEXT_PUBLIC_MEDUSA_BACKEND_URL: origin,
  };
  const allows = (env, url) => {
    const exports = {};
    vm.runInNewContext(compiled, { exports, require, URL, process: { env } });
    return hasRemoteMatch([], exports.default.images.remotePatterns, new URL(url));
  };
  const photo = `${origin}/static/approved-photo.webp`;

  assert.equal(allows(preview, photo), true);
  assert.equal(allows(preview, `${origin}/store/products`), false);
  assert.equal(allows(preview, photo.replace("https:", "http:")), false);
  assert.equal(allows(preview, "https://other-staging.up.railway.app/static/photo.webp"), false);
  assert.equal(allows({ ...preview, VERCEL_ENV: "production" }, photo), false);
  assert.equal(allows({ ...preview, VERCEL_GIT_COMMIT_REF: "codex/other-preview" }, photo), false);
  assert.equal(allows({ ...preview, NEXT_PUBLIC_MEDUSA_BACKEND_URL: "https://api.distribuidorasicaru.com" }, photo), false);
});
