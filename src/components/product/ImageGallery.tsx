"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

type ImageGalleryProps = {
  images: { id: string; url: string }[];
  title: string;
  reserveImageSpace?: boolean;
  reserveThumbnails?: boolean;
};

export function ImageGallery({ images, title, reserveImageSpace = false, reserveThumbnails = false }: ImageGalleryProps) {
  const [selected, setSelected] = useState(0);
  const selectedIndex = Math.max(0, Math.min(selected, images.length - 1));
  const selectedImage = images[selectedIndex];
  const hasThumbnails = images.length > 1;

  return (
    <div>
      <div className={`relative aspect-[16/10] w-full overflow-hidden border border-[#efe7dd] bg-[#faf8f5] md:aspect-square lg:aspect-auto ${
        selectedImage || reserveImageSpace ? "lg:h-[600px] xl:h-[620px]" : "lg:h-[460px] xl:h-[500px]"
      }`}>
        {selectedImage ? (
          <Image
            src={selectedImage.url}
            alt={`${title} - imagen ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 60vw, 56vw"
            className="object-contain"
            priority
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
            <ImageIcon
              aria-hidden="true"
              className="h-5 w-5 text-[#9b89a8] md:h-6 md:w-6"
              strokeWidth={1.35}
            />
            <div>
              <span className="block text-sm font-medium text-[#8E7A9E] md:text-base">
                Imagen no disponible
              </span>
              <span className="mt-1 block text-xs font-medium text-[#9B89A8] md:text-sm">
                Fotografía en actualización
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {(hasThumbnails || reserveThumbnails) && (
        <div
          className="mt-3 flex min-h-[68px] gap-2 overflow-x-auto pb-1"
          role={hasThumbnails ? "group" : undefined}
          aria-label={hasThumbnails ? "Fotografías del producto" : undefined}
          aria-hidden={!hasThumbnails || undefined}
        >
          {hasThumbnails && images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-pressed={i === selectedIndex}
              className={`relative h-16 w-16 shrink-0 overflow-hidden border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b89a8] ${
                i === selectedIndex
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
