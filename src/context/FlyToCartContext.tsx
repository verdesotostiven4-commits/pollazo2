import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface FlyParticle { id: number; x: number; y: number; image: string; }

const FlyToCartContext = createContext<{
  particles: FlyParticle[];
  triggerFly: (x: number, y: number, image: string) => void;
} | null>(null);

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [particles, setParticles] = useState<FlyParticle[]>([]);
  const triggerFly = useCallback((x: number, y: number, image: string) => {
    const id = Date.now() + Math.random();
    setParticles(prev => [...prev, { id, x, y, image }]);
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 900);
  }, []);
  return <FlyToCartContext.Provider value={{ particles, triggerFly }}>{children}</FlyToCartContext.Provider>;
}

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error('useFlyToCart must be inside FlyToCartProvider');
  return ctx;
}
