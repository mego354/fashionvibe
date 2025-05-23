export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Payment {
  id: number;
  order: number;
  amount: number;
  status: PaymentStatus;
  method: string;
  transaction_id: string;
  created_at: string;
} 