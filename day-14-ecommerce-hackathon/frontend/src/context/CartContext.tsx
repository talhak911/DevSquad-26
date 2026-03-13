import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartApi } from "../services/api";
import { useAuth } from "./AuthContext";

export interface CartItem {
  _id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productTitle: string;
  variantLabel: string;
  productImage: string;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
}

interface CartContextValue {
  cart: Cart | null;
  cartCount: number;
  loading: boolean;
  refreshCart: () => void;
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user || user.role !== "user") { 
      setCart(null); 
      return; 
    }
    try {
      setLoading(true);
      const { data } = await cartApi.getCart();
      setCart(data.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { 
    if (user?.role === "user") {
      refreshCart(); 
    } else {
      setCart(null);
    }
  }, [refreshCart, user]);

  const addToCart = async (productId: string, variantId: string, quantity = 1) => {
    const { data } = await cartApi.addItem(productId, variantId, quantity);
    setCart(data.data);
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    const { data } = await cartApi.updateItem(itemId, quantity);
    setCart(data.data);
  };

  const removeCartItem = async (itemId: string) => {
    const { data } = await cartApi.removeItem(itemId);
    setCart(data.data);
  };

  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, loading, refreshCart, addToCart, updateCartItem, removeCartItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
