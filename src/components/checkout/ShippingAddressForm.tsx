"use client";
import {useState} from "react";
import {MEXICAN_STATES} from "@/lib/constants/mexican-states";
type Address={first_name:string;last_name:string;phone:string;address_1:string;address_2:string;city:string;province:string;postal_code:string;country_code:string;interior?:string;references?:string};
type Props={address:Address;email?:string;onEmailChange?:(email:string)=>void;onAddressChange:(address:Address)=>void;onSubmit:()=>Promise<void>;isLoading:boolean;remember?:boolean;onRememberChange?:(value:boolean)=>void;onForget?:()=>void};
export function ShippingAddressForm({address,email,onEmailChange,onAddressChange,onSubmit,isLoading,remember=false,onRememberChange,onForget}:Props){
  const [errors,setErrors]=useState<Record<string,string>>({});
  function update(key:keyof Address,value:string){onAddressChange({...address,[key]:value});setErrors(old=>({...old,[key]:""}));}
  const fullName=[address.first_name,address.last_name].filter(Boolean).join(" ");
  async function submit(e:React.FormEvent){e.preventDefault();const next:Record<string,string>={};if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))next.email="Ingresa un correo válido.";
    for(const key of ["first_name","last_name","address_1","address_2","city","province"] as const)if(!address[key].trim())next[key]="Completa este dato.";
    if(!/^\d{10}$/.test(address.phone))next.phone="Ingresa 10 dígitos.";if(!/^\d{5}$/.test(address.postal_code))next.postal_code="Ingresa 5 dígitos.";
    setErrors(next);if(Object.keys(next).length){document.getElementById(Object.keys(next)[0]==="email"?"checkout-email":["first_name","last_name"].includes(Object.keys(next)[0])?"shipping-name":"shipping-"+Object.keys(next)[0])?.focus();return;}await onSubmit();
  }
  const field="mt-1 min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm";
  function input(key:keyof Address,label:string,autoComplete:string,type="text",numeric=false){return <div><label htmlFor={"shipping-"+key} className="text-sm">{label}</label><input id={"shipping-"+key} name={key} type={type} autoComplete={autoComplete} inputMode={numeric?"numeric":undefined} value={address[key]??""} onChange={e=>update(key,numeric?e.target.value.replace(/\D/g,"").slice(0,key==="phone"?10:5):e.target.value)} className={field} aria-invalid={!!errors[key]} aria-describedby={errors[key]?"error-"+key:undefined}/>{errors[key]&&<p id={"error-"+key} className="mt-1 text-xs text-red-700">{errors[key]}</p>}</div>;}
  return <form onSubmit={submit} className="space-y-3" noValidate>
    {onEmailChange&&<div><label htmlFor="checkout-email" className="text-sm">Correo electrónico</label><input id="checkout-email" name="email" type="email" autoComplete="email" value={email??""} onChange={e=>onEmailChange(e.target.value)} className={field} aria-invalid={!!errors.email}/>{errors.email&&<p className="mt-1 text-xs text-red-700">{errors.email}</p>}</div>}
    <div><label htmlFor="shipping-name" className="text-sm">Nombre completo</label><input id="shipping-name" name="name" autoComplete="name" value={fullName} onChange={e=>{const value=e.target.value;const at=value.indexOf(" ");onAddressChange({...address,first_name:at<0||at===value.length-1?value:value.slice(0,at),last_name:at<0?"":value.slice(at+1)});setErrors(old=>({...old,first_name:"",last_name:""}));}} className={field} aria-invalid={!!errors.first_name||!!errors.last_name}/>{(errors.first_name||errors.last_name)&&<p className="mt-1 text-xs text-red-700">Escribe tu nombre y apellido.</p>}</div>
    {input("phone","Teléfono (10 dígitos)","tel-national","tel",true)}
    <div className="grid grid-cols-2 gap-3">{input("postal_code","Código postal","postal-code","text",true)}<div><label htmlFor="shipping-province" className="text-sm">Estado</label><select id="shipping-province" name="province" autoComplete="address-level1" value={address.province} onChange={e=>update("province",e.target.value)} className={field} aria-invalid={!!errors.province}><option value="">Seleccionar</option>{MEXICAN_STATES.map(state=><option key={state.value} value={state.value}>{state.label}</option>)}</select>{errors.province&&<p className="mt-1 text-xs text-red-700">{errors.province}</p>}</div></div>
    <div className="grid gap-3 sm:grid-cols-2">{input("city","Ciudad","address-level2")}{input("address_2","Colonia","address-level3")}</div>
    {input("address_1","Calle y número","address-line1")}
    <details className="text-sm"><summary className="min-h-11 cursor-pointer py-3 text-sicaru-purple-700">Interior y referencias (opcional)</summary><div className="space-y-3 pb-2">{input("interior","Interior","address-line2")}{input("references","Referencias","off")}</div></details>
    {onRememberChange&&<label className="flex min-h-11 items-center gap-2 text-xs text-gray-600"><input type="checkbox" checked={remember} onChange={e=>onRememberChange(e.target.checked)} className="h-4 w-4"/>Recordar mis datos en este dispositivo</label>}
    {remember&&onForget&&<button type="button" onClick={onForget} className="min-h-11 text-xs text-gray-600 underline">Borrar datos guardados</button>}
    <button type="submit" disabled={isLoading} className="sicaru-button-primary w-full disabled:opacity-50">{isLoading?"Guardando…":"Continuar compra"}</button>
  </form>;
}
