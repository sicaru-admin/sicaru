import { sdk } from "@/lib/medusa";
import { alignCartSalesChannel } from "@/lib/cart-channel";

export async function createCart(regionId: string) {
  const salesChannelId = process.env.NEXT_PUBLIC_SALES_CHANNEL_ID;

  const payload = {
    region_id: regionId,
    ...(salesChannelId ? { sales_channel_id: salesChannelId } : {}),
  };

  const { cart } = await sdk.store.cart.create(payload);

  return cart;
}

export async function getCart(cartId: string) {
  const { cart } = await sdk.store.cart.retrieve(cartId);
  return cart;
}

// A persisted cart can predate the branch's sales-channel configuration.
// Update the same cart through Medusa, preserving its items and server validation.
export async function restoreCart(cartId: string) {
  return alignCartSalesChannel(
    await getCart(cartId),
    process.env.NEXT_PUBLIC_SALES_CHANNEL_ID,
    async (id, salesChannelId) => {
      try {
        const { cart } = await sdk.store.cart.update(id, { sales_channel_id: salesChannelId });
        return cart;
      } catch (error) {
        // Only a missing cart from retrieve may clear its saved ID.
        // A failed channel update must leave that cart available for retry.
        throw new Error("No pudimos recuperar tu carrito. Inténtalo nuevamente.", { cause: error });
      }
    }
  );
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
