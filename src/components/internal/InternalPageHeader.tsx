import Image from "next/image";

type InternalPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  secondaryLine?: string;
  image?: {
    src: string;
    alt: string;
    fit?: "cover" | "contain";
  };
};

export function InternalPageHeader({
  eyebrow,
  title,
  description,
  secondaryLine,
  image,
}: InternalPageHeaderProps) {
  return (
    <section className="border-b border-[#efe7dd] bg-[#faf8f5]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] md:items-center md:py-12 lg:gap-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-semibold leading-tight text-[#2e2b2b] md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#2e2b2b]/68">
            {description}
          </p>
          {secondaryLine ? (
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#7f6d8a]">
              {secondaryLine}
            </p>
          ) : null}
        </div>

        <div className="relative h-48 overflow-hidden rounded-lg border border-[#efe7dd] bg-[#efe7dd] sm:h-56 md:h-64">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 420px"
              className={
                image.fit === "contain"
                  ? "object-contain object-center"
                  : "object-cover object-center"
              }
            />
          ) : (
            <div className="h-full w-full bg-[#efe7dd]" />
          )}
        </div>
      </div>
    </section>
  );
}
