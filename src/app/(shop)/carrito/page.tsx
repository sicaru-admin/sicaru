"use client";
export const dynamic="force-dynamic";
import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useCart} from "@/components/cart/CartProvider";
import {getCartLineVariantLabel} from "@/components/cart/cart-line-variant";
import {formatCurrency} from "@/lib/order-totals";
import {LocalDeliveryNotice} from "@/components/checkout/LocalDeliveryNotice";
export default function CarritoPage(){
  const {cart,isLoading,isInitializingCart,cartError,retryInitializeCart,updateQuantity,removeFromCart}=useCart();
  const [rowError,setRowError]=useState<{id:string;message:string}|null>(null);
  const [failedImages,setFailedImages]=useState<string[]>([]);
  async function change(id:string,operation:()=>Promise<void>){setRowError(null);try{await operation();}catch{setRowError({id,message:"No pudimos actualizar este artículo. Revisa la cantidad o elimínalo; los demás productos siguen guardados."});}}
  const inclusive=cart?.items.every(item=>(item as {is_tax_inclusive?:boolean}).is_tax_inclusive);
  return <div className="mx-auto max-w-5xl px-4 py-6"><h1 className="mb-5 text-3xl">Tu carrito</h1>
    {cartError&&!rowError&&<div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{cartError}{!cart&&<button onClick={()=>void retryInitializeCart().catch(()=>{})} className="ml-2 min-h-11 underline">Reintentar</button>}</div>}
    {!cart&&(isLoading||isInitializingCart)?<p>Cargando carrito…</p>:!cart?.items.length?<div className="py-8"><p>Tu carrito está vacío.</p><Link href="/productos" className="sicaru-button-primary mt-4">Comprar productos</Link></div>:<div className="grid items-start gap-5 lg:grid-cols-[1fr_340px]">
      <ul className="divide-y divide-sicaru-purple-200">{cart.items.map(item=><li key={item.id} className="flex min-w-0 gap-3 py-4">
        <div className="relative h-20 w-20 shrink-0 rounded-md border border-sicaru-purple-200 bg-white">
          {item.thumbnail&&!failedImages.includes(item.id)?<Image src={item.thumbnail} fill sizes="80px" alt={item.title} onError={()=>setFailedImages(current=>[...current,item.id])} className="object-contain p-1"/>:<span className="flex h-full items-center justify-center p-2 text-center text-[10px] text-gray-500">Sin imagen</span>}
        </div>
        <div className="min-w-0 flex-1"><h2 className="font-body text-sm font-medium leading-5">{item.title}</h2><p className="mt-1 text-xs text-gray-600">{getCartLineVariantLabel(item)}</p><p className="mt-1 text-sm">{formatCurrency(item.unit_price)} c/u</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2"><button aria-label={`Disminuir cantidad de ${item.title}`} disabled={isLoading||item.quantity<=1} onClick={()=>void change(item.id,()=>updateQuantity(item.id,item.quantity-1))} className="h-11 w-11 rounded-md border disabled:opacity-40">−</button><span aria-label="Cantidad" className="min-w-5 text-center text-sm">{item.quantity}</span><button aria-label={`Aumentar cantidad de ${item.title}`} disabled={isLoading} onClick={()=>void change(item.id,()=>updateQuantity(item.id,item.quantity+1))} className="h-11 w-11 rounded-md border disabled:opacity-40">+</button></div>
            <button disabled={isLoading} onClick={()=>void change(item.id,()=>removeFromCart(item.id))} className="min-h-11 text-xs text-red-800 underline">Eliminar</button>
          </div><p className="mt-1 text-right text-sm font-semibold">{formatCurrency((item as {total?:number}).total??item.unit_price*item.quantity)}</p>
          {rowError?.id===item.id&&<p role="alert" className="mt-2 text-xs text-red-800">{rowError.message}</p>}
        </div>
      </li>)}</ul>
      <section className="rounded-lg border border-sicaru-purple-200 bg-white p-4"><div className="flex justify-between text-lg font-semibold"><h2 className="font-body text-base">Subtotal</h2><p>{formatCurrency(cart.item_total)}</p></div>
        <p className="mt-2 text-xs text-gray-600">{inclusive?"IVA incluido. Envío al continuar.":"IVA calculado en el subtotal. Envío al continuar."}</p>
        <Link href="/checkout" className="sicaru-button-primary mt-4 w-full">Finalizar compra</Link>
        <LocalDeliveryNotice items={cart.items.map(item=>({...item,variant_title:getCartLineVariantLabel(item)}))} subtotal={cart.item_total}/>
      </section>
    </div>}
  </div>;
}
