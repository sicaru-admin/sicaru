import type { Metadata } from "next";
import Link from "next/link";
import { CATALOG_MODE } from "@/lib/catalog-mode";

export const metadata: Metadata = {
  title: "Envíos — Próximamente",
  description: "Envíos y compras online de SICARÚ próximamente. Consulta productos de belleza y coloración en nuestro catálogo digital.",
};

export default function EnviosPage() {
  if (!CATALOG_MODE) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="font-heading text-3xl text-[#2e2b2b]">Información de envíos</h1>
        <p className="mt-5 text-[#2e2b2b]/75">Consulta nuestros servicios y cobertura antes de completar un pedido.</p>
        <Link href="/contacto" className="mt-8 inline-flex min-h-11 items-center bg-[#7f6d8a] px-6 py-3 text-white">Contactar a SICARÚ</Link>
      </main>
    );
  }

  return (
    <main className="min-h-[55vh] bg-[#faf8f5] px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl rounded-[8px] border border-[#efe7dd] bg-white p-7 text-center sm:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e7a9e]">SICARÚ · Catálogo digital</p>
        <h1 className="mt-5 font-heading text-4xl font-medium text-[#2e2b2b] sm:text-5xl">Envíos online próximamente</h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#2e2b2b]/75">
          Estamos preparando las opciones de paquetería y compra en línea. Por ahora puedes explorar nuestro catálogo; este sitio no acepta pagos ni pedidos con envío.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#2e2b2b]/65">
          Si buscas un producto en nuestra tienda física de Cadereyta Jiménez, consulta información y disponibilidad por WhatsApp.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/productos" className="inline-flex min-h-11 items-center justify-center bg-[#7f6d8a] px-6 py-3 text-sm font-semibold text-white">Explorar productos</Link>
          <a href="https://wa.me/528281136652?text=Hola%2C%20quisiera%20informaci%C3%B3n%20sobre%20un%20producto%20de%20SICAR%C3%9A." target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center border border-[#7f6d8a] px-6 py-3 text-sm font-semibold text-[#7f6d8a]">Consultar por WhatsApp</a>
        </div>
      </div>
    </main>
  );
}
