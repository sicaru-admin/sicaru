import { sdk } from "@/lib/medusa";

export async function createCart(regionId: string) {
  const salesChannelId = process.env.NEXT_PUBLIC_SALES_CHANNEL_ID;

  if (!salesChannelId) {
    throw new Error("Falta configurar el canal de ventas de la tienda.");
  }

  const { cart } = await sdk.store.cart.create({
    region_id: regionId,
    sales_channel_id: salesChannelId,
  });

  return cart;
}

export async function getCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId);
  return cart;
}

export async function addItem(
  cartId: string,
  variantId: string,
  quantity: number
) {
  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  });

  return cart;
}

export async function updateItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  });

  return cart;
}

export async function removeItem(cartId: string, lineItemId: string) {
  const { parent: cart } = await sdk.store.cart.deleteLineItem(
    cartId,
    lineItemId
  );

  return cart;
}
