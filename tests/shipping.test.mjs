import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { registerHooks } from "node:module";
import {
  getLocalDeliveryWhatsAppUrl,
  getDhlWhatsAppUrl,
  getParcelShippingOptions,
  getShippingOptionPrice,
  hasParcelShippingMethod,
} from "../src/lib/shipping.ts";

const originalIds = process.env.NEXT_PUBLIC_PARCEL_SHIPPING_OPTION_IDS;
let availableOptions;
let approvedQuote;
let quoteFails;
let currentCart;
let shippingWrites;
let paymentWrites;
let orderWrites;
let paymentCart;

// Resolve the real checkout module's SDK import to an in-memory Medusa boundary.
const sdkKey = Symbol.for("sicaru.shipping.tests.sdk");
globalThis[sdkKey] = {
  client: {
    fetch: async () => {
      if (quoteFails) throw new Error("Verification unavailable");
      return { quote: approvedQuote, shipping_options: availableOptions };
    },
  },
  store: {
    cart: {
      retrieve: async () => ({ cart: currentCart }),
      addShippingMethod: async (_id, { option_id }) => {
        shippingWrites++;
        currentCart = {
          ...currentCart,
          shipping_methods: [{ shipping_option_id: option_id, amount: 214, is_tax_inclusive: true }],
        };
        return { cart: currentCart };
      },
      complete: async () => {
        orderWrites++;
        return { type: "order" };
      },
    },
    fulfillment: {
      listCartOptions: async () => ({ shipping_options: availableOptions }),
    },
    payment: {
      initiatePaymentSession: async (cart) => {
        paymentWrites++;
        paymentCart = cart;
        return { payment_collection: { id: "test_payment_collection" } };
      },
    },
  },
};

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/medusa") {
      return {
        url: "data:text/javascript,export const sdk = globalThis[Symbol.for('sicaru.shipping.tests.sdk')];",
        shortCircuit: true,
      };
    }
    if (specifier === "@/lib/shipping") {
      return {
        url: new URL("../src/lib/shipping.ts", import.meta.url).href,
        shortCircuit: true,
      };
    }
    return nextResolve(specifier, context);
  },
});
const checkout = await import("../src/lib/data/checkout.ts");
hooks.deregister();

beforeEach(() => {
  process.env.NEXT_PUBLIC_PARCEL_SHIPPING_OPTION_IDS = " courier_standard ";
  availableOptions = [
    { id: "local_cadereyta", name: "Envío Cadereyta", amount: 49 },
    { id: "courier_standard", name: "DHL", amount: 214 },
  ];
  currentCart = {
    id: "cart_test",
    total: 514,
    shipping_total: 214,
    shipping_methods: [{ shipping_option_id: "courier_standard", amount: 214, is_tax_inclusive: true }],
  };
  approvedQuote = {
    status: "available", shipping_option_id: "courier_standard",
    amount: 214, currency_code: "mxn",
  };
  quoteFails = false;
  shippingWrites = paymentWrites = orderWrites = 0;
  paymentCart = null;
});

after(() => {
  if (originalIds === undefined) {
    delete process.env.NEXT_PUBLIC_PARCEL_SHIPPING_OPTION_IDS;
  } else {
    process.env.NEXT_PUBLIC_PARCEL_SHIPPING_OPTION_IDS = originalIds;
  }
  delete globalThis[sdkKey];
});

test("only explicitly enabled courier services reach the selector", async () => {
  assert.deepEqual((await checkout.listShippingOptions("cart_test")).map((o) => o.id), [
    "courier_standard",
  ]);
});

test("an unconfigured checkout does not fall back to the local service", async () => {
  approvedQuote = { status: "quote_required", reason: "coverage_unknown", message: "Cotiza por WhatsApp" };
  assert.deepEqual(await checkout.listShippingOptions("cart_test"), []);
  await assert.rejects(checkout.completeCart("cart_test"), /envío/);
  assert.equal(orderWrites, 0);
});

test("missing, negative, or invalid prices cannot become free delivery", () => {
  for (const amount of [undefined, null, -1, NaN, Infinity, "150"]) {
    assert.deepEqual(
      getParcelShippingOptions([{ id: "courier_standard", amount }], approvedQuote),
      []
    );
  }
  assert.equal(getShippingOptionPrice({ amount: 0 }), 0);
  assert.equal(
    getShippingOptionPrice({ amount: 0, price_type: "calculated" }),
    null
  );
  assert.equal(
    getShippingOptionPrice({ amount: 150, calculated_price: { calculated_amount: 175 } }),
    175
  );
});

test("a local service cannot be submitted directly to the checkout helper", async () => {
  await assert.rejects(checkout.addShippingMethod("cart_test", "local_cadereyta"), /envío/);
  assert.equal(shippingWrites, 0);
});

