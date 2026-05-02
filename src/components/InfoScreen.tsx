import { useState } from 'react';
import { MapPin, Clock, MessageCircle, Phone, Truck, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import Testimonials from './Testimonials';
import LiveMetrics from './LiveMetrics';

const WHATSAPP = '+593989795628';
const WA_HELLO = `https://wa.me/${WHATSAPP}?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20La%20Casa%20del%20Pollazo%20El%20Mirador%20%F0%9F%8D%97`;

const teamMembers = [
  { name: 'Edgar Verdesoto', role: 'Encargado', photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  { name: 'Mery Loyola', role: 'Encargada', photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  { name: 'Paola', role: 'Parte del equipo', photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
  { name: 'Matias Verdesoto', role: 'Parte del equipo', photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop' },
];

export default function InfoScreen({ onInstall, canInstall }: { onInstall: () => Promise<void>; canInstall: boolean }) {
  const [teamIndex, setTeamIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-6">
      <div className="rounded-3xl overflow-hidden hero-water">
        <div className="px-5 py-6 flex items-center gap-4">
          <img src="/Picsart_26-03-14_04-02-01-579.png" alt="La Casa del Pollazo" className="w-20 h-20 object-contain flex-shrink-0" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.2)) drop-shadow(0 0 8px rgba(255,255,255,0.3))' }} />
          <div>
            <h2 className="text-white font-black text-xl leading-tight">La Casa del Pollazo</h2>
            <p className="text-white/90 font-bold text-sm mt-0.5">El Mirador</p>
            <p className="text-white/70 text-xs mt-1">Puerto Ayora, Galápagos</p>
          </div>
        </div>
      </div>
      <LiveMetrics />
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <h3 className="font-black text-gray-900 text-base">Contáctanos</h3>
        {[
          { icon: <MessageCircle size={16} className="text-green-500" />, label: 'WhatsApp', href: WA_HELLO, text: 'Chatear ahora' },
          { icon: <Phone size={16} className="text-blue-500" />, label: 'Teléfono', href: `tel:${WHATSAPP}`, text: WHATSAPP },
          { icon: <MapPin size={16} className="text-red-500" />, label: 'Ubicación', href: 'https://maps.app.goo.gl/uM7jPvwGxzyUeeJYA', text: 'El Mirador, Calle Delfín' },
        ].map(item => (
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-2.5 px-3 bg-gray-50 rounded-xl active:bg-gray-100 transition-colors">
            {item.icon}
            <div><p className="text-[10px] text-gray-400 font-medium">{item.label}</p><p className="text-sm text-gray-800 font-semibold">{item.text}</p></div>
          </a>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 mb-3"><Clock size={16} className="text-orange-500" /><h3 className="font-black text-gray-900 text-base">Horario</h3></div>
        {[{ day: 'Lunes – Viernes', hours: '7:00 AM – 9:00 PM' }, { day: 'Sábado', hours: '7:00 AM – 10:00 PM' }, { day: 'Domingo', hours: '8:00 AM – 8:00 PM' }].map(({ day, hours }) => (
          <div key={day} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-600 font-medium">{day}</span>
            <span className="text-sm font-bold text-gray-900">{hours}</span>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-4">
        <div className="flex items-center gap-2 mb-2"><Truck size={16} className="text-orange-500" /><h3 className="font-black text-gray-900 text-base">Delivery</h3></div>
        <p className="text-sm text-gray-600 leading-relaxed">Entregamos en Puerto Ayora. Tiempo estimado: <strong className="text-orange-600">20-40 minutos</strong>.</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="font-black text-gray-900 text-base mb-4 text-center">Nuestro equipo</h3>
        <div className="relative flex items-center justify-center">
          <button onClick={() => setTeamIndex(i => (i - 1 + teamMembers.length) % teamMembers.length)} className="absolute left-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform z-10"><ChevronLeft size={16} className="text-gray-600" /></button>
          <div className="text-center px-10">
            <img src={teamMembers[teamIndex].photo} alt={teamMembers[teamIndex].name} className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-orange-100 shadow-md" />
            <p className="font-black text-gray-900 mt-3">{teamMembers[teamIndex].name}</p>
            <p className="text-sm text-orange-500 font-semibold mt-0.5">{teamMembers[teamIndex].role}</p>
          </div>
          <button onClick={() => setTeamIndex(i => (i + 1) % teamMembers.length)} className="absolute right-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center active:scale-90 transition-transform z-10"><ChevronRight size={16} className="text-gray-600" /></button>
        </div>
        <div className="flex justify-center gap-1.5 mt-4">
          {teamMembers.map((_, i) => <button key={i} onClick={() => setTeamIndex(i)} className={`rounded-full transition-all duration-300 ${i === teamIndex ? 'w-5 h-1.5 bg-orange-500' : 'w-1.5 h-1.5 bg-gray-200'}`} />)}
        </div>
      </div>
      {canInstall && (
        <button onClick={onInstall} className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-black py-4 rounded-2xl text-sm active:scale-[0.98] transition-transform shadow-lg shadow-orange-200">
          <Download size={18} /> Instalar app en mi celular
        </button>
      )}
      <Testimonials />
    </div>
  );
}
