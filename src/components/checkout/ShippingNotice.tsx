import Link from "next/link";
import { MessageCircle, Package } from "lucide-react";

export function ShippingNotice() {
  return (
    <section className="rounded-[8px] border border-[#efe7dd] bg-[#faf8f5] px-6 py-10 text-center sm:px-10" aria-labelledby="shipping-notice">
      <Package className="mx-auto h-8 w-8 text-[#7f6d8a]" strokeWidth={1.3} aria-hidden="true" />
      <h1 id="shipping-notice" className="mt-5 font-heading text-3xl font-medium text-[#2e2b2b] sm:text-4xl">Envíos online próximamente</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#2e2b2b]/70">Los pedidos con envío y los pagos online aún no están habilitados. Escríbenos para consultar productos y disponibilidad en tienda.</p>
      <a href="https://wa.me/528281136652?text=Hola%2C%20quisiera%20consultar%20un%20producto%20de%20SICAR%C3%9A." target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-[#7f6d8a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#6d5b79] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]">
        <MessageCircle className="h-4 w-4" aria-hidden="true" /> Escribir por WhatsApp
      </a>
      <p className="mt-3 text-xs text-[#2e2b2b]/65">+52 828 113 6652</p>
      <Link href="/productos" className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[#7f6d8a] underline underline-offset-4">Seguir explorando</Link>
    </section>
  );
}
