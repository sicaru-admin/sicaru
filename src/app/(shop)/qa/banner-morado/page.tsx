import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Laboratorio banner morado · No publicado",
  robots: { index: false, follow: false },
};

function CampaignHeroPreview() {
  return (
    <section
      aria-labelledby="sicaru-campaign-title"
      className="isolate overflow-hidden bg-[#7F6D8A] text-[#FAF8F5]"
    >
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-[1.03fr_0.97fr] md:items-stretch">
        <div className="relative z-20 flex min-w-0 flex-col justify-center px-5 pb-5 pt-6 sm:px-8 sm:py-8 md:px-9 md:py-12 lg:px-12 lg:py-16">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#F5F1EB] sm:text-xs">
            SICARÚ · Beauty Supply
          </p>
          <h1
            id="sicaru-campaign-title"
            className="font-heading mt-3 max-w-[20ch] text-[clamp(2.125rem,8.8vw,2.6875rem)] md:mt-4 md:max-w-[16ch] md:text-[clamp(2.45rem,5vw,5rem)] font-medium leading-[1.02] tracking-[-0.035em] text-[#FAF8F5]"
          >
            Belleza profesional para ti y tu salón.
          </h1>
          <p className="mt-3 max-w-[37ch] text-sm leading-6 md:mt-4 text-[#FAF8F5] sm:text-base sm:leading-7">
            Coloración, cuidado capilar y herramientas para tu estilo y tu profesión.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 md:mt-6">
            <Link
              href="/productos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FAF8F5] px-6 py-3 text-sm font-semibold text-[#2E2B2B] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none sm:text-base"
            >
              Explorar productos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/salon-pro"
              className="hidden min-h-11 items-center text-sm font-medium text-[#FAF8F5] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:inline-flex"
            >
              Para profesionales
            </Link>
          </div>
        </div>
        <div className="relative isolate h-[298px] min-w-0 overflow-hidden bg-[#9B89A8] sm:h-[345px] md:h-auto md:min-h-[425px] lg:min-h-[475px]">
          <Image
            src="/images/preview/sicaru-textura-en-libertad-concepto.png"
            alt="Exploración visual sintética de cabello rizado en movimiento; fotografía de campaña no aprobada"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 49vw"
            className="object-cover object-[50%_top] md:object-[52%_15%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(127,109,138,0.09)_0%,transparent_40%)]"
          />
        </div>
      </div>
    </section>
  );
}

export default function BannerMoradoPreviewPage() {
  // Never make this experiment available on the production deployment.
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();

  return (
    <>
      <div className="bg-[#2E2B2B] px-4 py-2 text-center text-xs leading-5 text-[#FAF8F5]">
        Laboratorio visual · Imagen conceptual IA · No aprobada ni publicada
      </div>
      <CampaignHeroPreview />
      <CategoriesGrid />
      <BrandsShowcase />
      <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-7 text-sm text-[#7F6D8A]">Cargando productos destacados…</div>}>
        <FeaturedProducts />
      </Suspense>
      <section className="bg-[#FAF8F5] px-4 py-8 text-center sm:py-11" aria-labelledby="preview-identity">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7F6D8A]">SICARÚ · Belleza con identidad</p>
        <h2 id="preview-identity" className="font-heading mt-3 text-3xl text-[#2E2B2B] sm:text-4xl">La belleza tiene muchas formas.</h2>
        <p className="mt-3 text-sm text-[#2E2B2B]/80">Cada cabello es diferente. Su cuidado también.</p>
      </section>
      <WhatsAppBanner />
    </>
  );
}
