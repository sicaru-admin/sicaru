import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
          regionSummary: regions.map(
            (item: { id?: string; name?: string; currency_code?: string }) => ({
              id: item.id,
              name: item.name,
              currency_code: item.currency_code,
            })
          ),
        },
        { status: 500 }
      );
    }

    const cartResponse = await fetch(`${backendUrl}/store/carts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ region_id: region.id }),
      cache: "no-store",
    });
    const cartBody = await cartResponse.json().catch(() => null);

    return NextResponse.json(
      {
        ok: cartResponse.ok,
        stage: "cart-create",
        region: {
          id: region.id,
          name: region.name,
          currency_code: region.currency_code,
        },
        status: cartResponse.status,
        body: cartBody,
      },
      { status: cartResponse.ok ? 200 : 500 }
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
