import type { Metadata } from "next";
import { Bodoni_Moda, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { WebVitals } from "@/components/analytics/WebVitals";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import { BrowserCacheReset } from "@/components/system/BrowserCacheReset";

const bodoniModa = Bodoni_Moda({
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
    "Distribuidora autorizada de productos de belleza profesional en México. Las mejores marcas para salón y uso personal con envío a todo el país.",
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
