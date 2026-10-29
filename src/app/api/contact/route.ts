import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, subject, message } = body ?? {};

    // Validate required fields
    if ([name, subject, message].some((value) => typeof value !== "string" || !value.trim())) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados." },
        { status: 400 }
      );
    }

    // Contact details must never be written to application logs.

    // Build the WhatsApp URL with a pre-filled message
    const whatsappMessage = `Hola, soy ${name}. ${subject}: ${message}`;
    const whatsappUrl = `https://wa.me/528281136652?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({ ok: true, whatsappUrl }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
