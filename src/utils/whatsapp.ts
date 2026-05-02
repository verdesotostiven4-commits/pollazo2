import type { Product } from '../types';

export const WHATSAPP = '+593989795628';

interface CartItem { product: Product; qty: number; }

export function buildWhatsAppUrl(items: CartItem[]): string {
  const lines = items.map(({ product, qty }) =>
    `• ${qty}x ${product.name}${product.price ? ` (${product.price})` : ''}`
  );
  const body = [
    'Hola, quiero hacer un pedido en La Casa del Pollazo El Mirador:',
    '',
    ...lines,
    '',
    '¡Gracias!',
  ].join('\n');
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(body)}`;
}
