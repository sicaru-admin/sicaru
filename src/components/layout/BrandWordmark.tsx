import Image from "next/image";
import Link from "next/link";

type BrandWordmarkProps = {
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Official SICARÚ logo, including the descriptor "PRODUCTOS DE BELLEZA".
 * The transparent margins of the original 1600×993 file are clipped for
 * legibility, but the artwork (lettering, accent and descriptor) is intact.
 */
export function BrandWordmark({
  variant = "dark",
  className = "",
}: BrandWordmarkProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      aria-label="SICARÚ, productos de belleza. Ir al inicio"
      className={`sicaru-wordmark ${isLight ? "sicaru-wordmark-light" : "sicaru-wordmark-dark"} relative shrink-0 overflow-hidden ${isLight ? "h-[68px] w-[218px]" : "h-[56px] w-[178px] sm:h-[62px] sm:w-[196px] md:h-[58px] md:w-[188px] lg:h-[74px] lg:w-[240px]"} ${className}`}
    >
      <Image
        src={isLight ? "/brand/logo-cream.png" : "/brand/logo-dark.png"}
        alt=""
        aria-hidden="true"
        width={1600}
        height={993}
        priority={!isLight}
        sizes={isLight ? "218px" : "(max-width: 639px) 178px, (max-width: 767px) 196px, (max-width: 1023px) 188px, 240px"}
        className={`pointer-events-none absolute left-0 h-auto w-full max-w-none select-none ${isLight ? "-top-[30px]" : "-top-[24px] sm:-top-[27px] md:-top-[26px] lg:-top-[33px]"}`}
      />
    </Link>
  );
}
