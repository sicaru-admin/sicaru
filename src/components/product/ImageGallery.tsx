"use client";

import { useState } from "react";
import Image from "next/image";

type ImageGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
};

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  // If no images, show a restrained editorial placeholder.
  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] w-full overflow-hidden border border-[#efe7dd] bg-[#faf8f5] md:aspect-square lg:aspect-auto lg:h-[460px] xl:h-[500px]">
        <div className="flex h-full items-center justify-center px-6 text-center">
          <span className="text-sm font-medium text-[#9b89a8] md:text-base">
            Imagen no disponible
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-[#efe7dd] bg-[#faf8f5] md:aspect-square lg:aspect-auto lg:h-[600px] xl:h-[620px]">
        <Image
          src={images[selected].url}
          alt={`${title} - imagen ${selected + 1}`}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 56vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8] ${
                i === selected
                  ? "border-[#7f6d8a] bg-[#faf8f5]"
                  : "border-[#efe7dd] bg-[#f5f1eb] opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} - miniatura ${i + 1}`}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
