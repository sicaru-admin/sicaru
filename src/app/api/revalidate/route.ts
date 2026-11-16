import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
const reply = (status: number, message: string) => NextResponse.json({ message }, {
  status, headers: { "Cache-Control": "no-store" },
});

export async function POST(request: NextRequest) {
  const secret = process.env.CATALOG_REVALIDATION_SECRET;
  if (!secret || secret.length < 32) return reply(503, "Invalidation is not configured");
  const timestamp = request.headers.get("x-sicaru-timestamp") || "";
  const signature = request.headers.get("x-sicaru-signature") || "";
  if (!/^\d{13}$/.test(timestamp) || Math.abs(Date.now() - Number(timestamp)) > 60000 ||
      !/^[a-f0-9]{64}$/.test(signature)) return reply(401, "Invalid signature");
  // Bound actual streamed bytes too; Content-Length alone is not trustworthy.
  const reader = request.body?.getReader();
  if (!reader) return reply(400, "Invalid request");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 256) { await reader.cancel(); return reply(413, "Request too large"); }
      chunks.push(value);
    }
    const bytes = Buffer.concat(chunks);
    const expected = createHmac("sha256", secret).update(timestamp + ".").update(bytes).digest();
    if (!timingSafeEqual(expected, Buffer.from(signature, "hex"))) return reply(401, "Invalid signature");
    const payload = JSON.parse(bytes.toString("utf8"));
    if (payload?.scope !== "catalog" || Object.keys(payload).length !== 1) return reply(400, "Invalid scope");
    // Fixed scope; no caller-controlled path. Repeating the same request is harmless.
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ revalidated: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return reply(500, "Invalidation failed");
  }
}
