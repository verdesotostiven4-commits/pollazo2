import { useState, useEffect } from 'react';
import { Download, Shield, Store, Globe, Loader2, CheckCircle2, Smartphone } from 'lucide-react';

interface Props {
  onInstall: () => void;
  canInstall: boolean;
  onContinueWeb: () => void;
}

type InstallState = 'idle' | 'waiting' | 'success';

const BENEFITS = [
  { icon: '⚡', text: 'Carga instantánea' },
  { icon: '📦', text: 'Sin Play Store ni App Store' },
  { icon: '🔔', text: 'Notificaciones de pedidos' },
  { icon: '📴', text: 'Funciona sin internet' },
];

export default function LandingPage({ onInstall, canInstall, onContinueWeb }: Props) {
  const [visible, setVisible] = useState(false);
  const [installState, setInstallState] = useState<InstallState>('idle');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Listen for native appinstalled event — show success, do NOT redirect
  useEffect(() => {
    const handler = () => setInstallState('success');
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  const handleInstallClick = async () => {
    if (installState !== 'idle') return;
    setInstallState('waiting');
    await onInstall();
    // If user dismissed the prompt without installing, go back to idle
    // (success state is set only by appinstalled event)
    // Fallback: if no appinstalled fires within 12s, reset
    const fallback = setTimeout(() => {
      setInstallState(prev => prev === 'waiting' ? 'idle' : prev);
    }, 12000);
    return () => clearTimeout(fallback);
  };

  const fadeIn = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  });

  return (
    <div className="fixed inset-0 z-[300] flex flex-col overflow-y-auto hero-water">

      {/* Ripple blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-15%] left-[-20%] w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 65%)',
            animation: 'water-ripple 9s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-15%] w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(254,240,138,0.35) 0%, transparent 65%)',
            animation: 'water-ripple-2 11s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[40%] right-[10%] w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)',
            animation: 'water-ripple 14s ease-in-out infinite reverse',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 pt-14 pb-10 min-h-full">

        {/* Logo */}
        <div
          className="mb-7 relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(-28px) scale(0.82)',
            transition: 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* White circle bg for maskable feel */}
          <div className="w-28 h-28 rounded-full bg-white shadow-xl shadow-orange-300/40 flex items-center justify-center">
            <img
              src="/Picsart_26-03-14_04-02-01-579.png"
              alt="La Casa del Pollazo"
              className="w-22 h-22 object-contain"
              style={{
                width: 88, height: 88,
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.12))',
                animation: 'splashFloat 3.5s ease-in-out infinite',
              }}
            />
          </div>
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 68%)',
              animation: 'logoGlowPulse 2.8s ease-in-out infinite',
            }}
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8" style={fadeIn(120)}>
          <h1 className="font-black leading-tight mb-1.5" style={{ fontSize: '1.85rem', color: '#431407', textShadow: '0 1px 0 rgba(255,255,255,0.45)' }}>
            La Casa del Pollazo
          </h1>
          <p className="font-bold text-sm" style={{ color: '#7c2d12' }}>
            El Mirador · Puerto Ayora, Galápagos
          </p>
          <p className="font-semibold text-base mt-1" style={{ color: '#9a3412' }}>
            Lo mejor para cada cliente.
          </p>
        </div>

        {/* Success state */}
        {installState === 'success' ? (
          <div className="w-full" style={fadeIn(0)}>
            <div
              className="w-full rounded-3xl px-6 py-7 flex flex-col items-center gap-4 text-center"
              style={{ background: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={36} className="text-green-500" strokeWidth={2} />
              </div>
              <div>
                <p className="font-black text-lg text-gray-900 leading-snug">¡Instalación Exitosa!</p>
                <p className="text-green-600 font-bold text-sm mt-0.5">La app fue instalada correctamente</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-left space-y-1">
                <div className="flex items-start gap-2">
                  <Smartphone size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 font-medium leading-snug">
                    Ya puedes encontrar la App en tu pantalla de inicio. Si no aparece de inmediato, reinicia tu dispositivo.
                  </p>
                </div>
              </div>
              <button
                onClick={onContinueWeb}
                className="text-sm font-semibold text-orange-600 active:opacity-70 underline underline-offset-2"
              >
                Abrir en el navegador
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Benefits grid */}
            <div className="w-full grid grid-cols-2 gap-2.5 mb-7" style={fadeIn(180)}>
              {BENEFITS.map(b => (
                <div
                  key={b.text}
                  className="flex items-center gap-2.5 rounded-2xl px-3.5 py-3"
                  style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.5)' }}
                >
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs font-semibold leading-snug" style={{ color: '#431407' }}>{b.text}</span>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="w-full space-y-3.5" style={fadeIn(260)}>
              <button
                onClick={handleInstallClick}
                disabled={installState === 'waiting'}
                className="btn-shimmer w-full flex items-center justify-center gap-3 py-4 px-5 rounded-2xl font-black text-[15px] active:scale-[0.97] transition-transform disabled:cursor-not-allowed"
                style={{
                  background: installState === 'waiting'
                    ? 'rgba(255,255,255,0.7)'
                    : 'rgba(255,255,255,0.95)',
                  color: installState === 'waiting' ? '#9a3412' : '#c2410c',
                  boxShadow: '0 6px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                {installState === 'waiting' ? (
                  <>
                    <Loader2 size={20} className="animate-spin text-orange-500 flex-shrink-0" />
                    <span>Iniciando descarga... Por favor espere</span>
                  </>
                ) : (
                  <>
                    <Download size={20} className="flex-shrink-0" />
                    <span>Descargar Aplicación del Pollazo en mi celular</span>
                  </>
                )}
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <Shield size={12} style={{ color: '#7c2d12' }} />
                  <span className="text-xs font-semibold" style={{ color: '#7c2d12' }}>App Segura</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <Store size={12} style={{ color: '#7c2d12' }} />
                  <span className="text-xs font-semibold" style={{ color: '#7c2d12' }}>Sin tienda de apps</span>
                </div>
              </div>

              {!canInstall && installState === 'idle' && (
                <p className="text-xs text-center px-2 leading-relaxed" style={{ color: '#92400e' }}>
                  Para instalar: abre en <strong>Chrome</strong> (Android) o <strong>Safari</strong> (iOS) y usa "Agregar a pantalla de inicio"
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex-1 min-h-[24px]" />

        {/* Continue web — always visible */}
        {installState !== 'success' && (
          <button
            onClick={onContinueWeb}
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity active:opacity-60 mt-6"
            style={{
              color: '#7c2d12',
              opacity: visible ? 0.65 : 0,
              transition: 'opacity 0.55s ease 0.45s',
            }}
          >
            <Globe size={12} />
            Continuar en la web por ahora
          </button>
        )}
      </div>
    </div>
  );
}
