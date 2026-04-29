import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import type { Category } from '../types';

const CATEGORIES: (Category | 'Todos')[] = ['Todos', 'Pollos', 'Embutidos', 'Bebidas', 'Lácteos y refrigerados', 'Abarrotes y básicos', 'Snacks y dulces'];

interface Props {
  initialCategory: Category | 'Todos';
  onCategoryChange: (cat: Category | 'Todos') => void;
}

export default function CatalogScreen({ initialCategory, onCategoryChange }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>(initialCategory);
  const [search, setSearch] = useState('');

  const handleCategory = useCallback((cat: Category | 'Todos') => {
    setActiveCategory(cat);
    onCategoryChange(cat);
  }, [onCategoryChange]);

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
        </div>
      </div>
      <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${activeCategory === cat ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 pt-3">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        {filtered.length === 0 && <div className="col-span-2 text-center py-12 text-gray-400 text-sm">Sin resultados</div>}
      </div>
    </div>
  );
}
