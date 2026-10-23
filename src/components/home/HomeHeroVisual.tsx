import Image from "next/image";
import Link from "next/link";

// Existing product photographs are reused byte-for-byte; no packaging is recreated.
export function HomeHeroVisual() {
  return (
    <Link href="/productos" aria-label="Explorar productos SICARÚ" className="relative block h-[245px] min-w-0 rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7f6d8a] sm:h-[310px] lg:h-[360px]">
      <div className="absolute inset-x-0 bottom-2 top-8 rounded-[50%_50%_22px_22px] bg-[#9b89a8]/20 sm:inset-x-4" />
      <div className="absolute bottom-1 left-0 right-0 h-5 rounded-[50%] bg-[#7f6d8a]/10 blur-md" />
      <Image src="/images/products-hero/voglia-total-repair.webp" alt="Voglia Total Repair, tratamiento para cabello maltratado, 250 ml" width={1200} height={1400} priority sizes="(max-width: 767px) 200px, 300px" className="absolute -left-14 bottom-2 h-[78%] w-auto max-w-none drop-shadow-[0_8px_8px_rgba(46,43,43,0.13)] sm:-left-6 sm:h-[92%] lg:left-0" />
      <Image src="/images/products-hero/vitale-bifase-pro-keratin.webp" alt="Vitale Bifase Pro-Keratin, tratamiento acondicionador en dos fases" width={1200} height={1400} sizes="300px" className="absolute bottom-5 left-[12%] hidden h-[98%] w-auto max-w-none drop-shadow-[0_8px_8px_rgba(46,43,43,0.13)] sm:block" />
      <Image src="/images/products-hero/hidra-color-mask.webp" alt="Hidra Color Mask, tratamiento matizante violeta, 150 g" width={1200} height={1400} priority sizes="(max-width: 767px) 200px, 300px" className="absolute -left-1 bottom-2 h-[88%] w-auto max-w-none drop-shadow-[0_8px_8px_rgba(46,43,43,0.13)] sm:left-[35%] sm:h-[94%]" />
    </Link>
  );
}
