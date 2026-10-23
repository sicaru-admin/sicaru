import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductPhoto } from "@/components/products/ProductPhoto";
import { VOGLIA_COMBO_ASSETS, VOGLIA_COMBO_APPROVED_PRICE } from "@/lib/product-retail";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Revisión de fotografías Voglia — SICARÚ",
  robots: { index: false, follow: false },
};

export default function VogliaPhotoReview() {
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview") notFound();

  return <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
    <h1 className="text-2xl font-semibold text-[#2e2b2b]">Revisión de fotografías · Voglia</h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#7f6d8a]">Tres originales del lote 1. Vinculación a los combos en Medusa pendiente; esta vista permite revisar fotografías y no indica disponibilidad.</p>
    <p className="mt-2 text-sm">Precio aprobado exclusivamente del combo tinte 90 ml + peróxido 20V 140 ml: ${VOGLIA_COMBO_APPROVED_PRICE.amount} MXN.</p>
    <div className="mt-6 space-y-8">
      {VOGLIA_COMBO_ASSETS.map((asset) => <section key={asset.identifier} aria-label={asset.identifier} className="rounded-xl border border-[#efe7dd] bg-[#faf8f5] p-3 sm:p-5">
        <h2 className="text-lg font-semibold">Tono {asset.tone}</h2>
        <p className="mt-1 break-all text-xs text-[#7f6d8a]">{asset.identifier}</p>
        <div className="mt-4 grid min-w-0 gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <h3 className="mb-2 text-xs font-medium text-[#7f6d8a]">Vista en tarjeta</h3>
            <div data-testid="photo-review-card" className="group relative mx-auto aspect-square w-full max-w-60 overflow-hidden rounded-lg border border-[#efe7dd] bg-[#faf8f5]">
              <ProductPhoto src={asset.src} alt={`Combo Voglia tono ${asset.tone}: tinte y peróxido`} />
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="mb-2 text-xs font-medium text-[#7f6d8a]">Vista en ficha</h3>
            <ImageGallery images={[{ id: asset.identifier, url: asset.src }]} title={`Combo Voglia tono ${asset.tone}: tinte y peróxido`} />
          </div>
        </div>
      </section>)}
    </div>
  </div>;
}
