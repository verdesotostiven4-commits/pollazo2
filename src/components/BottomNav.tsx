import { Home, Grid, ShoppingCart, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Screen = 'home' | 'catalog' | 'cart' | 'info';
const TABS = [
  { id: 'home' as Screen, icon: Home, label: 'Inicio' },
  { id: 'catalog' as Screen, icon: Grid, label: 'Catálogo' },
  { id: 'cart' as Screen, icon: ShoppingCart, label: 'Pedido' },
  { id: 'info' as Screen, icon: Info, label: 'Info' },
];

export default function BottomNav({ current, onNavigate }: { current: Screen; onNavigate: (s: Screen) => void }) {
  const { totalCount } = useCart();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50 safe-area-bottom" style={{ boxShadow: '0 -2px 16px rgba(0,0,0,0.07)' }}>
      {TABS.map(({ id, icon: Icon, label }) => {
        const active = current === id;
        return (
          <button key={id} onClick={() => onNavigate(id)} className={`flex-1 flex flex-col items-center pt-3 pb-2 gap-0.5 ${active ? 'text-orange-500' : 'text-gray-400'}`}>
            <div className="relative">
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              {id === 'cart' && totalCount > 0 && <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">{totalCount}</span>}
            </div>
            <span className={`text-[10px] font-semibold ${active ? 'text-orange-500' : 'text-gray-400'}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
