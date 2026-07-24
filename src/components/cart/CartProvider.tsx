"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  createCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
} from "@/lib/data/cart";
import { getMexicoRegion } from "@/lib/data/regions";

type CartItem = {
  id: string;
  title: string;
  variant_id: string;
  quantity: number;
  unit_price: number;
  thumbnail?: string | null;
};

type Cart = {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  item_total: number;
};

type CartContextType = {
  cart: Cart | null;
  cartId: string | null;
  isLoading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineItemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_ID_KEY = "sicaru_cart_id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const initCart = useCallback(async () => {
    const storedCartId = localStorage.getItem(CART_ID_KEY);

    if (storedCartId) {
      try {
        const existingCart = await getCart(storedCartId);
        if (existingCart) {
          setCartId(storedCartId);
          setCart(existingCart as unknown as Cart);
          return;
        }
      } catch {
        localStorage.removeItem(CART_ID_KEY);
      }
    }

    try {
      const region = await getMexicoRegion();
      if (region) {
        const newCart = await createCart(region.id);
        localStorage.setItem(CART_ID_KEY, newCart.id);
        setCartId(newCart.id);
        setCart(newCart as unknown as Cart);
      }
    } catch (error) {
      console.error("Error initializing cart:", error);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      initCart();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initCart]);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      if (!cart) {
        throw new Error(
          "El carrito todavia no esta listo. Intenta de nuevo en unos segundos."
        );
      }

      setIsLoading(true);
      try {
        const updatedCart = await addItem(cart.id, variantId, quantity);
        setCart(updatedCart as unknown as Cart);
        openCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cart, openCart]
  );

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updatedCart = await updateItem(cart.id, lineItemId, quantity);
        setCart(updatedCart as unknown as Cart);
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updatedCart = await removeItem(cart.id, lineItemId);
        setCart(updatedCart as unknown as Cart);
      } catch (error) {
        console.error("Error removing from cart:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const refreshCart = useCallback(async () => {
    const id = cartId || localStorage.getItem(CART_ID_KEY);
    if (!id) return;
    try {
      const refreshed = await getCart(id);
      if (refreshed) {
        setCart(refreshed as unknown as Cart);
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  }, [cartId]);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY);
    setCart(null);
    setCartId(null);
  }, []);

  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
        isLoading,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
