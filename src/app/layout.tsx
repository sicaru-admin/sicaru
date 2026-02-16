import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CartProvider } from "@/components/cart/CartProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateOrganizationSchema } from "@/lib/schema";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Distribuidora Sicar\u00fa",
    default: "Distribuidora Sicar\u00fa — Productos de Belleza Profesional",
  },
  description:
    "Distribuidora autorizada de productos de belleza profesional en M\u00e9xico. Las mejores marcas para sal\u00f3n y uso personal con env\u00edo a todo el pa\u00eds.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sicaru.com"
  ),
  openGraph: {
    locale: "es_MX",
    type: "website",
    siteName: "Distribuidora Sicar\u00fa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <body
        className={`${playfairDisplay.variable} ${montserrat.variable} antialiased`}
      >
        <JsonLd schema={generateOrganizationSchema()} />
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
