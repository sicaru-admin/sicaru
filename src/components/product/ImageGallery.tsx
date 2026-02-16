"use client";

import { useState } from "react";
import Image from "next/image";

type ImageGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
};

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);

  // If no images, show gradient placeholder
  if (images.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-sicaru-purple-200 to-sicaru-purple-400">
        <div className="flex h-full items-center justify-center">
          <span className="text-lg font-medium text-white/60">
            Imagen no disponible
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={images[selected].url}
          alt={`${title} - imagen ${selected + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                i === selected
                  ? "border-sicaru-pink"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} - miniatura ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
