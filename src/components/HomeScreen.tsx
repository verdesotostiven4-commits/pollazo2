import { useEffect, useRef, useState, useCallback } from 'react';
import { MessageCircle, Clock, Truck, ChevronRight, Star, ChevronLeft } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import { WHATSAPP } from '../utils/whatsapp';
import { Category } from '../types';

const LOGO = '/Picsart_26-03-14_04-02-01-579.png';

type Screen = 'home' | 'catalog' | 'cart' | 'info';

interface Props {
  onNavigate: (s: Screen) => void;
  onNavigateToCategory: (cat: Category) => void;
}

const BESTSELLER_IDS = ['pollo-entero', 'pechuga', 'cuartos', 'coca-cola-300ml'];
const bestsellers = products.filter(p => BESTSELLER_IDS.includes(p.id));

const QUICK_CATEGORIES: { label: Category; icon: string }[] = [
  { label: 'Pollos', icon: '🍗' },
  { label: 'Embutidos', icon: '🥓' },
  { label: 'Bebidas', icon: '🥤' },
  { label: 'Lácteos y refrigerados', icon: '🥛' },
  { label: 'Abarrotes y básicos', icon: '🌾' },
  { label: 'Snacks y dulces', icon: '🍫' },
];

const QUICK_LABELS: Record<string, string> = {
  'Pollos': 'Pollos',
  'Embutidos': 'Embutidos',
  'Bebidas': 'Bebidas',
  'Lácteos y refrigerados': 'Lácteos',
  'Abarrotes y básicos': 'Abarrotes',
  'Snacks y dulces': 'Snacks',
};

function getDynamicGreeting(): string {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return '¡Buenos días! ¿Empezamos el desayuno con sabor? ☀️';
  if (h >= 12 && h < 19) return '¡Buenas tardes! ¿Sale un pollito? 🍗';
  if (h >= 19) return '¡Buenas noches! Cerremos con algo rico 🌙';
  return '¡Bienvenido a La Casa del Pollazo! 🍗';
}

