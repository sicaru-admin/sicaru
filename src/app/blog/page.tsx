import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog de Belleza",
  description:
    "Consejos, tendencias y tutoriales de belleza profesional. Tips para el cuidado del cabello y novedades de nuestras marcas.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Blog de Belleza
      </h1>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-lg text-gray-600">
          Proximamente: consejos y tendencias de belleza profesional.
        </p>
      </div>
    </div>
  );
}
