import { useState, useMemo } from 'react';
import { ShoppingCart, Search, X, Home, Grid3X3, Info, Trash2, Plus, Minus, MessageCircle, Clock, MapPin, ChevronRight } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { products, categories } from './data/products';
import ProductCard from './components/ProductCard';
import type { Category, CartItem } from './types';
import './index.css';

const WHATSAPP = '+593989795628';
const MAPS_URL = 'https://maps.app.goo.gl/uM7jPvwGxzyUeeJYA';

const CAT_ICONS: Record<string, string> = {
  'Pollos':'🍗','Embutidos':'🥓','Lácteos y refrigerados':'🥛','Abarrotes y básicos':'🌾',
  'Salsas, aliños y aceites':'🫙','Bebidas':'🥤','Frutas y verduras':'🥦',
  'Snacks y dulces':'🍫','Cuidado personal':'🧴','Limpieza y hogar':'🧹',
};
const CAT_SHORT: Record<string, string> = {
  'Pollos':'Pollos','Embutidos':'Embutidos','Lácteos y refrigerados':'Lácteos',
  'Abarrotes y básicos':'Abarrotes','Salsas, aliños y aceites':'Salsas',
  'Bebidas':'Bebidas','Frutas y verduras':'Frutas','Snacks y dulces':'Snacks',
  'Cuidado personal':'Personal','Limpieza y hogar':'Limpieza',
};

type Screen = 'home' | 'catalog' | 'cart' | 'info';

