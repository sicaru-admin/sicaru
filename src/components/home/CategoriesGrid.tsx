import Link from "next/link";
import { Droplets, Palette, Sparkles, Leaf, Heart, Wrench } from "lucide-react";

const CATEGORIES = [
  {
    name: "Shampoo y Acondicionador",
    brands: "Küül, Nekane, Montis, Vitale",
    icon: Droplets,
    href: "/categorias/shampoo-y-acondicionador",
    gradient: "from-sicaru-purple-600 to-sicaru-purple-800",
  },
  {
    name: "Color y Tintes",
    brands: "Küül Color, Voglia, Hidra Color",
    icon: Palette,
    href: "/categorias/color-y-tintes",
    gradient: "from-sicaru-purple-700 to-sicaru-purple-900",
  },
  {
    name: "Styling y Acabado",
    brands: "Geles, ceras, sprays, protectores",
    icon: Sparkles,
    href: "/categorias/styling-y-acabado",
    gradient: "from-sicaru-pink to-sicaru-purple-700",
  },
  {
    name: "Línea Natural",
    brands: "Montis — extractos 100% naturales",
    icon: Leaf,
    href: "/categorias/linea-natural",
    gradient: "from-[#166534] to-[#1A3A25]",
  },
  {
    name: "Tratamientos y Mascarillas",
    brands: "Keratina, botox, reparación",
    icon: Heart,
    href: "/categorias/tratamientos-y-mascarillas",
    gradient: "from-sicaru-purple-500 to-sicaru-purple-700",
  },
  {
    name: "Herramientas Pro",
    brands: "Secadoras, planchas, cepillos",
    icon: Wrench,
    href: "/categorias/herramientas-pro",
    gradient: "from-sicaru-purple-800 to-sicaru-purple-900",
  },
];

export function CategoriesGrid() {
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-10 text-center font-heading text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
          Compra por Categoría
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-xl p-5 md:p-6"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-transform duration-300 group-hover:scale-105`}
              />

              <div className="relative z-10">
                <cat.icon className="mb-3 h-8 w-8 text-white/80" />
                <h3 className="text-base font-bold text-white md:text-lg">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-white/70 md:text-sm">
                  {cat.brands}
                </p>
                <span className="mt-3 inline-block text-xs font-semibold text-sicaru-gold">
                  Explorar &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
