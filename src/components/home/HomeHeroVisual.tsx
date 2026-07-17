import Image from "next/image";

const products = [
  {
    src: "/images/products-hero/voglia-total-repair.webp",
    alt: "Voglia Total Repair para reparación profesional del cabello",
    className:
      "left-[7%] top-[15%] z-20 w-[34%] md:left-[11%] md:top-[14%] md:w-[33%]",
  },
  {
    src: "/images/products-hero/vitale-bifase-pro-keratin.webp",
    alt: "Vitale Bifase Pro Keratin para protección capilar",
    className:
      "left-[31%] top-[2%] z-40 w-[31%] md:left-[33%] md:top-[0%] md:w-[30%]",
    priority: true,
  },
  {
    src: "/images/products-hero/hidra-color-mask.webp",
    alt: "Hidra Color Mask para coloración capilar",
    className:
      "right-[8%] top-[20%] z-30 w-[34%] md:right-[10%] md:top-[18%] md:w-[33%]",
  },
];

export function HomeHeroVisual() {
  return (
    <div className="relative mx-auto h-[292px] w-full max-w-[520px] overflow-hidden sm:h-[340px] md:h-[420px] md:max-w-none lg:h-[462px]">
      <div className="absolute bottom-[10%] left-[8%] right-[9%] top-[18%] rounded-[8px] bg-[#efe7dd]" />
      <div className="absolute bottom-[17%] right-[10%] top-[7%] w-[34%] rounded-[8px] bg-[#7f6d8a]" />
      <div className="absolute bottom-[8%] left-[14%] right-[14%] h-px bg-[#9b89a8]/45" />

      {products.map((product) => (
        <div
          key={product.src}
          className={`absolute aspect-[6/7] drop-shadow-[0_14px_20px_rgba(127,109,138,0.16)] ${product.className}`}
        >
          <Image
            src={product.src}
            alt={product.alt}
            fill
            priority={product.priority}
            sizes="(max-width: 768px) 34vw, 190px"
            className="object-contain object-center"
          />
        </div>
      ))}
    </div>
  );
}
