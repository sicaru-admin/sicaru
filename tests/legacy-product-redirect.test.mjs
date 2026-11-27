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
const cureMeLegacy = "kuul-cure-me-reconstructor-1l";
const cureMeReplacement = "kuul-cure-me-reconstructor-1kg";
const cureMeId = "prod_01KVV3GD5ZFG0NT90YWFXRPZFK";
const absent = { count: 0, products: [] };
const present = (handle, id = "prod_fixture") => ({ count: 1, products: [{ id, handle }] });

function harness(responses) {
  const exports = {};
  const calls = [];
  vm.runInNewContext(compiled, {
    require: (id) => id === "./lib/kuul-cure-me" ? require("../src/lib/kuul-cure-me.ts") : require(id),
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
    request: (method = "GET", handle = legacy) => exports.proxy(new NextRequest(`${origin}/productos/${handle}`, { method })),
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

test("Cure Me keeps its old URL until the existing product is public on the new handle", async () => {
  const coexist = harness({
    [cureMeLegacy]: present(cureMeLegacy, cureMeId), [cureMeReplacement]: present(cureMeReplacement, cureMeId),
  });
  assert.equal((await coexist.request("GET", cureMeLegacy)).headers.get("location"), null);
  assert.deepEqual(coexist.calls, [cureMeLegacy]);

  for (const destination of [absent, present(cureMeReplacement, "prod_distinct"), new Error("timeout")]) {
    const qa = harness({ [cureMeLegacy]: absent, [cureMeReplacement]: destination });
    assert.equal((await qa.request("GET", cureMeLegacy)).headers.get("location"), null);
  }
  const cutover = harness({ [cureMeLegacy]: absent, [cureMeReplacement]: present(cureMeReplacement, cureMeId) });
  for (const method of ["GET", "HEAD"]) {
    const response = await cutover.request(method, `${cureMeLegacy}?utm_source=prueba`);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `${origin}/productos/${cureMeReplacement}?utm_source=prueba`);
    assert.match(response.headers.get("cache-control"), /no-store/);
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
