import type { Product } from '../types';

export const products: Product[] = [
  // Pollos
  { id: 'pollo-entero', name: 'Pollo Entero', category: 'Pollos', price: '$8.50', unit: 'unidad', badge: 'Popular', description: 'Pollo fresco de granja, limpio y listo para cocinar.', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'pechuga', name: 'Pechuga de Pollo', category: 'Pollos', price: '$4.50', unit: 'lb', badge: 'Fresco', description: 'Pechuga sin hueso, ideal para asados y guisos.', image: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'cuartos', name: 'Cuartos de Pollo', category: 'Pollos', price: '$3.50', unit: 'lb', description: 'Cuartos traseros jugosos, perfectos para la parrilla.', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'menudencias', name: 'Menudencias', category: 'Pollos', price: '$1.50', unit: 'lb', description: 'Hígado, corazón y molleja frescos.', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400' },
  // Embutidos
  { id: 'chorizo', name: 'Chorizo', category: 'Embutidos', price: '$3.00', unit: 'lb', badge: 'Nuevo', image: 'https://images.pexels.com/photos/410648/pexels-photo-410648.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'mortadela', name: 'Mortadela', category: 'Embutidos', price: '$2.50', unit: 'lb', image: 'https://images.pexels.com/photos/208081/pexels-photo-208081.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'salchicha', name: 'Salchicha', category: 'Embutidos', price: '$2.80', unit: 'lb', image: 'https://images.pexels.com/photos/1638507/pexels-photo-1638507.jpeg?auto=compress&cs=tinysrgb&w=400' },
  // Bebidas
  { id: 'coca-cola-300ml', name: 'Coca-Cola 300ml', category: 'Bebidas', price: '$0.75', unit: 'botella', image: 'https://images.pexels.com/photos/2668308/pexels-photo-2668308.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'agua-500ml', name: 'Agua 500ml', category: 'Bebidas', price: '$0.50', unit: 'botella', image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'jugo-natural', name: 'Jugo Natural', category: 'Bebidas', description: 'Consultar sabores disponibles.', image: 'https://images.pexels.com/photos/1234120/pexels-photo-1234120.jpeg?auto=compress&cs=tinysrgb&w=400' },
  // Lácteos
  { id: 'leche', name: 'Leche 1L', category: 'Lácteos y refrigerados', price: '$1.20', unit: 'litro', image: 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'queso', name: 'Queso Fresco', category: 'Lácteos y refrigerados', price: '$3.00', unit: 'lb', image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'yogur', name: 'Yogur Natural', category: 'Lácteos y refrigerados', price: '$1.50', unit: '200g', image: 'https://images.pexels.com/photos/373882/pexels-photo-373882.jpeg?auto=compress&cs=tinysrgb&w=400' },
  // Abarrotes
  { id: 'arroz', name: 'Arroz 1kg', category: 'Abarrotes y básicos', price: '$1.80', unit: 'kg', image: 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'aceite', name: 'Aceite 1L', category: 'Abarrotes y básicos', price: '$3.50', unit: 'litro', image: 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'huevos', name: 'Huevos (cubeta 30)', category: 'Abarrotes y básicos', price: '$5.50', unit: 'cubeta', badge: 'Oferta', image: 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400' },
  // Snacks
  { id: 'papas-fritas', name: 'Papas Fritas', category: 'Snacks y dulces', price: '$1.00', unit: 'bolsa', image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'chifles', name: 'Chifles', category: 'Snacks y dulces', price: '$0.75', unit: 'bolsa', image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'chocolate', name: 'Chocolate', category: 'Snacks y dulces', price: '$1.25', unit: 'barra', image: 'https://images.pexels.com/photos/918327/pexels-photo-918327.jpeg?auto=compress&cs=tinysrgb&w=400' },
];
