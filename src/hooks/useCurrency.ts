import { formatPrice } from '../lib/geo';

export function useCurrency() {
  return { currency: 'USD' as const, price: formatPrice };
}
