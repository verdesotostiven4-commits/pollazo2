import { useState } from 'react';
import { ShoppingCart, ArrowLeft, Plus, Minus, Trash2, X, MapPin, Phone } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Pollo Entero',
    price: 12.50,
    description: 'Pollo fresco entero, listo para cocinar.',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pollos',
  },
  {
    id: 2,
    name: 'Medio Pollo',
    price: 6.50,
    description: 'Media presa de pollo fresco.',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pollos',
  },
  {
    id: 3,
    name: 'Presa Especial',
    price: 4.00,
    description: 'Presa seleccionada de pollo fresco.',
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Pollos',
  },
  {
    id: 4,
    name: 'Refresco',
    price: 1.25,
    description: 'Bebida fría para acompañar tu pedido.',
    image: 'https://images.pexels.com/photos/2668308/pexels-photo-2668308.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Bebidas',
  },
  {
    id: 5,
    name: 'Agua Botella',
    price: 0.75,
    description: 'Agua pura en botella personal.',
    image: 'https://images.pexels.com/photos/3887985/pexels-photo-3887985.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Bebidas',
  },
];

const CATEGORIES = ['Todos', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

export default function CatalogPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = activeCategory === 'Todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeOne = (id: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const removeAll = (id: number) => setCart(prev => prev.filter(i => i.id !== id));

  const qtyInCart = (id: number) => cart.find(i => i.id === id)?.qty ?? 0;

  const sendWhatsApp = () => {
    const lines = cart.map(i => `• ${i.qty}x ${i.name} — $${(i.price * i.qty).toFixed(2)}`).join('%0A');
    const msg = `Hola! Quiero hacer un pedido:%0A%0A${lines}%0A%0A*Total: $${totalPrice.toFixed(2)}*`;
    window.open(`https://wa.me/593999999999?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen" style={{ background: '#f8f4f0' }}>

      {/* Header */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between" style={{ background: '#E67E22', boxShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-3">
          <img src="/logo-pollazo.png" alt="Logo" className="w-9 h-9 object-contain" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
          <div>
            <p className="font-black text-white text-sm leading-tight">La Casa del Pollazo</p>
            <div className="flex items-center gap-1">
              <MapPin size={10} className="text-orange-200" />
              <p className="text-orange-100 text-[10px]">El Mirador, Puerto Ayora</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
        >
          <ShoppingCart size={20} className="text-white" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-black flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all active:scale-95"
            style={activeCategory === cat
              ? { background: '#E67E22', color: '#fff', boxShadow: '0 2px 8px rgba(230,126,34,0.4)' }
              : { background: '#fff', color: '#666', border: '1px solid #e5e7eb' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="px-4 pb-24 grid grid-cols-2 gap-3">
        {filtered.map(product => {
          const qty = qtyInCart(product.id);
          return (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div className="relative" style={{ height: 120 }}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(230,126,34,0.9)', color: '#fff' }}>
                    {product.category}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-black text-gray-900 text-sm leading-tight">{product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{product.description}</p>
                <div className="flex items-center justify-between mt-2.5">
                  <p className="font-black text-base" style={{ color: '#E67E22' }}>${product.price.toFixed(2)}</p>
                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                      style={{ background: '#E67E22' }}
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => removeOne(product.id)} className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center active:scale-90 transition-transform">
                        <Minus size={12} style={{ color: '#E67E22' }} />
                      </button>
                      <span className="font-black text-sm text-gray-900 w-4 text-center">{qty}</span>
                      <button onClick={() => addToCart(product)} className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform" style={{ background: '#E67E22' }}>
                        <Plus size={12} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky cart bar */}
      {totalItems > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-2">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full py-4 rounded-2xl flex items-center justify-between px-5 font-black text-white"
            style={{ background: '#E67E22', boxShadow: '0 8px 32px rgba(230,126,34,0.5)' }}
          >
            <span className="bg-white/25 rounded-xl px-2.5 py-1 text-sm">{totalItems}</span>
            <span className="text-base">Ver pedido</span>
            <span className="text-base">${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setCartOpen(false)}>
          <div
            className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-5 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <p className="font-black text-lg text-gray-900">Tu Pedido</p>
              <button onClick={() => setCartOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={16} className="text-gray-600" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <ShoppingCart size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 font-semibold">Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="px-5 py-4 space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="font-black text-sm" style={{ color: '#E67E22' }}>${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeOne(item.id)} className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                          <Minus size={12} style={{ color: '#E67E22' }} />
                        </button>
                        <span className="font-black text-sm text-gray-900 w-4 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#E67E22' }}>
                          <Plus size={12} className="text-white" />
                        </button>
                        <button onClick={() => removeAll(item.id)} className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center ml-1">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-5 pt-2 pb-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-600">Total</p>
                    <p className="font-black text-xl" style={{ color: '#E67E22' }}>${totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="px-5 pb-8 space-y-2">
                  <button
                    onClick={sendWhatsApp}
                    className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2"
                    style={{ background: '#25D366' }}
                  >
                    <Phone size={18} />
                    Pedir por WhatsApp
                  </button>
                  <button onClick={() => setCartOpen(false)} className="w-full py-3 rounded-2xl font-semibold text-gray-500 text-sm">
                    Seguir comprando
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
