export interface StoreSettings {
  theme: string;
  logo: string;
  banners: string[];
  colors: Record<string, string>;
  policies: {
    returns: string;
    shipping: string;
  };
  contact_info: string;
  default_language: 'en' | 'ar';
}

export interface Store {
  id: number;
  name: string;
  owner: number;
  settings: StoreSettings;
  branches: number[];
  warehouses: number[];
  subscription: number;
  created_at: string;
  updated_at: string;
} 