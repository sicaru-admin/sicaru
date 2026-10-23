import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CatalogUnavailable({ title = "Esta selección no está disponible por ahora." }: { title?: string }) {
  return (
    <section className="mx-auto max-w-xl px-5 py-16 text-center sm:py-24">
      <ShoppingBag className="mx-auto h-8 w-8 text-[#7f6d8a]" strokeWidth={1.3} aria-hidden="true" />
      <h1 className="mt-5 font-heading text-3xl font-medium text-[#2e2b2b]">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-[#2e2b2b]/65">Inténtalo de nuevo en un momento o escríbenos. Te ayudamos a encontrar lo que buscas.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-[#7f6d8a]">
        <Link href="/productos" className="inline-flex min-h-11 items-center underline underline-offset-4">Explorar productos</Link>
        <a href="https://wa.me/528281136652" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">WhatsApp</a>
      </div>
    </section>
  );
}
