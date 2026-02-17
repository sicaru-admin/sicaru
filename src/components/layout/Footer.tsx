import Link from "next/link";

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
    <footer className="relative border-t bg-sicaru-purple-900 text-white footer-gradient">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sicaru-gold">Tienda</h3>
            <ul className="space-y-2">
              {footerLinks.tienda.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-purple-200 transition-colors hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sicaru-gold">Marcas</h3>
            <ul className="space-y-2">
              {footerLinks.marcas.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-purple-200 transition-colors hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sicaru-gold">Ayuda</h3>
            <ul className="space-y-2">
              {footerLinks.ayuda.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-purple-200 transition-colors hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sicaru-gold">Informaci&oacute;n</h3>
            <ul className="space-y-2">
              {footerLinks.informacion.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm text-purple-200 transition-colors hover:text-white">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sicaru-gold">Contacto</h3>
            <ul className="space-y-2">
              {footerLinks.contacto.map((l) => (
                <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-200 transition-colors hover:text-white">{l.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-purple-800 pt-6 text-center">
          <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            Distribuidora Sicar&uacute;
          </p>
          <p className="mt-1 text-sm text-purple-300">Distribuidor Autorizado de Productos de Belleza Profesional</p>
          <p className="mt-4 text-xs text-purple-400">&copy; {new Date().getFullYear()} Distribuidora Sicar&uacute;. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
