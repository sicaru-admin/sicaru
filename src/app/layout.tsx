import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";

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
    template: "%s | Distribuidora Sicarú",
    default: "Distribuidora Sicarú — Productos de Belleza Profesional",
  },
  description:
    "Distribuidora autorizada de productos de belleza profesional en México. Las mejores marcas para salón y uso personal con envío a todo el país.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sicaru.com"
  ),
  openGraph: {
    locale: "es_MX",
    type: "website",
    siteName: "Distribuidora Sicarú",
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
