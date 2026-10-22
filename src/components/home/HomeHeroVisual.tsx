import Image from "next/image";

export function HomeHeroVisual() {
  return (
    <div className="relative aspect-[5/4] overflow-hidden rounded-[8px] bg-[#efe7dd] md:aspect-[4/5] md:max-h-[620px]">
      <Image
        src="/images/mujer-rizos-salon-espejo.jpg"
        alt="Mujer sonriente disfrutando de sus rizos naturales frente al espejo de un salón"
        fill
        priority
        sizes="(max-width: 767px) 100vw, 50vw"
        className="object-cover object-[35%_center]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-6 pb-6 pt-16">
        <p className="font-heading text-2xl text-white sm:text-3xl">Cada textura. Cada estilo.</p>
      </div>
    </div>
  );
}
