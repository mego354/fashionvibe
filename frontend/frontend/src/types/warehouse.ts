export interface Warehouse {
  id: number;
  name: string;
  address: string;
  store: number;
  stock: Record<number, number>; // productId -> quantity
  created_at: string;
  updated_at: string;
} 