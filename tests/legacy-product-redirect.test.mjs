import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const { NextRequest } = require("next/server");
const compile = (path) => ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const compiled = compile("../src/proxy.ts");
const constants = { exports: {} };
vm.runInNewContext(compile("../src/lib/kuul-cure-me.ts"), { exports: constants.exports });
const { CURE_ME } = constants.exports;
const origin = "https://preview.example.invalid";
const legacy = "kuul-color-system-cream-3oz";
const replacement = "kuul-color-system-90ml";
const absent = { count: 0, products: [] };
const present = (handle, id = "prod_fixture") => ({ count: 1, products: [{ id, handle }] });

function harness(responses) {
  const exports = {};
  const calls = [];
  vm.runInNewContext(compiled, {
    require: (name) => name === "./lib/kuul-cure-me" ? constants.exports : require(name),
    exports, URL, URLSearchParams, AbortSignal,
    process: { env: {
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: "https://store.example.invalid",
      NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: "pk_fixture",
    } },
    async fetch(url, init) {
      assert.equal(url.origin + url.pathname, "https://store.example.invalid/store/products");
      assert.equal(url.searchParams.get("limit"), "1");
      assert.equal(init.headers["x-publishable-api-key"], "pk_fixture");
      assert.equal(init.cache, "no-store");
      const handle = url.searchParams.get("handle");
      calls.push(handle);
      const payload = responses[handle];
      if (payload instanceof Error) throw payload;
      return Response.json(payload ?? absent, { status: payload === undefined ? 503 : 200 });
    },
  });
  return {
    calls,
    request: (method = "GET", handle = legacy, query = "") =>
      exports.proxy(new NextRequest(`${origin}/productos/${handle}${query}`, { method })),
  };
}

test("legacy remains accessible before cutover, during coexistence and after rollback", async () => {
  for (const newState of [absent, present(replacement)]) {
    const qa = harness({ [legacy]: present(legacy), [replacement]: newState });
    const response = await qa.request();
    assert.equal(response.headers.get("x-middleware-next"), "1");
    assert.equal(response.headers.get("location"), null);
    assert.deepEqual(qa.calls, [legacy]);
  }
});

test("only confirmed replacement yields a real, uncached 308 for GET and HEAD", async () => {
  for (const method of ["GET", "HEAD"]) {
    const qa = harness({ [legacy]: absent, [replacement]: present(replacement) });
    const response = await qa.request(method);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `${origin}/productos/${replacement}`);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.deepEqual(qa.calls, [legacy, replacement]);
  }
});

test("no redirect for missing target, uncertain data, outages or non-read requests", async () => {
  for (const responses of [
    { [legacy]: absent, [replacement]: absent },
    { [legacy]: absent, [replacement]: present("different-product") },
    { [legacy]: absent },
    { [legacy]: { count: 0 }, [replacement]: present(replacement) },
    { [legacy]: new Error("network unavailable"), [replacement]: present(replacement) },
  ]) {
    const response = await harness(responses).request();
    assert.equal(response.headers.get("x-middleware-next"), "1");
  }
  const qa = harness({ [legacy]: absent, [replacement]: present(replacement) });
  assert.equal((await qa.request("POST")).headers.get("x-middleware-next"), "1");
  assert.deepEqual(qa.calls, []);
});


test("Cure Me issues a single 308 only for the exact public product and preserves the query", async () => {
  const { legacyHandle, handle, productId } = CURE_ME;
  for (const method of ["GET", "HEAD"]) {
    const qa = harness({ [legacyHandle]: absent, [handle]: present(handle, productId) });
    const query = "?utm_source=cat%C3%A1logo&a=1&a=2";
    const response = await qa.request(method, legacyHandle, query);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `${origin}/productos/${handle}${query}`);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.deepEqual(qa.calls, [legacyHandle, handle]);
  }
});

test("Cure Me leaves the old route alone before cutover, during coexistence and after rollback", async () => {
  const { legacyHandle, handle, productId } = CURE_ME;
  for (const target of [absent, present(handle, productId)]) {
    const qa = harness({ [legacyHandle]: present(legacyHandle, productId), [handle]: target });
    const response = await qa.request("GET", legacyHandle);
    assert.equal(response.headers.get("x-middleware-next"), "1");
    assert.equal(response.headers.get("location"), null);
    assert.deepEqual(qa.calls, [legacyHandle]);
  }
});

test("Cure Me fails closed on a wrong ID, a mismatched handle, ambiguous counts or Store API errors", async () => {
  const { legacyHandle, handle, productId } = CURE_ME;
  for (const [from, to] of [
    [absent, present(handle, "other_product")],
    [absent, present(legacyHandle, productId)],
    [absent, { count: 1, products: [{ handle }] }],
    [absent, { count: 2, products: [{ id: productId, handle }] }],
    [absent, new Error("Store API unavailable")],
    [absent, undefined],
    [{ count: 0, products: [{}] }, present(handle, productId)],
    [new Error("Store API unavailable"), present(handle, productId)],
  ]) {
    const qa = harness({ [legacyHandle]: from, [handle]: to });
    const response = await qa.request("GET", legacyHandle);
    assert.equal(response.headers.get("location"), null);
  }

  const qa = harness({ [legacyHandle]: absent, [handle]: present(handle, productId) });
  await qa.request("POST", legacyHandle);
  await qa.request("GET", handle);
  await qa.request("GET", "another-product");
  assert.deepEqual(qa.calls, []);
});

test("Color System keeps its existing status, destination and query handling", async () => {
  const qa = harness({ [legacy]: absent, [replacement]: { count: 1, products: [{ handle: replacement }] } });
  const response = await qa.request("GET", legacy, "?utm_source=cat");
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), `${origin}/productos/${replacement}`);
  assert.match(response.headers.get("cache-control"), /no-store/);
});

test("the delivery branch disables automatic deployments only for this PR", () => {
  const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.deepEqual(vercel.git, { deploymentEnabled: { "codex/kuul-reconstructor-1kg-url": false } });
});
