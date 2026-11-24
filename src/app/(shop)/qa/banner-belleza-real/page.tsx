import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
    <section className="relative isolate overflow-hidden border-b border-[#9B89A8]/20 bg-[#F5F1EB]" aria-labelledby="banner-a-heading">
      <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[0.94fr_1.06fr]">
        <div className="relative z-20 flex flex-col justify-center px-5 pb-9 pt-11 sm:px-10 sm:pb-12 sm:pt-14 lg:py-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-9 bg-[#7F6D8A]" aria-hidden="true" />
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#7F6D8A] sm:text-xs">SICARÚ · Beauty Supply</p>
          </div>
          <h1 id="banner-a-heading" className="font-heading mt-5 max-w-[16ch] text-[clamp(2.65rem,5vw,5.35rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-[#2E2B2B]">
            Belleza profesional para ti y tu salón.
          </h1>
          <p className="mt-6 max-w-[37ch] text-sm leading-6 text-[#2E2B2B] sm:text-base sm:leading-7">
            Coloración, cuidado capilar y herramientas para tu estilo y tu profesión.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/productos" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#7F6D8A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6C5C76] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E2B2B] motion-reduce:transition-none">
              Explorar productos <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/salon-pro" className="inline-flex min-h-12 items-center text-sm font-semibold text-[#7F6D8A] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7F6D8A]">
              Para profesionales
            </Link>
          </div>
          <p className="mt-6 max-w-[42ch] text-[0.68rem] leading-5 text-[#2E2B2B]/70">
            Productos profesionales y orientación por WhatsApp. Los pedidos, pagos y envíos se confirman con nuestro equipo.
          </p>
        </div>
        <div className="relative isolate min-h-[370px] overflow-hidden sm:min-h-[470px] lg:min-h-[530px]">
          {/* The earlier model photo was explicitly rejected on 24 Nov 2026.
              Never render or release it; this is an intentionally temporary
              product-only stage until a new portrait is approved. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(132deg,#B6A4C2_0%,#9B89A8_48%,#7F6D8A_100%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-[26%] -top-[43%] h-[115%] w-[96%] rounded-full border-[42px] border-white/15 sm:border-[68px]" />
          <div className="absolute left-5 top-6 z-30 max-w-[18rem] rounded-xl border border-white/50 bg-[#2E2B2B]/60 px-4 py-3 text-xs font-semibold leading-5 text-white sm:left-8 sm:top-8">
            Imagen humana en revisión · Foto anterior rechazada
          </div>
          <div className="pointer-events-none absolute bottom-0 right-0 z-10 h-[50%] w-[48%] bg-[linear-gradient(0deg,rgba(245,241,235,0.78),transparent)]" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-0 right-[1%] z-20 h-[45%] w-[34%] sm:h-[52%] sm:w-[30%]">
            <Image src="/images/products-hero/voglia-total-repair.webp" alt="Voglia Total Repair, fotografía existente del producto" fill sizes="(max-width: 640px) 34vw, 18vw" className="object-contain drop-shadow-[0_12px_10px_rgba(46,43,43,0.18)]" />
          </div>
          <div className="pointer-events-none absolute bottom-0 right-[27%] z-20 h-[37%] w-[29%] sm:h-[42%] sm:w-[23%]">
            <Image src="/images/products-hero/vitale-bifase-pro-keratin.webp" alt="Vitale Bifase Pro-Keratin, fotografía existente del producto" fill sizes="(max-width: 640px) 29vw, 14vw" className="object-contain drop-shadow-[0_12px_10px_rgba(46,43,43,0.18)]" />
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
      <div className="border-b border-[#9B89A8]/20 bg-[#2E2B2B] px-4 py-3 text-center text-xs leading-5 text-[#FAF8F5]">
        Laboratorio privado de SICARÚ · Dirección A aprobada visualmente · Imagen humana pendiente de verificar derechos y autenticidad · NO publicado
      </div>
      <PreviewHeroA />
      <CategoriesGrid />
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
