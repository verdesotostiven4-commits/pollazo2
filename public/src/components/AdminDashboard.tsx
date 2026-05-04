import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, LogOut, Save, Bell, BellOff, Package, CheckCircle, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { products } from '../data/products';
import { useAdmin } from '../context/AdminContext';
import { Category } from '../types';

const ADMIN_PIN = '1234';
const PIN_KEY = 'pollazo_admin_auth';

const CATEGORY_ICONS: Record<string, string> = {
  'Pollos': '🍗', 'Embutidos': '🥓', 'Lácteos y refrigerados': '🥛',
  'Abarrotes y básicos': '🌾', 'Salsas, aliños y aceites': '🫙', 'Bebidas': '🥤',
  'Frutas y verduras': '🥦', 'Snacks y dulces': '🍫', 'Cuidado personal': '🧴', 'Limpieza y hogar': '🧹',
};

function PinScreen({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(PIN_KEY, '1');
      onAuth();
    } else {
      setError(true);
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const digits = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: '#1a1a2e' }}>
      <div className="flex flex-col items-center gap-8 w-full max-w-xs px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#E67E22' }}>
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-white font-black text-2xl">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">Pollazo Galapagueño · El Mirador</p>
        </div>

        {/* PIN dots */}
        <div
          className={`flex gap-4 ${shake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
          style={shake ? { animation: 'shake 0.5s ease-in-out' } : {}}
        >
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className="w-4 h-4 rounded-full transition-all duration-200"
              style={{ background: i < pin.length ? '#E67E22' : error ? '#ef4444' : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>
        {error && <p className="text-red-400 text-sm font-semibold -mt-4">PIN incorrecto</p>}

        {/* Hidden input for desktop */}
        <input
          ref={inputRef}
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={e => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 4);
            setPin(v);
            setError(false);
            if (v.length === 4) {
              if (v === ADMIN_PIN) {
                sessionStorage.setItem(PIN_KEY, '1');
                onAuth();
              } else {
                setError(true);
                setShake(true);
                setTimeout(() => { setPin(''); setShake(false); }, 600);
              }
            }
          }}
          onKeyDown={handleKey}
          className="opacity-0 absolute w-0 h-0"
        />

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {digits.map((d, i) => (
            d === '' ? <div key={i} /> :
            <button
              key={i}
              onClick={() => {
                if (d === '⌫') {
                  setPin(prev => prev.slice(0, -1));
                  setError(false);
                } else if (pin.length < 4) {
                  const next = pin + d;
                  setPin(next);
                  setError(false);
                  if (next.length === 4) {
                    if (next === ADMIN_PIN) {
                      sessionStorage.setItem(PIN_KEY, '1');
                      onAuth();
                    } else {
                      setError(true);
                      setShake(true);
                      setTimeout(() => { setPin(''); setShake(false); }, 600);
                    }
                  }
                }
              }}
              className="aspect-square rounded-2xl text-white font-bold text-xl flex items-center justify-center active:scale-90 transition-all"
              style={{ background: d === '⌫' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {d}
            </button>
          ))}
        </div>

        <p className="text-white/30 text-xs">Acceso restringido al personal autorizado</p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

interface EditingPrice {
  id: string;
  value: string;
}

type SortField = 'name' | 'category' | 'price' | 'available';
type SortDir = 'asc' | 'desc';

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(PIN_KEY) === '1');
  const { overrides, announcement, setAnnouncement, setOverride, loading } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<Category | 'Todos'>('Todos');
  const [filterAvail, setFilterAvail] = useState<'all' | 'available' | 'unavailable'>('all');
  const [editingPrice, setEditingPrice] = useState<EditingPrice | null>(null);
  const [announcementDraft, setAnnouncementDraft] = useState(announcement);
  const [annSaving, setAnnSaving] = useState(false);
  const [annSaved, setAnnSaved] = useState(false);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const priceInputRef = useRef<HTMLInputElement>(null);

  // Sync announcement draft when loaded
  useEffect(() => { setAnnouncementDraft(announcement); }, [announcement]);
  useEffect(() => { if (editingPrice) priceInputRef.current?.focus(); }, [editingPrice]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category)));
    return cats.sort();
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === 'Todos' || p.category === filterCat;
      const ov = overrides[p.id];
      const avail = ov ? ov.available : true;
      const matchAvail = filterAvail === 'all' ||
        (filterAvail === 'available' && avail) ||
        (filterAvail === 'unavailable' && !avail);
      return matchSearch && matchCat && matchAvail;
    });

    list = list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortField === 'price') cmp = (a.price ?? '').localeCompare(b.price ?? '');
      else if (sortField === 'available') {
        const aa = overrides[a.id]?.available ?? true;
        const ba = overrides[b.id]?.available ?? true;
        cmp = Number(ba) - Number(aa);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [search, filterCat, filterAvail, overrides, sortField, sortDir]);

  const stats = useMemo(() => {
    const total = products.length;
    const unavailable = products.filter(p => overrides[p.id]?.available === false).length;
    const modified = Object.keys(overrides).filter(id => overrides[id].price !== null).length;
    return { total, unavailable, modified };
  }, [overrides]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleToggleAvail = (id: string) => {
    const current = overrides[id]?.available ?? true;
    setOverride(id, { available: !current });
  };

  const handlePriceEdit = (id: string) => {
    const current = overrides[id]?.price ?? products.find(p => p.id === id)?.price ?? '';
    setEditingPrice({ id, value: current });
  };

  const handlePriceSave = () => {
    if (!editingPrice) return;
    const base = products.find(p => p.id === editingPrice.id)?.price ?? '';
    const val = editingPrice.value.trim() || null;
    setOverride(editingPrice.id, { price: val === base ? null : val });
    setEditingPrice(null);
  };

  const handleAnnouncementSave = async () => {
    setAnnSaving(true);
    await setAnnouncement(announcementDraft);
    setAnnSaving(false);
    setAnnSaved(true);
    setTimeout(() => setAnnSaved(false), 2000);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={12} className="text-gray-300" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-orange-500" /> : <ChevronDown size={12} className="text-orange-500" />;
  };

  if (!authed) return <PinScreen onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#E67E22' }}>
              <Package size={16} className="text-white" />
            </div>
            <div>
              <span className="font-black text-gray-900 text-sm">Admin Panel</span>
              <span className="text-gray-400 text-xs ml-2">Pollazo Galapagueño</span>
            </div>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem(PIN_KEY); setAuthed(false); }}
            className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total productos', value: stats.total, icon: <Package size={18} className="text-blue-500" />, bg: 'bg-blue-50' },
            { label: 'Agotados', value: stats.unavailable, icon: <AlertCircle size={18} className="text-red-500" />, bg: 'bg-red-50' },
            { label: 'Precios editados', value: stats.modified, icon: <CheckCircle size={18} className="text-green-500" />, bg: 'bg-green-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-3 flex flex-col gap-1`}>
              {s.icon}
              <span className="text-2xl font-black text-gray-900">{s.value}</span>
              <span className="text-[11px] text-gray-500 font-medium leading-tight">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Announcement banner editor */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            {announcementDraft ? <Bell size={16} className="text-orange-500" /> : <BellOff size={16} className="text-gray-400" />}
            <h2 className="font-black text-gray-900 text-sm">Aviso del día</h2>
            <span className="text-xs text-gray-400 font-medium ml-auto">Aparece en inicio y catálogo</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={announcementDraft}
              onChange={e => setAnnouncementDraft(e.target.value)}
              placeholder="Ej: Hoy 20% off en pollos enteros — solo hasta las 6pm"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
            />
            <button
              onClick={handleAnnouncementSave}
              disabled={annSaving}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              style={{ background: annSaved ? '#22c55e' : '#E67E22', minWidth: 80 }}
            >
              {annSaved ? <><CheckCircle size={14} /> Guardado</> : annSaving ? 'Guardando…' : <><Save size={14} /> Guardar</>}
            </button>
          </div>
          {announcementDraft && (
            <div className="mt-3 flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2.5">
              <Bell size={13} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-800 font-medium leading-snug">{announcementDraft}</p>
              <button onClick={() => setAnnouncementDraft('')} className="ml-auto text-orange-400 hover:text-orange-600 flex-shrink-0">
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full bg-gray-50 rounded-xl pl-9 pr-9 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value as Category | 'Todos')}
              className="text-xs font-semibold bg-gray-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200 text-gray-700"
            >
              <option value="Todos">Todas las categorías</option>
              {categories.map(c => (
                <option key={c} value={c}>{CATEGORY_ICONS[c] ?? '📦'} {c}</option>
              ))}
            </select>

            {(['all','available','unavailable'] as const).map(v => (
              <button
                key={v}
                onClick={() => setFilterAvail(v)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all ${filterAvail === v ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {v === 'all' ? 'Todos' : v === 'available' ? 'Disponibles' : 'Agotados'}
              </button>
            ))}

            <span className="ml-auto text-xs text-gray-400 font-medium self-center">{filtered.length} resultados</span>
          </div>
        </div>

        {/* Product table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">
              <div className="w-6 h-6 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin mr-3" />
              Cargando datos…
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="grid gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wide"
                style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr' }}>
                <button onClick={() => handleSort('category')} className="flex items-center gap-1 text-left hover:text-gray-700">
                  Cat <SortIcon field="category" />
                </button>
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 text-left hover:text-gray-700">
                  Producto <SortIcon field="name" />
                </button>
                <button onClick={() => handleSort('price')} className="flex items-center gap-1 text-left hover:text-gray-700">
                  Precio <SortIcon field="price" />
                </button>
                <button onClick={() => handleSort('available')} className="flex items-center gap-1 text-left hover:text-gray-700">
                  Estado <SortIcon field="available" />
                </button>
                <span>Acciones</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-gray-400">
                    <Package size={32} className="mb-3 text-gray-300" />
                    <p className="font-semibold text-sm">Sin resultados</p>
                  </div>
                ) : filtered.map(product => {
                  const ov = overrides[product.id];
                  const available = ov ? ov.available : true;
                  const displayPrice = ov?.price ?? product.price;
                  const priceModified = ov?.price != null;
                  const isEditing = editingPrice?.id === product.id;

                  return (
                    <div
                      key={product.id}
                      className={`grid gap-2 px-4 py-3 items-center hover:bg-gray-50/80 transition-colors ${!available ? 'bg-red-50/30' : ''}`}
                      style={{ gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr' }}
                    >
                      {/* Category */}
                      <span className="text-xs text-gray-400 font-medium truncate">
                        {CATEGORY_ICONS[product.category] ?? '📦'} {product.category.split(' ')[0]}
                      </span>

                      {/* Name + image */}
                      <div className="flex items-center gap-2 min-w-0">
                        {product.image && (
                          <img src={product.image} alt={product.name} className="w-8 h-8 rounded-lg object-contain bg-gray-50 flex-shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-gray-900 truncate">{product.name}</span>
                      </div>

                      {/* Price */}
                      <div className="min-w-0">
                        {isEditing ? (
                          <input
                            ref={priceInputRef}
                            type="text"
                            value={editingPrice.value}
                            onChange={e => setEditingPrice(prev => prev ? { ...prev, value: e.target.value } : null)}
                            onKeyDown={e => { if (e.key === 'Enter') handlePriceSave(); if (e.key === 'Escape') setEditingPrice(null); }}
                            onBlur={handlePriceSave}
                            className="w-full text-xs bg-orange-50 border border-orange-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-orange-300 font-semibold text-gray-900"
                          />
                        ) : (
                          <button
                            onClick={() => handlePriceEdit(product.id)}
                            className={`text-xs font-bold px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors text-left ${priceModified ? 'text-orange-600 bg-orange-50' : 'text-gray-600'}`}
                          >
                            {displayPrice ?? 'Consultar'}
                            {priceModified && <span className="ml-1 text-[9px] text-orange-400">✏️</span>}
                          </button>
                        )}
                      </div>

                      {/* Availability badge */}
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full w-fit ${
                        available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-green-500' : 'bg-red-500'}`} />
                        {available ? 'Disponible' : 'Agotado'}
                      </span>

                      {/* Toggle */}
                      <button
                        onClick={() => handleToggleAvail(product.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
                          available ? 'bg-green-400' : 'bg-gray-300'
                        }`}
                        title={available ? 'Marcar como agotado' : 'Marcar como disponible'}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                          available ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 pb-6">
          Los cambios se sincronizan en tiempo real con el catálogo de clientes.
        </p>
      </div>
    </div>
  );
}
