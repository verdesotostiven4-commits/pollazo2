import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Screen = 'home' | 'catalog' | 'cart' | 'info';

export default function CartScreen({ onCheckout, onNavigate }: { onCheckout: () => void; onNavigate: (s: Screen) => void }) {
  const { items, removeItem, updateQty, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 gap-4">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center"><ShoppingCart size={32} className="text-orange-300" /></div>
        <div className="text-center">
          <p className="font-bold text-gray-700 text-lg">Tu pedido está vacío</p>
          <p className="text-gray-400 text-sm mt-1">Agrega productos desde el catálogo</p>
        </div>
        <button onClick={() => onNavigate('catalog')} className="bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl active:scale-95 transition-transform">Ver catálogo</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-4">
      <div className="px-4 pt-4 space-y-3">
        {items.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
            {product.image && <img src={product.image} alt={product.name} className="w-14 h-14 object-contain rounded-xl bg-gray-50 flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{product.name}</p>
              {product.price && <p className="text-orange-500 font-black text-sm mt-0.5">{product.price}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => updateQty(product.id, qty - 1)} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center active:scale-90 transition-transform"><Minus size={12} className="text-gray-600" /></button>
              <span className="font-bold text-gray-900 text-sm w-5 text-center">{qty}</span>
              <button onClick={() => updateQty(product.id, qty + 1)} className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center active:scale-90 transition-transform"><Plus size={12} className="text-orange-600" /></button>
              <button onClick={() => removeItem(product.id)} className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center active:scale-90 transition-transform ml-1"><Trash2 size={12} className="text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-700">Total estimado</span>
          <span className="font-black text-xl text-orange-500">${totalPrice.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Los precios por peso son aproximados</p>
      </div>
      <div className="mx-4 mt-3">
        <button onClick={onCheckout} className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-black py-4 rounded-2xl text-base active:scale-[0.98] transition-transform shadow-lg shadow-orange-200">Hacer pedido por WhatsApp</button>
      </div>
    </div>
  );
}
