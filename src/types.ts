export type Category =
  | 'Pollos'
  | 'Embutidos'
  | 'Bebidas'
  | 'Lácteos y refrigerados'
  | 'Abarrotes y básicos'
  | 'Snacks y dulces';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price?: string;
  unit?: string;
  image?: string;
  badge?: string;
  description?: string;
}
