import assert from "node:assert/strict";
import { createServer } from "node:http";
import { mkdir } from "node:fs/promises";
import { chromium, devices } from "playwright";

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
let offline = false;
const variant = { id: "variant_test", title: "Default Variant", options: [], manage_inventory: false, calculated_price: { calculated_amount: 199, original_amount: 199, currency_code: "mxn" } };
const product = { id: "prod_test", title: "Tratamiento de prueba", handle: "tratamiento-prueba", description: "Producto de prueba para verificar el recorrido.", thumbnail: "/images/products-hero/voglia-total-repair.webp", images: [], options: [], variants: [variant], collection: null };
const cart = { id: "cart_test", items: [], total: 0, subtotal: 0, item_total: 0, shipping_methods: [] };
let paymentRequests = 0;
const backend = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:9000");
  res.setHeader("Access-Control-Allow-Origin", baseUrl);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "content-type,x-publishable-api-key,authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Content-Type", "application/json");
  if (req.method === "OPTIONS") { res.end(); return; }
  if (/payment|complete/.test(url.pathname)) paymentRequests++;
  if (offline) { res.statusCode = 503; res.end(JSON.stringify({ message: "Backend offline for test" })); return; }
  let result;
  if (url.pathname === "/store/regions") result = { regions: [{ id: "reg_mx", name: "México", currency_code: "mxn" }] };
  else if (url.pathname === "/store/products") {
    const handle = url.searchParams.get("handle");
    result = { products: !handle || handle === product.handle ? [product] : [], count: 1, offset: 0, limit: 20 };
  } else if (url.pathname === "/store/product-categories") result = { product_categories: [{ id: "cat_color", name: "Coloración", handle: "color-y-tintes" }], count: 1 };
  else if (url.pathname === "/store/collections") result = { collections: [{ id: "col_voglia", title: "Voglia", handle: "voglia" }], count: 1 };
  else if (url.pathname.startsWith("/store/carts")) {
    if (req.method === "POST" && url.pathname.endsWith("/line-items")) {
      let body = "";
      for await (const chunk of req) body += chunk;
      const data = JSON.parse(body);
      cart.items = [{ id: "item_test", title: product.title, variant_id: variant.id, quantity: data.quantity, unit_price: 199, thumbnail: product.thumbnail }];
      cart.total = cart.subtotal = cart.item_total = 199 * data.quantity;
    }
    result = { cart };
  } else { res.statusCode = 404; result = { message: "Not found" }; }
  res.end(JSON.stringify(result));
});
await new Promise((resolve) => backend.listen(9000, "127.0.0.1", resolve));
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ ...devices["iPhone 13"] });
const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { const response = await fetch(baseUrl); if (response.ok) break; } catch {}
    if (attempt === 59) throw new Error("Storefront did not start");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Belleza profesional, cercana y real." }).waitFor();
  assert.equal(await page.getByText(/Catálogo informativo|Envíos próximamente|Estamos preparando/).count(), 0);
  assert.equal(await page.locator("header").getByRole("button", { name: "Abrir carrito" }).count(), 1);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.decode());
  }
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.getByRole("link", { name: "Productos", exact: true }).last().click();
  await page.waitForURL("**/productos");
  await page.getByRole("heading", { name: "Encuentra tu próximo favorito" }).waitFor();
  assert.equal(await page.getByText(/Catálogo informativo|Estamos preparando/).count(), 0);
  await page.goto(`${baseUrl}/productos/tratamiento-prueba`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Agregar al Carrito" }).click();
  await page.getByRole("heading", { name: "Tu Carrito (1)" }).waitFor();
  await page.getByRole("button", { name: "Cerrar carrito" }).click();
  await page.goto(`${baseUrl}/carrito`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Continuar al envío" }).click();
  await page.getByRole("heading", { name: "Envíos próximamente" }).waitFor();
  assert.equal(await page.locator('a[href^="https://wa.me/528281136652"]').count(), 1);
  assert.equal(await page.locator('input[name="cardNumber"], iframe').count(), 0);
  assert.equal(paymentRequests, 0);
  await page.screenshot({ path: "artifacts/shipping-mobile.png", fullPage: true });
  await page.goto(`${baseUrl}/envios`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Envíos próximamente" }).waitFor();
  offline = true;
  for (const path of ["/productos/backend-offline", "/categorias/backend-offline", "/marcas/backend-offline"]) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: /No pudimos cargar este producto|Esta selección no está disponible/ }).waitFor();
    assert.equal(await page.getByText(/Application error|server-side exception|Backend offline for test/).count(), 0);
  }
  await page.screenshot({ path: "artifacts/catalog-fallback-mobile.png", fullPage: true });
  for (const path of ["/", "/productos", "/carrito"]) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    assert.equal(await page.getByText(/Application error|server-side exception/).count(), 0);
  }
  assert.deepEqual(pageErrors, []);
  assert.equal(paymentRequests, 0);
  console.log("PASS: mobile home, images, menu, products, add to cart, shipping guard, WhatsApp and backend outage fallbacks; no payments or browser errors.");
} finally {
  await browser.close();
  await new Promise((resolve) => backend.close(resolve));
}
