import { useEffect, useRef, useState } from 'react';
import { MessageCircle } from 'lucide-react';

export default function OrderConfirmation({ visible, onWhatsApp }: { visible: boolean; onWhatsApp: () => void }) {
  const [animateCheck, setAnimateCheck] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = (cb: () => void) => { setExiting(true); setTimeout(cb, 600); };

  useEffect(() => {
    if (visible) {
      setExiting(false); setAnimateCheck(false);
      setTimeout(() => setAnimateCheck(true), 100);
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        [[523.25, 0], [659.25, 0.1], [783.99, 0.2]].forEach(([f, s]) => {
          const osc = ctx.createOscillator(); const g = ctx.createGain();
          osc.connect(g); g.connect(ctx.destination); osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime + s);
          g.gain.setValueAtTime(0, ctx.currentTime + s); g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + s + 0.02); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + s + 0.28);
          osc.start(ctx.currentTime + s); osc.stop(ctx.currentTime + s + 0.28);
        });
      } catch {}
      timer.current = setTimeout(() => go(onWhatsApp), 2200);
    } else {
      if (timer.current) clearTimeout(timer.current);
      setAnimateCheck(false); setExiting(false);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-500 ${exiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className={`relative bg-white rounded-3xl shadow-2xl px-8 py-10 max-w-sm w-full text-center transition-all duration-500 ${animateCheck && !exiting ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-6'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div className="flex justify-center mb-7">
          <div className={`w-24 h-24 rounded-full bg-green-50 border-4 border-green-400 flex items-center justify-center transition-all duration-500 ${animateCheck ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} style={{ transitionDelay: '100ms', transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}>
            <svg viewBox="0 0 52 52" className="w-12 h-12" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 26 L22 34 L38 18" style={{ strokeDasharray: 36, strokeDashoffset: animateCheck ? 0 : 36, transition: 'stroke-dashoffset 0.45s ease 0.25s' }} />
            </svg>
          </div>
        </div>
        <h2 className={`text-gray-900 font-black text-xl mb-1 transition-all duration-500 ${animateCheck ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>Gracias por tu pedido</h2>
        <p className={`text-orange-500 font-bold text-sm mb-5 transition-all duration-500 ${animateCheck ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '380ms' }}>en Pollazo El Mirador</p>
        <p className={`text-gray-400 text-sm leading-relaxed mb-8 transition-all duration-500 ${animateCheck ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '460ms' }}>Redirigiendo a WhatsApp para finalizar...</p>
        <div className={`transition-all duration-500 ${animateCheck ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '540ms' }}>
          <button onClick={() => { if (timer.current) clearTimeout(timer.current); go(onWhatsApp); }} className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-500 to-green-400 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-green-500/25 text-sm">
            <MessageCircle size={18} /> Ir ahora a WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
