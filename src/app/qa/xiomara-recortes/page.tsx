import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";

export const metadata: Metadata = {
  title: "SICARÚ · Revisión visual de recortes XIOMARA · Solo Preview",
  robots: { index: false, follow: false },
};

const products = [
  {
    name: "XIOMARA Shampoo Platinum 250 ml",
    details: "Envase azul · presentación 250 ml",
    handle: "xiomara-shampoo-platinum-250ml",
  },
  {
    name: "XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml",
    details: "Envase morado · presentación 250 ml",
    handle: "xiomara-shampoo-platinum-libre-sulfatos-250ml",
  },
] as const;

export default function XiomaraRecortesPreviewPage() {
  // This page is a static, image-only quality lab, not a live catalog.
  // Never expose QA on production, and do not fetch the Medusa backend.
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-4 py-10 text-[#2E2B2B] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#7F6D8A]">
          SICARÚ · Laboratorio fotográfico · Solo Preview
        </p>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Recortes XIOMARA aprobados</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7">
          Esta vista muestra fotografías exactas del repositorio y no consulta Medusa.
          No representa precios, existencias ni la tienda pública. No se ha modificado el catálogo en producción.
        </p>
        <div className="mt-10 space-y-12">
          {products.map((product) => (
            <section key={product.handle} className="border-b border-[#E9E1DD] pb-10">
              <h2 className="font-heading text-2xl">{product.name}</h2>
              <p className="mt-1 text-sm text-[#7F6D8A]">{product.details}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-6" data-testid={`review-${product.handle}`}>
                {[
                  {
                    label: "Fotografía anterior · referencia",
                    file: "01-principal.webp",
                  },
                  {
                    label: "Nuevo recorte · aprobado visualmente",
                    file: "01-principal-recorte-propietaria-candidato.webp",
                  },
                ].map((version) => (
                  <figure key={version.file} className="min-w-0 rounded-xl border border-[#D7C9DA] bg-[#FAF8F5] p-2 sm:p-5">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#FAF8F5]">
                      <Image
                        alt={`${product.name} · ${version.label}`}
                        src={`/images/products/${product.handle}/${version.file}`}
                        fill
                        sizes="(max-width: 639px) 46vw, 45vw"
                        className="object-contain p-2 sm:p-6"
                      />
                    </div>
                    <figcaption className="mt-3 text-xs font-medium leading-5 sm:text-sm">
                      {version.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="text-xs text-[#7F6D8A]">
          PR #35 · Verificación visual independiente del backend · Sin publicación a producción.
        </p>
      </div>
    </main>
  );
}
