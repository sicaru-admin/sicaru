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
  getCustomer,
  login as loginFn,
  register as registerFn,
  logout as logoutFn,
} from "@/lib/data/customer";
import type { HttpTypes } from "@medusajs/types";

type AuthContextType = {
  customer: HttpTypes.StoreCustomer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    try {
      const c = await getCustomer();
      setCustomer(c);
    } catch {
      setCustomer(null);
    }
  }, []);

  useEffect(() => {
    refreshCustomer().finally(() => setIsLoading(false));
  }, [refreshCustomer]);

  const login = useCallback(
    async (email: string, password: string) => {
      await loginFn(email, password);
      await refreshCustomer();
    },
    [refreshCustomer]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => {
      const { customer: newCustomer } = await registerFn(data);
      setCustomer(newCustomer as HttpTypes.StoreCustomer);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutFn();
    } catch {
      // Ignore logout errors
    }
    setCustomer(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
