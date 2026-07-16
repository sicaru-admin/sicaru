type ProductsCatalogToolbarProps = {
  count: number;
};

export function ProductsCatalogToolbar({ count }: ProductsCatalogToolbarProps) {
  return (
    <div className="border-y border-[#efe7dd] py-4">
      <div>
        <h2 className="font-heading text-2xl font-semibold leading-tight text-[#2e2b2b]">
          Todos los productos
        </h2>
        <p className="mt-1 text-sm text-[#2e2b2b]/62">
          {count} resultado{count !== 1 ? "s" : ""} disponible
          {count !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
