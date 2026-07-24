"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
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
  const cartRef = useRef<Cart | null>(null);
  const initCartPromiseRef = useRef<Promise<Cart> | null>(null);
  const addToCartPromiseRef = useRef<Promise<void> | null>(null);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const storeCart = useCallback((nextCart: Cart) => {
    localStorage.setItem(CART_ID_KEY, nextCart.id);
    cartRef.current = nextCart;
    setCartId(nextCart.id);
    setCart(nextCart);
  }, []);

  const initCart = useCallback(async () => {
    const storedCartId = localStorage.getItem(CART_ID_KEY);

    if (storedCartId) {
      try {
        const existingCart = await getCart(storedCartId);
        if (existingCart?.id) {
          const nextCart = existingCart as unknown as Cart;
          storeCart(nextCart);
          return nextCart;
        }
      } catch (error) {
        console.error("Error retrieving cart:", error);
        localStorage.removeItem(CART_ID_KEY);
      }
    }

    const region = await getMexicoRegion();
    if (!region?.id) {
      throw new Error("No pudimos encontrar la region de compra.");
    }

    const newCart = await createCart(region.id);
    if (!newCart?.id) {
      throw new Error("No pudimos crear el carrito.");
    }

    const nextCart = newCart as unknown as Cart;
    storeCart(nextCart);
    return nextCart;
  }, [storeCart]);

  const ensureCart = useCallback(async () => {
    if (cartRef.current?.id) {
      return cartRef.current;
    }

    if (!initCartPromiseRef.current) {
      initCartPromiseRef.current = initCart().finally(() => {
        initCartPromiseRef.current = null;
      });
    }

    return initCartPromiseRef.current;
  }, [initCart]);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      ensureCart().catch((error) => {
        console.error("Error initializing cart:", error);
      });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [ensureCart]);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      if (addToCartPromiseRef.current) {
        return addToCartPromiseRef.current;
      }

      const addPromise = (async () => {
        setIsLoading(true);
        try {
          const activeCart = await ensureCart();
          const updatedCart = await addItem(activeCart.id, variantId, quantity);
          const nextCart = updatedCart as unknown as Cart;
          storeCart(nextCart);
          openCart();
        } catch (error) {
          console.error("Error adding to cart:", error);
          throw error;
        } finally {
          setIsLoading(false);
          addToCartPromiseRef.current = null;
        }
      })();

      addToCartPromiseRef.current = addPromise;
      return addPromise;
    },
    [ensureCart, openCart, storeCart]
  );

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updatedCart = await updateItem(cart.id, lineItemId, quantity);
        const nextCart = updatedCart as unknown as Cart;
        storeCart(nextCart);
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, storeCart]
  );

  const removeFromCart = useCallback(
    async (lineItemId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const updatedCart = await removeItem(cart.id, lineItemId);
        const nextCart = updatedCart as unknown as Cart;
        storeCart(nextCart);
      } catch (error) {
        console.error("Error removing from cart:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, storeCart]
  );

  const refreshCart = useCallback(async () => {
    const id = cartRef.current?.id || localStorage.getItem(CART_ID_KEY);
    if (!id) return;
    try {
      const refreshed = await getCart(id);
      if (refreshed) {
        const nextCart = refreshed as unknown as Cart;
        storeCart(nextCart);
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  }, [storeCart]);

  const clearCart = useCallback(() => {
    localStorage.removeItem(CART_ID_KEY);
    cartRef.current = null;
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
