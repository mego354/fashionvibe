export type StaffRole = 'owner' | 'manager' | 'sales';

export interface Staff {
  id: number;
  user: number;
  store: number;
  role: StaffRole;
  performance_metrics?: any;
  commission?: number;
  is_active: boolean;
} 