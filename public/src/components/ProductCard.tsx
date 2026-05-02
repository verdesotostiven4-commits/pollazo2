import { useState, useRef } from 'react';
import { ShoppingCart, Check, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFlyToCart } from '../context/FlyToCartContext';

interface Props {
  product: Product;
  style?: React.CSSProperties;
  className?: string;
  compact?: boolean;
}

const isConsultPrice = (price?: string) =>
  !price || price.toLowerCase().includes('consultar');

function triggerHaptic() {
  try { if ('vibrate' in navigator) navigator.vibrate(25); } catch {}
}

export default function ProductCard({ product, style, className = '', compact = false }: Props) {
  const { addItem } = useCart();
  const { triggerFly } = useFlyToCart();
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleAdd = () => {
    if (added) return;
    triggerHaptic();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      triggerFly(rect.left + rect.width / 2, rect.top + rect.height / 2, product.image ?? '');
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const consult = isConsultPrice(product.price);

  if (compact) {
    return (
      <div
        style={style}
        className={`group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm active:shadow-md transition-all duration-200 h-full ${className}`}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2.5 group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200"><ShoppingCart size={28} /></div>
          )}
          {product.badge && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
              {product.badge}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 p-3 gap-1.5">
          <h3 className="text-gray-900 font-bold text-[13px] leading-snug line-clamp-2 flex-1">{product.name}</h3>
          <div>
            {consult ? (
              <span className="text-[11px] text-gray-400 font-medium">A consultar</span>
            ) : (
              <span className="text-orange-600 font-black text-base">{product.price}</span>
            )}
          </div>
          <button
            ref={btnRef}
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-1.5 font-bold text-[13px] py-2.5 rounded-xl transition-all duration-300 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white active:scale-95'
            }`}
          >
            {added ? (
              <><Check size={13} strokeWidth={3} /> Agregado</>
            ) : (
              <><ShoppingCart size={13} /> Agregar</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      className={`group relative flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-orange-100/60 hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200"><ShoppingCart size={40} /></div>
        )}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wide shadow-sm">
            {product.badge}
          </span>
        )}
        {consult && (
          <span className="absolute top-2.5 right-2.5 bg-white/90 border border-orange-200 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
            A consultar
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3.5">
        <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-widest mb-1 truncate">{product.category}</p>
        <h3 className="text-gray-900 font-bold text-[15px] leading-snug mb-1 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">{product.description}</p>
        )}

        <div className="flex items-end justify-between mb-3 mt-auto">
          {consult ? (
            <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
              <MessageCircle size={12} className="text-orange-400" />
              Consultar precio
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-orange-600 font-black text-lg leading-none">{product.price}</span>
              {product.unit && <span className="text-gray-400 text-[11px]">/ {product.unit}</span>}
            </div>
          )}
        </div>

        <button
          ref={btnRef}
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-1.5 font-bold text-sm py-2.5 rounded-xl transition-all duration-300 ${
            added
              ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white scale-95'
              : 'bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 text-white hover:scale-[1.03] active:scale-95 shadow-sm shadow-orange-200'
          }`}
        >
          {added ? (
            <><Check size={14} strokeWidth={3} /> Agregado</>
          ) : (
            <><ShoppingCart size={14} /> Agregar al pedido</>
          )}
        </button>
      </div>
    </div>
  );
}
