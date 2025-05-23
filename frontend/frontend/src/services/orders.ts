import api from './api';
import { Order } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/orders/');
  return data;
};

export const fetchOrder = async (id: number): Promise<Order> => {
  const { data } = await api.get(`/orders/${id}/`);
  return data;
};

export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  const { data } = await api.post('/orders/', order);
  return data;
};

export const updateOrder = async (id: number, order: Partial<Order>): Promise<Order> => {
  const { data } = await api.put(`/orders/${id}/`, order);
  return data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/orders/${id}/`);
}; 