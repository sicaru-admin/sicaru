import { NextRequest, NextResponse } from "next/server";

const legacyHandle = "kuul-color-system-cream-3oz";
const replacementHandle = "kuul-color-system-90ml";

async function isPublicProduct(handle: string, signal: AbortSignal) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (!backendUrl || !publishableKey) return null;

  const url = new URL("/store/products", backendUrl);
  url.search = new URLSearchParams({ handle, fields: "id,handle", limit: "1" }).toString();
  const response = await fetch(url, {
    headers: { "x-publishable-api-key": publishableKey },
    cache: "no-store",
    signal,
  });
  if (!response.ok) return null;

  const { products, count } = await response.json();
  if (!Array.isArray(products)) return null;
  if (count === 0 && products.length === 0) return false;
  if (count === 1 && products.length === 1 && products[0]?.handle === handle) return true;
  return null;
}

export async function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();

  // Keep the legacy URL during coexistence. Redirect only on two conclusive
  // Store API reads: the old handle is absent and the replacement is public.
  try {
    const signal = AbortSignal.timeout(2500);
    if (await isPublicProduct(legacyHandle, signal) === false &&
        await isPublicProduct(replacementHandle, signal) === true) {
      const response = NextResponse.redirect(
        new URL(`/productos/${replacementHandle}`, request.url),
        308,
      );
      // A rollback must restore the original URL without a cached redirect.
      response.headers.set("Cache-Control", "no-store, max-age=0");
      return response;
    }
  } catch {
    // A transport failure does not prove the legacy product was withdrawn.
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/productos/kuul-color-system-cream-3oz",
};
