type Variant = { title?: string | null; sku?: string | null; calculated_price?: { calculated_amount?: number | null } | null; options?: { value?: string | null }[] | null };
type Product = { title?: string | null; description?: string | null; collection?: {title?:string|null} | null; variants?: Variant[] | null };
export function getProductPriceRange(product: Product) {
  const amounts=(product.variants??[]).map(v=>v.calculated_price?.calculated_amount).filter((n):n is number=>typeof n==="number" && Number.isFinite(n) && n>=0);
  return amounts.length ? {minimum:Math.min(...amounts),maximum:Math.max(...amounts),varies:new Set(amounts).size>1} : null;
}
const normalize=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
export function matchesCatalogQuery(product:Product,query:string) {
  const text=normalize([product.title,product.description,product.collection?.title,...(product.variants??[]).flatMap(v=>[v.title,v.sku,...(v.options??[]).map(o=>o.value)])].filter(Boolean).join(" "));
  return normalize(query).split(/\s+/).every(token=>text.includes(token));
}
export function categoryLabel(category:{name?:string|null;handle?:string|null}) {
  const value=normalize((category.name??"")+" "+(category.handle??""));
  if(/tint|color/.test(value))return "Coloración";
  if(/tratam|mascar|kerat/.test(value))return "Tratamientos";
  if(/herram|electr|plancha|secad/.test(value))return "Herramientas";
  if(/acces|cepill|peine/.test(value))return "Accesorios";
  if(/shamp|acond|styling|cuidado/.test(value))return "Cuidado del cabello";
  return category.name??"Otros";
}
