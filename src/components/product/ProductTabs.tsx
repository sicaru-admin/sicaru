import {
  ProductInfoSections,
  type ProductInfoSection,
} from "./ProductInfoSections";

type ProductTabsProps = {
  description: string | null;
  material: string | null;
};

export function ProductTabs({ description, material }: ProductTabsProps) {
  const sections: ProductInfoSection[] = [
    {
      id: "descripcion",
      title: "Descripción",
      content: description,
    },
    {
      id: "ingredientes",
      title: "Ingredientes",
      content: material,
    },
  ];

  return <ProductInfoSections sections={sections} />;
}
