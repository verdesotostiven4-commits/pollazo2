import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CatalogPage from './components/CatalogPage';

type View = 'landing' | 'catalog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // If already installed (standalone mode), skip landing
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setView('catalog');
    }
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  if (view === 'catalog') {
    return <CatalogPage />;
  }

  return (
    <LandingPage
      onInstall={handleInstall}
      canInstall={!!installPrompt}
      onContinueWeb={() => setView('catalog')}
    />
  );
}
