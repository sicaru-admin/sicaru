"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

export function ProductPhoto({ src, alt }: { src?: string | null; alt: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src || !/^(https?:\/\/|\/(?!\/))/.test(src)) {
    return <div className="flex h-full flex-col items-center justify-center gap-2 text-[#7f6d8a]"><ImageIcon className="h-7 w-7" strokeWidth={1.3} aria-hidden="true" /><span className="text-[0.65rem]">Imagen no disponible</span></div>;
  }
  return <Image src={src} alt={alt} fill unoptimized={!src.startsWith("/")} sizes="(max-width: 639px) 50vw, 25vw" className="object-contain p-3 drop-shadow-[0_5px_7px_rgba(46,43,43,0.08)] transition-transform duration-200 group-hover:scale-[1.025] motion-reduce:transition-none sm:p-5" onError={() => setFailedSrc(src)} />;
}
