import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Heart,
  Leaf,
  Palette,
  Sparkles,
  Wrench,
} from "lucide-react";

const CATEGORIES = [
  {
    name: "Coloración profesional",
    brands: "Tintes, oxidantes y color técnico",
    icon: Palette,
    href: "/categorias/color-y-tintes",
    image: "/images/marcas-colorista-aplicando-tinte.jpg",
    alt: "Estilista profesional aplicando tinte en salón de belleza",
  },
  {
    name: "Tratamientos capilares",
    brands: "Reparación, keratina y mascarillas",
    icon: Heart,
    href: "/categorias/tratamientos-y-mascarillas",
    image: "/images/salon-aplicacion-tratamiento.jpg",
    alt: "Aplicación profesional de tratamiento capilar",
  },
  {
    name: "Hidratación y cuidado diario",
    brands: "Shampoo, acondicionador y rutina",
    icon: Droplets,
    href: "/categorias/shampoo-y-acondicionador",
    image: "/images/mujer-lavando-cabello.jpg",
    alt: "Lavado profesional de cabello",
  },
  {
    name: "Herramientas y accesorios",
    brands: "Secadoras, planchas y cepillos",
    icon: Wrench,
    href: "/categorias/herramientas-pro",
    image: "/images/salon-alisado-plancha-profesional.jpg",
    alt: "Herramienta profesional para alisar cabello",
  },
  {
    name: "Depilación",
    brands: "Productos para servicio y cuidado",
    icon: Sparkles,
    href: "/productos?buscar=depilacion",
    image: "/images/barberia-corte-masculino.jpg",
    alt: "Servicio profesional de belleza y cuidado personal",
  },
  {
    name: "Productos para estilistas",
    brands: "Líneas técnicas y rotación de salón",
    icon: Leaf,
    href: "/salon-pro",
    image: "/images/salon-mezcla-tintes-profesional.jpg",
    alt: "Mezcla profesional de tintes para trabajo de salón",
  },
];

export function CategoriesGrid() {
  return (
    <section className="bg-[#efe7dd] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="sicaru-eyebrow">02 · Categorías</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
            Explora nuestras categorías
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#d8cedc] bg-[#d8cedc] md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[#faf8f5] p-5 md:p-6"
            >
              <Image
                src={cat.image}
                alt={cat.alt}
                fill
                className="object-cover opacity-28 transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-[#faf8f5]/80" />

              <div className="relative z-10">
                <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#9b89a8]/45 bg-[#faf8f5]/75 text-[#7f6d8a]">
                  <cat.icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-[#2e2b2b]">
                  {cat.name}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[#2e2b2b]/70">
                  {cat.brands}
                </p>
              </div>
              <span className="relative z-10 mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#7f6d8a]">
                Explorar
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
