export const CART_STORAGE_KEY = 'origran-cart';

export interface CartLine {
  variantId: string;
  quantity: number;
}

export type CartAction =
  | { type: 'add'; variantId: string; quantity: number; maxQuantity: number }
  | { type: 'set'; variantId: string; quantity: number; maxQuantity: number }
  | { type: 'remove'; variantId: string }
  | { type: 'clear' };

function withQuantity(lines: CartLine[], variantId: string, quantity: number): CartLine[] {
  if (quantity <= 0) {
    return lines.filter((line) => line.variantId !== variantId);
  }
  if (lines.some((line) => line.variantId === variantId)) {
    return lines.map((line) => (line.variantId === variantId ? { ...line, quantity } : line));
  }
  return [...lines, { variantId, quantity }];
}

function clamp(quantity: number, maxQuantity: number): number {
  return Math.max(0, Math.min(quantity, maxQuantity));
}

export function cartReducer(lines: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'add': {
      const current = lines.find((line) => line.variantId === action.variantId)?.quantity ?? 0;
      return withQuantity(
        lines,
        action.variantId,
        clamp(current + action.quantity, action.maxQuantity)
      );
    }
    case 'set':
      return withQuantity(
        lines,
        action.variantId,
        clamp(action.quantity, action.maxQuantity)
      );
    case 'remove':
      return withQuantity(lines, action.variantId, 0);
    case 'clear':
      return [];
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.variantId === 'string' &&
    typeof line.quantity === 'number' &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

export function loadCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : [];
  } catch {
    return [];
  }
}
