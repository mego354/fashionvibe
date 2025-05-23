export type PlanType = 'payg' | 'basic' | 'standard' | 'gold' | 'platinum';

export interface Plan {
  id: number;
  name: string;
  price: number;
  product_limit: number;
  branch_limit: number;
  analytics_days: number;
  theme_count: number;
  support_level: string;
  staff_limit: number;
  domain_type: 'subdomain' | 'custom';
  features: string[];
}

export interface Subscription {
  id: number;
  store: number;
  plan: PlanType;
  start_date: string;
  end_date: string;
  is_active: boolean;
  invoices: number[];
} 