function buildWhatsAppMsg(items: CartItem[]) {
  const lines = items.map(i => `• ${i.product.name} x${i.quantity}${i.product.price?.startsWith('$') ? ' — ' + i.product.price : ''}`);
  const text = `Hola, quiero hacer un pedido en La Casa del Pollazo:\n\n${lines.join('\n')}\n\nPor favor confirmar total.`;
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const h = new Date().getHours();
  const greeting = h < 12 ? '¡Buenos días! ☀️' : h < 19 ? '¡Buenas tardes! 🍗' : '¡Buenas noches! 🌙';
  const featured = products.filter(p => p.badge === 'Popular').slice(0, 6);
  const QUICK: Category[] = ['Pollos','Embutidos','Bebidas','Lácteos y refrigerados','Abarrotes y básicos','Snacks y dulces'];

  return (
    <div>
      <div className="hero-bg px-4 pt-8 pb-8 flex flex-col items-center text-center">
        <p className="text-white/80 text-xs font-semibold mb-4">{greeting}</p>
        <img src="/logo-final.png" alt="Logo"
          className="w-28 h-28 object-contain mb-4 drop-shadow-xl"
          style={{ animation: 'floatLogo 3.5s ease-in-out infinite' }}
          onError={e => (e.currentTarget.style.display = 'none')} />
        <h1 className="text-white font-black text-3xl leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          Pollo fresco
        </h1>
        <h2 className="font-black text-3xl leading-tight mb-2" style={{ color: '#FFD700', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
          directo a tu puerta
        </h2>
        <p className="text-white/80 text-sm mb-5">Pedidos rápidos por WhatsApp</p>
        <div className="flex gap-3">
          <button onClick={() => window.open(`https://wa.me/${WHATSAPP}?text=Hola%2C%20quiero%20hacer%20un%20pedido`, '_blank')}
            className="flex items-center gap-2 bg-white text-orange-600 font-black px-5 py-3 rounded-2xl shadow-lg text-sm active:scale-95 transition-all">
            <MessageCircle size={16} /> Pedir ahora
          </button>
          <button onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 bg-white/20 border border-white/40 text-white font-bold px-5 py-3 rounded-2xl text-sm active:scale-95 transition-all">
            Ver todo
          </button>
        </div>
        <div className="flex gap-3 mt-4">
          {[{ icon: Clock, text: '7AM – 9PM' }, { icon: MapPin, text: 'El Mirador' }].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 text-white text-xs font-semibold">
              <Icon size={12} />{text}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5">
        <h2 className="font-black text-gray-900 text-base mb-3">Categorías</h2>
        <div className="grid grid-cols-3 gap-2">
          {QUICK.map(cat => (
            <button key={cat} onClick={() => onNavigate('catalog')}
              className="flex flex-col items-center gap-1 bg-white border border-gray-100 rounded-2xl py-3 hover:bg-orange-50 hover:border-orange-200 active:scale-95 transition-all shadow-sm">
              <span className="text-2xl">{CAT_ICONS[cat]}</span>
              <span className="text-xs font-bold text-gray-700">{CAT_SHORT[cat]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-gray-900 text-base">Más pedidos</h2>
          <button onClick={() => onNavigate('catalog')} className="flex items-center gap-0.5 text-orange-500 font-bold text-xs">
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

function CatalogScreen() {
  const [active, setActive] = useState<'Todos' | Category>('Todos');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => products.filter(p => {
    if (search) return p.name.toLowerCase().includes(search.toLowerCase());
    return active === 'Todos' || p.category === active;
  }), [active, search]);

  return (
    <div>
      <div className="px-4 pt-3 pb-2 bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full bg-gray-100 rounded-xl pl-9 pr-9 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-200 transition-all" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {!search && (
        <div className="bg-white border-b border-gray-100 sticky top-[57px] z-10 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 px-4 py-2.5" style={{ width: 'max-content' }}>
            {(['Todos', ...categories] as const).map(cat => {
              const isActive = active === cat;
              return (
                <button key={cat} onClick={() => setActive(cat as 'Todos' | Category)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap active:scale-95 ${
                    isActive ? 'bg-orange-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600'
                  }`}>
                  <span>{cat === 'Todos' ? '🛒' : CAT_ICONS[cat]}</span>
                  <span>{cat === 'Todos' ? 'Todos' : CAT_SHORT[cat]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-3 pt-3 pb-4">
        <p className="text-xs text-gray-400 mb-3 px-1">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</p>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-gray-500 font-semibold">Sin resultados</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function CartScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { items, total, removeItem, updateQty, clearCart } = useCart();

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
      <ShoppingCart size={52} className="text-gray-200 mb-4" />
      <h2 className="text-gray-800 font-black text-xl mb-2">Tu pedido está vacío</h2>
      <p className="text-gray-400 text-sm mb-6">Agrega productos desde el catálogo</p>
      <button onClick={() => onNavigate('catalog')}
        className="bg-gradient-to-r from-orange-500 to-amber-400 text-white font-bold px-6 py-3 rounded-2xl shadow-lg active:scale-95 transition-all">
        Ver catálogo
      </button>
    </div>
  );

  const handleCheckout = () => {
    window.open(buildWhatsAppMsg(items), '_blank');
    clearCart();
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-black text-gray-900">{items.length} producto{items.length !== 1 ? 's' : ''}</h2>
        <button onClick={clearCart} className="text-xs text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50">Vaciar</button>
      </div>
      <div className="px-4 space-y-3 pb-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="bg-white rounded-2xl p-3.5 flex gap-3 shadow-sm border border-gray-50">
            <div className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0">🍗</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 truncate">{product.name}</p>
              <p className="text-orange-500 font-black text-sm">{product.price?.startsWith('$') ? product.price : 'A consultar'}</p>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => updateQty(product.id, quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center active:scale-90">
                  <Minus size={12} />
                </button>
                <span className="font-black text-sm w-6 text-center">{quantity}</span>
                <button onClick={() => updateQty(product.id, quantity + 1)} className="w-7 h-7 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center active:scale-90">
                  <Plus size={12} />
                </button>
              </div>
            </div>
            <button onClick={() => removeItem(product.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1 self-start">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="px-4 pb-24">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          {total > 0 && (
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
              <span className="text-gray-500 text-sm">Total estimado</span>
              <span className="font-black text-orange-600 text-lg">${total.toFixed(2)}</span>
            </div>
          )}
          <p className="text-gray-400 text-xs mb-4">Los precios a consultar se confirman por WhatsApp.</p>
          <button onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-400 text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-base">
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoScreen() {
  return (
    <div className="px-4 py-5 space-y-4 pb-24">
      <div className="hero-bg rounded-3xl px-5 py-6 flex flex-col items-center text-center gap-3">
        <img src="/logo-final.png" alt="logo" className="w-20 h-20 object-contain drop-shadow-xl"
          onError={e => (e.currentTarget.style.display = 'none')} />
        <div>
          <h2 className="text-white font-black text-xl">La Casa del Pollazo</h2>
          <p className="text-white/80 font-bold text-sm">El Mirador</p>
          <p className="text-white/60 text-xs mt-1">Puerto Ayora, Galápagos</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Clock, title: 'Horario', sub: '7:00 AM – 9 PM', color: 'bg-amber-50 text-amber-600' },
          { icon: MapPin, title: 'Ubicación', sub: 'El Mirador', color: 'bg-blue-50 text-blue-600', link: MAPS_URL },
          { icon: MessageCircle, title: 'WhatsApp', sub: 'Pedidos rápidos', color: 'bg-green-50 text-green-600', link: `https://wa.me/${WHATSAPP}` },
          { icon: ShoppingCart, title: 'Delivery', sub: 'Puerto Ayora', color: 'bg-orange-50 text-orange-600' },
        ].map(({ icon: Icon, title, sub, color, link }) => {
          const card = (
            <div className={`${color.split(' ')[0]} rounded-2xl p-4 flex flex-col gap-2`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
              <p className="font-bold text-gray-900 text-sm">{title}</p>
              <p className="text-gray-500 text-xs">{sub}</p>
            </div>
          );
          return link
            ? <a key={title} href={link} target="_blank" rel="noopener noreferrer">{card}</a>
            : <div key={title}>{card}</div>;
        })}
      </div>
    </div>
  );
}

const NAV_TABS = [
  { id: 'home' as Screen, label: 'Inicio', Icon: Home },
  { id: 'catalog' as Screen, label: 'Catálogo', Icon: Grid3X3 },
  { id: 'cart' as Screen, label: 'Pedido', Icon: ShoppingCart },
  { id: 'info' as Screen, label: 'Info', Icon: Info },
];

function Shell() {
  const [screen, setScreen] = useState<Screen>('home');
  const { items } = useCart();
  const cartCount = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-100 shadow-sm" style={{ maxWidth: 448, margin: '0 auto' }}>
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <img src="/logo-final.png" alt="logo" className="h-9 w-auto object-contain"
              onError={e => (e.currentTarget.style.display = 'none')} />
            <div>
              <div className="font-black text-xs text-gray-900 leading-none">La Casa del Pollazo</div>
              <div className="font-bold text-[10px] text-orange-500 uppercase tracking-wider leading-none mt-0.5">El Mirador</div>
            </div>
          </div>
          <button onClick={() => setScreen('cart')}
            className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-colors active:scale-90">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="pt-14 pb-20">
        {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
        {screen === 'catalog' && <CatalogScreen />}
        {screen === 'cart' && <CartScreen onNavigate={setScreen} />}
        {screen === 'info' && <InfoScreen />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100" style={{ maxWidth: 448, margin: '0 auto', boxShadow: '0 -4px 24px rgba(0,0,0,0.08)' }}>
        <div className="flex">
          {NAV_TABS.map(({ id, label, Icon }) => {
            const active = screen === id;
            const showBadge = id === 'cart' && cartCount > 0;
            return (
              <button key={id} onClick={() => setScreen(id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all ${active ? 'text-orange-500' : 'text-gray-400'}`}>
                <div className="relative">
                  <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                  {showBadge && (
                    <span className="absolute -top-1 -right-1.5 bg-red-500 text-white text-[9px] font-black min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] leading-none ${active ? 'font-black' : 'font-medium'}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}
