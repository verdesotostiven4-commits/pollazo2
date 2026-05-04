import { useState } from 'react';
import { ShoppingCart, Check, MessageCircle } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const consult = !product.price || !product.price.startsWith('$');

  const handleAdd = () => {
    if (added) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
        <span className="text-4xl">🍗</span>
        {product.badge && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-3">
        <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wider mb-0.5 truncate">{product.category}</p>
        <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          {consult ? (
            <span className="flex items-center gap-1 text-gray-400 text-xs"><MessageCircle size={11} className="text-orange-400" />Consultar</span>
          ) : (
            <span className="text-orange-600 font-black text-base">{product.price}</span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-1.5 font-bold text-xs py-2 rounded-xl transition-all ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-orange-500 to-amber-400 text-white active:scale-95 shadow-sm shadow-orange-200'
          }`}
        >
          {added ? <><Check size={13} strokeWidth={3} /> Listo</> : <><ShoppingCart size={13} /> Agregar</>}
        </button>
      </div>
    </div>
  );
}
