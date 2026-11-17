// Catalogue publication is an access boundary: never persist HTML or RSC snapshots.
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateOrganizationSchema } from "@/lib/schema";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd schema={generateOrganizationSchema()} />
      <Navbar />
      <main className="min-h-screen bg-[#faf8f5]">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
