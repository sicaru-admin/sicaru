import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";

export const metadata: Metadata = {
  title: "SICARÚ · Revisión visual VOGLIA Color Fun Violeta · Solo Preview",
  robots: { index: false, follow: false },
};

const source = "/images/products/voglia-color-fun-violeta-250ml/01-principal.webp";

export default function VogliaColorFunCandidatePreviewPage() {
  // A photo-only preview. Do not fetch Medusa or silently publish an item.
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-10 text-[#2E2B2B] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#7F6D8A]">
          SICARÚ · Laboratorio fotográfico · Solo Preview
        </p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
          VOGLIA Color Fun Violeta · 250 ml
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#2E2B2B]/85">
          Vista estática del archivo real del repositorio. No es una ficha de Medusa,
          no confirma existencias, no publica precios y no habilita pedidos ni pagos.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-[#D7C9DA] bg-[#FAF8F5] p-5">
            <h2 className="text-base font-semibold">Presentación en fondo marfil</h2>
            <div className="relative mt-4 aspect-square w-full overflow-hidden bg-[#FAF8F5]">
              <Image
                src={source}
                alt="VOGLIA Color Fun Vivid Purple, tinte fantasía violeta, envase de 250 ml"
                fill
                priority
                sizes="(max-width: 768px) 95vw, 45vw"
                className="object-contain p-6"
              />
            </div>
            <p className="mt-2 text-xs text-[#2E2B2B]/70">Imagen original sin alteraciones.</p>
          </section>
          <section className="rounded-xl border border-[#D7C9DA] bg-white p-5">
            <h2 className="text-base font-semibold">Simulación de tarjeta móvil</h2>
            <div className="mx-auto mt-4 max-w-64 rounded-xl border border-[#E9E1DD] bg-white p-3">
              <div className="relative aspect-square overflow-hidden bg-[#FAF8F5]">
                <Image
                  src={source}
                  alt="VOGLIA Color Fun Violeta 250 ml, vista en tarjeta"
                  fill
                  sizes="240px"
                  className="object-contain p-4"
                />
              </div>
              <p className="mt-3 text-sm font-semibold">VOGLIA Color Fun Violeta</p>
              <p className="mt-1 text-xs text-[#2E2B2B]/70">Tinte fantasía semipermanente · 250 ml</p>
              <p className="mt-3 text-xs text-[#7F6D8A]">Candidato a nueva ficha · sin disponibilidad confirmada</p>
            </div>
          </section>
        </div>
        <div className="mt-8 rounded-xl bg-[#F5F1EB] p-5 text-sm">
          <h2 className="font-semibold">Control interno de identificación</h2>
          <p className="mt-2">SKU proveedor 1934 · EAN 7501633719343 · Tono Violeta</p>
          <p className="mt-2 text-[#2E2B2B]/75">
            El conteo histórico no acredita existencia actual. Antes de crear una ficha:
            revisar duplicados en Medusa y obtener confirmación física y autorización comercial.
          </p>
        </div>
      </div>
    </main>
  );
}
