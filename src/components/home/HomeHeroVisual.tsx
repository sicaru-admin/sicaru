import Image from "next/image";
import Link from "next/link";

// Existing product photographs are reused byte-for-byte; no packaging is recreated.
export function HomeHeroVisual() {
  return (
    <Link href="/productos" aria-label="Explorar productos SICARÚ" className="relative mx-auto block h-[230px] w-full min-w-0 max-w-[400px] rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a] sm:h-[310px] lg:h-[350px]">
      {/* Narrow frames crop transparent margins only, keeping each package intact. */}
      <div className="absolute -left-2 bottom-0 h-[92%] w-1/2 sm:left-0 sm:h-[88%] sm:w-[40%]">
        <Image src="/images/products-hero/voglia-total-repair.webp" alt="Voglia Total Repair, tratamiento para cabello maltratado, 250 ml" fill priority sizes="(max-width: 639px) 200px, 320px" className="object-cover drop-shadow-[0_6px_5px_rgba(46,43,43,0.10)]" />
      </div>
      <div className="absolute bottom-0 left-[30%] hidden h-full w-[35%] sm:block">
        <Image src="/images/products-hero/vitale-bifase-pro-keratin.webp" alt="Vitale Bifase Pro-Keratin, tratamiento acondicionador en dos fases" fill sizes="320px" className="object-cover drop-shadow-[0_6px_5px_rgba(46,43,43,0.10)]" />
      </div>
      <div className="absolute -right-1 bottom-0 h-[68%] w-[58%] sm:right-0 sm:h-[72%] sm:w-[45%]">
        <Image src="/images/products-hero/hidra-color-mask.webp" alt="Hidra Color Mask, tratamiento matizante violeta, 150 g" fill priority sizes="(max-width: 639px) 200px, 320px" className="object-cover drop-shadow-[0_6px_5px_rgba(46,43,43,0.10)]" />
      </div>
    </Link>
  );
}
