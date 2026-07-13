import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { BrandsShowcase } from "@/components/home/BrandsShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { EyebrowText } from "@/components/ui/EyebrowText";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateWebSiteSchema } from "@/lib/schema";

const CategoriesGrid = dynamic(() =>
  import("@/components/home/CategoriesGrid").then((mod) => mod.CategoriesGrid)
);
const MontisFeature = dynamic(() =>
  import("@/components/home/MontisFeature").then((mod) => mod.MontisFeature)
);
const BlogPreview = dynamic(() =>
  import("@/components/home/BlogPreview").then((mod) => mod.BlogPreview)
);
const SalonCTA = dynamic(() =>
  import("@/components/home/SalonCTA").then((mod) => mod.SalonCTA)
);
const WhatsAppBanner = dynamic(() =>
  import("@/components/home/WhatsAppBanner").then((mod) => mod.WhatsAppBanner)
);

export const metadata: Metadata = {
  title: "Distribuidora Sicarú — Productos de Belleza Profesional",
  description:
    "Sicarú es una tienda de productos profesionales de belleza en Cadereyta Jiménez, Nuevo León. Encuentra coloración, tratamientos capilares, herramientas, depilación y atención personalizada.",
};

export const revalidate = 900;

function FeaturedProductsFallback() {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
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
      <BrandsShowcase />
      <SectionDivider />
      <Suspense fallback={<FeaturedProductsFallback />}>
        <FeaturedProducts />
      </Suspense>
      <SectionDivider />
      <CategoriesGrid />
      <SectionDivider />
      <MontisFeature />
      <SectionDivider />
      <BlogPreview />
      <SalonCTA />
      <WhatsAppBanner />
    </>
  );
}
