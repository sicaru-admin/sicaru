import { getSalesWhatsAppUrl } from "@/lib/contact";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben ser completados." },
        { status: 400 }
      );
    }

    // Build the WhatsApp URL with a pre-filled message
    const whatsappMessage = `Hola, soy ${name}. ${subject}: ${message}`;
    const whatsappUrl = getSalesWhatsAppUrl(whatsappMessage);

    if (!whatsappUrl) return NextResponse.json({ error: "El número de WhatsApp está pendiente de confirmar. Tu mensaje no se ha enviado." }, { status: 503 });
    return NextResponse.json({ ok: true, whatsappUrl }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
