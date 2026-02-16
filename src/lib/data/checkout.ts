import { sdk } from "@/lib/medusa";
import type { HttpTypes } from "@medusajs/types";

export async function getFullCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId, {
    fields:
      "+shipping_address,+billing_address,+shipping_methods,+payment_collection,+region,+promotions",
  });
  return cart;
}

export async function updateCart(
  cartId: string,
  data: HttpTypes.StoreUpdateCart
) {
  const { cart } = await sdk.store.cart.update(cartId, data);
  return cart;
}

export async function listShippingOptions(cartId: string) {
  const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
    cart_id: cartId,
  });
  return shipping_options;
}

export async function addShippingMethod(cartId: string, optionId: string) {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
    option_id: optionId,
  });
  return cart;
}

export async function listPaymentProviders(regionId: string) {
  const { payment_providers } = await sdk.store.payment.listPaymentProviders({
    region_id: regionId,
  });
  return payment_providers;
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  providerId: string
) {
  const { payment_collection } =
    await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: providerId,
    });
  return payment_collection;
}

export async function completeCart(cartId: string) {
  return await sdk.store.cart.complete(cartId);
}
