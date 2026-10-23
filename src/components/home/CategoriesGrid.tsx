import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  { label: "Coloración", href: "/categorias/color-y-tintes", image: "/images/marcas-colorista-aplicando-tinte.jpg", alt: "Aplicación de color en salón" },
  { label: "Tratamientos", href: "/categorias/tratamientos-y-mascarillas", image: "/images/salon-aplicacion-tratamiento.jpg", alt: "Aplicación de un tratamiento capilar" },
  { label: "Herramientas", href: "/categorias/herramientas-pro", image: "/images/salon-alisado-plancha-profesional.jpg", alt: "Plancha profesional en uso" },
  { label: "Para profesionales", href: "/salon-pro", image: "/images/barberia-corte-masculino.jpg", alt: "Trabajo profesional de barbería" },
];

export function CategoriesGrid() {
  return (
    <section className="bg-[#faf8f5] py-5 sm:py-7" aria-labelledby="home-categories">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        <h2 id="home-categories" className="mb-3 text-base font-semibold text-[#2e2b2b] sm:mb-4 sm:text-xl">Compra por categoría</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="group relative min-w-0 overflow-hidden rounded-xl border border-[#efe7dd] bg-[#f5f1eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]">
              <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[5/3]">
                <Image src={category.image} alt={category.alt} fill sizes="(max-width: 639px) 50vw, 25vw" className="object-cover transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none" />
              </div>
              <div className="flex min-h-11 items-center justify-between gap-1 px-2.5 py-2 text-[#2e2b2b] sm:px-4">
                <h3 className="text-[0.7rem] font-semibold leading-4 sm:text-sm">{category.label}</h3>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#7f6d8a]" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
