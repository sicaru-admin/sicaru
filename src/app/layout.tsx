import type { Metadata } from "next";
import { Libre_Bodoni, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { WebVitals } from "@/components/analytics/WebVitals";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { BrowserCacheReset } from "@/components/system/BrowserCacheReset";

const bodoniModa = Libre_Bodoni({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Distribuidora Sicarú",
    default: "Distribuidora Sicarú — Productos de Belleza Profesional",
  },
  description:
    "Sicarú es una tienda de productos profesionales de belleza en Cadereyta Jiménez, Nuevo León. Encuentra coloración, tratamientos capilares, herramientas, depilación y atención personalizada.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sicarubeauty.com"
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
        className={`${bodoniModa.variable} ${poppins.variable} antialiased`}
      >
        <NavigationProgress />
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <BrowserCacheReset />
        <WebVitals />
      </body>
    </html>
  );
}
