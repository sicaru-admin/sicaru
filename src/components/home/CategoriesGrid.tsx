import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  { label: "Coloración", href: "/categorias/color-y-tintes", image: "/images/marcas-colorista-aplicando-tinte.jpg", alt: "Aplicación de color en salón" },
  { label: "Tratamientos", href: "/categorias/tratamientos-y-mascarillas", image: "/images/salon-aplicacion-tratamiento.jpg", alt: "Aplicación de un tratamiento capilar" },
  { label: "Herramientas", href: "/categorias/herramientas-pro", image: "/images/salon-alisado-plancha-profesional.jpg", alt: "Plancha profesional en uso sobre el cabello" },
  { label: "Para profesionales", href: "/salon-pro", image: "/images/barberia-corte-masculino.jpg", alt: "Trabajo de corte de cabello en barbería" },
];

export function CategoriesGrid() {
  return (
    <section className="bg-[#faf8f5] py-10 md:py-16" aria-labelledby="home-categories">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
          <h2 id="home-categories" className="font-heading text-3xl font-medium text-[#2e2b2b] md:text-4xl">Encuentra lo tuyo</h2>
          <Link href="/productos" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#7f6d8a] underline underline-offset-4">Ver productos</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <Link key={category.href} href={category.href} className="group min-w-0 rounded-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#efe7dd]">
                <Image src={category.image} alt={category.alt} fill sizes="(max-width: 1023px) 50vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
              </div>
              <div className="flex min-h-12 items-center justify-between gap-2 pt-3 text-[#2e2b2b]">
                <h3 className="font-heading text-lg font-medium leading-tight sm:text-2xl">{category.label}</h3>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[#7f6d8a]" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
