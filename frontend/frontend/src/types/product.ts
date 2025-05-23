export interface Category {
  id: number;
  name: string;
  description?: string;
  parent?: number | null;
  image?: string;
  is_active: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categories: Category[];
  price: number;
  discount_price?: number;
  images: string[];
  variants: ProductVariant[];
  stock: number;
  warehouse: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
} 