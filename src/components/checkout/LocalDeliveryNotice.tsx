"use client";
import { useId, useState } from "react";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { getLocalDeliveryMessage, LOCAL_STANDARD_ZONES, LOCAL_DELIVERY_OUTSKIRTS, type LocalDeliveryItem } from "@/lib/shipping";
export function LocalDeliveryNotice({items,subtotal,label="¿Entrega local? Pídela por WhatsApp · $40"}:{
  items?: LocalDeliveryItem[] | null; subtotal?: number | null; label?: string;
}) {
  const [zone,setZone]=useState("");
  const id=useId();
  return <aside aria-label="Entrega local en Cadereyta" className="mt-4 border-t border-sicaru-purple-200 pt-4">
    <p className="text-xs leading-5 text-gray-600">$40 en la zona urbana de Cadereyta Jiménez. Se coordina por WhatsApp fuera del checkout.</p>
    <details className="mt-2 text-xs leading-5 text-gray-600"><summary className="min-h-11 cursor-pointer py-3 font-medium text-sicaru-purple-700">Ver zonas de entrega</summary>
      <p>Incluye Centro, Alberos, Bella Vista y Candelario.</p><p className="mt-2">{LOCAL_DELIVERY_OUTSKIRTS}</p>
    </details>
    <label htmlFor={id} className="block text-xs text-gray-600">Tu zona (opcional)</label>
    <select id={id} value={zone} onChange={e=>setZone(e.target.value)} className="mt-1 min-h-11 w-full rounded-md border border-gray-300 bg-white px-2 text-sm">
      <option value="">Consultar cobertura</option>{LOCAL_STANDARD_ZONES.map(z=><option key={z}>{z}</option>)}
      <option>Santa Anita</option><option>Palma Nova</option><option>Valle del Roble</option><option>Otra zona</option>
    </select>
    <WhatsAppLink message={getLocalDeliveryMessage(items ?? [],subtotal,zone)}
      className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-green-800 underline underline-offset-4">{label}</WhatsAppLink>
  </aside>;
}

