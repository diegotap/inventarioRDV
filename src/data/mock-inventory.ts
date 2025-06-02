import type { InventoryItem } from '@/lib/types';

export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Tomates Frescos',
    category: 'Verduras',
    quantity: 50,
    price: 2.5,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Cebollas Blancas',
    category: 'Verduras',
    quantity: 30,
    price: 1.8,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pechuga de Pollo',
    category: 'Carnes',
    quantity: 20,
    price: 8.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Arroz Grano Largo',
    category: 'Granos',
    quantity: 100,
    price: 1.2,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Aceite de Oliva Extra Virgen',
    category: 'Aceites',
    quantity: 15,
    price: 12.5,
    lastUpdated: new Date().toISOString(),
  },
];
