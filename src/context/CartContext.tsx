import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

interface CartItem { product: Product; qty: number; }
interface CartState { items: CartItem[]; }
type CartAction =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) return { items: state.items.map(i => i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      return { items: [...state.items, { product: action.product, qty: 1 }] };
    }
    case 'REMOVE': return { items: state.items.filter(i => i.product.id !== action.id) };
    case 'UPDATE_QTY': return { items: state.items.map(i => i.product.id === action.id ? { ...i, qty: action.qty } : i).filter(i => i.qty > 0) };
    case 'CLEAR': return { items: [] };
    default: return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const totalCount = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + parseFloat((i.product.price ?? '0').replace('$', '')) * i.qty, 0);
  return (
    <CartContext.Provider value={{ items: state.items, addItem: p => dispatch({ type: 'ADD', product: p }), removeItem: id => dispatch({ type: 'REMOVE', id }), updateQty: (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }), clearCart: () => dispatch({ type: 'CLEAR' }), totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