test("a valid courier service is saved through Medusa", async () => {
  const cart = await checkout.addShippingMethod("cart_test", "courier_standard");
  assert.equal(shippingWrites, 1);
  assert.equal(cart.shipping_methods[0].shipping_option_id, "courier_standard");
});

test("payment uses the refreshed cart including the server's shipping total", async () => {
  await checkout.initiatePaymentSession({ id: "cart_test", total: 300 }, "test_provider");
  assert.equal(paymentWrites, 1);
  assert.equal(paymentCart.total, 514);
});

test("a courier service that is no longer available cannot be paid or completed", async () => {
  availableOptions = availableOptions.filter((o) => o.id === "local_cadereyta");
  await assert.rejects(checkout.initiatePaymentSession(currentCart, "test_provider"), /envío/);
  await assert.rejects(checkout.completeCart("cart_test"), /envío/);
  assert.equal(paymentWrites, 0);
  assert.equal(orderWrites, 0);
});

test("empty, local, or mixed shipping selections cannot reach payment", async () => {
  for (const methods of [
    [],
    [{ shipping_option_id: "local_cadereyta" }],
    [{ shipping_option_id: "courier_standard" }, { shipping_option_id: "local_cadereyta" }],
    [{}],
  ]) {
    currentCart.shipping_methods = methods;
    assert.equal(hasParcelShippingMethod(currentCart, getParcelShippingOptions(availableOptions, approvedQuote)), false);
    await assert.rejects(checkout.initiatePaymentSession(currentCart, "test_provider"), /envío/);
  }
  assert.equal(paymentWrites, 0);
});

test("a valid courier selection can complete the cart", async () => {
  assert.deepEqual(await checkout.completeCart("cart_test"), { type: "order" });
  assert.equal(orderWrites, 1);
});

test("WhatsApp opens the store chat with quantities and escaped product details", () => {
  const url = new URL(getLocalDeliveryWhatsAppUrl("528281111023", [
    { quantity: 2, product_title: "Tinte & cuidado", variant_title: "6/1" },
  ]));
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/528281111023");
  assert.match(url.searchParams.get("text"), /2 × Tinte & cuidado \(6\/1\)/);
  assert.match(url.searchParams.get("text"), /\$40 MXN fuera del checkout/);
});

test("the retired public allowlist cannot approve a local $49 service", () => {
  process.env.NEXT_PUBLIC_PARCEL_SHIPPING_OPTION_IDS = "local_cadereyta";
  assert.deepEqual(getParcelShippingOptions(availableOptions), []);
});

test("missing backend verification exposes no payable shipping option", async () => {
  quoteFails = true;
  assert.deepEqual(await checkout.listShippingOptions("cart_test"), []);
  await assert.rejects(checkout.initiatePaymentSession(currentCart, "test_provider"), /envío/);
  assert.equal(paymentWrites, 0);
});

test("a missing or zero quote is never treated as free DHL", () => {
  for (const amount of [undefined, null, 0, -1, NaN]) {
    assert.deepEqual(getParcelShippingOptions(availableOptions, { ...approvedQuote, amount }), []);
  }
});

test("a saved $49 method or a stale DHL amount cannot be retained for payment", async () => {
  for (const method of [
    { shipping_option_id: "local_cadereyta", amount: 49, is_tax_inclusive: true },
    { shipping_option_id: "courier_standard", amount: 49, is_tax_inclusive: true },
  ]) {
    currentCart.shipping_methods = [method];
    currentCart.shipping_total = 49;
    await assert.rejects(checkout.initiatePaymentSession(currentCart, "test_provider"), /envío/);
    await assert.rejects(checkout.completeCart("cart_test"), /envío/);
  }
  assert.equal(paymentWrites, 0);
  assert.equal(orderWrites, 0);
});

test("a stale order total or unexpected shipping tax prevents payment", async () => {
  currentCart.total = 100;
  await assert.rejects(checkout.completeCart("cart_test"), /envío/);
  currentCart.total = 514;
  currentCart.shipping_total = 248.24;
  await assert.rejects(checkout.completeCart("cart_test"), /envío/);
  assert.equal(orderWrites, 0);
});

test("the DHL WhatsApp route preserves products without offering local delivery", () => {
  const url = new URL(getDhlWhatsAppUrl("528281111023", [
    { quantity: 3, product_title: "Mascarilla", variant_title: "250 ml" },
  ]));
  const message = url.searchParams.get("text");
  assert.match(message, /3 × Mascarilla \(250 ml\)/);
  assert.match(message, /DHL/);
  assert.doesNotMatch(message, /\$40|entrega local/);
});
