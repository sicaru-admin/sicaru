import Link from "next/link";

type ProductEmbedProps = {
  handle: string;
  name: string;
  price: string;
  image?: string;
};

export function ProductEmbed({ handle, name, price, image }: ProductEmbedProps) {
  return (
    <div className="my-6 flex items-center gap-4 rounded-lg border border-sicaru-purple-200 bg-sicaru-purple-50 p-4">
      {image ? (
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-sicaru-purple-100 text-sicaru-purple-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
      )}
      <div className="flex-1">
        <Link
          href={`/productos/${handle}`}
          className="font-heading text-base font-bold text-sicaru-purple-900 hover:text-sicaru-pink"
        >
          {name}
        </Link>
        <p className="mt-1 text-sm font-semibold text-sicaru-purple-700">
          {price}
        </p>
        <Link
          href={`/productos/${handle}`}
          className="mt-1 inline-block text-xs font-semibold text-sicaru-pink hover:text-sicaru-pink/80"
        >
          Ver producto &rarr;
        </Link>
      </div>
    </div>
  );
}
