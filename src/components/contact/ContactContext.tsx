"use client";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
export type ProductContact = { title: string; variant: string | null; quantity: number; subtotal?: number };
const Context = createContext<{ product: ProductContact | null; setProduct: (value: ProductContact | null) => void }>({product:null,setProduct:()=>{}});
export function ContactProvider({ children }: { children: ReactNode }) {
  const [product, update] = useState<ProductContact | null>(null);
  const setProduct = useCallback((value: ProductContact | null) => update(value), []);
  return <Context.Provider value={{product,setProduct}}>{children}</Context.Provider>;
}
export const useProductContact = () => useContext(Context);
