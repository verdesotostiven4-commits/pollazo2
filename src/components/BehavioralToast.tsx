import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
}

interface Props {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed top-4 left-0 right-0 z-[180] flex flex-col items-center gap-2 px-4 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 bg-gray-900/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl max-w-sm w-full"
          style={{ animation: 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        >
          <span className="flex-1 leading-snug">{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-white/50 hover:text-white active:scale-90 transition-all flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes toastSlideIn {
          0%   { opacity: 0; transform: translateY(-16px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
  } catch {}
}

const TOAST_CART_ABANDON = '¡Ey! Tus 🍗 siguen aquí. ¿Pedimos? 🛒';
const TOAST_CATALOG_INTEREST = '¡Ey! Ese combo tiene tu nombre 🔥';
const TOAST_CLOSING_TIME = '¡Ey! Casi cerramos. No te quedes sin tu cena 🌙';

export function useBehavioralToasts(
  cartCount: number,
  currentScreen: string,
) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const shownRef = useRef<Set<string>>(new Set());

  const show = useCallback((message: string, key: string) => {
    if (shownRef.current.has(key)) return;
    shownRef.current.add(key);
    const id = ++idRef.current;
    playChime();
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Cart abandonment: user has items but navigates away from cart
  const cartCountRef = useRef(cartCount);
  const prevScreenRef = useRef(currentScreen);
  useEffect(() => {
    cartCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const prev = prevScreenRef.current;
    prevScreenRef.current = currentScreen;

    if (prev === 'cart' && currentScreen !== 'cart' && cartCountRef.current > 0) {
      const t = setTimeout(() => show(TOAST_CART_ABANDON, 'cart-abandon'), 8000);
      return () => clearTimeout(t);
    }
  }, [currentScreen, show]);

  // Catalog interest: spent time on catalog
  useEffect(() => {
    if (currentScreen !== 'catalog') return;
    const t = setTimeout(() => show(TOAST_CATALOG_INTEREST, 'catalog-interest'), 25000);
    return () => clearTimeout(t);
  }, [currentScreen, show]);

  // Closing-time reminder: 8 PM - 9 PM
  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 20 && h < 21) {
      const t = setTimeout(() => show(TOAST_CLOSING_TIME, 'closing-time'), 3000);
      return () => clearTimeout(t);
    }
  }, [show]);

  return { toasts, dismiss };
}
