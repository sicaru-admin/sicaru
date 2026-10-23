import { CATALOG_MODE } from "@/lib/catalog-mode";
import { ShippingNotice } from "@/components/checkout/ShippingNotice";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="font-heading text-xl font-bold text-sicaru-purple-900"
          >
            Sicarú
          </Link>
          <Link
            href="/carrito"
            className="flex items-center gap-1 text-sm font-medium text-sicaru-purple-600 hover:text-sicaru-purple-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al carrito
          </Link>
        </div>
      </header>
      {CATALOG_MODE ? (
        <main className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
          <nav aria-label="Pasos de compra" className="mb-6 flex items-center justify-center gap-3 text-sm text-[#7f6d8a]">
            <Link href="/carrito" className="inline-flex min-h-11 items-center underline underline-offset-4">Carrito</Link>
            <span aria-hidden="true">/</span><span aria-current="step">Envío</span>
          </nav>
          <ShippingNotice />
        </main>
      ) : children}
    </div>
  );
}
