"use client";
import {createContext,useCallback,useContext,useRef,useMemo,type ReactNode} from "react";
import type {CheckoutDraft} from "@/lib/checkout-draft";
const Context=createContext<{read:(id:string)=>CheckoutDraft|null;write:(id:string,draft:CheckoutDraft)=>void;clear:(id:string)=>void}>({read:()=>null,write:()=>{},clear:()=>{}});
export function CheckoutMemoryProvider({children}:{children:ReactNode}){
  const drafts=useRef(new Map<string,CheckoutDraft>());
  const read=useCallback((id:string)=>drafts.current.get(id)??null,[]);
  const write=useCallback((id:string,draft:CheckoutDraft)=>{drafts.current.set(id,draft);},[]);
  const clear=useCallback((id:string)=>{drafts.current.delete(id);},[]);
  const value=useMemo(()=>({read,write,clear}),[read,write,clear]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useCheckoutMemory=()=>useContext(Context);
