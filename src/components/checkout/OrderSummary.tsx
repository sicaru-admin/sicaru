"use client";
import Image from "next/image";
import type {HttpTypes} from "@medusajs/types";
import {formatCurrency} from "@/lib/order-totals";
import {getCartLineVariantLabel} from "@/components/cart/cart-line-variant";
type Props={cart:HttpTypes.StoreCart|null;shippingConfirmed?:boolean;isAuthenticated?:boolean;onCartRefresh?:()=>void};
export function OrderSummary({cart,shippingConfirmed=false}:Props){
  if(!cart)return <p>Cargando resumen…</p>;
  return <section aria-label="Resumen de compra" className="rounded-lg border border-sicaru-purple-200 bg-white p-4">
    <details><summary className="min-h-11 cursor-pointer py-2 text-sm font-medium">Resumen de productos ({(cart.items??[]).reduce((n,item)=>n+item.quantity,0)})</summary>
      <ul className="divide-y divide-gray-100">{(cart.items??[]).map(item=><li key={item.id} className="flex min-w-0 gap-3 py-3">{item.thumbnail&&<div className="relative h-12 w-12 shrink-0"><Image src={item.thumbnail} alt={item.product_title??"Producto"} fill sizes="48px" className="object-contain"/></div>}<div className="min-w-0 flex-1 text-xs"><p>{item.quantity} × {item.product_title??item.title}</p><p className="mt-1 text-gray-600">{getCartLineVariantLabel(item)}</p><p className="mt-1">{formatCurrency(item.total??item.unit_price*item.quantity)}</p></div></li>)}</ul>
    </details>
    <dl className="mt-3 space-y-2 border-t pt-3 text-sm"><div className="flex justify-between"><dt>Productos</dt><dd>{formatCurrency((cart.item_total??0)+(cart.discount_total??0))}</dd></div>
      {(cart.discount_total??0)>0&&<div className="flex justify-between text-green-800"><dt>Descuentos</dt><dd>−{formatCurrency(cart.discount_total)}</dd></div>}
      <div className="flex justify-between"><dt>Envío</dt><dd>{shippingConfirmed&&cart.shipping_total>0?formatCurrency(cart.shipping_total):"Por cotizar"}</dd></div>
      <div className="flex justify-between border-t pt-3 text-base font-semibold"><dt>{shippingConfirmed?"Total":"Subtotal"}</dt><dd>{formatCurrency(shippingConfirmed?cart.total:cart.item_total)}</dd></div>
    </dl>
    <p className="mt-2 text-xs text-gray-500">{(cart.items??[]).every(item=>item.is_tax_inclusive)?"IVA incluido.":"IVA calculado en el subtotal."}</p>
  </section>;
}
