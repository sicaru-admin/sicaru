import Image from "next/image";

const products = [
  {
    src: "/images/products-hero/xiomara-ten-tu.webp",
    alt: "Tratamiento Xiomara Ten+Tu para cuidado capilar profesional",
    className:
      "left-[5%] top-[34%] z-10 w-[38%] opacity-95 md:left-[1%] md:top-[32%] md:w-[36%]",
  },
  {
    src: "/images/products-hero/vitale-bifase-pro-keratin.webp",
    alt: "Vitale Bifase Pro Keratin para protección capilar",
    className:
      "left-[31%] top-[6%] z-30 w-[32%] md:left-[31%] md:top-[3%] md:w-[31%]",
    priority: true,
  },
  {
    src: "/images/products-hero/hidra-color-mask.webp",
    alt: "Hidra Color Mask para coloración capilar",
    className:
      "right-[5%] top-[28%] z-20 w-[34%] md:right-[5%] md:top-[24%] md:w-[33%]",
  },
  {
    src: "/images/products-hero/voglia-color-fun.webp",
    alt: "Voglia Color Fun coloración profesional",
    className:
      "bottom-[3%] left-[43%] z-40 hidden w-[23%] md:block",
  },
];

export function HomeHeroVisual() {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-[560px] overflow-hidden sm:h-[410px] md:h-[520px] md:max-w-none lg:h-[580px]">
      <div className="absolute right-[2%] top-[8%] h-[74%] w-[42%] rounded-[8px] bg-[#7f6d8a]" />
      <div className="absolute left-[7%] top-[14%] h-[54%] w-[44%] rounded-[8px] bg-[#faf8f5]" />

      <div className="absolute bottom-[5%] right-[9%] z-0 w-[42%] overflow-hidden rounded-[8px] border border-[#faf8f5] bg-[#efe7dd] p-2 shadow-[0_14px_30px_rgba(127,109,138,0.14)] md:bottom-[7%] md:right-[10%] md:w-[40%]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[#efe7dd]">
          <Image
            src="/images/hero-productos-tienda.jpg"
            alt="Productos profesionales de belleza Sicarú en tienda"
            fill
            sizes="(max-width: 768px) 42vw, 260px"
            className="object-cover object-center"
          />
        </div>
      </div>

      {products.map((product) => (
        <div
          key={product.src}
          className={`absolute aspect-[6/7] drop-shadow-[0_18px_24px_rgba(127,109,138,0.18)] ${product.className}`}
        >
          <Image
            src={product.src}
            alt={product.alt}
            fill
            priority={product.priority}
            sizes="(max-width: 768px) 38vw, 210px"
            className="object-contain object-center"
          />
        </div>
      ))}
    </div>
  );
}
