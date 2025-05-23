import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../services/products';
import { Product } from '../types';

export const useProducts = () => {
  return useQuery<Product[], Error>(['products'], fetchProducts);
}; 