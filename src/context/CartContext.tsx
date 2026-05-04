import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';

interface CartCtx {
  items: CartItem[];
  total: number;
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const Ctx = createContext<CartCtx>({
  items: [], total: 0,
  addItem: () => {}, removeItem: () => {}, updateQty: () => {}, clearCart: () => {},
});

export function useCart() { return useContext(Ctx); }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const total = items.reduce((acc, i) => {
    if (!i.product.price?.startsWith('$')) return acc;
    return acc + parseFloat(i.product.price.slice(1)) * i.quantity;
  }, 0);

  const addItem = (p: Product) => setItems(prev => {
    const found = prev.find(i => i.product.id === p.id);
    if (found) return prev.map(i => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
    return [...prev, { product: p, quantity: 1 }];
  });

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.product.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setItems([]);

  return <Ctx.Provider value={{ items, total, addItem, removeItem, updateQty, clearCart }}>{children}</Ctx.Provider>;
}
