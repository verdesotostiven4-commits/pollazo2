import { useFlyToCart } from '../context/FlyToCartContext';

export default function FlyParticleLayer() {
  const { particles } = useFlyToCart();
  return (
    <div className="fixed inset-0 pointer-events-none z-[150]">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-lg"
          style={{
            left: p.x - 20,
            top: p.y - 20,
            animation: 'flyToCart 0.85s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
          }}
        >
          {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-orange-400" />}
        </div>
      ))}
      <style>{`
        @keyframes flyToCart {
          0%   { transform: scale(1) translate(0, 0); opacity: 1; }
          80%  { transform: scale(0.4) translate(calc(50vw - 20px), calc(-50vh + 40px)); opacity: 0.8; }
          100% { transform: scale(0) translate(calc(50vw - 20px), calc(-50vh + 40px)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
