import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const TEST_VARIANT_ID = "variant_01KVV3GD87A2S476H48GGKQWK7";
const SALES_CHANNEL_ID =
  process.env.NEXT_PUBLIC_SALES_CHANNEL_ID ??
  "sc_01KVRH65XAA1QMW6TP5CT5G4ME";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  if (!backendUrl || !publishableKey) {
    return NextResponse.json(
      {
        ok: false,
        stage: "env",
        hasBackendUrl: Boolean(backendUrl),
        hasPublishableKey: Boolean(publishableKey),
      },
      { status: 500 }
    );
  }

  const headers = {
    "content-type": "application/json",
    "x-publishable-api-key": publishableKey,
  };

  try {
    const regionsResponse = await fetch(`${backendUrl}/store/regions?limit=100`, {
      headers,
      cache: "no-store",
    });
    const regionsBody = await regionsResponse.json().catch(() => null);

    if (!regionsResponse.ok) {
      return NextResponse.json(
        {
          ok: false,
          stage: "regions",
          status: regionsResponse.status,
          body: regionsBody,
        },
        { status: 500 }
      );
    }

    const regions = Array.isArray(regionsBody?.regions) ? regionsBody.regions : [];
    const region =
      regions.find(
        (item: { currency_code?: string; name?: string }) =>
          item.currency_code === "mxn" ||
          item.name?.toLowerCase().includes("mex")
      ) ?? regions[0];

    if (!region?.id) {
      return NextResponse.json(
        {
          ok: false,
          stage: "region-selection",
          regionsCount: regions.length,
        },
        { status: 500 }
      );
    }

    const cartResponse = await fetch(`${backendUrl}/store/carts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        region_id: region.id,
        sales_channel_id: SALES_CHANNEL_ID,
      }),
      cache: "no-store",
    });
    const cartBody = await cartResponse.json().catch(() => null);

    if (!cartResponse.ok || !cartBody?.cart?.id) {
      return NextResponse.json(
        {
          ok: false,
          stage: "cart-create",
          region,
          status: cartResponse.status,
          body: cartBody,
        },
        { status: 500 }
      );
    }

    const lineResponse = await fetch(
      `${backendUrl}/store/carts/${cartBody.cart.id}/line-items`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          variant_id: TEST_VARIANT_ID,
          quantity: 1,
        }),
        cache: "no-store",
      }
    );
    const lineBody = await lineResponse.json().catch(() => null);
    const cart = lineBody?.cart;
    const item = cart?.items?.[0];

    return NextResponse.json(
      {
        ok: lineResponse.ok,
        stage: "line-item",
        region: {
          id: region.id,
          name: region.name,
          currency_code: region.currency_code,
          is_tax_inclusive: region.is_tax_inclusive,
          automatic_taxes: region.automatic_taxes,
        },
        status: lineResponse.status,
        cart: cart
          ? {
              id: cart.id,
              subtotal: cart.subtotal,
              item_subtotal: cart.item_subtotal,
              item_tax_total: cart.item_tax_total,
              tax_total: cart.tax_total,
              total: cart.total,
            }
          : null,
        item: item
          ? {
              title: item.title,
              variant_title: item.variant_title,
              unit_price: item.unit_price,
              subtotal: item.subtotal,
              tax_total: item.tax_total,
              total: item.total,
              is_tax_inclusive: item.is_tax_inclusive,
            }
          : null,
        error: lineResponse.ok ? null : lineBody,
      },
      { status: lineResponse.ok ? 200 : 500 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        stage: "unexpected",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
