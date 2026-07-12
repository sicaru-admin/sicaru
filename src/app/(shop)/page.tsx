import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { NeedsSection } from "@/components/home/NeedsSection";
import { AboutSicaru } from "@/components/home/AboutSicaru";
import { AdvisorySection } from "@/components/home/AdvisorySection";
import { LocationContact } from "@/components/home/LocationContact";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateWebSiteSchema } from "@/lib/schema";

const CategoriesGrid = dynamic(() =>
  import("@/components/home/CategoriesGrid").then((mod) => mod.CategoriesGrid)
);
const BlogPreview = dynamic(() =>
  import("@/components/home/BlogPreview").then((mod) => mod.BlogPreview)
);
const SalonCTA = dynamic(() =>
  import("@/components/home/SalonCTA").then((mod) => mod.SalonCTA)
);

export const metadata: Metadata = {
  title: "Distribuidora Sicarú — Productos de Belleza Profesional",
  description:
    "Distribuidora autorizada de productos de belleza profesional en México. Küül, Voglia, Nekane, Hidra Color, Xiomara, Vitale y Montis con envío a todo el país.",
};

export const revalidate = 900;

function FeaturedProductsFallback() {
  return (
    <section className="bg-[#faf8f5] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex justify-center">
          <div className="h-9 w-64 rounded premium-shimmer" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <div className="aspect-square premium-shimmer" />
              <div className="p-3">
                <div className="h-4 w-3/4 rounded premium-shimmer" />
                <div className="mt-2 h-4 w-1/2 rounded premium-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <JsonLd schema={generateWebSiteSchema()} />
      <HeroSection />
      <TrustBar />
      <NeedsSection />
      <CategoriesGrid />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProducts />
      </Suspense>
      <AboutSicaru />
      <SalonCTA />
      <BrandsShowcase />
      <AdvisorySection />
      <BlogPreview />
      <LocationContact />
    </>
  );
}
