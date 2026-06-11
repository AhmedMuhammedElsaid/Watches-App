import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import type { CartItem, Product } from '@/lib/types';

const STORAGE_KEY = 'watches-app/cart';

type CartState = {
  items: CartItem[];
  totalCents: number;
  count: number;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setItems(JSON.parse(raw) as CartItem[]);
      })
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => undefined);
    }
  }, [items, hydrated]);

  const value = useMemo<CartState>(() => {
    const add = (product: Product, quantity = 1) =>
      setItems((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
              : item
          );
        }
        return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
      });

    const remove = (productId: string) =>
      setItems((prev) => prev.filter((item) => item.product.id !== productId));

    const setQuantity = (productId: string, quantity: number) =>
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((item) => item.product.id !== productId)
          : prev.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                : item
            )
      );

    return {
      items,
      totalCents: items.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      add,
      remove,
      setQuantity,
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
