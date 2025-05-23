import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../services/products';
import { Product } from '../types';

export const useProduct = (id: number) => {
  return useQuery<Product, Error>(['product', id], () => fetchProduct(id), {
    enabled: !!id,
  });
}; 