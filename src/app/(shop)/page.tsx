import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "SICARÚ — Belleza profesional, cercana y real",
  description: "Coloración, tratamientos y herramientas para tu rutina y tu salón. Belleza profesional con raíces mexicanas y atención cercana desde Cadereyta Jiménez.",
};

export const revalidate = 900;

export default function HomePage() {
  return (
    <>
      <JsonLd schema={generateWebSiteSchema()} />
      <HeroSection />
      <CategoriesGrid />
      <BrandsShowcase />
      <Suspense fallback={null}><FeaturedProducts /></Suspense>
      <section className="bg-[#efe7dd]" aria-labelledby="sicaru-heart">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <div className="relative aspect-[5/3] bg-[#e5ddd2] md:aspect-auto md:min-h-[400px]">
            <Image src="/images/salon-estilista-secando-cabello.jpg" alt="Estilista y clienta compartiendo un momento en el salón" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center px-5 py-10 sm:px-8 md:p-12 lg:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f6d8a]">El corazón de SICARÚ</p>
            <h2 id="sicaru-heart" className="mt-3 max-w-[18ch] font-heading text-3xl font-medium leading-tight text-[#2e2b2b] md:text-4xl">Raíces mexicanas. Belleza sin moldes.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#2e2b2b]/75">Desde Cadereyta Jiménez, te acompañamos a cuidar tu cabello y a crear en el salón. Con atención de cerca y espacio para cada textura, estilo y forma de ser.</p>
            <Link href="/nosotros" className="mt-5 inline-flex min-h-11 items-center self-start text-sm font-semibold text-[#7f6d8a] underline underline-offset-4">Conocer SICARÚ</Link>
          </div>
        </div>
      </section>
      <section className="px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-5 rounded-[8px] bg-[#7f6d8a] px-6 py-8 text-[#faf8f5] md:flex-row md:items-center md:px-10">
          <h2 className="font-heading text-2xl font-medium md:text-3xl">Elegir también se siente mejor en compañía.</h2>
          <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[6px] border border-[#faf8f5]/60 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Escríbenos por WhatsApp</a>
        </div>
      </section>
    </>
  );
}
