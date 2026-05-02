import { CartItem } from '../types';

export const WHATSAPP = '+593989795628';

const isFixedPrice = (price: string | undefined) => {
  const p = price ?? '';
  return p.startsWith('$') && !isNaN(parseFloat(p.replace('$', '')));
};

export function buildWhatsAppUrl(items: CartItem[]): string {
  const fixedItems = items.filter(i => isFixedPrice(i.product.price));
  const consultItems = items.filter(i => !isFixedPrice(i.product.price));
  const allItems = [...fixedItems, ...consultItems];

  const total = fixedItems.reduce((sum, i) => {
    return sum + parseFloat((i.product.price ?? '0').replace('$', '')) * i.quantity;
  }, 0);

  const lines: string[] = [];
  lines.push('🛒 *NUEVO PEDIDO - Pollazo Galapagueño*');
  lines.push('');
  lines.push('👤 *Cliente:* _________________');
  lines.push('');
  lines.push('📋 *Detalle:*');
  allItems.forEach(i => {
    const priceLabel = isFixedPrice(i.product.price) ? i.product.price! : 'Precio a consultar';
    lines.push(`• ${i.quantity}x ${i.product.name} (${priceLabel})`);
  });
  lines.push('');
  if (consultItems.length > 0 && total > 0) {
    lines.push(`💰 *Total parcial: $${total.toFixed(2)}*`);
    lines.push('_(Incluye solo productos con precio fijo — confirmar el resto)_');
  } else if (total > 0) {
    lines.push(`💰 *Total: $${total.toFixed(2)}*`);
  } else {
    lines.push('💰 *Total:* A confirmar');
  }
  lines.push('');
  lines.push('📍 *Entrega:* _________________');
  lines.push('');
  lines.push('_Enviado desde la App Oficial 📱_');

  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}
