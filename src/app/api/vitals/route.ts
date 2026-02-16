import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const metric = await request.json()

    // Log to server console for monitoring
    console.log(
      `[WebVital] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating}) | nav: ${metric.navigationType}`
    )

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
}
