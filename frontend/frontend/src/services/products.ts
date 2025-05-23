import api from './api';
import { Product } from '../types';

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get('/products/');
  return data;
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const { data } = await api.get(`/products/${id}/`);
  return data;
};

export const createProduct = async (product: Partial<Product>): Promise<Product> => {
  const { data } = await api.post('/products/', product);
  return data;
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const { data } = await api.put(`/products/${id}/`, product);
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}/`);
}; 