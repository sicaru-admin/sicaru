import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Droplets, Heart, Leaf, Palette, Sparkles, Wrench } from "lucide-react";

const CATEGORIES = [
  {
    name: "Shampoo y Acondicionador",
    brands: "Küül, Nekane, Montis, Vitale",
    icon: Droplets,
    href: "/categorias/shampoo-y-acondicionador",
    image: "/images/mujer-lavando-cabello.jpg",
    alt: "Mujer lavando su cabello con champú profesional",
  },
  {
    name: "Color y Tintes",
    brands: "Küül Color, Voglia, Hidra Color",
    icon: Palette,
    href: "/categorias/color-y-tintes",
    image: "/images/marcas-colorista-aplicando-tinte.jpg",
    alt: "Estilista profesional aplicando tinte rojo a clienta en salón de belleza",
  },
  {
    name: "Styling y Acabado",
    brands: "Geles, ceras, sprays, protectores",
    icon: Sparkles,
    href: "/categorias/styling-y-acabado",
    image: "/images/salon-estilista-secando-cabello.jpg",
    alt: "Estilista secando y peinando el cabello de clienta sonriente en salón",
  },
  {
    name: "Línea Natural",
    brands: "Montis — extractos 100% naturales",
    icon: Leaf,
    href: "/categorias/linea-natural",
    image: "/images/producto-champu-sabila-natural.jpg",
    alt: "Champú artesanal de sábila con ingredientes naturales mexicanos — romero, manzanilla y aloe vera",
  },
  {
    name: "Tratamientos y Mascarillas",
    brands: "Keratina, botox, reparación",
    icon: Heart,
    href: "/categorias/tratamientos-y-mascarillas",
    image: "/images/salon-aplicacion-tratamiento.jpg",
    alt: "Manos de estilista aplicando tratamiento capilar cremoso al cabello de clienta",
  },
  {
    name: "Herramientas Pro",
    brands: "Secadoras, planchas, cepillos",
    icon: Wrench,
    href: "/categorias/herramientas-pro",
    image: "/images/salon-alisado-plancha-profesional.jpg",
    alt: "Plancha profesional alisando cabello con vapor en salón de belleza",
  },
];

export function CategoriesGrid() {
  return (
    <section className="bg-[#faf8f5] py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase text-[#8e7a9e]">
            Compra con dirección
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold text-[#2e2b2b] md:text-4xl">
            Encuentra productos según el resultado que buscas
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex min-h-full flex-col overflow-hidden border border-[#efe7dd] bg-[#faf8f5] transition-colors duration-[220ms] hover:border-[#9b89a8]/55"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#efe7dd]">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  className="object-cover transition-transform duration-[220ms] ease-out group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col border-t border-[#efe7dd] p-5 md:p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center border border-[#9b89a8]/45 bg-[#faf8f5] text-[#7f6d8a] transition-colors duration-[220ms] group-hover:border-[#8e7a9e]/70 group-hover:text-[#8e7a9e]">
                  <cat.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-2xl font-semibold text-[#2e2b2b]">
                  {cat.name}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-[#2e2b2b]/70">
                  {cat.brands}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-semibold uppercase text-[#7f6d8a]">
                  Explorar
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-[220ms] group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
