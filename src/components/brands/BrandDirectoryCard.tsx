import Link from "next/link";
import { ArrowRight } from "lucide-react";

type BrandDirectoryCardProps = {
  brand: {
    name: string;
    handle: string;
    description: string;
  };
};

export function BrandDirectoryCard({ brand }: BrandDirectoryCardProps) {
  const initial = brand.name.trim().charAt(0);

  return (
    <Link
      href={`/marcas/${brand.handle}`}
      className="group flex min-h-[15rem] flex-col border border-[#efe7dd] bg-[#faf8f5] p-5 transition-colors duration-200 hover:border-[#9b89a8] hover:bg-[#f5f1eb] focus:outline-none focus-visible:border-[#7f6d8a] focus-visible:shadow-[0_0_0_3px_rgba(127,109,138,0.16)] md:p-6"
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#efe7dd] bg-[#f5f1eb] font-heading text-2xl font-medium text-[#7f6d8a]"
      >
        {initial}
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        <h2 className="font-heading text-2xl font-medium leading-tight text-[#2e2b2b]">
          {brand.name}
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#8e7a9e]">
          {brand.description}
        </p>
        <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 text-xs font-semibold uppercase tracking-[0.08em] text-[#7f6d8a]">
          Ver productos
          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}
