import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { CART_STORAGE_KEY, cartReducer, loadCart } from '@/lib/cart';
import { CartContext } from '@/context/cart-context';

export default function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      dispatch,
    }),
    [lines]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
