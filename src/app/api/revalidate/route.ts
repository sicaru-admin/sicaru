import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, secret } = body;

    if (!secret || secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: "Token de revalidacion invalido" },
        { status: 401 }
      );
    }

    if (!path) {
      return NextResponse.json(
        { message: "El parametro path es requerido" },
        { status: 400 }
      );
    }

    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error en revalidacion:", error);
    return NextResponse.json(
      { message: "Error al procesar la solicitud de revalidacion" },
      { status: 500 }
    );
  }
}
