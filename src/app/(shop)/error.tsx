"use client";

import Link from "next/link";

export default function ShopError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="font-heading text-3xl font-medium text-[#2e2b2b]">No pudimos cargar esta página.</h1>
      <p className="mt-4 text-sm leading-7 text-[#2e2b2b]/70">Puedes intentarlo de nuevo o seguir explorando SICARÚ.</p>
      <button onClick={reset} className="mt-6 inline-flex min-h-12 items-center rounded-[6px] bg-[#7f6d8a] px-6 py-3 text-sm font-semibold text-white">Intentar de nuevo</button>
      <Link href="/" className="mt-4 flex min-h-11 items-center justify-center text-sm text-[#7f6d8a] underline underline-offset-4">Volver al inicio</Link>
    </div>
  );
}
