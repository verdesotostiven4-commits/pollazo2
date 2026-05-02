import { useState, useEffect } from 'react';
import { Download, Shield, Store, Globe, Loader2 } from 'lucide-react';

interface Props {
  onInstall: () => void;
  canInstall: boolean;
  onContinueWeb: () => void;
}

export default function LandingPage({ onInstall, canInstall, onContinueWeb }: Props) {
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Listen for successful install — redirect to home
  useEffect(() => {
    const handler = () => {
      // App was installed; continue to web view (splash + home)
      onContinueWeb();
    };
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, [onContinueWeb]);

  const handleInstallClick = async () => {
    if (installing) return;
    setInstalling(true);
    await onInstall();
    // If prompt was dismissed without install, reset state
    setTimeout(() => setInstalling(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col overflow-y-auto"
      style={{
        background: 'linear-gradient(160deg, #f97316 0%, #fb923c 35%, #fdba74 65%, #fde68a 100%)',
      }}
    >
      {/* Soft blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 pt-16 pb-12 min-h-full">

        {/* Logo */}
        <div
          className="mb-8 relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(-32px) scale(0.8)',
            transition: 'opacity 0.65s cubic-bezier(0.34,1.56,0.64,1), transform 0.65s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
              animation: 'logoGlowPulse 2.8s ease-in-out infinite',
            }}
          />
          <img
            src="/Picsart_26-03-14_04-02-01-579.png"
            alt="La Casa del Pollazo"
            className="w-32 h-32 object-contain relative z-10"
            style={{
              filter: 'drop-shadow(0 12px 36px rgba(0,0,0,0.22)) drop-shadow(0 0 16px rgba(255,255,255,0.3))',
              animation: 'splashFloat 3.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Title */}
        <div
          className="text-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.55s ease 0.15s, transform 0.55s ease 0.15s',
          }}
        >
          <h1
            className="font-black leading-tight mb-2"
            style={{ fontSize: '2rem', color: '#7c2d12', textShadow: '0 1px 0 rgba(255,255,255,0.4)' }}
          >
            La Casa del Pollazo
          </h1>
          <p className="font-semibold text-base" style={{ color: '#9a3412' }}>
            Lo mejor para cada cliente.
          </p>
        </div>

        {/* Install CTA */}
        <div
          className="w-full space-y-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.55s ease 0.25s, transform 0.55s ease 0.25s',
          }}
        >
          <button
            onClick={handleInstallClick}
            disabled={installing}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-black text-base active:scale-[0.97] transition-transform disabled:opacity-80"
            style={{
              background: '#ea580c',
              color: '#ffffff',
              boxShadow: '0 6px 28px rgba(194,65,12,0.45), 0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {installing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Iniciando instalación...
              </>
            ) : (
              <>
                <Download size={20} />
                Descargar Aplicación del Pollazo en mi celular
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-sm rounded-full px-3 py-2 border border-white/40">
              <Shield size={13} style={{ color: '#7c2d12' }} />
              <span className="text-xs font-semibold" style={{ color: '#7c2d12' }}>App Segura</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/30 backdrop-blur-sm rounded-full px-3 py-2 border border-white/40">
              <Store size={13} style={{ color: '#7c2d12' }} />
              <span className="text-xs font-semibold" style={{ color: '#7c2d12' }}>Sin descargas de tienda</span>
            </div>
          </div>

          {!canInstall && !installing && (
            <p className="text-xs text-center px-4" style={{ color: '#9a3412' }}>
              Para instalar: abre en Chrome (Android) o Safari (iOS) y usa "Agregar a pantalla de inicio"
            </p>
          )}
        </div>

        <div className="flex-1" />

        {/* Continue web */}
        <button
          onClick={onContinueWeb}
          className="flex items-center gap-1.5 text-xs font-medium transition-opacity active:opacity-80 mt-8"
          style={{
            color: '#9a3412',
            opacity: visible ? 0.7 : 0,
            transition: 'opacity 0.55s ease 0.4s',
          }}
        >
          <Globe size={12} />
          Continuar en la web por ahora
        </button>
      </div>
    </div>
  );
}
