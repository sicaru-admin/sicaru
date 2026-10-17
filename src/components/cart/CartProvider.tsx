"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { createCart, getCart, restoreCart, addItem, updateItem, removeItem } from "@/lib/data/cart";
import { getMexicoRegion } from "@/lib/data/regions";

type CartItem = {
  id: string; title: string; variant_id: string; variant_title?: string | null;
  quantity: number; unit_price: number; thumbnail?: string | null;
};
type Cart = {
  id: string; items: CartItem[]; total: number; subtotal: number; item_total: number;
  item_subtotal?: number | null; shipping_subtotal?: number | null; shipping_total?: number | null;
  tax_total?: number | null; item_tax_total?: number | null; shipping_tax_total?: number | null;
  discount_total?: number | null; shipping_methods?: Array<unknown>;
};
type CartContextType = {
  cart: Cart | null; cartId: string | null; isLoading: boolean; isInitializingCart: boolean;
  cartError: string | null; isOpen: boolean; openCart: () => void; closeCart: () => void;
  retryInitializeCart: () => Promise<void>; addToCart: (id: string, quantity?: number) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>; removeFromCart: (id: string) => Promise<void>;
  refreshCart: () => Promise<void>; clearCart: () => void; totalItems: number;
};
const CartContext = createContext<CartContextType | null>(null);
const CART_ID_KEY = "sicaru_cart_id";
const PREPARATION_ERROR = "No pudimos cargar tu carrito. Revisa tu conexión e inténtalo nuevamente.";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializingCart, setIsInitializingCart] = useState(true);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<Cart | null>(null);
  const initRef = useRef<Promise<Cart> | null>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingRef = useRef(0);
  const addsRef = useRef(new Map<string, Promise<void>>());
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const storeCart = useCallback((next: Cart) => {
    localStorage.setItem(CART_ID_KEY, next.id);
    cartRef.current = next; setCartId(next.id); setCart(next); setCartError(null);
  }, []);

  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (cartRef.current) return cartRef.current;
    if (!initRef.current) {
      setIsInitializingCart(true);
      initRef.current = (async () => {
        const storedId = localStorage.getItem(CART_ID_KEY);
        if (storedId) {
          try {
            const existing = await restoreCart(storedId);
            if (existing?.id && !existing.completed_at) {
              const restored = existing as unknown as Cart; storeCart(restored); return restored;
            }
            localStorage.removeItem(CART_ID_KEY);
          } catch (error) {
            // A transient network failure must not discard a saved cart.
            if ((error as { status?: number }).status !== 404) throw error;
            localStorage.removeItem(CART_ID_KEY);
          }
        }
        const region = await getMexicoRegion();
        if (!region?.id) throw new Error(PREPARATION_ERROR);
        const created = await createCart(region.id);
        if (!created?.id) throw new Error(PREPARATION_ERROR);
        const next = created as unknown as Cart; storeCart(next); return next;
      })().catch(() => {
        setCartError(PREPARATION_ERROR); throw new Error(PREPARATION_ERROR);
      }).finally(() => {
        initRef.current = null; setIsInitializingCart(false);
      });
    }
    return initRef.current;
  }, [storeCart]);

  useEffect(() => { const timer = window.setTimeout(() => { void ensureCart().catch(() => {}); }, 0); return () => window.clearTimeout(timer); }, [ensureCart]);
  const retryInitializeCart = useCallback(async () => { await ensureCart(); }, [ensureCart]);

  const mutate = useCallback((operation: (active: Cart) => Promise<Cart>, message: string) => {
    pendingRef.current++; setIsLoading(true); setCartError(null);
    const task = queueRef.current.then(async () => {
      const active = await ensureCart();
      storeCart(await operation(active));
    }).catch(() => {
      setCartError(message); throw new Error(message);
    }).finally(() => {
      pendingRef.current--; setIsLoading(pendingRef.current > 0);
    });
    // Serialize distinct changes without swallowing a caller's failed operation.
    queueRef.current = task.catch(() => {});
    return task;
  }, [ensureCart, storeCart]);

  const addToCart = useCallback((variantId: string, quantity = 1) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return Promise.reject(new Error("Selecciona una cantidad válida."));
    const key = variantId + ":" + quantity;
    const pending = addsRef.current.get(key);
    if (pending) return pending;
    const task = mutate(async active => {
      const next = await addItem(active.id, variantId, quantity);
      openCart(); return next as unknown as Cart;
    }, "No pudimos agregar el producto. Revisa la disponibilidad e inténtalo nuevamente.")
      .finally(() => addsRef.current.delete(key));
    addsRef.current.set(key, task); return task;
  }, [mutate, openCart]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!Number.isSafeInteger(quantity) || quantity < 1) return Promise.reject(new Error("Selecciona una cantidad válida."));
    return mutate(async active => await updateItem(active.id, id, quantity) as unknown as Cart,
      "No pudimos cambiar la cantidad. El carrito conserva la cantidad anterior; inténtalo nuevamente.");
  }, [mutate]);
  const removeFromCart = useCallback((id: string) => mutate(
    async active => await removeItem(active.id, id) as unknown as Cart,
    "No pudimos eliminar el producto. Sigue en tu carrito; inténtalo nuevamente."
  ), [mutate]);
  const refreshCart = useCallback(async () => {
    const id = cartRef.current?.id || localStorage.getItem(CART_ID_KEY);
    if (!id) return;
    try { storeCart(await getCart(id) as unknown as Cart); }
    catch { setCartError(PREPARATION_ERROR); throw new Error(PREPARATION_ERROR); }
  }, [storeCart]);
  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY); cartRef.current = null; setCart(null); setCartId(null); setCartError(null);
  }, []);
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  return <CartContext.Provider value={{cart, cartId, isLoading, isInitializingCart, cartError, isOpen,
    openCart, closeCart, retryInitializeCart, addToCart, updateQuantity, removeFromCart, refreshCart, clearCart, totalItems}}>
    {children}
  </CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
