export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Articulo
      </h1>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-lg text-gray-600">Contenido proximamente.</p>
        <p className="mt-2 text-sm text-gray-400">Slug: {slug}</p>
      </div>

      <div className="mt-8">
        <a
          href="/blog"
          className="text-sicaru-pink hover:text-sicaru-pink/80 font-medium"
        >
          &larr; Volver al Blog
        </a>
      </div>
    </div>
  );
}
