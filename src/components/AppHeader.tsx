import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

type Screen = 'home' | 'catalog' | 'cart' | 'info';

interface Props {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  scrolled: boolean;
}

export default function AppHeader({ onNavigate }: Props) {
  const { totalCount } = useCart();
  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-2.5">
        <img src="/Picsart_26-03-14_04-02-01-579.png" alt="Logo" className="w-9 h-9 object-contain" />
        <div>
          <p className="font-black text-sm text-gray-900 leading-tight">La Casa del Pollazo</p>
          <p className="text-[10px] text-orange-500 font-semibold">El Mirador</p>
        </div>
      </div>
      <button onClick={() => onNavigate('cart')} className="relative p-2">
        <ShoppingCart size={22} className="text-gray-700" />
        {totalCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
            {totalCount}
          </span>
        )}
      </button>
    </header>
  );
}