function BestsellerCarousel() {
  const pairs: typeof bestsellers[] = [];
  for (let i = 0; i < bestsellers.length; i += 2) {
    pairs.push(bestsellers.slice(i, i + 2));
  }

  const [index, setIndex] = useState(0);
  const autoRef = useRef<ReturnType<typeof setTimeout>>();
  const pausedUntilRef = useRef<number>(0);
  const total = pairs.length;

  const startAutoplay = useCallback(() => {
    if (autoRef.current) clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => {
      if (Date.now() >= pausedUntilRef.current) {
        setIndex(prev => (prev + 1) % total);
        startAutoplay();
      } else {
        const remaining = pausedUntilRef.current - Date.now();
        autoRef.current = setTimeout(() => {
          setIndex(prev => (prev + 1) % total);
          startAutoplay();
        }, remaining);
      }
    }, 4000);
  }, [total]);

  useEffect(() => {
    startAutoplay();
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [startAutoplay]);

  const handlePrev = () => {
    pausedUntilRef.current = Date.now() + 10000;
    setIndex(prev => (prev - 1 + total) % total);
    startAutoplay();
  };

  const handleNext = () => {
    pausedUntilRef.current = Date.now() + 10000;
    setIndex(prev => (prev + 1) % total);
    startAutoplay();
  };

  return (
    <div className="relative">
      <button
        onClick={handlePrev}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 text-orange-500 rounded-full shadow-md flex items-center justify-center active:scale-90 transition-transform border border-orange-100"
        aria-label="Anterior"
      >
        <ChevronLeft size={16} strokeWidth={2.5} />
      </button>

      <div className="overflow-hidden mx-10">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {pairs.map((pair, pi) => (
            <div key={pi} className="flex gap-3 px-1 min-w-full items-stretch">
              {pair.map(product => (
                <div key={product.id} className="flex-1 flex flex-col">
                  <ProductCard product={product} compact className="flex-1" />
                </div>
              ))}
              {pair.length < 2 && <div className="flex-1" />}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 text-orange-500 rounded-full shadow-md flex items-center justify-center active:scale-90 transition-transform border border-orange-100"
        aria-label="Siguiente"
      >
        <ChevronRight size={16} strokeWidth={2.5} />
      </button>

      <div className="flex justify-center gap-1.5 mt-3">
        {pairs.map((_, pi) => (
          <button
            key={pi}
            onClick={() => { pausedUntilRef.current = Date.now() + 10000; setIndex(pi); startAutoplay(); }}
            className={`rounded-full transition-all duration-300 ${pi === index ? 'w-5 h-1.5 bg-orange-500' : 'w-1.5 h-1.5 bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomeScreen({ onNavigate, onNavigateToCategory }: Props) {
  const greeting = getDynamicGreeting();

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP}?text=Hola%2C%20quiero%20hacer%20un%20pedido%20en%20La%20Casa%20del%20Pollazo%20El%20Mirador.`,
      '_blank'
    );
  };

  return (
    <div className="flex flex-col bg-gray-50">
      {/* HERO */}
      <div className="relative overflow-hidden hero-water">
        {/* Water ripple overlays */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-72 h-72 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 65%)',
            animation: 'water-ripple 10s ease-in-out infinite',
          }} />
          <div className="absolute bottom-[-15%] right-[-5%] w-60 h-60 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(254,240,138,0.25) 0%, transparent 65%)',
            animation: 'water-ripple-2 13s ease-in-out infinite',
          }} />
        </div>

        <div className="px-4 pt-10 pb-8 relative z-10">
          <p className="text-white/90 text-xs font-semibold text-center mb-4 tracking-wide" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
            {greeting}
          </p>

          <div className="flex justify-center mb-5 relative">
            <div className="absolute pointer-events-none" style={{
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(251,191,36,0.15) 50%, transparent 72%)',
              animation: 'logoGlowPulse 2.8s ease-in-out infinite',
            }} />
            {/* Original transparent logo — NO frames, NO white bg */}
            <img
              src={LOGO}
              alt="La Casa del Pollazo"
              className="w-36 h-36 object-contain relative z-10"
              style={{
                filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.25)) drop-shadow(0 0 16px rgba(255,255,255,0.2))',
                animation: 'splashFloat 3.6s ease-in-out infinite',
              }}
            />
          </div>

          <div className="text-center mb-5">
            {/* White pure text — no dark shadow */}
            <h1 className="text-white font-black text-3xl leading-tight">
              Pollo fresco
            </h1>
            {/* Intense yellow */}
            <h2 className="font-black text-3xl leading-tight" style={{ color: '#FFD700' }}>
              directo a tu puerta
            </h2>
            <p className="text-white/90 text-sm font-semibold mt-2">
              Pedidos rápidos por WhatsApp
            </p>
            <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-3.5 py-1.5 mt-2.5 border border-white/20">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-semibold">Puerto Ayora, Galápagos</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('catalog')}
              className="flex-1 bg-white font-black py-3.5 rounded-2xl text-sm active:scale-95 transition-transform"
              style={{ color: '#c2410c', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            >
              Ver catálogo
            </button>
            <button
              onClick={openWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3.5 rounded-2xl text-sm active:scale-95 transition-transform"
              style={{ boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            {[
              { icon: <Clock size={11} />, text: '7 AM – 9 PM' },
              { icon: <Truck size={11} />, text: 'Delivery' },
              { icon: <Star size={11} className="fill-white" />, text: 'Calidad garantizada' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-white">{icon}</span>
                <span className="text-white/90 text-xs font-semibold">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK CATEGORIES */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-black text-gray-900 text-base mb-3">Categorías</h2>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_CATEGORIES.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => onNavigateToCategory(label)}
              className="flex flex-col items-center gap-1.5 bg-white rounded-2xl py-3 px-2 border border-gray-100 shadow-sm active:scale-95 transition-transform"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">
                {QUICK_LABELS[label]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* BESTSELLERS */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-gray-900 text-base">Más Pedidos</h2>
          <button onClick={() => onNavigate('catalog')} className="flex items-center gap-1 text-orange-500 text-xs font-bold">
            Ver todos <ChevronRight size={13} />
          </button>
        </div>
        <BestsellerCarousel />
      </div>
    </div>
  );
}
