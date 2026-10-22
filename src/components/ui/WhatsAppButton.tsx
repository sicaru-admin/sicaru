"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getSalesWhatsAppUrl } from "@/lib/contact";
import { useCart } from "@/components/cart/CartProvider";
import { getCartLineVariantLabel } from "@/components/cart/cart-line-variant";
import { useProductContact } from "@/components/contact/ContactContext";
import { ParcelQuoteNotice } from "@/components/checkout/ParcelQuoteNotice";

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [safe, setSafe] = useState(false);
  const dock = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const { cart } = useCart();
  const { product } = useProductContact();
  const isCart = pathname === "/carrito";
  const items = isCart ? (cart?.items ?? []).map(item => ({...item,variant_title:getCartLineVariantLabel(item)}))
    : product ? [{title:product.title,variant_title:product.variant,quantity:product.quantity}] : [];
  const subtotal = isCart ? cart?.item_total : product?.subtotal;
  const inquiry = ["Hola, quisiera consultar estos productos:", ...items.map(item =>
    "- " + item.quantity + " × " + item.title + (item.variant_title ? " (" + item.variant_title + ")" : "")),
    isCart && typeof subtotal === "number" ? "Subtotal: " + new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN"}).format(subtotal) + " MXN" : ""
  ].filter(Boolean).join("\n");

  useEffect(() => {
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const focused = document.activeElement;
        const editing = focused?.matches("input,select,textarea,[contenteditable=true]");
        const keyboard = !!window.visualViewport && window.visualViewport.height < window.innerHeight - 120;
        const box = trigger.current?.getBoundingClientRect();
        const overlap = box && Array.from(document.querySelectorAll("button,a,input,select,textarea,summary,[role=button]"))
          .some(el => {
            if (dock.current?.contains(el) || el.closest(".mobile-bottom-nav")) return false;
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && r.top < box.bottom + 5 && r.bottom > box.top - 5 && r.left < box.right + 5 && r.right > box.left - 5;
          });
        setSafe(!editing && !keyboard && !overlap);
      });
    };
    check();
    window.addEventListener("scroll", check, {passive:true});
    window.addEventListener("resize", check);
    document.addEventListener("focusin", check);
    document.addEventListener("focusout", check);
    window.visualViewport?.addEventListener("resize", check);
    const observer = new ResizeObserver(check); observer.observe(document.body);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll",check); window.removeEventListener("resize",check); document.removeEventListener("focusin",check);document.removeEventListener("focusout",check);window.visualViewport?.removeEventListener("resize",check); };
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => { if (!dock.current?.contains(e.target as Node)) setOpen(false); };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") {setOpen(false); trigger.current?.focus();} };
    document.addEventListener("pointerdown",outside); document.addEventListener("keydown",escape);
    dock.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
  },[open]);
  if (pathname.startsWith("/checkout")) return null;
  return <div ref={dock} className="whatsapp-dock" style={{visibility:safe || open ? "visible" : "hidden"}}>
    {open && <section id="whatsapp-options" role="dialog" aria-label="Contactar a Sicarú" className="mb-3 w-[min(320px,calc(100vw-32px))] rounded-xl border border-sicaru-purple-200 bg-white p-4 shadow-lg">
      <div className="flex items-center justify-between"><h2 className="text-lg">¿Cómo te ayudamos?</h2><button aria-label="Cerrar opciones de WhatsApp" onClick={()=>{setOpen(false);trigger.current?.focus();}} className="flex h-11 w-11 items-center justify-center"><X className="h-5 w-5" /></button></div>
      <a href={getSalesWhatsAppUrl(inquiry)} target="_blank" rel="noopener noreferrer" className="mt-2 flex min-h-11 items-center font-medium text-sicaru-purple-700 underline">Consultar producto</a>
      <ParcelQuoteNotice items={items} subtotal={subtotal} />
    </section>}
    <button ref={trigger} type="button" onClick={()=>setOpen(value=>!value)} aria-label="WhatsApp: abrir opciones de contacto" aria-expanded={open} aria-controls="whatsapp-options" className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1f7a48] text-white shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sicaru-purple-700">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.49 0 .15 5.34.15 11.9c0 2.1.55 4.15 1.59 5.96L.05 24l6.29-1.65a11.9 11.9 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.43-8.42ZM12.05 21.8a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.73.98 1-3.64-.24-.38a9.9 9.9 0 1 1 8.35 4.62Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.1 4.5.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.69.25-1.29.18-1.41-.08-.12-.27-.2-.57-.35Z"/></svg>
    </button>
  </div>;
}

