import { BUSINESS } from '@/lib/business';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: BUSINESS.currency,
});

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}
