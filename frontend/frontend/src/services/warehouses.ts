import api from './api';
import { Warehouse } from '../types';

export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const { data } = await api.get('/warehouses/');
  return data;
};

export const fetchWarehouse = async (id: number): Promise<Warehouse> => {
  const { data } = await api.get(`/warehouses/${id}/`);
  return data;
};

export const createWarehouse = async (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  const { data } = await api.post('/warehouses/', warehouse);
  return data;
};

export const updateWarehouse = async (id: number, warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  const { data } = await api.put(`/warehouses/${id}/`, warehouse);
  return data;
};

export const deleteWarehouse = async (id: number): Promise<void> => {
  await api.delete(`/warehouses/${id}/`);
}; 