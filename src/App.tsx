import { useState, useCallback, useEffect, useRef } from 'react';
import { CartProvider } from './context/CartContext';
import { FlyToCartProvider } from './context/FlyToCartContext';
import FlyParticleLayer from './components/FlyParticleLayer';
import HomeScreen from './components/HomeScreen';
import CatalogScreen from './components/CatalogScreen';
import CartScreen from './components/CartScreen';
import InfoScreen from './components/InfoScreen';
import BottomNav from './components/BottomNav';
import AppHeader from './components/AppHeader';
import OrderConfirmation from './components/OrderConfirmation';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import { ToastContainer, useBehavioralToasts } from './components/BehavioralToast';
import { useCart } from './context/CartContext';
import { buildWhatsAppUrl } from './utils/whatsapp';
import { supabase } from './lib/supabase';
import type { Category } from './types';

type Screen = 'home' | 'catalog' | 'cart' | 'info';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const LANDING_KEY = 'pollazo_landing_dismissed';

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone === true)
  );
}

function AppShell({ canInstall, onInstall }: { canInstall: boolean; onInstall: () => Promise<void> }) {
  const [screen, setScreen] = useState<Screen>('home');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const { items, clearCart, totalCount } = useCart();
  const mainRef = useRef<HTMLElement>(null);
  const { toasts, dismiss } = useBehavioralToasts(totalCount, screen);

  const handleNavigate = useCallback((s: Screen) => { setScreen(s); if (mainRef.current) mainRef.current.scrollTop = 0; }, []);
  const handleNavigateToCategory = useCallback((cat: Category) => { setActiveCategory(cat); setScreen('catalog'); if (mainRef.current) mainRef.current.scrollTop = 0; }, []);

  const handleWhatsApp = () => {
    supabase.rpc('increment_metric', { metric_id: 'total_orders' }).then(() => {});
    window.open(buildWhatsAppUrl(items), '_blank');
    clearCart(); setShowConfirmation(false); setScreen('home');
  };

  return (
    <div className="flex flex-col bg-gray-50" style={{ minHeight: '100dvh', maxHeight: '100dvh' }}>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <AppHeader onNavigate={handleNavigate} />
      <main ref={mainRef} className="flex-1 overflow-y-auto pb-20" style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}>
        {screen === 'home' && <HomeScreen onNavigate={handleNavigate} onNavigateToCategory={handleNavigateToCategory} />}
        {screen === 'catalog' && <CatalogScreen initialCategory={activeCategory} onCategoryChange={setActiveCategory} />}
        {screen === 'cart' && <CartScreen onCheckout={() => { if (items.length > 0) setShowConfirmation(true); }} onNavigate={handleNavigate} />}
        {screen === 'info' && <InfoScreen onInstall={onInstall} canInstall={canInstall} />}
      </main>
      <BottomNav current={screen} onNavigate={handleNavigate} />
      <FlyParticleLayer />
      <OrderConfirmation visible={showConfirmation} onWhatsApp={handleWhatsApp} />
    </div>
  );
}

export default function App() {
  const [landingDone, setLandingDone] = useState(() => isStandalone() || !!sessionStorage.getItem(LANDING_KEY));
  const [splashDone, setSplashDone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent); setCanInstall(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null); setCanInstall(false);
  };

  const handleContinueWeb = () => { sessionStorage.setItem(LANDING_KEY, '1'); setLandingDone(true); };

  if (!landingDone) return <LandingPage onInstall={handleInstall} canInstall={canInstall} onContinueWeb={handleContinueWeb} />;

  return (
    <CartProvider>
      <FlyToCartProvider>
        {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
        <AppShell canInstall={canInstall} onInstall={handleInstall} />
      </FlyToCartProvider>
    </CartProvider>
  );
}
