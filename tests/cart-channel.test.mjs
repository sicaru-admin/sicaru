import assert from "node:assert/strict";
import { test } from "node:test";
import { alignCartSalesChannel } from "../src/lib/cart-channel.ts";

test("an old-channel saved cart is reconciled in place with its variants and quantities intact", async () => {
  const original = { id: "cart_saved", sales_channel_id: "old", items: [{ variant_id: "tinte_6_1", quantity: 2 }, { variant_id: "tinte_7_0", quantity: 1 }] };
  const calls = [];
  const restored = await alignCartSalesChannel(original, "current", async (id, channel) => {
    calls.push({ id, channel }); return { ...original, sales_channel_id: channel };
  });
  assert.deepEqual(calls, [{ id: "cart_saved", channel: "current" }]);
  assert.equal(restored.id, original.id);
  assert.deepEqual(restored.items, original.items);
});

test("a failed server reconciliation rejects instead of using the stale channel", async () => {
  const saved = { id: "cart_saved", sales_channel_id: "old" };
  await assert.rejects(alignCartSalesChannel(saved, "current", async () => { throw new Error("unavailable"); }), /unavailable/);
  assert.equal(saved.sales_channel_id, "old");
});

test("wrong-channel and replacement-cart responses are rejected", async () => {
  const saved = { id: "cart_saved", sales_channel_id: "old" };
  await assert.rejects(alignCartSalesChannel(saved, "current", async () => saved));
  await assert.rejects(alignCartSalesChannel(saved, "current", async () => ({ id: "different", sales_channel_id: "current" })));
});

test("current-channel and completed carts are left intact; an absent channel does not invent one", async () => {
  for (const [cart, configured] of [
    [{ id: "cart", sales_channel_id: "current" }, "current"],
    [{ id: "done", sales_channel_id: "old", completed_at: "2026-10-17" }, "current"],
    [{ id: "cart", sales_channel_id: "old" }, undefined]
  ]) {
    assert.equal(await alignCartSalesChannel(cart, configured, async () => { assert.fail("must not update"); }), cart);
  }
});
