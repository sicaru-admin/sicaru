import type {Metadata} from "next";
import {LocalDeliveryNotice} from "@/components/checkout/LocalDeliveryNotice";
export const metadata:Metadata={title:"Envíos y entregas",description:"Paquetería y entrega local en Cadereyta Jiménez."};
export default function EnviosPage(){return <div className="mx-auto max-w-2xl space-y-6 px-4 py-7"><h1 className="text-3xl">Envíos y entregas</h1><section><h2 className="text-xl">Paquetería</h2><p className="mt-2 text-sm leading-6 text-gray-600">El costo y las condiciones de entrega se muestran antes de pagar. Si tu compra requiere cotización, conservamos tu carrito y puedes consultar el envío.</p></section><section><h2 className="text-xl">Entrega local · $40 MXN</h2><LocalDeliveryNotice/></section></div>;}
