import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const { NextRequest } = require("next/server");
const source = readFileSync(new URL("../src/proxy.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const origin = "https://preview.example.invalid";
const legacy = "kuul-color-system-cream-3oz";
const replacement = "kuul-color-system-90ml";
const absent = { count: 0, products: [] };
const present = (handle) => ({ count: 1, products: [{ id: "prod_fixture", handle }] });

function harness(responses) {
  const exports = {};
  const calls = [];
  vm.runInNewContext(compiled, {
    require, exports, URL, URLSearchParams, AbortSignal,
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
    request: (method = "GET") => exports.proxy(new NextRequest(`${origin}/productos/${legacy}`, { method })),
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
