export interface OrderItem {
  id: number;
  product: number;
  variant?: number;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface Order {
  id: number;
  user: number;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  payment_status: 'pending' | 'paid' | 'failed';
  address: string;
  created_at: string;
  updated_at: string;
} 