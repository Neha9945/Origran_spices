import { createContext, useContext, type Dispatch } from 'react';
import type { CartAction, CartLine } from '@/lib/cart';

export interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  dispatch: Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used inside CartProvider');
  return value;
}
