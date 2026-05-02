import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function LiveMetrics() {
  const [metrics, setMetrics] = useState({ total_orders: 847, happy_customers: 612 });

  useEffect(() => {
    supabase.from('metrics').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, number> = {};
        (data as { id: string; value: number }[]).forEach(m => { map[m.id] = m.value; });
        setMetrics(prev => ({ ...prev, ...map }));
      }
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      {[{ label: 'Pedidos realizados', value: metrics.total_orders, icon: '📦' }, { label: 'Clientes felices', value: metrics.happy_customers, icon: '😊' }].map(m => (
        <div key={m.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl mb-1">{m.icon}</p>
          <p className="font-black text-2xl text-orange-500">{m.value.toLocaleString()}+</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
