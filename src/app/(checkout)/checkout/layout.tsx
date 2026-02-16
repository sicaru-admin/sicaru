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
      {children}
    </div>
  );
}
