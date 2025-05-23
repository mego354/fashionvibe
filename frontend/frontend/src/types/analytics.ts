export interface KPI {
  name: string;
  value: number;
  trend?: number;
}

export interface Analytics {
  id: number;
  store: number;
  kpis: KPI[];
  sales_by_day: Record<string, number>;
  top_products: number[];
  top_categories: number[];
  staff_performance: Record<number, number>; // staffId -> sales
  created_at: string;
} 