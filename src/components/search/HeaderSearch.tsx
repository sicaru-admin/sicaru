import { Search } from "lucide-react";

export function HeaderSearch() {
  return (
    <form action="/productos" method="get" role="search" aria-label="Buscar productos SICARÚ" className="mx-auto max-w-[1400px] px-4 pb-3 sm:px-8 lg:px-10">
      <div className="flex min-h-11 items-center overflow-hidden rounded-full border border-[#9b89a8]/35 bg-[#f5f1eb] transition-colors focus-within:border-[#7f6d8a] focus-within:ring-2 focus-within:ring-[#7f6d8a]/20">
        <label htmlFor="storefront-search" className="sr-only">Buscar tinte, tono, marca o producto</label>
        <input id="storefront-search" name="q" type="search" maxLength={120} placeholder="Buscar tinte, tono, marca o producto..." className="min-w-0 flex-1 bg-transparent py-2.5 pl-4 text-sm text-[#2e2b2b] outline-none placeholder:text-[#2e2b2b]/60 sm:text-base" />
        <button type="submit" aria-label="Buscar productos" className="flex min-h-11 w-12 shrink-0 items-center justify-center text-[#7f6d8a] transition-colors hover:bg-[#efe7dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#7f6d8a]">
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
