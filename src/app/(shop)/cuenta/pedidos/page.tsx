export default function PedidosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold text-sicaru-purple-900 md:text-4xl">
        Mis Pedidos
      </h1>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
        <p className="text-lg text-gray-600">No tienes pedidos aun.</p>
        <a
          href="/productos"
          className="mt-6 inline-block rounded-full bg-sicaru-pink px-8 py-3 font-semibold text-white transition-colors hover:bg-sicaru-pink/90"
        >
          Explorar Productos
        </a>
      </div>
    </div>
  );
}
