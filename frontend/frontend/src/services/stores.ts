import api from './api';
import { Store } from '../types';

export const fetchStores = async (): Promise<Store[]> => {
  const { data } = await api.get('/stores/');
  return data;
};

export const fetchStore = async (id: number): Promise<Store> => {
  const { data } = await api.get(`/stores/${id}/`);
  return data;
};

export const createStore = async (store: Partial<Store>): Promise<Store> => {
  const { data } = await api.post('/stores/', store);
  return data;
};

export const updateStore = async (id: number, store: Partial<Store>): Promise<Store> => {
  const { data } = await api.put(`/stores/${id}/`, store);
  return data;
};

export const deleteStore = async (id: number): Promise<void> => {
  await api.delete(`/stores/${id}/`);
}; 