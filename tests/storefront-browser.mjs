import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const { chromium, devices } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
let offline = false;
let paymentRequests = 0;
let shippingRequests = 0;
let lastVariantId;
let comboFixtureMode = false;
const variant = { id: "variant_250", title: "250 ml", options: [], manage_inventory: true, inventory_quantity: 5, metadata: { storefront_price_approved: true }, calculated_price: { calculated_amount: 199, original_amount: 199, currency_code: "mxn" } };
const product = { id: "prod_test", title: "Tratamiento de prueba", handle: "tratamiento-prueba", subtitle: "Cuidado capilar", description: "Producto aislado para las pruebas del storefront.", thumbnail: "/images/products-hero/voglia-total-repair.webp", images: [], options: [], variants: [variant, { ...variant, id: "variant_500", title: "500 ml", metadata: {}, calculated_price: { calculated_amount: 299, currency_code: "mxn" } }], collection: { id: "col_voglia", title: "Voglia", handle: "voglia" } };
const products = [product,
  { ...product, id: "prod_unapproved", title: "Producto sin precio aprobado", handle: "sin-aprobacion", variants: [{ ...variant, id: "variant_unapproved", inventory_quantity: 0, metadata: {}, calculated_price: { calculated_amount: 987.65, currency_code: "mxn" } }] },
  { ...product, id: "prod_missing", title: "Producto sin fotografía", handle: "sin-foto", thumbnail: "/images/foto-que-no-existe.jpg", variants: [{ id: "variant_unknown", title: "Default Variant", metadata: {} }] },
];
// Isolated API fixtures only; never imported by the deployed storefront.
const suppliedCombos = [
  { identifier: "KIT-VOGLIA-8601-1036", tone: "1 Negro" },
  { identifier: "KIT-VOGLIA-8603-1036", tone: "3 Castaño Oscuro" },
  { identifier: "KIT-VOGLIA-8604-1036", tone: "4 Castaño Medio" },
];
const comboFixtures = suppliedCombos.map((asset, index) => ({ ...product, id: `test_combo_${index}`, title: `Combo Voglia ${asset.tone}`, handle: `test-combo-${index}`, thumbnail: null, variants: [{ id: `test_variant_${index}`, title: asset.tone, sku: asset.identifier, metadata: {}, manage_inventory: true, calculated_price: { calculated_amount: 97, currency_code: "mxn" } }] }));
comboFixtures.push({ ...product, id: "test_tube", title: "Tubo Voglia de prueba", handle: "test-tube", thumbnail: null, variants: [{ id: "test_tube_variant", title: "1 Negro", sku: "VOGLIA-TINTE-1-90ML", metadata: {}, calculated_price: { calculated_amount: 97, currency_code: "mxn" } }] });
// Include a legacy shipping method to prove it is never shown as an active rate.
const cart = { id: "cart_test", items: [], total: 0, subtotal: 0, item_subtotal: 0, item_total: 0, shipping_total: 149, shipping_subtotal: 149, shipping_methods: [{ id: "old_dhl", name: "DHL provisional" }] };
function recalculate() {
  cart.item_subtotal = cart.item_total = cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  cart.subtotal = cart.total = cart.item_total + 149;
}
const backend = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:9000");
  res.setHeader("Access-Control-Allow-Origin", baseUrl);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type,x-publishable-api-key,authorization,x-medusa-locale");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") { res.end(); return; }
  if (/payment|complete/.test(url.pathname)) paymentRequests++;
  if (/shipping-options|fulfillment|dhl/i.test(url.pathname)) shippingRequests++;
  if (offline) { res.statusCode = 503; res.end(JSON.stringify({ message: "Backend offline for test" })); return; }
  let result;
  if (url.pathname === "/store/regions") result = { regions: [{ id: "reg_mx", name: "México", currency_code: "mxn" }] };
  else if (url.pathname === "/store/products") {
    const handle = url.searchParams.get("handle");
    const source = comboFixtureMode ? comboFixtures : products;
    const selection = handle ? source.filter((item) => item.handle === handle) : source;
    result = { products: selection, count: selection.length, offset: 0, limit: 20 };
  } else if (url.pathname === "/store/product-categories") result = { product_categories: [{ id: "cat_color", name: "Coloración", handle: "color-y-tintes" }], count: 1 };
  else if (url.pathname === "/store/collections") result = { collections: [{ id: "col_voglia", title: "Voglia", handle: "voglia" }], count: 1 };
  else if (url.pathname.startsWith("/store/carts")) {
    if (req.method === "POST") {
      let body = ""; for await (const chunk of req) body += chunk;
      const data = body ? JSON.parse(body) : {};
      if (url.pathname === "/store/carts") cart.items = [];
      else if (url.pathname.endsWith("/line-items")) {
        lastVariantId = data.variant_id;
        cart.items = [{ id: "item_test", title: product.title, variant_title: "250 ml", variant_id: data.variant_id, quantity: data.quantity, unit_price: 199, thumbnail: product.thumbnail }];
      } else if (url.pathname.endsWith("/line-items/item_test")) cart.items[0].quantity = data.quantity;
      recalculate();
    }
    result = { cart };
  } else { res.statusCode = 404; result = { message: "Not found" }; }
  res.end(JSON.stringify(result));
});
await new Promise((resolve) => backend.listen(9000, "127.0.0.1", resolve));
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
let activePage;
const swFile = new URL("../public/sw.js", import.meta.url);
const realWorker = await readFile(swFile, "utf8");
// Original alpha bounds let us detect accidental clipping of a package or label.
async function verifyRetailPresentation(page) {
  assert.deepEqual(await page.locator("main section[aria-labelledby]").evaluateAll((sections) => sections.map((section) => section.getAttribute("aria-labelledby"))), ["retail-hero", "home-categories", "home-brands", "home-featured"]);
  const about = page.getByRole("link", { name: "Conoce SICARÚ", exact: true });
  assert.equal(await about.getAttribute("href"), "/nosotros#filosofia");
  const photoBounds = {
    "voglia-total-repair.webp": [438, 114, 754, 1286],
    "vitale-bifase-pro-keratin.webp": [461, 69, 728, 1328],
    "hidra-color-mask.webp": [339, 158, 867, 1315],
    "voglia-color-fun.webp": [443, 135, 751, 1285],
    "navaja-profesional.webp": [504, 111, 731, 1286],
  };
  for (const img of await page.locator('[aria-labelledby="retail-hero"] img, [aria-labelledby="home-categories"] img').all()) {
    if (!(await img.isVisible())) continue;
    const result = await img.evaluate((element, bounds) => {
      const src = new URL(element.currentSrc, location.href);
      const name = (src.searchParams.get("url") || src.pathname).split("/").pop();
      const box = element.getBoundingClientRect();
      const [left, top, right, bottom] = bounds[name];
      const scale = Math.max(box.width / 1200, box.height / 1400);
      const offsetX = (box.width - 1200 * scale) / 2;
      const offsetY = (box.height - 1400 * scale) / 2;
      return { name, intact: offsetX + left * scale >= -1 && offsetY + top * scale >= -1 && offsetX + right * scale <= box.width + 1 && offsetY + bottom * scale <= box.height + 1 };
    }, photoBounds);
    assert.ok(result.intact, `Package cropped: ${result.name}`);
  }
  const hero = page.locator('[aria-labelledby="retail-hero"]');
  assert.ok(await hero.getByRole("link", { name: "Explorar productos", exact: true }).isVisible());
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
}
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(baseUrl)).ok) break; } catch {}
    if (attempt === 59) throw new Error("Storefront did not start");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  for (const width of [320, 375, 390]) {
    offline = false;
    const context = await browser.newContext({ ...devices["iPhone 13"], viewport: { width, height: 844 }, deviceScaleFactor: 1 });
    const page = activePage = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Belleza profesional para ti y tu salón" }).waitFor();
    assert.equal(await page.getByText(/Catálogo informativo|Envíos online próximamente|Estamos preparando|El corazón de SICARÚ/).count(), 0);
    const search = page.getByRole("searchbox", { name: "Buscar tinte, tono, marca o producto", exact: true });
    assert.ok(await search.isVisible());
    assert.equal(await search.getAttribute("placeholder"), "Buscar tinte, tono, marca o producto...");
    await page.getByRole("button", { name: "Buscar", exact: true }).click();
    assert.ok(await search.evaluate((element) => element === document.activeElement));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    const cards = page.getByTestId("retail-product-card");
    assert.equal(await cards.count(), 3);
    const unapproved = cards.filter({ has: page.getByRole("heading", { name: "Producto sin precio aprobado", exact: true }) });
    assert.equal(await unapproved.getByTestId("retail-price").innerText(), "Consultar precio");
    assert.ok(await unapproved.getByRole("button", { name: "Agregar Producto sin precio aprobado", exact: true }).isDisabled());
    await cards.filter({ has: page.getByRole("heading", { name: "Producto sin fotografía", exact: true }) }).getByText("Imagen no disponible").waitFor();
    for (const image of await page.locator("main img").all()) { if (!(await image.isVisible())) continue; await image.scrollIntoViewIfNeeded(); await image.evaluate((element) => element.decode()); }
    await verifyRetailPresentation(page);
    await page.screenshot({ path: `artifacts/home-${width}.png`, fullPage: true });

    await search.fill("Voglia 500");
    await page.getByRole("button", { name: "Buscar productos", exact: true }).click();
    await page.waitForURL("**/productos?q=*");
    assert.equal(await page.getByTestId("retail-product-card").count(), 1);
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator('[aria-labelledby="home-categories"] a[href="/categorias/color-y-tintes"]').click();
    await page.waitForURL("**/categorias/color-y-tintes");
    await page.getByRole("heading", { name: "Coloración", exact: true }).waitFor();
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    assert.equal(await page.locator('[aria-labelledby="home-categories"] a').count(), 4);
    assert.equal(await page.locator('[aria-labelledby="home-brands"] a').count(), 7);
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.locator("header").getByRole("link", { name: "Conócenos", exact: true }).click();
    await page.getByRole("heading", { name: "Raíces mexicanas. Belleza sin moldes." }).waitFor();
    await page.goto(baseUrl, { waitUntil: "networkidle" });

    const current = page.getByTestId("retail-product-card").filter({ has: page.getByRole("heading", { name: "Tratamiento de prueba", exact: true }) });
    const select = current.getByRole("combobox", { name: "Variante de Tratamiento de prueba" });
    await select.selectOption("variant_250");
    assert.match(await current.getByTestId("retail-price").innerText(), /199/);
    await select.selectOption("variant_500");
    assert.equal(await current.getByTestId("retail-price").innerText(), "Consultar precio");
    await select.selectOption("variant_250");
    await current.getByRole("button", { name: "Agregar Tratamiento de prueba", exact: true }).click();
    await page.getByRole("heading", { name: "Tu Carrito (1)" }).waitFor();
    assert.equal(lastVariantId, "variant_250");
    await page.getByRole("button", { name: "Cerrar carrito" }).click();
    await page.goto(`${baseUrl}/carrito`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Aumentar cantidad de Tratamiento de prueba", exact: true }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Productos (2)"));
    assert.equal(cart.items[0].quantity, 2);
    await page.getByRole("button", { name: "Reducir cantidad de Tratamiento de prueba", exact: true }).click();
    await page.waitForFunction(() => document.body.innerText.includes("Productos (1)"));
    assert.equal(cart.items[0].quantity, 1);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    assert.equal(await page.getByText(/Gratis|DHL|149[.,]00/).count(), 0);
    await page.getByRole("link", { name: "Continuar al envío" }).click();
    await page.getByRole("heading", { name: "Envíos online próximamente" }).waitFor();
    assert.equal(await page.locator('a[href^="https://wa.me/528281136652"]').count(), 1);
    assert.equal(await page.locator('input[name="cardNumber"], iframe').count(), 0);
    assert.equal(paymentRequests, 0);
    assert.equal(shippingRequests, 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: `artifacts/shipping-${width}.png`, fullPage: true });
    await page.goto(`${baseUrl}/envios`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Envíos online próximamente" }).waitFor();

    if (width === 390) {
      await page.goto(baseUrl, { waitUntil: "networkidle" });
      const cartBefore = await page.evaluate(() => localStorage.getItem("sicaru_cart_id"));
      await page.evaluate(async () => {
        const cache = await caches.open("legacy-storefront");
        await cache.put("/old-page", new Response("OLD SICARU"));
        sessionStorage.setItem("sicaru-cache-reset-2026-06-29", "done");
        sessionStorage.setItem("sicaru-retail-cache-2026-10-23", "done");
        sessionStorage.removeItem("sicaru-retail-refinement-2026-10-23");
      });
      await page.reload({ waitUntil: "networkidle" });
      assert.equal(await page.evaluate(async () => (await caches.keys()).includes("legacy-storefront")), false);
      assert.equal(await page.evaluate(() => localStorage.getItem("sicaru_cart_id")), cartBefore);

      // Simulate an installed app controlled by an old worker, then serve the real upgrade.
      await writeFile(swFile, `self.addEventListener("install",()=>self.skipWaiting());self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));self.addEventListener("fetch",e=>{if(e.request.mode==="navigate")e.respondWith(Promise.resolve(new Response("<html><body>OLD SICARU INSTALLED APP</body></html>",{headers:{"Content-Type":"text/html"}})));});`);
      await page.evaluate(async () => {
        await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) await new Promise((resolve) => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true }));
      });
      await page.goto(`${baseUrl}/?legacy=1`, { waitUntil: "networkidle" });
      await page.getByText("OLD SICARU INSTALLED APP").waitFor();
      await writeFile(swFile, realWorker);
      await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
      await page.getByRole("heading", { name: "Belleza profesional para ti y tu salón" }).waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem("sicaru_cart_id")), cartBefore);
      assert.equal(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length), 0);
      await page.screenshot({ path: "artifacts/installed-app-updated-390.png", fullPage: true });
      console.log("PASS: installed app evicts stale worker/cache and preserves cart.");
    }

    offline = true;
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.getByTestId("featured-recovery").waitFor();
    assert.equal(await page.getByTestId("retail-product-card").count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: `artifacts/offline-${width}.png`, fullPage: true });
    if (width === 390) for (const path of ["/productos/backend-offline", "/categorias/backend-offline", "/marcas/backend-offline"]) {
      await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: /No pudimos cargar este producto|Esta selección no está disponible/ }).waitFor();
      assert.equal(await page.getByText(/Application error|server-side exception|Backend offline for test/).count(), 0);
    }
    assert.deepEqual(pageErrors, []);
    await context.close();
    console.log(`PASS: ${width}px search, categories, brand links, images, approved prices, variants, cart quantities, shipping guard, recovery and no horizontal overflow.`);
  }
  offline = false;
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const desktopPage = activePage = await desktop.newPage();
  await desktopPage.goto(baseUrl, { waitUntil: "networkidle" });
  for (const image of await desktopPage.locator("main img").all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate((element) => element.decode()); }
  await verifyRetailPresentation(desktopPage);
  await desktopPage.screenshot({ path: "artifacts/home-desktop-1440.png", fullPage: true });
  await desktop.close();
  console.log("PASS: retail section order, original packages intact and desktop presentation at 1440px.");
  comboFixtureMode = true;
  for (const width of [320, 375, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
    const page = activePage = await context.newPage();
    await page.goto(`${baseUrl}/productos?lote1=${width}`, { waitUntil: "networkidle" });
    for (const [index, asset] of suppliedCombos.entries()) {
      const card = page.getByTestId("retail-product-card").filter({ has: page.getByRole("heading", { name: `Combo Voglia ${asset.tone}`, exact: true }) });
      assert.match(await card.getByTestId("retail-price").innerText(), /97/);
      assert.ok(await card.getByRole("button", { name: `Agregar Combo Voglia ${asset.tone}`, exact: true }).isDisabled());
      const image = card.locator("img");
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
      assert.ok((await image.getAttribute("src")).includes(asset.identifier));
      assert.equal(await image.evaluate((element) => getComputedStyle(element).objectFit), "contain");
      await page.goto(`${baseUrl}/productos/test-combo-${index}`, { waitUntil: "networkidle" });
      const galleryImage = page.getByRole("img", { name: `Combo Voglia tono ${asset.tone}: tinte 90 ml y peróxido 20V 140 ml`, exact: true }).first();
      await galleryImage.evaluate((element) => element.decode());
      assert.ok((await galleryImage.getAttribute("src")).includes(asset.identifier));
      assert.equal(await galleryImage.evaluate((element) => getComputedStyle(element).objectFit), "contain");
      assert.ok(await page.getByRole("button", { name: "Consultar disponibilidad", exact: true }).isDisabled());
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
      await page.screenshot({ path: `artifacts/voglia-${asset.identifier}-${width}.png`, fullPage: true });
      await page.goto(`${baseUrl}/productos?lote1=${width}`, { waitUntil: "networkidle" });
    }
    const tube = page.getByTestId("retail-product-card").filter({ has: page.getByRole("heading", { name: "Tubo Voglia de prueba", exact: true }) });
    assert.equal(await tube.getByTestId("retail-price").innerText(), "Consultar precio");
    assert.equal(await tube.locator('img[src*="KIT-VOGLIA"]').count(), 0);
    await page.goto(`${baseUrl}/revision/voglia-lote1`, { waitUntil: "networkidle" });
    assert.equal(await page.getByTestId("photo-review-card").count(), 3);
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
      assert.equal(await image.evaluate((element) => getComputedStyle(element).objectFit), "contain");
      // Responsive srcset density correction can round natural dimensions by 1px.
      const dimensions = await image.evaluate((element) => [element.naturalWidth, element.naturalHeight]);
      assert.ok(Math.abs(dimensions[1] - dimensions[0] * 3 / 4) <= 1);
    }
    assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, nofollow");
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: `artifacts/voglia-photo-review-${width}.png`, fullPage: true });
    await context.close();
    console.log(`PASS: Voglia ${width}px exact combo images, complete photos in cards/details, 97 MXN only for combos, no invented stock and preview review.`);
  }
  assert.equal(paymentRequests, 0);
  assert.equal(shippingRequests, 0);
} catch (error) {
  await activePage?.screenshot({ path: "artifacts/failure-mobile.png", fullPage: true }).catch(() => {});
  throw error;
} finally {
  await writeFile(swFile, realWorker);
  await browser.close();
  await new Promise((resolve) => backend.close(resolve));
}
