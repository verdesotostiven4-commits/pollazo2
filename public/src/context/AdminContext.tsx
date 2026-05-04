import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface ProductOverride {
  id: string;
  price: string | null;
  available: boolean;
}

interface AdminContextValue {
  overrides: Record<string, ProductOverride>;
  announcement: string;
  setAnnouncement: (text: string) => Promise<void>;
  setOverride: (id: string, patch: Partial<Omit<ProductOverride, 'id'>>) => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextValue>({
  overrides: {},
  announcement: '',
  setAnnouncement: async () => {},
  setOverride: async () => {},
  loading: true,
});

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({});
  const [announcement, setAnnouncementState] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [{ data: ov }, { data: settings }] = await Promise.all([
        supabase.from('product_overrides').select('id, price, available'),
        supabase.from('app_settings').select('key, value'),
      ]);

      if (cancelled) return;

      if (ov) {
        const map: Record<string, ProductOverride> = {};
        for (const row of ov) map[row.id] = row as ProductOverride;
        setOverrides(map);
      }
      if (settings) {
        const ann = settings.find(s => s.key === 'announcement');
        if (ann) setAnnouncementState(ann.value);
      }
      setLoading(false);
    }

    load();

    // Real-time subscription for product_overrides
    const ovChannel = supabase
      .channel('product_overrides_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'product_overrides' }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const row = payload.new as ProductOverride;
          setOverrides(prev => ({ ...prev, [row.id]: row }));
        } else if (payload.eventType === 'DELETE') {
          const id = (payload.old as ProductOverride).id;
          setOverrides(prev => { const n = { ...prev }; delete n[id]; return n; });
        }
      })
      .subscribe();

    // Real-time subscription for app_settings
    const settingsChannel = supabase
      .channel('app_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'app_settings' }, payload => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const row = payload.new as { key: string; value: string };
          if (row.key === 'announcement') setAnnouncementState(row.value);
        }
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(ovChannel);
      supabase.removeChannel(settingsChannel);
    };
  }, []);

  const setAnnouncement = useCallback(async (text: string) => {
    setAnnouncementState(text);
    await supabase.from('app_settings').upsert({ key: 'announcement', value: text, updated_at: new Date().toISOString() });
  }, []);

  const setOverride = useCallback(async (id: string, patch: Partial<Omit<ProductOverride, 'id'>>) => {
    const current = overrides[id] ?? { id, price: null, available: true };
    const updated = { ...current, ...patch, id, updated_at: new Date().toISOString() };
    setOverrides(prev => ({ ...prev, [id]: { id, price: updated.price, available: updated.available } }));
    await supabase.from('product_overrides').upsert(updated);
  }, [overrides]);

  return (
    <AdminContext.Provider value={{ overrides, announcement, setAnnouncement, setOverride, loading }}>
      {children}
    </AdminContext.Provider>
  );
}
