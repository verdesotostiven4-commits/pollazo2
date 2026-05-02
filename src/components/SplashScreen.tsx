import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'out'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('out'), 2600);
    const t3 = setTimeout(() => onDone(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[200] hero-water" style={{ opacity: phase === 'out' ? 0 : 1, transition: phase === 'out' ? 'opacity 0.4s ease' : 'none', pointerEvents: phase === 'out' ? 'none' : 'all' }}>
      <div className="absolute pointer-events-none" style={{ width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.38) 0%, rgba(249,115,22,0.18) 50%, transparent 72%)', opacity: phase === 'enter' ? 0 : 1, transition: 'opacity 0.5s ease', animation: phase !== 'enter' ? 'logoGlowPulse 2.8s ease-in-out infinite' : 'none' }} />
      <div style={{ animation: phase === 'enter' ? 'splashDrop 0.6s cubic-bezier(0.22,1.5,0.5,1) forwards' : 'splashFloat 3.2s ease-in-out infinite' }}>
        <img src="/Picsart_26-03-14_04-02-01-579.png" alt="La Casa del Pollazo" className="w-40 h-40 object-contain" style={{ filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.3)) drop-shadow(0 0 20px rgba(251,146,60,0.4))' }} />
      </div>
      <div className="mt-7 text-center" style={{ opacity: phase === 'enter' ? 0 : 1, transform: phase === 'enter' ? 'translateY(12px)' : 'translateY(0)', transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s' }}>
        <p className="text-white font-black text-2xl tracking-tight drop-shadow-lg">La Casa del Pollazo</p>
        <p className="text-white/70 font-semibold text-sm tracking-[0.22em] uppercase mt-1.5">El Mirador</p>
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
        </div>
      </div>
    </div>
  );
}
