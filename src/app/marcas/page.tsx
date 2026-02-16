import type { Metadata } from "next";
import Link from "next/link";
import { getCollections } from "@/lib/data/collections";

export const metadata: Metadata = {
  title: "Nuestras Marcas",
  description:
    "Descubre las marcas de belleza profesional que distribuimos: Küül, Voglia, Nekane Capilar, Hidra Color, Xiomara, Vitale y Montis.",
};

export const revalidate = 1800;

export default async function MarcasPage() {
  let collections: Awaited<ReturnType<typeof getCollections>>["collections"] = [];

  try {
    const data = await getCollections();
    collections = data.collections;
  } catch {
    // Backend may not be available
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Nuestras Marcas
      </h1>

      {collections.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay marcas disponibles en este momento.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/marcas/${collection.handle}`}
              className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-lg"
            >
              <h2 className="text-lg font-semibold text-sicaru-purple-900 group-hover:text-sicaru-pink transition-colors">
                {collection.title}
              </h2>
              {typeof collection.metadata?.description === "string" && (
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                  {collection.metadata.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
