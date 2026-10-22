import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateOrganizationSchema } from "@/lib/schema";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ContactProvider } from "@/components/contact/ContactContext";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContactProvider>
      <JsonLd schema={generateOrganizationSchema()} />
      <Navbar />
      {process.env.VERCEL_ENV==="preview"&&<p className="bg-sicaru-purple-100 px-4 py-1 text-center text-[11px] text-sicaru-purple-700">Vista previa de prueba</p>}
      <main id="contenido" className="shop-content min-h-screen bg-[#faf8f5]">{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
    </ContactProvider>
  );
}

