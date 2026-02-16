type ComparisonRow = {
  brand: string;
  product: string;
  price: string;
  rating: string;
  pros: string;
  cons: string;
};

type ComparisonTableProps = {
  data: ComparisonRow[];
};

export function ComparisonTable({ data }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="bg-sicaru-purple-800 text-white">
            <th className="px-4 py-3 font-semibold">Marca</th>
            <th className="px-4 py-3 font-semibold">Producto</th>
            <th className="px-4 py-3 font-semibold">Precio</th>
            <th className="px-4 py-3 font-semibold">Rating</th>
            <th className="px-4 py-3 font-semibold">Pros</th>
            <th className="px-4 py-3 font-semibold">Contras</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={
                i % 2 === 0 ? "bg-white" : "bg-sicaru-purple-50"
              }
            >
              <td className="px-4 py-3 font-medium text-sicaru-purple-900">
                {row.brand}
              </td>
              <td className="px-4 py-3">{row.product}</td>
              <td className="px-4 py-3 font-semibold">{row.price}</td>
              <td className="px-4 py-3">{row.rating}</td>
              <td className="px-4 py-3 text-green-700">{row.pros}</td>
              <td className="px-4 py-3 text-red-600">{row.cons}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
