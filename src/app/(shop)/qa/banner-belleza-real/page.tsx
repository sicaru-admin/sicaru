import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATALOG_MODE } from "@/lib/catalog-mode";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhatsAppBanner } from "@/components/home/WhatsAppBanner";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "SICARÚ · Propuesta de banner A · Belleza real",
  robots: { index: false, follow: false },
};

function PreviewHeroA() {
  return (
    <section className="bg-[#FAF8F5]" aria-labelledby="banner-a-heading">
      <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex min-w-0 flex-col justify-center px-5 py-5 sm:px-8 sm:py-8 lg:px-10 lg:py-12">
          <p className="text-sm font-semibold tracking-[0.08em] text-[#7F6D8A]">SICARÚ · Beauty Supply</p>
          <h1 id="banner-a-heading" className="font-heading mt-3 max-w-[15ch] text-[clamp(2.25rem,4.6vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.035em] text-[#2E2B2B]">
            Belleza profesional para ti y tu salón.
          </h1>
          <p className="mt-4 max-w-[39ch] text-base leading-6 text-[#2E2B2B]">
            Coloración, cuidado capilar y herramientas para tu estilo y tu profesión.
          </p>
          <Link href="/productos" className="mt-5 inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-[#7F6D8A] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#6C5C76] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E2B2B] motion-reduce:transition-none">
            Explorar productos
          </Link>
          <Link href="/salon-pro" className="mt-1 hidden min-h-11 md:inline-flex w-fit items-center text-sm font-medium text-[#2E2B2B] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A]">
            Para profesionales
          </Link>
        </div>
        <div className="flex min-w-0 flex-col bg-[#9B89A8] px-5 py-3 sm:px-8 md:justify-center lg:py-8">
          <p className="text-sm font-medium leading-5 text-[#2E2B2B]">Imagen humana en revisión</p>
          <p className="mt-1 hidden max-w-[38ch] md:block text-sm leading-5 text-[#2E2B2B]">Composición provisional con fotografías de productos existentes.</p>
          <div className="mt-3 grid h-[120px] grid-cols-2 gap-2 sm:h-[220px] md:h-[290px] lg:h-[340px]">
            <div className="relative min-w-0">
              <Image src="/images/products-hero/voglia-total-repair.webp" alt="Voglia Total Repair, fotografía existente del producto" fill sizes="(max-width: 767px) 44vw, 22vw" className="object-contain" />
            </div>
            <div className="relative min-w-0">
              <Image src="/images/products-hero/vitale-bifase-pro-keratin.webp" alt="Vitale Bifase Pro-Keratin, fotografía existente del producto" fill sizes="(max-width: 767px) 44vw, 22vw" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BannerBellezaRealPreviewPage() {
  // This page must never be publicly accessible in the production deployment.
  if (!CATALOG_MODE || (process.env.VERCEL_ENV !== "preview" && process.env.NODE_ENV !== "development")) notFound();

  return (
    <>
      <div className="bg-[#2E2B2B] px-4 py-2 text-center text-sm leading-5 text-[#FAF8F5]">
        Propuesta provisional · Solo evaluación
      </div>
      <PreviewHeroA />
      <CategoriesGrid />
      <p className="mx-auto max-w-[1400px] px-5 pb-4 text-sm leading-6 text-[#2E2B2B] sm:px-8 lg:px-10">Productos profesionales y orientación por WhatsApp. Los pedidos, pagos y envíos se confirman con nuestro equipo.</p>
      <BrandsShowcase />
      <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 py-8 text-sm text-[#7F6D8A]">Cargando productos destacados…</div>}>
        <FeaturedProducts />
      </Suspense>
      <section className="bg-[#FAF8F5] px-4 py-9 text-center sm:py-12" aria-labelledby="lab-identity">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#7F6D8A]">SICARÚ · Belleza con identidad</p>
        <h2 id="lab-identity" className="font-heading mt-3 text-3xl text-[#2E2B2B] sm:text-4xl">La belleza tiene muchas formas.</h2>
        <p className="mt-3 text-sm text-[#2E2B2B]/75">Cada cabello es diferente. Su cuidado también.</p>
      </section>
      <WhatsAppBanner />
    </>
  );
}
