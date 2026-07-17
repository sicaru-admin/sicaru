import Link from "next/link";
import { BrandWordmark } from "./BrandWordmark";

const footerLinks = {
  tienda: [
    { href: "/productos", label: "Productos" },
    { href: "/marcas", label: "Marcas" },
    { href: "/salon-pro", label: "Salón Pro" },
    { href: "/blog", label: "Blog" },
  ],
  ayuda: [
    { href: "/cuenta", label: "Mi cuenta" },
    { href: "/cuenta/pedidos", label: "Mis pedidos" },
    { href: "/contacto", label: "Contacto" },
    { href: "/envios", label: "Envíos" },
    { href: "/devoluciones", label: "Devoluciones" },
  ],
  contacto: [
    { href: "https://wa.me/528281111023", label: "WhatsApp" },
    { href: "mailto:hola@sicaru.com", label: "hola@sicaru.com" },
  ],
  legales: [
    { href: "/terminos", label: "Términos" },
    { href: "/politica-privacidad", label: "Privacidad" },
  ],
};

export function Footer() {
  return (
    <footer className="sicaru-footer-dark">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)] lg:items-start">
          <div>
            <BrandWordmark variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-[#efe7dd]/90">
              Productos de belleza profesional seleccionados con criterio técnico y una experiencia cercana.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
            <div>
              <h3 className="sicaru-footer-heading">Tienda</h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.tienda.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="sicaru-footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="sicaru-footer-heading">Ayuda</h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.ayuda.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="sicaru-footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="sicaru-footer-heading">Contacto</h3>
              <ul className="mt-4 space-y-2.5">
                {footerLinks.contacto.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sicaru-footer-link"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 text-[#efe7dd]/85">
                Cadereyta Jiménez, Nuevo León
              </p>
            </div>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-[#efe7dd]/28 pt-5 text-xs text-[#efe7dd]/78 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Distribuidora Sicarú. Todos los derechos reservados.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {footerLinks.legales.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-[#faf8f5] focus:outline-none focus-visible:text-[#faf8f5]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
