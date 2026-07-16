import Image from "next/image";

const heroProducts = [
  {
    src: "/images/products-hero/xiomara-ten-tu.webp",
    alt: "Tratamiento Xiomara Ten+Tu para hidratación capilar",
    className:
      "left-[6%] top-[24%] z-10 w-[38%] opacity-95 md:left-[2%] md:top-[27%] md:w-[39%]",
  },
  {
    src: "/images/products-hero/voglia-total-repair.webp",
    alt: "Tratamiento Voglia Total Repair",
    className:
      "left-[21%] top-[6%] z-20 w-[34%] md:left-[19%] md:top-[5%] md:w-[35%]",
  },
  {
    src: "/images/products-hero/vitale-bifase-pro-keratin.webp",
    alt: "Vitale Bifase Pro Keratin protector capilar",
    className:
      "left-[38%] top-[0%] z-30 w-[30%] md:left-[39%] md:top-[-1%] md:w-[31%]",
    priority: true,
  },
  {
    src: "/images/products-hero/hidra-color-mask.webp",
    alt: "Hidra Color Mask tratamiento de color",
    className:
      "right-[8%] top-[19%] z-20 w-[33%] md:right-[6%] md:top-[18%] md:w-[34%]",
  },
  {
    src: "/images/products-hero/voglia-color-fun.webp",
    alt: "Voglia Color Fun coloración capilar",
    className:
      "bottom-[4%] right-[23%] z-40 w-[24%] md:bottom-[3%] md:right-[24%] md:w-[25%]",
  },
];

export function ProductsHeroComposition() {
  return (
    <div className="relative h-[320px] overflow-hidden rounded-lg border border-[#d8cedc] bg-[#efe7dd] sm:h-[390px] md:h-[500px] lg:h-[540px]">
      <div className="absolute inset-5 rounded-lg border border-[#faf8f5]/70" />
      {heroProducts.map((product) => (
        <div
          key={product.src}
          className={`absolute aspect-[6/7] drop-shadow-[0_18px_28px_rgba(46,43,43,0.16)] ${product.className}`}
        >
          <Image
            src={product.src}
            alt={product.alt}
            fill
            priority={product.priority}
            sizes="(max-width: 768px) 40vw, 210px"
            className="object-contain object-center"
          />
        </div>
      ))}
    </div>
  );
}
