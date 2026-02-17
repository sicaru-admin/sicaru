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

    // Log the contact submission
    console.log("[Contact Form Submission]", {
      name,
      email,
      phone: body.phone || "N/A",
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Build the WhatsApp URL with a pre-filled message
    const whatsappMessage = `Hola, soy ${name}. ${subject}: ${message}`;
    const whatsappUrl = `https://wa.me/528281111023?text=${encodeURIComponent(whatsappMessage)}`;

    return NextResponse.json({ ok: true, whatsappUrl }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error al procesar la solicitud." },
      { status: 500 }
    );
  }
}
