export type UserRole = 'owner' | 'manager' | 'staff' | 'customer' | 'admin' | 'superadmin';

export interface User {
  id: number;
  email: string;
  phone?: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  role: UserRole;
  date_joined: string;
  last_login?: string;
}

export interface Customer extends User {
  addresses: string[];
  order_history: number[];
  saved_payment_methods: string[];
}

export interface Staff extends User {
  store: number;
  performance_metrics?: any;
  commission?: number;
} 