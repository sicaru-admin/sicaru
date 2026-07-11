import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  tienda: [
    { href: "/productos", label: "Todos los Productos" },
    { href: "/marcas", label: "Marcas" },
    { href: "/salon-pro", label: "Sal\u00f3n Pro" },
    { href: "/blog", label: "Blog" },
  ],
  marcas: [
    { href: "/marcas", label: "Ver Todas las Marcas" },
  ],
  ayuda: [
    { href: "/cuenta", label: "Mi Cuenta" },
    { href: "/cuenta/pedidos", label: "Mis Pedidos" },
    { href: "/contacto", label: "Contacto" },
    { href: "/nosotros", label: "Nosotros" },
  ],
  informacion: [
    { href: "/envios", label: "Pol\u00edtica de Env\u00edos" },
    { href: "/devoluciones", label: "Devoluciones" },
    { href: "/terminos", label: "T\u00e9rminos y Condiciones" },
    { href: "/politica-privacidad", label: "Aviso de Privacidad" },
  ],
  contacto: [
    { href: "https://wa.me/528281111023", label: "WhatsApp" },
    { href: "mailto:hola@sicaru.com", label: "hola@sicaru.com" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-[#6c5c76] bg-[#7f6d8a] text-[#faf8f5] footer-gradient">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-14">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Link href="/" className="relative block h-20 w-44" aria-label="Sicarú, inicio">
            <Image
              src="/brand/logo-cream.png"
              alt="Sicarú Productos de Belleza"
              fill
              sizes="192px"
              className="object-contain"
            />
          </Link>
          <p className="max-w-md text-sm leading-6 text-[#faf8f5]/75">
            Productos de belleza profesional seleccionados con criterio técnico y una experiencia cercana.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#efe7dd]">Tienda</h3>
            <ul className="space-y-2">
              {footerLinks.tienda.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-[#faf8f5]/75 transition-colors hover:text-[#faf8f5]">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#efe7dd]">Marcas</h3>
            <ul className="space-y-2">
              {footerLinks.marcas.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-[#faf8f5]/75 transition-colors hover:text-[#faf8f5]">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#efe7dd]">Ayuda</h3>
            <ul className="space-y-2">
              {footerLinks.ayuda.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-[#faf8f5]/75 transition-colors hover:text-[#faf8f5]">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#efe7dd]">Informaci&oacute;n</h3>
            <ul className="space-y-2">
              {footerLinks.informacion.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-[#faf8f5]/75 transition-colors hover:text-[#faf8f5]">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#efe7dd]">Contacto</h3>
            <ul className="space-y-2">
              {footerLinks.contacto.map((l) => (
                <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#faf8f5]/75 transition-colors hover:text-[#faf8f5]">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#faf8f5]/20 pt-6 text-center">
          <p className="text-lg font-semibold text-[#faf8f5]" style={{ fontFamily: "var(--font-heading)" }}>
            Distribuidora Sicar&uacute;
          </p>
          <p className="mt-1 text-sm text-[#faf8f5]/70">Distribuidor autorizado de productos de belleza profesional</p>
          <p className="mt-4 text-xs text-[#faf8f5]/55">&copy; {new Date().getFullYear()} Distribuidora Sicar&uacute;. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
