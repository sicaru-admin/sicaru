export function ProductTabs({description,material}:{description:string|null;material:string|null}) {
  if(!description&&!material)return null;
  return <section aria-label="Información del producto" className="divide-y divide-sicaru-purple-200 border-y border-sicaru-purple-200">
    {description&&<details><summary className="min-h-12 cursor-pointer py-4 font-medium">Descripción</summary><p className="whitespace-pre-line pb-4 text-sm leading-6 text-gray-600">{description}</p></details>}
    {material&&<details><summary className="min-h-12 cursor-pointer py-4 font-medium">Información adicional</summary><p className="whitespace-pre-line pb-4 text-sm leading-6 text-gray-600">{material}</p></details>}
  </section>;
}
